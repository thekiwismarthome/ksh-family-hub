"""KSH Family Hub: recipes, meal planning and shopping in one integration."""
from __future__ import annotations

import json
import logging
import os
import pathlib

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType
import voluptuous as vol

from .const import (
    CARD_FILENAME,
    DEFAULT_COUNTRY,
    DOMAIN,
    MODULE_OPTIONS,
    MODULE_RECIPES,
    MODULE_SHOPPING,
    OPTION_HIDDEN_ITEMS,
)
from .migrate import async_import_legacy_storage, async_import_report

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.SENSOR]


def _read_version() -> str:
    path = os.path.join(os.path.dirname(__file__), "manifest.json")
    with open(path, encoding="utf-8") as fh:
        return json.load(fh).get("version", "unknown")


def enabled_modules(entry: ConfigEntry) -> dict[str, bool]:
    """Which modules are switched on for this entry (both default to on)."""
    return {
        module: bool(entry.options.get(option, True))
        for module, option in MODULE_OPTIONS.items()
    }


def hidden_items(entry: ConfigEntry) -> list[str]:
    return [str(i) for i in entry.options.get(OPTION_HIDDEN_ITEMS, [])]


def _reload_signature(entry: ConfigEntry) -> dict:
    """Everything that needs a reload when it changes (menu visibility does not)."""
    rest = {
        k: v for k, v in entry.options.items()
        if k != OPTION_HIDDEN_ITEMS and k not in MODULE_OPTIONS.values()
    }
    return {**rest, "modules": enabled_modules(entry)}


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up KSH Family Hub and whichever modules are enabled."""
    version = await hass.async_add_executor_job(_read_version)
    modules = enabled_modules(entry)
    unsubs: list = []

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN]["version"] = version
    hass.data[DOMAIN]["modules"] = modules
    hass.data[DOMAIN]["hidden"] = hidden_items(entry)
    hass.data[DOMAIN]["signature"] = _reload_signature(entry)
    hass.data[DOMAIN]["unsubs"] = unsubs

    _register_hub_commands(hass)
    await _register_frontend(hass)
    await _sync_panel(hass, entry)

    if modules[MODULE_RECIPES]:
        from . import recipes
        from .recipes.const import DOMAIN as RECIPES_NS, LEGACY_DOMAIN as RECIPES_LEGACY

        await async_import_legacy_storage(hass, MODULE_RECIPES, RECIPES_LEGACY, RECIPES_NS)
        unsubs.extend(await recipes.async_setup_module(hass, version))

    if modules[MODULE_SHOPPING]:
        from . import shopping
        from .shopping.const import DOMAIN as SHOPPING_NS, LEGACY_DOMAIN as SHOPPING_LEGACY

        await async_import_legacy_storage(hass, MODULE_SHOPPING, SHOPPING_LEGACY, SHOPPING_NS)
        country = entry.options.get("country") or entry.data.get("country") or DEFAULT_COUNTRY
        unsubs.extend(await shopping.async_setup_module(hass, version, country))

    entry.async_on_unload(entry.add_update_listener(_update_listener))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    _LOGGER.info(
        "KSH Family Hub %s ready (recipes=%s, shopping=%s)",
        version, modules[MODULE_RECIPES], modules[MODULE_SHOPPING],
    )
    return True


async def _update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    hub = hass.data.get(DOMAIN, {})
    if hub.get("signature") == _reload_signature(entry):
        # Only menu visibility changed: no need to restart the parts
        hub["hidden"] = hidden_items(entry)
        return
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if not unload_ok:
        return False

    _remove_panel(hass)
    hub = hass.data.get(DOMAIN, {})
    for unsub in hub.get("unsubs", []):
        unsub()
    modules = hub.get("modules", {})
    if modules.get(MODULE_RECIPES):
        from . import recipes
        await recipes.async_unload_module(hass)
    if modules.get(MODULE_SHOPPING):
        from . import shopping
        await shopping.async_unload_module(hass)
    hass.data.pop(DOMAIN, None)
    return True


# ---------------------------------------------------------------------------
# Hub websocket API
# ---------------------------------------------------------------------------

def _register_hub_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_get_info)
    websocket_api.async_register_command(hass, ws_set_modules)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/get_info"})
@websocket_api.async_response
async def ws_get_info(hass, connection, msg) -> None:
    """Version and which modules are enabled (read by the card to build its menu)."""
    hub = hass.data.get(DOMAIN, {})
    connection.send_result(msg["id"], {
        "version": hub.get("version", "unknown"),
        "modules": hub.get("modules", {MODULE_RECIPES: False, MODULE_SHOPPING: False}),
        "hidden": hub.get("hidden", []),
        "imported": await async_import_report(hass),
    })


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/set_modules",
    vol.Optional(MODULE_RECIPES): bool,
    vol.Optional(MODULE_SHOPPING): bool,
    vol.Optional("hidden"): [str],
})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_set_modules(hass, connection, msg) -> None:
    """Switch parts and menu entries on or off (admin only). Switching a part reloads the hub."""
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries:
        connection.send_error(msg["id"], "not_found", "KSH Family Hub is not set up")
        return
    entry = entries[0]
    options = dict(entry.options)
    for module, option in MODULE_OPTIONS.items():
        if module in msg:
            options[option] = msg[module]
    if "hidden" in msg:
        options[OPTION_HIDDEN_ITEMS] = msg["hidden"]
    if not any(bool(options.get(o, True)) for o in MODULE_OPTIONS.values()):
        connection.send_error(msg["id"], "invalid_format", "At least one part must stay switched on")
        return
    # Reload (via the update listener) happens after the result has been sent.
    connection.send_result(msg["id"], {
        "modules": {m: bool(options.get(o, True)) for m, o in MODULE_OPTIONS.items()},
        "hidden": options.get(OPTION_HIDDEN_ITEMS, []),
    })
    hass.config_entries.async_update_entry(entry, options=options)


async def _register_frontend(hass: HomeAssistant) -> None:
    """Serve the bundled card and load it on every dashboard page."""
    from homeassistant.components.frontend import add_extra_js_url
    from homeassistant.components.http import StaticPathConfig

    if DOMAIN in _REGISTERED:
        return
    www_dir = pathlib.Path(__file__).parent / "www"
    url_base = f"/{DOMAIN}/static"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(url_base, str(www_dir), cache_headers=False)]
    )
    version = hass.data[DOMAIN].get("version", "")
    add_extra_js_url(hass, f"{url_base}/{CARD_FILENAME}?v={version}")
    _REGISTERED.add(DOMAIN)


PANEL_URL_PATH = "ksh-family-hub"


async def _sync_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Add (or leave out) the full-screen app in the Home Assistant sidebar."""
    if not entry.options.get("show_panel", True):
        return
    from homeassistant.components import panel_custom

    version = hass.data[DOMAIN].get("version", "")
    try:
        await panel_custom.async_register_panel(
            hass,
            webcomponent_name="ksh-family-hub-panel",
            frontend_url_path=PANEL_URL_PATH,
            sidebar_title="Family Hub",
            sidebar_icon="mdi:home-heart",
            module_url=f"/{DOMAIN}/static/{CARD_FILENAME}?v={version}",
            embed_iframe=False,
            require_admin=False,
        )
    except ValueError:
        _LOGGER.debug("Panel %s was already registered", PANEL_URL_PATH)


def _remove_panel(hass: HomeAssistant) -> None:
    from homeassistant.components import frontend

    try:
        frontend.async_remove_panel(hass, PANEL_URL_PATH)
    except Exception:  # noqa: BLE001 - nothing to remove if it was never added
        pass


# Static paths / extra JS can only be registered once per HA run.
_REGISTERED: set[str] = set()
