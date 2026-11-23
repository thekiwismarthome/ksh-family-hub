"""Sensor platform: delegates to the recipes module when it is enabled."""
from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, MODULE_RECIPES


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    if not hass.data.get(DOMAIN, {}).get("modules", {}).get(MODULE_RECIPES):
        return
    from .recipes.sensor import async_setup_entry as setup_recipe_sensors

    await setup_recipe_sensors(hass, entry, async_add_entities)
