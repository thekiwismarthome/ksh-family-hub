"""Websocket API of the Calendar module (ksh_calendar/...)."""
from __future__ import annotations

from homeassistant.components import websocket_api
from homeassistant.core import callback
import voluptuous as vol

from .. import people as people_mod
from . import get_store, logic
from .const import DOMAIN, EVENT_REMINDER, EVENT_UPDATED, MAX_RANGE_DAYS

AS = people_mod.AS


def async_register_commands(hass) -> None:
    for command in (ws_subscribe, ws_get_events, ws_add, ws_update, ws_delete, ws_set_settings):
        websocket_api.async_register_command(hass, command)


async def _mutate(hass, connection, msg, action):
    """Adults change the calendar. Run `action(data)` under the lock, save, and answer."""
    try:
        actor = await people_mod.async_resolve_actor(hass, connection, msg.get("as_person"), msg.get("pin_token"))
    except people_mod.ActorError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    if not people_mod.is_adult(actor):
        connection.send_error(msg["id"], "unauthorized", "Only an adult can change the calendar")
        return
    store = get_store(hass)
    async with store.lock:
        try:
            result = action(store.data)
        except logic.CalendarError as err:
            connection.send_error(msg["id"], err.code, err.message)
            return
        await store.async_save()
    connection.send_result(msg["id"], result or {"ok": True})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@websocket_api.async_response
async def ws_subscribe(hass, connection, msg) -> None:
    @callback
    def _forward(event):
        connection.send_message(websocket_api.event_message(msg["id"], {"event_type": event.event_type}))

    unsubs = [hass.bus.async_listen(e, _forward) for e in (EVENT_UPDATED, EVENT_REMINDER)]

    @callback
    def _unsub():
        for unsub in unsubs:
            unsub()

    connection.subscriptions[msg["id"]] = _unsub
    connection.send_result(msg["id"], {"subscribed": True})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/get_events", vol.Required("start"): str, vol.Required("end"): str, **AS,
})
@websocket_api.async_response
async def ws_get_events(hass, connection, msg) -> None:
    """The hub's own events between two dates, plus the settings (which Home Assistant calendars to merge in)."""
    try:
        start, end = logic.parse_date(msg["start"]), logic.parse_date(msg["end"])
    except logic.CalendarError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    if end < start or (end - start).days > MAX_RANGE_DAYS:
        connection.send_error(msg["id"], "invalid_format", "Ask for at most 100 days at a time")
        return
    person = None
    if msg.get("as_person") or not connection.user.is_admin:
        try:
            person = await people_mod.async_resolve_actor(hass, connection, msg.get("as_person"), msg.get("pin_token"))
        except people_mod.ActorError:
            person = None          # without a known person, show the shared calendar
    data = get_store(hass).data
    connection.send_result(msg["id"], {"events": logic.expand(data, start, end, person), "settings": data["settings"]})


EVENT_FIELDS = {
    vol.Optional("title"): str, vol.Optional("emoji"): str, vol.Optional("category"): str,
    vol.Optional("people"): [str], vol.Optional("date"): str, vol.Optional("end_date"): vol.Any(None, str),
    vol.Optional("all_day"): bool, vol.Optional("start_time"): vol.Any(None, str),
    vol.Optional("end_time"): vol.Any(None, str), vol.Optional("repeat"): dict,
    vol.Optional("location"): str, vol.Optional("notes"): str, vol.Optional("remind"): vol.Any(None, vol.Coerce(int)),
}


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/events/add", vol.Required("title"): str,
                                  vol.Required("date"): str, **AS,
                                  **{k: v for k, v in EVENT_FIELDS.items() if k.schema not in ("title", "date")}})
@websocket_api.async_response
async def ws_add(hass, connection, msg) -> None:
    def action(data):
        event = logic.clean_event(msg)
        data["events"].append(event)
        return {"event": event}
    await _mutate(hass, connection, msg, action)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/events/update", vol.Required("event_id"): str,
                                  **AS, **EVENT_FIELDS})
@websocket_api.async_response
async def ws_update(hass, connection, msg) -> None:
    def action(data):
        old = next((e for e in data["events"] if e["id"] == msg["event_id"]), None)
        if old is None:
            raise logic.CalendarError("That event no longer exists", "not_found")
        old.update(logic.clean_event(msg, existing=old))
        return {"event": old}
    await _mutate(hass, connection, msg, action)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/events/delete", vol.Required("event_id"): str, **AS})
@websocket_api.async_response
async def ws_delete(hass, connection, msg) -> None:
    def action(data):
        data["events"] = [e for e in data["events"] if e["id"] != msg["event_id"]]
        return {"deleted": True}
    await _mutate(hass, connection, msg, action)


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/settings/set", vol.Optional("ha_calendars"): [str], vol.Optional("show_chores"): bool, **AS,
})
@websocket_api.async_response
async def ws_set_settings(hass, connection, msg) -> None:
    def action(data):
        data["settings"] = logic.clean_settings(msg, data["settings"])
        return {"settings": data["settings"]}
    await _mutate(hass, connection, msg, action)
