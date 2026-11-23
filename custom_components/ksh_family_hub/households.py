"""Households: named groups of Home Assistant users that share the hub.

A household is a name plus a list of members (Home Assistant user ids). The first one is created
automatically from the Home Assistant location name and is open to everyone who has a login on this
Home Assistant. Further households (a flat, friends, grandparents) are created by a user, who becomes
its owner and invites other users into it.

Which household each person is "in" at the moment is a per-device choice kept by the card.
"""
from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
import voluptuous as vol

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.households"
NAME = vol.All(str, vol.Length(min=1, max=60))


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class HouseholdStore:
    """Households, persisted in one small file."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store = Store(hass, 1, STORE_KEY)
        self._households: list[dict[str, Any]] | None = None

    async def _load(self) -> list[dict[str, Any]]:
        if self._households is None:
            data = await self._store.async_load() or {}
            self._households = list(data.get("households", []))
            if not self._households:
                self._households.append({
                    "id": uuid.uuid4().hex,
                    "name": self._hass.config.location_name or "Home",
                    "everyone": True,        # open to every Home Assistant user
                    "owner_id": None,
                    "members": [],
                    "created_at": _now(),
                })
                await self._save()
        return self._households

    async def _save(self) -> None:
        await self._store.async_save({"households": self._households})

    @staticmethod
    def _visible(household: dict, user_id: str, is_admin: bool) -> bool:
        return bool(household.get("everyone") or user_id in household.get("members", []))

    @staticmethod
    def can_manage(household: dict, user_id: str, is_admin: bool) -> bool:
        return is_admin or household.get("owner_id") == user_id

    def _out(self, household: dict, user_id: str, is_admin: bool) -> dict:
        return {
            "id": household["id"],
            "name": household["name"],
            "everyone": bool(household.get("everyone")),
            "owner_id": household.get("owner_id"),
            "members": list(household.get("members", [])),
            "can_manage": self.can_manage(household, user_id, is_admin),
        }

    async def list_for(self, user_id: str, is_admin: bool) -> list[dict]:
        return [self._out(h, user_id, is_admin) for h in await self._load() if self._visible(h, user_id, is_admin)]

    async def get(self, household_id: str) -> dict | None:
        return next((h for h in await self._load() if h["id"] == household_id), None)

    async def create(self, name: str, user_id: str) -> dict:
        household = {
            "id": uuid.uuid4().hex, "name": name.strip(), "everyone": False,
            "owner_id": user_id, "members": [user_id], "created_at": _now(),
        }
        (await self._load()).append(household)
        await self._save()
        return household

    async def save(self) -> None:
        await self._save()

    async def delete(self, household: dict) -> None:
        (await self._load()).remove(household)
        await self._save()


def _store(hass: HomeAssistant) -> HouseholdStore:
    hub = hass.data.setdefault(DOMAIN, {})
    if "households" not in hub:
        hub["households"] = HouseholdStore(hass)
    return hub["households"]


def _who(connection) -> tuple[str, bool]:
    user = connection.user
    return user.id, bool(user.is_admin)


async def _manageable(hass, connection, msg):
    """The household of this message if the caller may change it, otherwise reply with an error."""
    store = _store(hass)
    household = await store.get(msg["household_id"])
    user_id, is_admin = _who(connection)
    if household is None or not store._visible(household, user_id, is_admin):
        connection.send_error(msg["id"], "not_found", "Household not found")
        return None, store
    if not store.can_manage(household, user_id, is_admin):
        connection.send_error(msg["id"], "unauthorized", "Only the owner of a household can change it")
        return None, store
    return household, store


def async_register_commands(hass: HomeAssistant) -> None:
    for command in (ws_list, ws_create, ws_update, ws_add_member, ws_remove_member, ws_delete):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/households/list"})
@websocket_api.async_response
async def ws_list(hass, connection, msg) -> None:
    user_id, is_admin = _who(connection)
    connection.send_result(msg["id"], {"households": await _store(hass).list_for(user_id, is_admin)})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/households/create", vol.Required("name"): NAME})
@websocket_api.async_response
async def ws_create(hass, connection, msg) -> None:
    if not msg["name"].strip():
        connection.send_error(msg["id"], "invalid_format", "Give the household a name")
        return
    user_id, is_admin = _who(connection)
    store = _store(hass)
    household = await store.create(msg["name"], user_id)
    connection.send_result(msg["id"], {"household": store._out(household, user_id, is_admin)})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/households/update",
    vol.Required("household_id"): str,
    vol.Required("name"): NAME,
})
@websocket_api.async_response
async def ws_update(hass, connection, msg) -> None:
    household, store = await _manageable(hass, connection, msg)
    if household is None:
        return
    if not msg["name"].strip():
        connection.send_error(msg["id"], "invalid_format", "Give the household a name")
        return
    household["name"] = msg["name"].strip()
    await store.save()
    user_id, is_admin = _who(connection)
    connection.send_result(msg["id"], {"household": store._out(household, user_id, is_admin)})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/households/add_member",
    vol.Required("household_id"): str,
    vol.Required("user_id"): str,
})
@websocket_api.async_response
async def ws_add_member(hass, connection, msg) -> None:
    household, store = await _manageable(hass, connection, msg)
    if household is None:
        return
    if household.get("everyone"):
        connection.send_error(msg["id"], "invalid_format",
                              "This household is already open to everyone on this Home Assistant. "
                              "Create another household to share with only some people.")
        return
    if await hass.auth.async_get_user(msg["user_id"]) is None:
        connection.send_error(msg["id"], "not_found", "That person has no login on this Home Assistant")
        return
    if msg["user_id"] not in household["members"]:
        household["members"].append(msg["user_id"])
        await store.save()
    user_id, is_admin = _who(connection)
    connection.send_result(msg["id"], {"household": store._out(household, user_id, is_admin)})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/households/remove_member",
    vol.Required("household_id"): str,
    vol.Required("user_id"): str,
})
@websocket_api.async_response
async def ws_remove_member(hass, connection, msg) -> None:
    store = _store(hass)
    household = await store.get(msg["household_id"])
    user_id, is_admin = _who(connection)
    if household is None or household.get("everyone") or not store._visible(household, user_id, is_admin):
        connection.send_error(msg["id"], "not_found", "Household not found")
        return
    leaving = msg["user_id"] == user_id
    if not leaving and not store.can_manage(household, user_id, is_admin):
        connection.send_error(msg["id"], "unauthorized", "Only the owner of a household can remove members")
        return
    if msg["user_id"] == household.get("owner_id"):
        connection.send_error(msg["id"], "invalid_format", "The owner cannot be removed")
        return
    if msg["user_id"] in household["members"]:
        household["members"].remove(msg["user_id"])
        await store.save()
    connection.send_result(msg["id"], {"household": store._out(household, user_id, is_admin) if not leaving else None})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/households/delete",
    vol.Required("household_id"): str,
})
@websocket_api.async_response
async def ws_delete(hass, connection, msg) -> None:
    household, store = await _manageable(hass, connection, msg)
    if household is None:
        return
    if household.get("everyone"):
        connection.send_error(msg["id"], "invalid_format", "The main household cannot be deleted")
        return
    await store.delete(household)
    connection.send_result(msg["id"], {"deleted": True})
