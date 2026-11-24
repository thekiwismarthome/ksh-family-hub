"""Menu preferences: the order of the menu for each login, and which entries each person is not shown.

`order`   {home assistant user id: [menu ids in the order that person wants them]}
`blocked` {person id: [menu ids hidden from that person]}

Hiding an entry only takes it out of that person's menu. It is not a security boundary: the person can still
reach the data through Home Assistant itself.
"""
from __future__ import annotations

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
import voluptuous as vol

from .const import DOMAIN

STORE_KEY = f"{DOMAIN}.prefs"
EVENT_PREFS_UPDATED = f"{DOMAIN}_prefs_updated"
IDS = [vol.All(str, vol.Length(max=40))]


class PrefsStore:
    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store = Store(hass, 1, STORE_KEY)
        self.data: dict | None = None

    async def load(self) -> dict:
        if self.data is None:
            stored = await self._store.async_load() or {}
            self.data = {"order": stored.get("order", {}), "blocked": stored.get("blocked", {})}
        return self.data

    async def save(self) -> None:
        await self._store.async_save(self.data)
        self._hass.bus.async_fire(EVENT_PREFS_UPDATED, {})


def store(hass: HomeAssistant) -> PrefsStore:
    hub = hass.data.setdefault(DOMAIN, {})
    if "prefs" not in hub:
        hub["prefs"] = PrefsStore(hass)
    return hub["prefs"]


def async_register_commands(hass: HomeAssistant) -> None:
    for command in (ws_get, ws_set_order, ws_set_access):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/prefs/get"})
@websocket_api.async_response
async def ws_get(hass, connection, msg) -> None:
    data = await store(hass).load()
    connection.send_result(msg["id"], {
        "order": data["order"].get(connection.user.id, []),
        "blocked": data["blocked"],
    })


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/prefs/set_order", vol.Required("order"): IDS})
@websocket_api.async_response
async def ws_set_order(hass, connection, msg) -> None:
    """Each login keeps its own menu order. An empty list goes back to the default order."""
    prefs = store(hass)
    data = await prefs.load()
    if msg["order"]:
        data["order"][connection.user.id] = list(dict.fromkeys(msg["order"]))
    else:
        data["order"].pop(connection.user.id, None)
    await prefs.save()
    connection.send_result(msg["id"], {"order": data["order"].get(connection.user.id, [])})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/prefs/set_access", vol.Required("person_id"): str, vol.Required("hidden"): IDS,
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_set_access(hass, connection, msg) -> None:
    """Administrators choose which menu entries a person is not shown."""
    from . import people as people_mod
    if await people_mod.store(hass).get(msg["person_id"]) is None:
        connection.send_error(msg["id"], "not_found", "Person not found")
        return
    prefs = store(hass)
    data = await prefs.load()
    hidden = [i for i in dict.fromkeys(msg["hidden"]) if i != "home"]
    if hidden:
        data["blocked"][msg["person_id"]] = hidden
    else:
        data["blocked"].pop(msg["person_id"], None)
    await prefs.save()
    connection.send_result(msg["id"], {"blocked": data["blocked"]})
