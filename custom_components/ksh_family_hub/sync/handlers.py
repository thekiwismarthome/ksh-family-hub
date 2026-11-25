"""Websocket API of the sync module (ksh_sync/...). Administrators only: the documents include people and their PIN hashes."""
from __future__ import annotations

import logging

from homeassistant.components import websocket_api
from homeassistant.core import callback
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .. import people as people_mod
from ..const import DOMAIN as HUB, MODULE_CALENDAR, MODULE_CHORES, MODULE_FINANCE, MODULE_RECIPES, MODULE_SHOPPING
from .adapters import PeopleAdapter, RecipesAdapter, ShoppingAdapter, StoreAdapter
from .core import DOC_NAMES, Backend, SyncError

_LOGGER = logging.getLogger(__name__)
DOMAIN = "ksh_sync"

# Home Assistant events that mean "something changed": the app listens and syncs
_CHANGE_EVENTS = (
    "ksh_chores_updated", "ksh_calendar_updated", "ksh_finance_updated", "ksh_family_hub_people_updated",
    "ksh_shopping_list_updated", "ksh_shopping_item_added", "ksh_shopping_item_updated", "ksh_shopping_item_checked", "ksh_shopping_item_deleted",
    "ksh_recipes_recipe_added", "ksh_recipes_recipe_updated", "ksh_recipes_recipe_deleted", "ksh_recipes_meal_plan_updated",
)


def async_register_commands(hass) -> None:
    for command in (ws_info, ws_digests, ws_pull, ws_push, ws_subscribe):
        websocket_api.async_register_command(hass, command)


def _backend(hass) -> Backend:
    """The documents for the parts that are switched on. Built each time, so it follows the hub being reloaded."""
    hub = hass.data.get(HUB, {})
    modules = hub.get("modules", {})
    adapters = {"people": _cached(hass, "people", lambda: PeopleAdapter(people_mod.store(hass), people_mod.ROLES, people_mod.COLOURS, lambda: dt_util.utcnow().isoformat()))}

    if modules.get(MODULE_CHORES):
        from ..chores import get_store
        from ..chores import logic
        adapters["chores"] = _cached(hass, "chores", lambda: StoreAdapter("chores", get_store(hass), logic.empty_data, {k: list if isinstance(v, list) else dict for k, v in logic.empty_data().items()}))
    if modules.get(MODULE_CALENDAR):
        from .. import family_calendar
        adapters["calendar"] = _cached(hass, "calendar", lambda: StoreAdapter("calendar", family_calendar.get_store(hass), family_calendar.logic.empty_data, {"events": list, "settings": dict, "reminded": dict}))
    if modules.get(MODULE_FINANCE):
        from .. import family_finance
        store = family_finance.get_store(hass)
        if store is not None:
            adapters["finance"] = _cached(hass, "finance", lambda: StoreAdapter("finance", store, family_finance.logic.empty_data, {"transactions": list}))
    if modules.get(MODULE_SHOPPING):
        from ..shopping import DATA_STORAGE as SHOP_KEY
        from ..shopping.const import DOMAIN as SHOP_NS
        from ..shopping.models import Item, ShoppingList
        storage = hass.data.get(SHOP_NS, {}).get(SHOP_KEY)
        if storage is not None:
            adapters["shopping"] = _cached(hass, "shopping", lambda: ShoppingAdapter(storage, ShoppingList, Item))
    if modules.get(MODULE_RECIPES):
        from ..recipes import DATA_STORAGE as REC_KEY
        from ..recipes.const import DOMAIN as REC_NS, MEAL_TYPES
        from ..recipes.models import MealPlanEntry, Recipe
        storage = hass.data.get(REC_NS, {}).get(REC_KEY)
        if storage is not None:
            adapters["recipes"] = _cached(hass, "recipes", lambda: RecipesAdapter(storage, Recipe, MealPlanEntry, list(MEAL_TYPES)))
    return Backend(adapters)


def _cached(hass, name: str, make):
    """One adapter object per document, so its lock is shared by every request (the people store likewise)."""
    cache = hass.data.setdefault(HUB, {}).setdefault("sync_adapters", {})
    stale = cache.get(name)
    adapter = make()
    # a reload makes new stores: use the new adapter then, otherwise keep the one with the lock that is already in use
    if stale is not None and getattr(stale, "_store", None) is getattr(adapter, "_store", None) and getattr(stale, "_s", None) is getattr(adapter, "_s", None):
        return stale
    cache[name] = adapter
    return adapter


def _error(connection, msg, err: SyncError) -> None:
    connection.send_error(msg["id"], err.code, err.message)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/info"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_info(hass, connection, msg) -> None:
    hub = hass.data.get(HUB, {})
    connection.send_result(msg["id"], {**_backend(hass).info(), "version": hub.get("version", "unknown"), "now": dt_util.utcnow().isoformat()})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/digests"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_digests(hass, connection, msg) -> None:
    connection.send_result(msg["id"], {"digests": await _backend(hass).digests()})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/pull", vol.Required("docs"): [vol.In(DOC_NAMES)]})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_pull(hass, connection, msg) -> None:
    try:
        connection.send_result(msg["id"], {"docs": await _backend(hass).pull(msg["docs"])})
    except SyncError as err:
        _error(connection, msg, err)


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/push", vol.Required("doc"): vol.In(DOC_NAMES), vol.Required("data"): dict, vol.Required("expect"): str,
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_push(hass, connection, msg) -> None:
    try:
        result = await _backend(hass).push(msg["doc"], msg["data"], msg["expect"])
    except SyncError as err:
        _error(connection, msg, err)
        return
    # the storages that save themselves already told the cards; the shopping and recipes storages do not
    for event in result.pop("events", []):
        hass.bus.async_fire(event, {})
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_subscribe(hass, connection, msg) -> None:
    """Tell the app whenever something changes here, so it can sync at once."""
    @callback
    def _forward(event):
        connection.send_message(websocket_api.event_message(msg["id"], {"event_type": event.event_type}))

    unsubs = [hass.bus.async_listen(e, _forward) for e in _CHANGE_EVENTS]

    @callback
    def _unsub():
        for unsub in unsubs:
            unsub()

    connection.subscriptions[msg["id"]] = _unsub
    connection.send_result(msg["id"], {"subscribed": True})
