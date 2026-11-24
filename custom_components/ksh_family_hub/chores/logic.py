"""Chores rules, with no Home Assistant code in it so it can be tested on its own.

`data` is one plain dict:
  chores    list of chores
  routines  list of routines
  instances {"<chore>:<date>": {status, done_by, done_at, approved_by, approved_at, points, gen, note}}
  gens      {"<chore>:<date>": n}     how many times that day has been completed (each cycle pays at most once)
  runs      {"<routine>:<date>:<person>": {steps: [ids], completed_at}}
  ledger    [{id, key, person_id, points, reason, at, kind}]    the points balance is the sum
  reminded  {"<chore>:<date>": true}
  celebrations {person id: animation chosen for when that person finishes a chore or routine}
  rewards   things points can be spent on [{id, name, emoji, cost, active}]
  redemptions requests to spend points [{id, reward_id, name, emoji, cost, person_id, status, at, ...}]
  pocket    {person id: {enabled, period, points, amount (cents), account, since, settled}}   pocket money rules
  pocket_history  what each finished week or month earned and whether it paid
"""
from __future__ import annotations

import calendar
import re
import uuid
from datetime import date, datetime, timedelta
from typing import Any

ROLE_ADULT, ROLE_CHILD, ROLE_GUEST = "adult", "child", "guest"
TIME_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")


class ChoreError(Exception):
    """A rule was broken. `code` is a websocket error code."""

    def __init__(self, message: str, code: str = "invalid_format") -> None:
        super().__init__(message)
        self.code = code
        self.message = message


def new_id() -> str:
    return uuid.uuid4().hex[:12]


def empty_data() -> dict[str, Any]:
    return {"chores": [], "routines": [], "instances": {}, "gens": {}, "runs": {}, "ledger": [], "reminded": {}, "celebrations": {},
            "rewards": [], "redemptions": [], "pocket": {}, "pocket_history": []}


def parse_date(value: str) -> date:
    try:
        return date.fromisoformat(value)
    except (TypeError, ValueError) as err:
        raise ChoreError("Not a valid date") from err


def _monday(d: date) -> date:
    return d - timedelta(days=d.weekday())


# ---------------------------------------------------------------------------
# Recurrence
# ---------------------------------------------------------------------------

def occurs_on(chore: dict, day: date) -> bool:
    """Is this chore due on `day`?"""
    if not chore.get("active", True):
        return False
    rec = chore.get("recurrence") or {"type": "daily"}
    kind = rec.get("type", "daily")
    if kind == "once":
        return day == parse_date(rec.get("date"))
    start = parse_date(chore.get("start") or day.isoformat())
    if day < start:
        return False
    if kind == "daily":
        return True
    if kind == "weekly":
        return day.weekday() in (rec.get("days") or [start.weekday()])
    if kind == "custom":
        every = max(1, int(rec.get("every", 1)))
        base = parse_date(rec.get("start") or chore.get("start") or day.isoformat())
        if day < base:
            return False
        unit = rec.get("unit", "day")
        if unit == "day":
            return (day - base).days % every == 0
        if unit == "week":
            weeks = (_monday(day) - _monday(base)).days // 7
            return weeks % every == 0 and day.weekday() in (rec.get("days") or [base.weekday()])
        if unit == "month":
            months = (day.year - base.year) * 12 + day.month - base.month
            last = calendar.monthrange(day.year, day.month)[1]
            return months % every == 0 and day.day == min(base.day, last)
    return False


def clean_recurrence(rec: Any, default_start: str | None = None) -> dict:
    rec = rec or {}
    kind = rec.get("type", "daily")
    if kind == "daily":
        return {"type": "daily"}
    days = sorted({int(d) for d in rec.get("days", []) if 0 <= int(d) <= 6})
    if kind == "weekly":
        return {"type": "weekly", "days": days}
    if kind == "once":
        return {"type": "once", "date": parse_date(rec.get("date")).isoformat()}
    if kind == "custom":
        unit = rec.get("unit", "day")
        if unit not in ("day", "week", "month"):
            raise ChoreError("Repeat must be days, weeks or months")
        out = {"type": "custom", "every": max(1, min(int(rec.get("every", 1)), 365)), "unit": unit,
               "start": parse_date(rec.get("start") or default_start).isoformat()}
        if unit == "week":
            out["days"] = days
        return out
    raise ChoreError("Repeat must be daily, weekly or custom")


def clean_chore(raw: dict, today: date, existing: dict | None = None) -> dict:
    """Validate chore fields from the card. Returns the chore to store."""
    chore = dict(existing or {"id": new_id(), "active": True, "start": today.isoformat()})
    name = str(raw.get("name", chore.get("name", ""))).strip()
    if not name or len(name) > 80:
        raise ChoreError("Give the chore a name (up to 80 characters)")
    chore["name"] = name
    chore["emoji"] = str(raw.get("emoji", chore.get("emoji", "✅")))[:8] or "✅"
    chore["points"] = max(0, min(int(raw.get("points", chore.get("points", 1))), 1000))
    assignees = raw.get("assignees", chore.get("assignees", []))
    chore["assignees"] = list(dict.fromkeys(str(a) for a in assignees))     # [] means Anyone
    if raw.get("start"):
        chore["start"] = parse_date(raw["start"]).isoformat()
    chore["recurrence"] = clean_recurrence(raw.get("recurrence", chore.get("recurrence")), chore.get("start"))
    if chore["recurrence"]["type"] == "once":
        chore["start"] = chore["recurrence"]["date"]
    due = raw.get("due_time", chore.get("due_time"))
    if due in (None, ""):
        chore["due_time"] = None
    elif TIME_RE.match(str(due)):
        chore["due_time"] = str(due)
    else:
        raise ChoreError("Due time must look like 17:30")
    chore["remind"] = bool(raw.get("remind", chore.get("remind", True))) and bool(chore["due_time"])
    chore["requires_approval"] = bool(raw.get("requires_approval", chore.get("requires_approval", True)))
    chore["notes"] = str(raw.get("notes", chore.get("notes", "")))[:200]
    chore["active"] = bool(raw.get("active", chore.get("active", True)))
    return chore


# ---------------------------------------------------------------------------
# Points ledger: every award has a key, and a key pays out once
# ---------------------------------------------------------------------------

def award(data: dict, key: str, person_id: str, points: int, reason: str, now: str, kind: str = "chore") -> bool:
    """Add points for `key`. Returns False (and changes nothing) if that key has already paid or there is nothing to pay."""
    if points == 0 or any(e["key"] == key for e in data["ledger"]):
        return False
    data["ledger"].append({"id": new_id(), "key": key, "person_id": person_id, "points": points,
                           "reason": reason, "at": now, "kind": kind})
    return True


def balances(data: dict) -> dict[str, int]:
    out: dict[str, int] = {}
    for e in data["ledger"]:
        out[e["person_id"]] = out.get(e["person_id"], 0) + e["points"]
    return out


def history(data: dict, limit: int = 40) -> list[dict]:
    return list(reversed(data["ledger"][-limit:]))


# ---------------------------------------------------------------------------
# Chores
# ---------------------------------------------------------------------------

def _key(chore_id: str, day: date) -> str:
    return f"{chore_id}:{day.isoformat()}"


def can_do(chore: dict, actor: dict) -> bool:
    """Adults can do anything. Others can do what is assigned to them, or 'Anyone' chores (guests: only theirs)."""
    if actor["role"] == ROLE_ADULT:
        return True
    assignees = chore.get("assignees") or []
    if not assignees:
        return actor["role"] != ROLE_GUEST
    return actor["id"] in assignees


def day_items(data: dict, day: date) -> list[dict]:
    return [_item(c, day, data["instances"].get(_key(c["id"], day))) for c in data["chores"] if occurs_on(c, day)]


def _item(chore: dict, day: date, inst: dict | None) -> dict:
    return {
        "chore_id": chore["id"], "date": day.isoformat(),
        "status": inst["status"] if inst else "open",
        "done_by": inst.get("done_by") if inst else None,
        "approved_by": inst.get("approved_by") if inst else None,
        "points": inst.get("points", 0) if inst else 0,
        "note": inst.get("note") if inst else None,
    }


def overdue_items(data: dict, today: date, now: datetime, lookback: int = 7) -> list[dict]:
    """Chores that were due on an earlier day and are still not done.

    A chore is never overdue on its own day before its due time has passed, and one without a due time is only
    overdue once the day has ended. A chore is not overdue before it starts.
    """
    out = []
    for back in range(1, lookback + 1):
        day = today - timedelta(days=back)
        for chore in data["chores"]:
            if not occurs_on(chore, day):
                continue
            item = _item(chore, day, data["instances"].get(_key(chore["id"], day)))
            if item["status"] in ("open", "rejected"):
                out.append(item)
    return out


def range_items(data: dict, start: date, end: date) -> list[dict]:
    """Every chore occurrence from `start` to `end` (inclusive), for the calendar."""
    out = []
    for n in range(min((end - start).days, 120) + 1):
        out.extend(day_items(data, start + timedelta(days=n)))
    return out


def pending(data: dict) -> list[dict]:
    out = []
    for key, inst in data["instances"].items():
        if inst["status"] == "done":
            chore_id, day = key.split(":", 1)
            out.append({"chore_id": chore_id, "date": day, "status": "done", "done_by": inst.get("done_by"),
                        "done_at": inst.get("done_at")})
    return sorted(out, key=lambda x: x.get("done_at") or "", reverse=True)


def _get_chore(data: dict, chore_id: str) -> dict:
    chore = next((c for c in data["chores"] if c["id"] == chore_id), None)
    if chore is None:
        raise ChoreError("That chore no longer exists", "not_found")
    return chore


def complete(data: dict, chore_id: str, day: date, actor: dict, now: str) -> dict:
    chore = _get_chore(data, chore_id)
    if not occurs_on(chore, day):
        raise ChoreError("That chore is not due on this day")
    if not can_do(chore, actor):
        raise ChoreError("That chore is not assigned to you", "unauthorized")
    key = _key(chore_id, day)
    inst = data["instances"].get(key)
    if inst and inst["status"] in ("done", "approved"):
        raise ChoreError("Already done", "conflict")
    data["gens"][key] = data["gens"].get(key, 0) + 1
    gen = data["gens"][key]
    needs_approval = chore.get("requires_approval", True) and actor["role"] != ROLE_ADULT
    inst = {"status": "done", "done_by": actor["id"], "done_at": now, "gen": gen, "points": 0}
    data["instances"][key] = inst
    awarded = False
    if not needs_approval:
        inst.update(status="approved", approved_by=actor["id"], approved_at=now)
        awarded = _pay(data, key, chore, inst, actor["id"], now)
    return {"status": inst["status"], "awarded": awarded}


def _pay(data: dict, key: str, chore: dict, inst: dict, person_id: str, now: str) -> bool:
    paid = award(data, f"chore:{key}:{inst['gen']}", person_id, chore.get("points", 0),
                 f"{chore.get('emoji', '')} {chore['name']}".strip(), now)
    if paid:
        inst["points"] = chore.get("points", 0)
    return paid


def approve(data: dict, chore_id: str, day: date, actor: dict, now: str) -> dict:
    if actor["role"] != ROLE_ADULT:
        raise ChoreError("Only an adult can approve", "unauthorized")
    chore = _get_chore(data, chore_id)
    key = _key(chore_id, day)
    inst = data["instances"].get(key)
    if not inst or inst["status"] != "done":
        raise ChoreError("Nothing to approve", "conflict")
    if inst.get("done_by") == actor["id"]:
        raise ChoreError("Someone else has to approve your chore", "unauthorized")
    inst.update(status="approved", approved_by=actor["id"], approved_at=now)
    return {"status": "approved", "awarded": _pay(data, key, chore, inst, inst["done_by"], now)}


def reject(data: dict, chore_id: str, day: date, actor: dict, note: str = "") -> dict:
    if actor["role"] != ROLE_ADULT:
        raise ChoreError("Only an adult can send a chore back", "unauthorized")
    key = _key(chore_id, day)
    inst = data["instances"].get(key)
    if not inst or inst["status"] != "done":
        raise ChoreError("Nothing to send back", "conflict")
    data["instances"][key] = {"status": "rejected", "note": str(note)[:120], "gen": inst.get("gen", 0), "points": 0}
    return {"status": "rejected"}


def reopen(data: dict, chore_id: str, day: date, actor: dict, now: str) -> dict:
    """Undo a completion. The person who did it can take back one that is waiting; an adult can undo an approved one
    (its points are taken back)."""
    key = _key(chore_id, day)
    inst = data["instances"].get(key)
    if not inst or inst["status"] not in ("done", "approved"):
        raise ChoreError("Nothing to undo", "conflict")
    if inst["status"] == "done":
        if actor["role"] != ROLE_ADULT and inst.get("done_by") != actor["id"]:
            raise ChoreError("Only the person who did it can take it back", "unauthorized")
    elif actor["role"] != ROLE_ADULT:
        raise ChoreError("Only an adult can undo an approved chore", "unauthorized")
    if inst.get("points"):
        paid_to = inst["done_by"]
        award(data, f"rev:chore:{key}:{inst['gen']}", paid_to, -inst["points"],
              f"Undone: {_get_chore(data, chore_id)['name']}", now, kind="reversal")
    data["instances"].pop(key, None)
    return {"status": "open"}


# ---------------------------------------------------------------------------
# Routines: step by step, paying once when the last step is done
# ---------------------------------------------------------------------------

def clean_routine(raw: dict, existing: dict | None = None) -> dict:
    routine = dict(existing or {"id": new_id(), "active": True})
    name = str(raw.get("name", routine.get("name", ""))).strip()
    if not name or len(name) > 60:
        raise ChoreError("Give the routine a name")
    routine["name"] = name
    routine["emoji"] = str(raw.get("emoji", routine.get("emoji", "☀️")))[:8]
    routine["kind"] = raw.get("kind", routine.get("kind", "custom")) if raw.get("kind", routine.get("kind", "custom")) in ("morning", "evening", "custom") else "custom"
    routine["points"] = max(0, min(int(raw.get("points", routine.get("points", 3))), 1000))
    routine["assignees"] = list(dict.fromkeys(str(a) for a in raw.get("assignees", routine.get("assignees", []))))
    steps = []
    for s in raw.get("steps", routine.get("steps", [])):
        text = str(s.get("text", "")).strip()[:60]
        if text:
            days = sorted({int(d) for d in (s.get("days") or []) if 0 <= int(d) <= 6})
            steps.append({"id": str(s.get("id") or new_id()), "text": text, "emoji": str(s.get("emoji", ""))[:8],
                          "days": [] if len(days) == 7 else days})        # [] means every day
    if not steps:
        raise ChoreError("Add at least one step")
    routine["steps"] = steps[:20]
    routine["active"] = bool(raw.get("active", routine.get("active", True)))
    return routine


def _get_routine(data: dict, routine_id: str) -> dict:
    routine = next((r for r in data["routines"] if r["id"] == routine_id), None)
    if routine is None:
        raise ChoreError("That routine no longer exists", "not_found")
    return routine


def steps_for_day(routine: dict, day: date) -> list[dict]:
    """The steps of a routine that apply on `day` (a step with no days applies every day)."""
    return [s for s in routine.get("steps", []) if not s.get("days") or day.weekday() in s["days"]]


def routine_for(routine: dict, actor: dict) -> bool:
    assignees = routine.get("assignees") or []
    return actor["role"] == ROLE_ADULT or (not assignees and actor["role"] != ROLE_GUEST) or actor["id"] in assignees


def run_key(routine_id: str, day: date, person_id: str) -> str:
    return f"{routine_id}:{day.isoformat()}:{person_id}"


def routine_step(data: dict, routine_id: str, day: date, actor: dict, step_id: str, done: bool, now: str) -> dict:
    routine = _get_routine(data, routine_id)
    if not routine_for(routine, actor):
        raise ChoreError("That routine is not assigned to you", "unauthorized")
    todays = steps_for_day(routine, day)
    if step_id not in {s["id"] for s in routine["steps"]}:
        raise ChoreError("Unknown step", "not_found")
    if step_id not in {s["id"] for s in todays}:
        raise ChoreError("That step is not part of the routine on this day")
    key = run_key(routine_id, day, actor["id"])
    run = data["runs"].setdefault(key, {"steps": [], "completed_at": None})
    if done and step_id not in run["steps"]:
        run["steps"].append(step_id)
    elif not done and step_id in run["steps"]:
        run["steps"].remove(step_id)
    awarded = False
    if todays and all(s["id"] in run["steps"] for s in todays) and not run["completed_at"]:
        run["completed_at"] = now
        awarded = award(data, f"routine:{key}", actor["id"], routine.get("points", 0),
                        f"{routine.get('emoji', '')} {routine['name']}".strip(), now, kind="routine")
    return {"steps": list(run["steps"]), "completed": bool(run["completed_at"]), "awarded": awarded}


def day_runs(data: dict, day: date) -> dict[str, dict]:
    """Progress of every routine on `day`, keyed '<routine>:<person>'."""
    out = {}
    suffix = f":{day.isoformat()}:"
    for key, run in data["runs"].items():
        if suffix in key:
            routine_id, _, person_id = key.partition(suffix)
            out[f"{routine_id}:{person_id}"] = {"steps": run["steps"], "completed": bool(run["completed_at"])}
    return out


CELEBRATIONS = ("tape", "fireworks", "balloons", "stars", "off")
DEFAULT_CELEBRATION = "tape"


def celebration_for(data: dict, person_id: str) -> str:
    return data.get("celebrations", {}).get(person_id, DEFAULT_CELEBRATION)


def set_celebration(data: dict, person_id: str, style: str) -> None:
    if style not in CELEBRATIONS:
        raise ChoreError("Pick one of the celebrations")
    data.setdefault("celebrations", {})[person_id] = style


# ---------------------------------------------------------------------------
# Spending points: rewards, and requests to spend them
# ---------------------------------------------------------------------------

def clean_reward(raw: dict, existing: dict | None = None) -> dict:
    reward = dict(existing or {"id": new_id(), "active": True})
    name = str(raw.get("name", reward.get("name", ""))).strip()
    if not name or len(name) > 60:
        raise ChoreError("Give the reward a name")
    reward["name"] = name
    reward["emoji"] = str(raw.get("emoji", reward.get("emoji", "🎁")))[:8] or "🎁"
    cost = int(raw.get("cost", reward.get("cost", 10)))
    if cost < 1 or cost > 100000:
        raise ChoreError("A reward costs between 1 and 100000 points")
    reward["cost"] = cost
    reward["active"] = bool(raw.get("active", reward.get("active", True)))
    return reward


def _redemption(data: dict, rid: str) -> dict:
    red = next((r for r in data["redemptions"] if r["id"] == rid), None)
    if red is None:
        raise ChoreError("That request no longer exists", "not_found")
    return red


def free_points(data: dict, person_id: str) -> int:
    """Points that can still be spent: the balance minus what is already asked for and waiting."""
    held = sum(r["cost"] for r in data["redemptions"] if r["person_id"] == person_id and r["status"] == "requested")
    return balances(data).get(person_id, 0) - held


def request_reward(data: dict, reward_id: str, actor: dict, now: str) -> dict:
    if actor["role"] == ROLE_GUEST:
        raise ChoreError("Guests cannot spend points", "unauthorized")
    reward = next((r for r in data["rewards"] if r["id"] == reward_id and r.get("active", True)), None)
    if reward is None:
        raise ChoreError("That reward is not available", "not_found")
    if free_points(data, actor["id"]) < reward["cost"]:
        raise ChoreError("Not enough points yet")
    red = {"id": new_id(), "reward_id": reward["id"], "name": reward["name"], "emoji": reward["emoji"], "cost": reward["cost"],
           "person_id": actor["id"], "status": "requested", "at": now}
    data["redemptions"].append(red)
    if actor["role"] == ROLE_ADULT:                      # an adult does not wait for someone else to agree
        return approve_redemption(data, red["id"], actor, now, self_ok=True)
    return {"redemption": red, "status": "requested"}


def approve_redemption(data: dict, rid: str, actor: dict, now: str, self_ok: bool = False) -> dict:
    if actor["role"] != ROLE_ADULT:
        raise ChoreError("Only an adult can approve this", "unauthorized")
    red = _redemption(data, rid)
    if red["status"] != "requested":
        raise ChoreError("That request was already answered", "conflict")
    if red["person_id"] == actor["id"] and not self_ok:
        raise ChoreError("Someone else has to approve your request", "unauthorized")
    if balances(data).get(red["person_id"], 0) < red["cost"]:
        raise ChoreError("They do not have enough points any more")
    award(data, f"reward:{rid}", red["person_id"], -red["cost"], f"{red['emoji']} {red['name']}".strip(), now, kind="reward")
    red.update(status="approved", decided_by=actor["id"], decided_at=now)
    return {"redemption": red, "status": "approved"}


def decline_redemption(data: dict, rid: str, actor: dict, now: str) -> dict:
    if actor["role"] != ROLE_ADULT:
        raise ChoreError("Only an adult can answer this", "unauthorized")
    red = _redemption(data, rid)
    if red["status"] != "requested":
        raise ChoreError("That request was already answered", "conflict")
    red.update(status="declined", decided_by=actor["id"], decided_at=now)
    return {"redemption": red, "status": "declined"}


def cancel_redemption(data: dict, rid: str, actor: dict) -> dict:
    red = _redemption(data, rid)
    if red["status"] != "requested" or (red["person_id"] != actor["id"] and actor["role"] != ROLE_ADULT):
        raise ChoreError("That request cannot be taken back", "unauthorized")
    data["redemptions"].remove(red)
    return {"cancelled": True}


# ---------------------------------------------------------------------------
# Pocket money: earn enough points in a week or month, and the amount is paid into their Finance account
# ---------------------------------------------------------------------------

EARNED_KINDS = ("chore", "routine", "reversal")        # what counts towards pocket money (not bonuses or spending)
POCKET_PERIODS = ("week", "month")
POCKET_ACCOUNTS = ("cash", "bank")


def period_start(period: str, day: date) -> date:
    return _monday(day) if period == "week" else day.replace(day=1)


def next_period_start(period: str, day: date) -> date:
    if period == "week":
        return _monday(day) + timedelta(days=7)
    return date(day.year + (day.month == 12), day.month % 12 + 1, 1)


def clean_pocket(raw: dict, existing: dict | None, today: date) -> dict:
    cur = dict(existing or {"enabled": False, "period": "week", "points": 20, "amount": 500, "account": "bank", "since": None, "settled": None})
    period = raw.get("period", cur["period"])
    if period not in POCKET_PERIODS:
        raise ChoreError("Pocket money is paid weekly or monthly")
    account = raw.get("account", cur["account"])
    if account not in POCKET_ACCOUNTS:
        raise ChoreError("Pay into Cash or Bank")
    points = int(raw.get("points", cur["points"]))
    amount = int(raw.get("amount", cur["amount"]))
    if points < 1 or points > 100000 or amount < 0 or amount > 10_000_000:
        raise ChoreError("Check the points and the amount")
    enabled = bool(raw.get("enabled", cur["enabled"]))
    # Switching it on, or changing the period, starts from the next full week or month so nothing is paid backwards
    if enabled and (not cur["enabled"] or period != cur["period"] or not cur.get("since")):
        cur["since"] = today.isoformat()
        cur["settled"] = None
    cur.update(enabled=enabled, period=period, points=points, amount=amount, account=account)
    return cur


def _first_period(cfg: dict) -> date:
    since = parse_date(cfg["since"])
    start = period_start(cfg["period"], since)
    return start if start == since else next_period_start(cfg["period"], since)


def _default_local(iso: str) -> date:
    return date.fromisoformat(iso[:10])


def earned_in(data: dict, person_id: str, start: date, end: date, to_local=_default_local) -> int:
    return sum(e["points"] for e in data["ledger"]
               if e["person_id"] == person_id and e.get("kind") in EARNED_KINDS and start <= to_local(e["at"]) < end)


def pocket_due(data: dict, today: date, to_local=_default_local, max_periods: int = 8) -> list[dict]:
    """Finished weeks or months that have not been settled yet, and whether each earned its pocket money."""
    out = []
    for pid, cfg in data.get("pocket", {}).items():
        if not cfg.get("enabled") or not cfg.get("since"):
            continue
        start = parse_date(cfg["settled"]) if cfg.get("settled") else _first_period(cfg)
        for _ in range(max_periods):
            end = next_period_start(cfg["period"], start)
            if end > today:
                break
            earned = earned_in(data, pid, start, end, to_local)
            out.append({"person_id": pid, "start": start, "end": end, "earned": earned, "target": cfg["points"],
                        "amount": cfg["amount"], "account": cfg["account"], "paid": earned >= cfg["points"] and cfg["amount"] > 0,
                        "key": f"pocket:{pid}:{start.isoformat()}"})
            start = end
    return out


def pocket_apply(data: dict, results: list[dict]) -> None:
    for r in results:
        cfg = data["pocket"].get(r["person_id"])
        if cfg is not None:
            cfg["settled"] = r["end"].isoformat()
        data["pocket_history"].append({"person_id": r["person_id"], "start": r["start"].isoformat(), "end": r["end"].isoformat(),
                                       "earned": r["earned"], "target": r["target"], "amount": r["amount"], "paid": r["paid"],
                                       "account": r["account"]})
    del data["pocket_history"][:-80]


def pocket_progress(data: dict, today: date, to_local=_default_local) -> dict:
    """For each person with pocket money on: this week's or month's points so far."""
    out = {}
    for pid, cfg in data.get("pocket", {}).items():
        start = period_start(cfg["period"], today)
        end = next_period_start(cfg["period"], today)
        out[pid] = {**cfg, "start": start.isoformat(), "end": end.isoformat(), "earned": earned_in(data, pid, start, end, to_local),
                    "starts_next": bool(cfg.get("enabled") and cfg.get("since") and _first_period(cfg) > start)}
    return out


def adjust_points(data: dict, person_id: str, points: int, reason: str, now: str) -> None:
    if points == 0 or abs(points) > 100000:
        raise ChoreError("Enter a number of points")
    award(data, f"adjust:{new_id()}", person_id, points, str(reason)[:60] or "Adjustment", now, kind="adjust")


# ---------------------------------------------------------------------------
# Reminders and housekeeping
# ---------------------------------------------------------------------------

def due_reminders(data: dict, now: datetime, window_minutes: int = 15) -> list[dict]:
    """Chores whose due time has just passed today and are not done yet (each is returned once)."""
    out = []
    today = now.date()
    for chore in data["chores"]:
        if not chore.get("remind") or not chore.get("due_time") or not occurs_on(chore, today):
            continue
        key = _key(chore["id"], today)
        inst = data["instances"].get(key)
        if data["reminded"].get(key) or (inst and inst["status"] in ("done", "approved")):
            continue
        hour, minute = (int(x) for x in chore["due_time"].split(":"))
        due = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
        if due <= now < due + timedelta(minutes=window_minutes):
            out.append(chore)
    return out


def mark_reminded(data: dict, chore: dict, day: date) -> None:
    data["reminded"][_key(chore["id"], day)] = True


def prune(data: dict, today: date, keep_days: int = 120) -> None:
    del data.setdefault("redemptions", [])[:-200]
    cutoff = (today - timedelta(days=keep_days)).isoformat()
    for bucket in ("instances", "gens", "reminded"):
        for key in [k for k in data[bucket] if k.split(":", 2)[1] < cutoff]:
            del data[bucket][key]
    for key in [k for k in data["runs"] if k.split(":", 2)[1] < cutoff]:
        del data["runs"][key]
