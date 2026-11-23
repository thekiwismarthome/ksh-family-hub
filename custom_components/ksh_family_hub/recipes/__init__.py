"""Recipes module of KSH Family Hub (formerly the Recipe Manager integration)."""
from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    EVENT_RECIPE_ADDED,
    EVENT_RECIPE_UPDATED,
    EVENT_RECIPE_DELETED,
    EVENT_MEAL_PLAN_UPDATED,
    EVENT_GLOBAL_TIMER_ADDED,
    EVENT_GLOBAL_TIMER_UPDATED,
    EVENT_GLOBAL_TIMER_DELETED,
)
from .storage import RecipeStorage, GlobalTimerStorage

_LOGGER = logging.getLogger(__name__)

DATA_STORAGE = f"{DOMAIN}_storage"
DATA_GLOBAL_TIMER_STORAGE = f"{DOMAIN}_global_timer_storage"

_EVENTS = [
    EVENT_RECIPE_ADDED, EVENT_RECIPE_UPDATED, EVENT_RECIPE_DELETED, EVENT_MEAL_PLAN_UPDATED,
    EVENT_GLOBAL_TIMER_ADDED, EVENT_GLOBAL_TIMER_UPDATED, EVENT_GLOBAL_TIMER_DELETED,
]


async def async_setup_module(hass: HomeAssistant, version: str) -> list:
    """Load storage and register the websocket API. Returns unload callbacks."""
    storage = RecipeStorage(hass)
    await storage.async_load()
    timer_storage = GlobalTimerStorage(hass)
    await timer_storage.async_load()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_STORAGE] = storage
    hass.data[DOMAIN][DATA_GLOBAL_TIMER_STORAGE] = timer_storage
    hass.data[DOMAIN]["version"] = version

    _register_websocket_handlers(hass)

    # Dummy listeners so non-admin users can subscribe to events
    def _noop(event):
        pass

    return [hass.bus.async_listen(evt, _noop) for evt in _EVENTS]


async def async_unload_module(hass: HomeAssistant) -> None:
    hass.data.pop(DOMAIN, None)


def _register_websocket_handlers(hass: HomeAssistant) -> None:
    from homeassistant.components import websocket_api
    from .websocket import handlers as h

    cmds = [
        h.websocket_subscribe,
        h.websocket_get_all_recipes,
        h.websocket_get_recipe,
        h.websocket_scrape_recipe,
        h.websocket_add_recipe,
        h.websocket_update_recipe,
        h.websocket_delete_recipe,
        h.websocket_toggle_favourite,
        h.websocket_download_recipe_image,
        h.websocket_get_tags,
        h.websocket_get_meal_plan,
        h.websocket_add_meal_plan,
        h.websocket_remove_meal_plan,
        h.websocket_clear_meal_plan,
        h.websocket_import_recipe_keeper,
        h.websocket_upload_recipe_image,
        h.websocket_get_global_timers,
        h.websocket_add_global_timer,
        h.websocket_update_global_timer,
        h.websocket_delete_global_timer,
        h.websocket_get_info,
        h.websocket_backup,
    ]
    for cmd in cmds:
        websocket_api.async_register_command(hass, cmd)
