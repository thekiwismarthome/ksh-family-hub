"""Constants for KSH Family Hub."""

DOMAIN = "ksh_family_hub"

# Modules that can be switched on and off. key -> config-entry option name
MODULE_RECIPES = "recipes"
MODULE_SHOPPING = "shopping"
MODULE_CHORES = "chores"
MODULE_CALENDAR = "calendar"
MODULE_FINANCE = "finance"
MODULE_OPTIONS = {
    MODULE_RECIPES: "enable_recipes",
    MODULE_SHOPPING: "enable_shopping",
    MODULE_CHORES: "enable_chores",
    MODULE_CALENDAR: "enable_calendar",
    MODULE_FINANCE: "enable_finance",
}

DEFAULT_COUNTRY = "NZ"

CARD_FILENAME = "ksh-family-hub-card.js"
APP_FILENAME = "ksh-family-hub-app.js"   # the app itself; CARD_FILENAME is the small loader every page gets

# Menu entries (other than Home) that an administrator has switched off in the hub settings
OPTION_HIDDEN_ITEMS = "items_off"
