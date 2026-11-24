"""Config flow for KSH Family Hub."""
from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback

from .const import DEFAULT_COUNTRY, DOMAIN

COUNTRIES = {
    "NZ": "New Zealand",
    "AU": "Australia",
    "US": "United States",
    "GB": "United Kingdom",
    "CA": "Canada",
    "BE": "Belgium (Dutch)",
    "ES": "Spain (Español)",
    "DE": "Germany (Deutsch)",
    "FR": "France (Français)",
}


class KshFamilyHubConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for KSH Family Hub."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(
                title="KSH Family Hub",
                data={},
                options={
                    "enable_recipes": user_input["enable_recipes"],
                    "enable_shopping": user_input["enable_shopping"],
                    "enable_chores": user_input["enable_chores"],
                    "enable_calendar": user_input["enable_calendar"],
                    "enable_finance": user_input["enable_finance"],
                    "country": user_input["country"],
                    "show_panel": True,
                    "enable_price_tracking": True,
                    "enable_image_search": True,
                    "metric_units_only": True,
                },
            )

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required("enable_recipes", default=True): bool,
                vol.Required("enable_shopping", default=True): bool,
                vol.Required("enable_chores", default=True): bool,
                vol.Required("enable_calendar", default=True): bool,
                vol.Required("enable_finance", default=True): bool,
                vol.Required("country", default=DEFAULT_COUNTRY): vol.In(COUNTRIES),
            }),
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return OptionsFlowHandler(config_entry)


class OptionsFlowHandler(config_entries.OptionsFlow):
    def __init__(self, config_entry):
        self._config_entry = config_entry

    async def async_step_init(self, user_input=None):
        if user_input is not None:
            # Keep options that are managed from the card (e.g. custom region choice)
            return self.async_create_entry(title="", data={**self._config_entry.options, **user_input})

        o = self._config_entry.options
        current = o.get("country", DEFAULT_COUNTRY)
        countries = COUNTRIES if current in COUNTRIES else {**COUNTRIES, current: current}
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Required("enable_recipes", default=o.get("enable_recipes", True)): bool,
                vol.Required("enable_shopping", default=o.get("enable_shopping", True)): bool,
                vol.Required("enable_chores", default=o.get("enable_chores", True)): bool,
                vol.Required("enable_calendar", default=o.get("enable_calendar", True)): bool,
                vol.Required("enable_finance", default=o.get("enable_finance", True)): bool,
                vol.Required("country", default=current): vol.In(countries),
                vol.Optional("show_panel", default=o.get("show_panel", True)): bool,
                vol.Optional("enable_price_tracking", default=o.get("enable_price_tracking", True)): bool,
                vol.Optional("enable_image_search", default=o.get("enable_image_search", True)): bool,
                vol.Optional("metric_units_only", default=o.get("metric_units_only", True)): bool,
            }),
        )
