"""Constants for KSH Family Hub."""

DOMAIN = "ksh_family_hub"

# Modules that can be switched on and off. key -> config-entry option name
MODULE_RECIPES = "recipes"
MODULE_SHOPPING = "shopping"
MODULE_OPTIONS = {
    MODULE_RECIPES: "enable_recipes",
    MODULE_SHOPPING: "enable_shopping",
}

DEFAULT_COUNTRY = "NZ"

CARD_FILENAME = "ksh-family-hub-card.js"

# Menu entries (other than Home) that an administrator has switched off in the hub settings
OPTION_HIDDEN_ITEMS = "items_off"
