"""Finance module of KSH Family Hub: pocket money. Each child has a Cash account and a Bank account."""
from __future__ import annotations

import asyncio

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from . import logic
from .const import DOMAIN, EVENT_UPDATED, KEEP_TRANSACTIONS, STORE_KEY


class FinanceStore:
    """All money records in one small file. Changes are made one at a time under a lock."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store = Store(hass, 1, STORE_KEY)
        self.data = logic.empty_data()
        self.lock = asyncio.Lock()

    async def async_load(self) -> None:
        stored = await self._store.async_load()
        if stored:
            self.data = {**logic.empty_data(), **stored}
        logic.prune(self.data, KEEP_TRANSACTIONS)

    async def async_save(self) -> None:
        await self._store.async_save(self.data)
        self.hass.bus.async_fire(EVENT_UPDATED, {})

    async def async_deposit(self, person_id: str, account: str, cents: int, note: str, key: str, now: str, by: str = "system") -> bool:
        """Pocket money from Chores. The key makes it pay once however often it is asked."""
        async with self.lock:
            tx = logic.deposit(self.data, person_id, account, cents, note, now, by, kind="pocket", key=key)
            if tx is None:
                return False
            await self.async_save()
            return True


def get_store(hass: HomeAssistant) -> FinanceStore | None:
    return hass.data.get(DOMAIN, {}).get("store")


async def async_setup_module(hass: HomeAssistant, version: str) -> list:
    store = FinanceStore(hass)
    await store.async_load()
    hass.data[DOMAIN] = {"store": store}

    from .handlers import async_register_commands
    async_register_commands(hass)
    return []


async def async_unload_module(hass: HomeAssistant) -> None:
    hass.data.pop(DOMAIN, None)
