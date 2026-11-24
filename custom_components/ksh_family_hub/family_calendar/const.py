"""Constants for the Calendar module."""
DOMAIN = "ksh_calendar"
STORE_KEY = "ksh_calendar.data"
EVENT_UPDATED = "ksh_calendar_updated"
EVENT_REMINDER = "ksh_calendar_reminder"      # fired when an event's reminder is due (for automations)
REMINDER_WINDOW_MINUTES = 15                  # a reminder is only sent within this long after its time
ALL_DAY_REMINDER_TIME = "08:00"               # when the reminder of an all-day event goes out
MAX_RANGE_DAYS = 100
