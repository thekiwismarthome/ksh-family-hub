"""Websocket API of the Chores module (ksh_chores/...)."""
from __future__ import annotations

from homeassistant.components import websocket_api
from homeassistant.core import callback
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .. import people as people_mod
from . import get_store, logic
from .const import DOMAIN, EVENT_DUE, EVENT_UPDATED

AS = people_mod.AS
DAY = {vol.Optional("date"): str}


def async_register_commands(hass) -> None:
    for command in (
        ws_subscribe, ws_get_state, ws_get_range, ws_add_chore, ws_update_chore, ws_delete_chore,
        ws_complete, ws_approve, ws_reject, ws_reopen,
        ws_add_routine, ws_update_routine, ws_delete_routine, ws_routine_step, ws_adjust, ws_set_celebration,
        ws_add_reward, ws_update_reward, ws_delete_reward, ws_redeem, ws_approve_redemption, ws_decline_redemption,
        ws_cancel_redemption, ws_set_pocket,
    ):
        websocket_api.async_register_command(hass, command)


def local_date(iso: str):
    """The local calendar day of a stored timestamp (a week of pocket money is the family's week, not UTC's)."""
    parsed = dt_util.parse_datetime(iso)
    return dt_util.as_local(parsed).date() if parsed else logic.date.fromisoformat(iso[:10])


def _today():
    return dt_util.now().date()


def _day(msg):
    return logic.parse_date(msg["date"]) if msg.get("date") else _today()


def _now():
    return dt_util.utcnow().isoformat()


async def _actor(hass, connection, msg):
    try:
        return await people_mod.async_resolve_actor(hass, connection, msg.get("as_person"), msg.get("pin_token"))
    except people_mod.ActorError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return None


async def _mutate(hass, connection, msg, action, *, adult_only=False):
    """Run `action(data, actor)` under the lock, save, and answer. Rule violations become websocket errors."""
    actor = await _actor(hass, connection, msg)
    if actor is None:
        return
    if adult_only and not people_mod.is_adult(actor):
        connection.send_error(msg["id"], "unauthorized", "Only an adult can do that")
        return
    store = get_store(hass)
    async with store.lock:
        try:
            result = action(store.data, actor)
        except logic.ChoreError as err:
            connection.send_error(msg["id"], err.code, err.message)
            return
        await store.async_save()
    connection.send_result(msg["id"], result or {"ok": True})


# ---- reading ---------------------------------------------------------------

@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@websocket_api.async_response
async def ws_subscribe(hass, connection, msg) -> None:
    """Live updates: chores changes, and changes to the people of the hub."""
    @callback
    def _forward(event):
        connection.send_message(websocket_api.event_message(msg["id"], {"event_type": event.event_type, "data": event.data}))

    unsubs = [hass.bus.async_listen(e, _forward) for e in (EVENT_UPDATED, EVENT_DUE, people_mod.EVENT_PEOPLE_UPDATED)]

    @callback
    def _unsub():
        for unsub in unsubs:
            unsub()

    connection.subscriptions[msg["id"]] = _unsub
    connection.send_result(msg["id"], {"subscribed": True})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/get_state", **DAY})
@websocket_api.async_response
async def ws_get_state(hass, connection, msg) -> None:
    """Everything the Chores page shows for one day."""
    try:
        day = _day(msg)
    except logic.ChoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    data = get_store(hass).data
    connection.send_result(msg["id"], {
        "date": day.isoformat(),
        "today": _today().isoformat(),
        "chores": data["chores"],
        "routines": data["routines"],
        "items": logic.day_items(data, day),
        "overdue": logic.overdue_items(data, _today(), dt_util.now()),
        "pending": logic.pending(data),
        "runs": logic.day_runs(data, day),
        "balances": logic.balances(data),
        "history": logic.history(data),
        "celebrations": data.get("celebrations", {}),
        "rewards": data["rewards"],
        "redemptions": data["redemptions"][-60:],
        "pocket": logic.pocket_progress(data, _today(), local_date),
        "pocket_history": data["pocket_history"][-30:],
    })


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/get_range", vol.Required("start"): str, vol.Required("end"): str})
@websocket_api.async_response
async def ws_get_range(hass, connection, msg) -> None:
    """Chore occurrences between two dates, for the calendar."""
    try:
        start, end = logic.parse_date(msg["start"]), logic.parse_date(msg["end"])
    except logic.ChoreError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    data = get_store(hass).data
    connection.send_result(msg["id"], {
        "items": logic.range_items(data, start, end),
        "chores": [{k: c.get(k) for k in ("id", "name", "emoji", "assignees", "due_time", "points")} for c in data["chores"]],
    })


# ---- chores (adults) -------------------------------------------------------

CHORE_FIELDS = {
    vol.Required("name"): str,
    vol.Optional("emoji"): str,
    vol.Optional("points"): vol.Coerce(int),
    vol.Optional("assignees"): [str],
    vol.Optional("recurrence"): dict,
    vol.Optional("start"): str,
    vol.Optional("due_time"): vol.Any(None, str),
    vol.Optional("remind"): bool,
    vol.Optional("requires_approval"): bool,
    vol.Optional("notes"): str,
    vol.Optional("active"): bool,
}


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/chores/add", **AS, **CHORE_FIELDS})
@websocket_api.async_response
async def ws_add_chore(hass, connection, msg) -> None:
    def action(data, actor):
        chore = logic.clean_chore(msg, _today())
        data["chores"].append(chore)
        return {"chore": chore}
    await _mutate(hass, connection, msg, action, adult_only=True)


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/chores/update", vol.Required("chore_id"): str, **AS,
    **{vol.Optional(k.schema): v for k, v in CHORE_FIELDS.items()},
})
@websocket_api.async_response
async def ws_update_chore(hass, connection, msg) -> None:
    def action(data, actor):
        old = next((c for c in data["chores"] if c["id"] == msg["chore_id"]), None)
        if old is None:
            raise logic.ChoreError("That chore no longer exists", "not_found")
        old.update(logic.clean_chore(msg, _today(), existing=old))
        return {"chore": old}
    await _mutate(hass, connection, msg, action, adult_only=True)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/chores/delete", vol.Required("chore_id"): str, **AS})
@websocket_api.async_response
async def ws_delete_chore(hass, connection, msg) -> None:
    def action(data, actor):
        data["chores"] = [c for c in data["chores"] if c["id"] != msg["chore_id"]]
        return {"deleted": True}
    await _mutate(hass, connection, msg, action, adult_only=True)


# ---- doing and approving ---------------------------------------------------

STEP = {vol.Required("chore_id"): str, **DAY, **AS}


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/complete", **STEP})
@websocket_api.async_response
async def ws_complete(hass, connection, msg) -> None:
    def action(d, a):
        result = logic.complete(d, msg["chore_id"], _day(msg), a, _now())
        result["celebration"] = logic.celebration_for(d, a["id"])
        return result
    await _mutate(hass, connection, msg, action)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/approve", **STEP})
@websocket_api.async_response
async def ws_approve(hass, connection, msg) -> None:
    await _mutate(hass, connection, msg, lambda d, a: logic.approve(d, msg["chore_id"], _day(msg), a, _now()))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/reject", vol.Optional("note", default=""): str, **STEP})
@websocket_api.async_response
async def ws_reject(hass, connection, msg) -> None:
    await _mutate(hass, connection, msg, lambda d, a: logic.reject(d, msg["chore_id"], _day(msg), a, msg["note"]))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/reopen", **STEP})
@websocket_api.async_response
async def ws_reopen(hass, connection, msg) -> None:
    await _mutate(hass, connection, msg, lambda d, a: logic.reopen(d, msg["chore_id"], _day(msg), a, _now()))


# ---- routines --------------------------------------------------------------

ROUTINE_FIELDS = {
    vol.Optional("name"): str, vol.Optional("emoji"): str, vol.Optional("kind"): str,
    vol.Optional("points"): vol.Coerce(int), vol.Optional("assignees"): [str],
    vol.Optional("steps"): [dict], vol.Optional("active"): bool,
}


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/routines/add", **AS, **ROUTINE_FIELDS})
@websocket_api.async_response
async def ws_add_routine(hass, connection, msg) -> None:
    def action(data, actor):
        routine = logic.clean_routine(msg)
        data["routines"].append(routine)
        return {"routine": routine}
    await _mutate(hass, connection, msg, action, adult_only=True)


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/routines/update", vol.Required("routine_id"): str, **AS, **ROUTINE_FIELDS,
})
@websocket_api.async_response
async def ws_update_routine(hass, connection, msg) -> None:
    def action(data, actor):
        old = next((r for r in data["routines"] if r["id"] == msg["routine_id"]), None)
        if old is None:
            raise logic.ChoreError("That routine no longer exists", "not_found")
        old.update(logic.clean_routine(msg, existing=old))
        return {"routine": old}
    await _mutate(hass, connection, msg, action, adult_only=True)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/routines/delete", vol.Required("routine_id"): str, **AS})
@websocket_api.async_response
async def ws_delete_routine(hass, connection, msg) -> None:
    def action(data, actor):
        data["routines"] = [r for r in data["routines"] if r["id"] != msg["routine_id"]]
        return {"deleted": True}
    await _mutate(hass, connection, msg, action, adult_only=True)


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/routines/step", vol.Required("routine_id"): str, vol.Required("step_id"): str,
    vol.Required("done"): bool, vol.Optional("for_person"): str, **DAY, **AS,
})
@websocket_api.async_response
async def ws_routine_step(hass, connection, msg) -> None:
    # An adult can tick a routine for a child (the progress and the points are the child's)
    target = await people_mod.store(hass).get(msg["for_person"]) if msg.get("for_person") else None
    if msg.get("for_person") and target is None:
        connection.send_error(msg["id"], "not_found", "That person no longer exists")
        return

    def action(d, a):
        result = logic.routine_step(d, msg["routine_id"], _day(msg), a, msg["step_id"], msg["done"], _now(), target)
        result["celebration"] = logic.celebration_for(d, result["person_id"])
        return result
    await _mutate(hass, connection, msg, action)


# ---- points ----------------------------------------------------------------

@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/points/adjust", vol.Required("person_id"): str,
    vol.Required("points"): vol.Coerce(int), vol.Optional("reason", default=""): str, **AS,
})
@websocket_api.async_response
async def ws_adjust(hass, connection, msg) -> None:
    def action(data, actor):
        logic.adjust_points(data, msg["person_id"], msg["points"], msg["reason"], _now())
        return {"ok": True}
    await _mutate(hass, connection, msg, action, adult_only=True)


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/celebration/set", vol.Required("style"): str, vol.Optional("person_id"): str, **AS,
})
@websocket_api.async_response
async def ws_set_celebration(hass, connection, msg) -> None:
    """Which animation plays when someone finishes a chore or routine: each person chooses their own, adults can choose for anyone."""
    actor = await _actor(hass, connection, msg)
    if actor is None:
        return
    person_id = msg.get("person_id") or actor["id"]
    if person_id != actor["id"] and not people_mod.is_adult(actor):
        connection.send_error(msg["id"], "unauthorized", "You can only change your own celebration")
        return
    store = get_store(hass)
    async with store.lock:
        try:
            logic.set_celebration(store.data, person_id, msg["style"])
        except logic.ChoreError as err:
            connection.send_error(msg["id"], err.code, err.message)
            return
        await store.async_save()
    connection.send_result(msg["id"], {"celebrations": store.data["celebrations"]})


# ---- rewards: things points can be spent on -------------------------------

REWARD_FIELDS = {vol.Optional("name"): str, vol.Optional("emoji"): str, vol.Optional("cost"): vol.Coerce(int), vol.Optional("active"): bool}


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/rewards/add", vol.Required("name"): str, **AS,
                                  **{k: v for k, v in REWARD_FIELDS.items() if k.schema != "name"}})
@websocket_api.async_response
async def ws_add_reward(hass, connection, msg) -> None:
    def action(data, actor):
        reward = logic.clean_reward(msg)
        data["rewards"].append(reward)
        return {"reward": reward}
    await _mutate(hass, connection, msg, action, adult_only=True)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/rewards/update", vol.Required("reward_id"): str, **AS, **REWARD_FIELDS})
@websocket_api.async_response
async def ws_update_reward(hass, connection, msg) -> None:
    def action(data, actor):
        old = next((r for r in data["rewards"] if r["id"] == msg["reward_id"]), None)
        if old is None:
            raise logic.ChoreError("That reward no longer exists", "not_found")
        old.update(logic.clean_reward(msg, existing=old))
        return {"reward": old}
    await _mutate(hass, connection, msg, action, adult_only=True)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/rewards/delete", vol.Required("reward_id"): str, **AS})
@websocket_api.async_response
async def ws_delete_reward(hass, connection, msg) -> None:
    def action(data, actor):
        data["rewards"] = [r for r in data["rewards"] if r["id"] != msg["reward_id"]]
        return {"deleted": True}
    await _mutate(hass, connection, msg, action, adult_only=True)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/redeem", vol.Required("reward_id"): str, **AS})
@websocket_api.async_response
async def ws_redeem(hass, connection, msg) -> None:
    await _mutate(hass, connection, msg, lambda d, a: logic.request_reward(d, msg["reward_id"], a, _now()))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/redemptions/approve", vol.Required("redemption_id"): str, **AS})
@websocket_api.async_response
async def ws_approve_redemption(hass, connection, msg) -> None:
    await _mutate(hass, connection, msg, lambda d, a: logic.approve_redemption(d, msg["redemption_id"], a, _now()))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/redemptions/decline", vol.Required("redemption_id"): str, **AS})
@websocket_api.async_response
async def ws_decline_redemption(hass, connection, msg) -> None:
    await _mutate(hass, connection, msg, lambda d, a: logic.decline_redemption(d, msg["redemption_id"], a, _now()))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/redemptions/cancel", vol.Required("redemption_id"): str, **AS})
@websocket_api.async_response
async def ws_cancel_redemption(hass, connection, msg) -> None:
    await _mutate(hass, connection, msg, lambda d, a: logic.cancel_redemption(d, msg["redemption_id"], a))


# ---- pocket money rules (adults) ---------------------------------------------

@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/pocket/set", vol.Required("person_id"): str, vol.Optional("enabled"): bool,
    vol.Optional("period"): str, vol.Optional("points"): vol.Coerce(int), vol.Optional("amount"): vol.Coerce(int),
    vol.Optional("account"): str, **AS,
})
@websocket_api.async_response
async def ws_set_pocket(hass, connection, msg) -> None:
    if await people_mod.store(hass).get(msg["person_id"]) is None:
        connection.send_error(msg["id"], "not_found", "Person not found")
        return

    def action(data, actor):
        data["pocket"][msg["person_id"]] = logic.clean_pocket(msg, data["pocket"].get(msg["person_id"]), _today())
        return {"pocket": data["pocket"][msg["person_id"]]}
    await _mutate(hass, connection, msg, action, adult_only=True)
