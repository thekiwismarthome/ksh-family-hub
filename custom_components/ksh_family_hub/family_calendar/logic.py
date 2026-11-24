"""Calendar rules, with no Home Assistant code in it so it can be tested on its own.

`data` is one plain dict:
  events    list of events (see clean_event)
  settings  {ha_calendars: [calendar.* entity ids to show next to the hub's own events], show_chores: bool}
  reminded  {"<event>:<date>": true}
"""
from __future__ import annotations

import calendar
import re
import uuid
from datetime import date, datetime, time, timedelta
from typing import Any

TIME_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
CATEGORIES = ("school", "sport", "medical", "reminder", "birthday", "family", "other")
REPEATS = ("none", "daily", "weekly", "custom", "yearly")
ALL_DAY_REMINDER_TIME = "08:00"


class CalendarError(Exception):
    def __init__(self, message: str, code: str = "invalid_format") -> None:
        super().__init__(message)
        self.code = code
        self.message = message


def new_id() -> str:
    return uuid.uuid4().hex[:12]


def empty_data() -> dict[str, Any]:
    return {"events": [], "settings": {"ha_calendars": [], "show_chores": True}, "reminded": {}}


def parse_date(value: Any) -> date:
    try:
        return date.fromisoformat(str(value))
    except (TypeError, ValueError) as err:
        raise CalendarError("Not a valid date") from err


def _monday(d: date) -> date:
    return d - timedelta(days=d.weekday())


# ---------------------------------------------------------------------------
# Events
# ---------------------------------------------------------------------------

def clean_repeat(rep: Any) -> dict:
    rep = rep or {}
    kind = rep.get("type", "none")
    if kind not in REPEATS:
        raise CalendarError("Repeat must be none, daily, weekly, custom or yearly")
    out: dict[str, Any] = {"type": kind}
    if kind == "none":
        return out
    if kind == "weekly" or (kind == "custom" and rep.get("unit") == "week"):
        out["days"] = sorted({int(d) for d in rep.get("days", []) if 0 <= int(d) <= 6})
    if kind == "custom":
        unit = rep.get("unit", "day")
        if unit not in ("day", "week", "month"):
            raise CalendarError("Repeat must be days, weeks or months")
        out.update(every=max(1, min(int(rep.get("every", 1)), 365)), unit=unit)
    if rep.get("until"):
        out["until"] = parse_date(rep["until"]).isoformat()
    return out


def clean_event(raw: dict, existing: dict | None = None) -> dict:
    ev = dict(existing or {"id": new_id()})
    title = str(raw.get("title", ev.get("title", ""))).strip()
    if not title or len(title) > 80:
        raise CalendarError("Give the event a title (up to 80 characters)")
    ev["title"] = title
    ev["emoji"] = str(raw.get("emoji", ev.get("emoji", "📌")))[:8] or "📌"
    category = raw.get("category", ev.get("category", "other"))
    ev["category"] = category if category in CATEGORIES else "other"
    ev["people"] = list(dict.fromkeys(str(p) for p in raw.get("people", ev.get("people", []))))   # [] = everyone
    ev["date"] = parse_date(raw.get("date", ev.get("date"))).isoformat()
    end_date = raw.get("end_date", ev.get("end_date"))
    ev["end_date"] = parse_date(end_date).isoformat() if end_date else None
    if ev["end_date"] and ev["end_date"] < ev["date"]:
        raise CalendarError("The end date cannot be before the start")
    ev["all_day"] = bool(raw.get("all_day", ev.get("all_day", True)))
    for field in ("start_time", "end_time"):
        value = raw.get(field, ev.get(field))
        if ev["all_day"] or value in (None, ""):
            ev[field] = None
        elif TIME_RE.match(str(value)):
            ev[field] = str(value)
        else:
            raise CalendarError("Times must look like 15:30")
    if not ev["all_day"] and not ev["start_time"]:
        raise CalendarError("Give it a start time, or make it an all day event")
    if not ev["all_day"] and ev["end_time"] and not ev["end_date"] and ev["end_time"] < ev["start_time"]:
        raise CalendarError("It cannot end before it starts")
    ev["repeat"] = clean_repeat(raw.get("repeat", ev.get("repeat")))
    if ev["repeat"]["type"] != "none":
        ev["end_date"] = None            # repeating events are single day
    ev["location"] = str(raw.get("location", ev.get("location", "")))[:100]
    ev["notes"] = str(raw.get("notes", ev.get("notes", "")))[:300]
    remind = raw.get("remind", ev.get("remind"))
    ev["remind"] = None if remind in (None, "") else max(0, min(int(remind), 7 * 1440))
    return ev


def occurs_on(ev: dict, day: date) -> bool:
    start = parse_date(ev["date"])
    if day < start:
        return False
    rep = ev.get("repeat") or {"type": "none"}
    kind = rep.get("type", "none")
    if kind == "none":
        return day <= parse_date(ev.get("end_date") or ev["date"])
    if rep.get("until") and day > parse_date(rep["until"]):
        return False
    if kind == "daily":
        return True
    if kind == "weekly":
        return day.weekday() in (rep.get("days") or [start.weekday()])
    if kind == "yearly":
        if (day.month, day.day) == (start.month, start.day):
            return True
        return (start.month, start.day) == (2, 29) and (day.month, day.day) == (2, 28) and not calendar.isleap(day.year)
    if kind == "custom":
        every = max(1, int(rep.get("every", 1)))
        unit = rep.get("unit", "day")
        if unit == "day":
            return (day - start).days % every == 0
        if unit == "week":
            weeks = (_monday(day) - _monday(start)).days // 7
            return weeks % every == 0 and day.weekday() in (rep.get("days") or [start.weekday()])
        if unit == "month":
            months = (day.year - start.year) * 12 + day.month - start.month
            return months % every == 0 and day.day == min(start.day, calendar.monthrange(day.year, day.month)[1])
    return False


def visible_to(ev: dict, person: dict | None) -> bool:
    """Guests only see events they are on. Everyone else sees everything."""
    if person is None or person.get("role") != "guest":
        return True
    return person["id"] in (ev.get("people") or [])


def expand(data: dict, start: date, end: date, person: dict | None = None) -> list[dict]:
    """Every occurrence from `start` to `end` inclusive, in the order they happen."""
    out = []
    for ev in data["events"]:
        if not visible_to(ev, person):
            continue
        for n in range(min((end - start).days, 100) + 1):
            day = start + timedelta(days=n)
            if occurs_on(ev, day):
                out.append({**ev, "event_id": ev["id"], "occurs": day.isoformat()})
    out.sort(key=lambda o: (o["occurs"], 0 if o["all_day"] else 1, o.get("start_time") or "", o["title"].lower()))
    return out


# ---------------------------------------------------------------------------
# Settings, reminders, housekeeping
# ---------------------------------------------------------------------------

def clean_settings(raw: dict, existing: dict) -> dict:
    out = dict(existing)
    if "ha_calendars" in raw:
        out["ha_calendars"] = list(dict.fromkeys(str(e) for e in raw["ha_calendars"] if str(e).startswith("calendar.")))[:20]
    if "show_chores" in raw:
        out["show_chores"] = bool(raw["show_chores"])
    return out


def due_reminders(data: dict, now: datetime, window_minutes: int = 15) -> list[tuple[dict, date]]:
    """(event, day) pairs whose reminder time has just passed (each is returned once)."""
    out = []
    today = now.date()
    for ev in data["events"]:
        if ev.get("remind") is None:
            continue
        for ahead in range(0, 9):                      # a reminder can be set up to a week before
            day = today + timedelta(days=ahead)
            if not occurs_on(ev, day):
                continue
            key = f"{ev['id']}:{day.isoformat()}"
            if data["reminded"].get(key):
                continue
            hh, mm = (int(x) for x in (ev.get("start_time") or ALL_DAY_REMINDER_TIME).split(":"))
            at = datetime.combine(day, time(hh, mm), tzinfo=now.tzinfo)
            if ev.get("all_day"):
                fire = at - timedelta(minutes=ev["remind"]) if ev["remind"] >= 1440 else at
            else:
                fire = at - timedelta(minutes=ev["remind"])
            if fire <= now < fire + timedelta(minutes=window_minutes):
                out.append((ev, day))
    return out


def mark_reminded(data: dict, ev: dict, day: date) -> None:
    data["reminded"][f"{ev['id']}:{day.isoformat()}"] = True


def prune(data: dict, today: date, keep_days: int = 14) -> None:
    cutoff = (today - timedelta(days=keep_days)).isoformat()
    for key in [k for k in data["reminded"] if k.split(":", 1)[1] < cutoff]:
        del data["reminded"][key]
