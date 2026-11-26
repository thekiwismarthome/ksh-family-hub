"""Constants for the KSH Family Hub recipes module."""

from ..picture_folders import RECIPES_FOLDER, RECIPES_URL

DOMAIN = "ksh_recipes"  # namespace for storage keys, events and websocket commands
HUB_DOMAIN = "ksh_family_hub"  # the config-entry domain
LEGACY_DOMAIN = "recipe_manager"  # standalone Recipe Manager (storage is imported once)

# Storage keys
STORAGE_VERSION = 1
STORAGE_KEY_RECIPES = f"{DOMAIN}.recipes"
STORAGE_KEY_TAGS = f"{DOMAIN}.tags"
STORAGE_KEY_MEAL_PLANS = f"{DOMAIN}.meal_plans"
STORAGE_KEY_GLOBAL_TIMERS = f"{DOMAIN}.global_timers"

# Events
EVENT_RECIPE_ADDED = f"{DOMAIN}_recipe_added"
EVENT_RECIPE_UPDATED = f"{DOMAIN}_recipe_updated"
EVENT_RECIPE_DELETED = f"{DOMAIN}_recipe_deleted"
EVENT_MEAL_PLAN_UPDATED = f"{DOMAIN}_meal_plan_updated"
EVENT_GLOBAL_TIMER_ADDED = f"{DOMAIN}_global_timer_added"
EVENT_GLOBAL_TIMER_UPDATED = f"{DOMAIN}_global_timer_updated"
EVENT_GLOBAL_TIMER_DELETED = f"{DOMAIN}_global_timer_deleted"

# Image config
IMAGE_SIZE = 400
IMAGE_QUALITY = 85
IMAGES_LOCAL_DIR = RECIPES_FOLDER
LOCAL_IMAGE_URL_PREFIX = RECIPES_URL

# Meal types
MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack", "dessert"]

