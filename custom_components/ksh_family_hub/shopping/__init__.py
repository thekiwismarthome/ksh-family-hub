"""Shopping module of KSH Family Hub (formerly the Shopping List Manager integration)."""
import logging
import os

from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    EVENT_ITEM_ADDED, EVENT_ITEM_UPDATED, EVENT_ITEM_CHECKED, EVENT_ITEM_DELETED,
    EVENT_LIST_UPDATED, EVENT_LIST_DELETED, EVENT_GROUPS_UPDATED,
)
from .storage import ShoppingListStorage
from .utils.images import ImageHandler

_LOGGER = logging.getLogger(__name__)

DATA_STORAGE = f"{DOMAIN}_storage"

_EVENTS = [
    EVENT_ITEM_ADDED, EVENT_ITEM_UPDATED, EVENT_ITEM_CHECKED, EVENT_ITEM_DELETED,
    EVENT_LIST_UPDATED, EVENT_LIST_DELETED, EVENT_GROUPS_UPDATED,
]


async def async_setup_module(hass: HomeAssistant, version: str, country: str) -> list:
    """Load storage and register the websocket API. Returns unload callbacks."""
    component_path = os.path.dirname(__file__)
    storage = ShoppingListStorage(hass, component_path, country)
    await storage.async_load()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_STORAGE] = storage
    hass.data[DOMAIN]["image_handler"] = ImageHandler(hass, hass.config.path())
    hass.data[DOMAIN]["country"] = country
    hass.data[DOMAIN]["version"] = version

    _register_websocket_handlers(hass)

    # Register event listeners so non-admin users can subscribe to events
    def _dummy_listener(event):
        pass

    return [hass.bus.async_listen(evt, _dummy_listener) for evt in _EVENTS]


async def async_unload_module(hass: HomeAssistant) -> None:
    hass.data.pop(DOMAIN, None)


def _register_websocket_handlers(hass: HomeAssistant) -> None:
    """Register WebSocket API handlers."""
    from homeassistant.components import websocket_api
    from .websocket import handlers
    
    # Lists handlers
    websocket_api.async_register_command(
        hass,
        handlers.websocket_subscribe,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_get_lists,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_create_list,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_update_list,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_delete_list,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_set_active_list,
    )

    # Groups (households)
    for _cmd in (
        handlers.websocket_get_groups,
        handlers.websocket_create_group,
        handlers.websocket_update_group,
        handlers.websocket_delete_group,
        handlers.websocket_adopt_shared,
        handlers.websocket_get_supermarket_chains,
        handlers.websocket_search_supermarkets,
        handlers.websocket_get_supermarkets,
        handlers.websocket_add_supermarket,
        handlers.websocket_update_supermarket,
        handlers.websocket_delete_supermarket,
    ):
        websocket_api.async_register_command(hass, _cmd)
    
    # Items handlers
    websocket_api.async_register_command(
        hass,
        handlers.websocket_get_items,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_add_item,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_update_item,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_check_item,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_increment_item,
    )

    websocket_api.async_register_command(
        hass,
        handlers.websocket_delete_item,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_reorder_items,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_bulk_check_items,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_clear_checked_items,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_get_list_total,
    )
    
    # Products handlers
    websocket_api.async_register_command(
        hass,
        handlers.websocket_download_product_image,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_search_by_barcode,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_search_products,
    )
    websocket_api.async_register_command(
        hass,
        handlers.ws_get_products_by_ids,
    )

    websocket_api.async_register_command(
        hass,
        handlers.websocket_get_product_suggestions,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_add_product,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_update_product,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_delete_product,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_get_product_substitutes,
    )
    
    # OpenFoodFacts proxy
    websocket_api.async_register_command(
        hass,
        handlers.websocket_off_fetch,
    )

    # Categories handlers
    websocket_api.async_register_command(
        hass,
        handlers.websocket_get_categories,
    )

    # Integration settings handlers
    websocket_api.async_register_command(
        hass,
        handlers.websocket_get_integration_settings,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_set_country,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_create_custom_region,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_delete_custom_region,
    )

    # Backup / Restore handlers
    websocket_api.async_register_command(
        hass,
        handlers.websocket_export_data,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_import_data,
    )

    # List members handler
    websocket_api.async_register_command(
        hass,
        handlers.websocket_update_list_members,
    )

    # HA users handler
    websocket_api.async_register_command(
        hass,
        handlers.websocket_get_ha_users,
    )

    # Loyalty card handlers
    websocket_api.async_register_command(
        hass,
        handlers.websocket_get_loyalty_cards,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_add_loyalty_card,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_update_loyalty_card,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_delete_loyalty_card,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_update_loyalty_card_members,
    )

    # User settings handlers (synced card preferences)
    websocket_api.async_register_command(
        hass,
        handlers.websocket_get_user_settings,
    )
    websocket_api.async_register_command(
        hass,
        handlers.websocket_set_user_settings,
    )

    _LOGGER.debug("WebSocket handlers registered")


def get_storage(hass: HomeAssistant) -> ShoppingListStorage:
    """Get the storage instance (used by the websocket handlers)."""
    return hass.data[DOMAIN][DATA_STORAGE]
