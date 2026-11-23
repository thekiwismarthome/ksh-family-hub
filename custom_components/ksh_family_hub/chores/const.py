"""Constants for the Chores module."""
DOMAIN = "ksh_chores"
STORE_KEY = "ksh_chores.data"
EVENT_UPDATED = "ksh_chores_updated"
EVENT_DUE = "ksh_chores_due"          # fired at a chore's due time (for automations)
REMINDER_WINDOW_MINUTES = 15          # a reminder is only sent within this long after the due time
KEEP_DAYS = 120                       # day-by-day history that is kept
