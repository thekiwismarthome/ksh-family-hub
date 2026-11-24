"""Chores module of KSH Family Hub: chores, routines and a points balance."""
from __future__ import annotations

import asyncio
import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .. import people as people_mod
from . import logic
from .const import DOMAIN, EVENT_DUE, EVENT_UPDATED, KEEP_DAYS, STORE_KEY

_LOGGER = logging.getLogger(__name__)


class ChoresStore:
    """All chores data in one small file. Changes are made one at a time under a lock."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store = Store(hass, 1, STORE_KEY)
        self.data = logic.empty_data()
        self.lock = asyncio.Lock()

    async def async_load(self) -> None:
        stored = await self._store.async_load()
        if stored:
            self.data = {**logic.empty_data(), **stored}
        logic.prune(self.data, dt_util.now().date(), KEEP_DAYS)

    async def async_save(self) -> None:
        await self._store.async_save(self.data)
        self.hass.bus.async_fire(EVENT_UPDATED, {})


def get_store(hass: HomeAssistant) -> ChoresStore:
    return hass.data[DOMAIN]["store"]


async def async_setup_module(hass: HomeAssistant, version: str) -> list:
    """Load the data, register the websocket API and start the reminder clock. Returns unload callbacks."""
    store = ChoresStore(hass)
    await store.async_load()
    hass.data[DOMAIN] = {"store": store}

    from .handlers import async_register_commands
    async_register_commands(hass)

    async def _tick(_now) -> None:
        # each job on its own: a problem sending a reminder must not stop pocket money being paid, or the other way round
        for job in (_send_reminders, _settle_pocket_money):
            try:
                await job(hass)
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Chores: %s failed", job.__name__)

    return [async_track_time_interval(hass, _tick, timedelta(seconds=60))]


async def async_unload_module(hass: HomeAssistant) -> None:
    hass.data.pop(DOMAIN, None)


async def _send_reminders(hass: HomeAssistant) -> None:
    """At a chore's own due time: fire an event, notify the people it is for, or fall back to a notification in HA."""
    store = hass.data.get(DOMAIN, {}).get("store")
    if store is None:
        return
    now = dt_util.now()
    from .. import people as people_mod

    async with store.lock:
        due = logic.due_reminders(store.data, now)
        if not due:
            return
        for chore in due:
            logic.mark_reminded(store.data, chore, now.date())
        await store.async_save()

    everyone = await people_mod.store(hass).all()
    for chore in due:
        assigned = chore.get("assignees") or []
        targets = [p for p in everyone if (p["id"] in assigned if assigned else p["role"] != "guest")]
        names = ", ".join(people_mod.display_name(p) for p in targets) if assigned else "Anyone"
        title = f"{chore.get('emoji', '')} {chore['name']}".strip()
        message = f"Due now ({chore['due_time']}) · {names}"
        hass.bus.async_fire(EVENT_DUE, {"chore_id": chore["id"], "name": chore["name"], "due_time": chore["due_time"],
                                        "assignees": assigned})
        sent = False
        for service in {p["notify"] for p in targets if p.get("notify", "") and p["notify"].startswith("notify.")}:
            try:
                await hass.services.async_call("notify", service.split(".", 1)[1], {"title": title, "message": message})
                sent = True
            except Exception:  # noqa: BLE001 - a broken notify service must not stop the others
                _LOGGER.warning("Chore reminder: could not send with %s", service, exc_info=True)
        if not sent:
            from homeassistant.components import persistent_notification
            persistent_notification.async_create(
                hass, message, title=f"Chore: {title}", notification_id=f"ksh_chore_{chore['id']}_{now.date().isoformat()}")


async def _settle_pocket_money(hass: HomeAssistant) -> None:
    """Pay pocket money for weeks or months that have finished. Needs the Finance part; without it nothing is settled,
    so a week is paid later rather than lost."""
    from ..family_finance import get_store as get_finance
    from .handlers import local_date

    store = hass.data.get(DOMAIN, {}).get("store")
    if store is None:
        return
    async with store.lock:
        results = logic.pocket_due(store.data, dt_util.now().date(), local_date)
        if not results:
            return
        finance = get_finance(hass)
        paying = [r for r in results if r["paid"]]
        if paying and finance is None:
            return
        for r in paying:
            await finance.async_deposit(
                r["person_id"], r["account"], r["amount"],
                f"Pocket money ({r['start'].strftime('%d %b')} – {(r['end'] - timedelta(days=1)).strftime('%d %b')})", r["key"],
                dt_util.utcnow().isoformat())
        logic.pocket_apply(store.data, results)
        await store.async_save()
