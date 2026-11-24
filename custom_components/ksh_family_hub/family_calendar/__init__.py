"""Calendar module of KSH Family Hub: the family's own events (school, sport, appointments, reminders, birthdays)."""
from __future__ import annotations

import asyncio
import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from . import logic
from .const import DOMAIN, EVENT_REMINDER, EVENT_UPDATED, REMINDER_WINDOW_MINUTES, STORE_KEY

_LOGGER = logging.getLogger(__name__)


class CalendarStore:
    """All calendar data in one small file. Changes are made one at a time under a lock."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store = Store(hass, 1, STORE_KEY)
        self.data = logic.empty_data()
        self.lock = asyncio.Lock()

    async def async_load(self) -> None:
        stored = await self._store.async_load()
        if stored:
            base = logic.empty_data()
            self.data = {**base, **stored, "settings": {**base["settings"], **stored.get("settings", {})}}
        logic.prune(self.data, dt_util.now().date())

    async def async_save(self) -> None:
        await self._store.async_save(self.data)
        self.hass.bus.async_fire(EVENT_UPDATED, {})


def get_store(hass: HomeAssistant) -> CalendarStore:
    return hass.data[DOMAIN]["store"]


async def async_setup_module(hass: HomeAssistant, version: str) -> list:
    store = CalendarStore(hass)
    await store.async_load()
    hass.data[DOMAIN] = {"store": store}

    from .handlers import async_register_commands
    async_register_commands(hass)

    async def _tick(_now) -> None:
        await _send_reminders(hass)

    return [async_track_time_interval(hass, _tick, timedelta(seconds=60))]


async def async_unload_module(hass: HomeAssistant) -> None:
    hass.data.pop(DOMAIN, None)


async def _send_reminders(hass: HomeAssistant) -> None:
    """Fire an event, notify the people an event is for, or fall back to a notification in Home Assistant."""
    store = hass.data.get(DOMAIN, {}).get("store")
    if store is None:
        return
    now = dt_util.now()
    from .. import people as people_mod

    async with store.lock:
        due = logic.due_reminders(store.data, now, REMINDER_WINDOW_MINUTES)
        if not due:
            return
        for ev, day in due:
            logic.mark_reminded(store.data, ev, day)
        await store.async_save()

    everyone = await people_mod.store(hass).all()
    for ev, day in due:
        listed = ev.get("people") or []
        targets = [p for p in everyone if (p["id"] in listed if listed else p["role"] != "guest")]
        when = "all day" if ev.get("all_day") else ev["start_time"]
        where = f" · {ev['location']}" if ev.get("location") else ""
        title = f"{ev.get('emoji', '')} {ev['title']}".strip()
        message = f"{day.strftime('%a %d %b')}, {when}{where}"
        hass.bus.async_fire(EVENT_REMINDER, {"event_id": ev["id"], "title": ev["title"], "date": day.isoformat(),
                                             "start_time": ev.get("start_time"), "people": listed})
        sent = False
        for service in {p["notify"] for p in targets if (p.get("notify") or "").startswith("notify.")}:
            try:
                await hass.services.async_call("notify", service.split(".", 1)[1], {"title": title, "message": message})
                sent = True
            except Exception:  # noqa: BLE001 - a broken notify service must not stop the others
                _LOGGER.warning("Calendar reminder: could not send with %s", service, exc_info=True)
        if not sent:
            from homeassistant.components import persistent_notification
            persistent_notification.async_create(hass, message, title=f"Reminder: {title}",
                                                 notification_id=f"ksh_event_{ev['id']}_{day.isoformat()}")
