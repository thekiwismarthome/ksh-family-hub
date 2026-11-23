"""Websocket API of the Chores module (ksh_chores/...)."""
from __future__ import annotations

from homeassistant.components import websocket_api
from homeassistant.core import callback
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .. import people as people_mod
from . import get_store, logic
from .const import DOMAIN, EVENT_DUE, EVENT_UPDATED

AS = {vol.Optional("as_person"): str}
DAY = {vol.Optional("date"): str}


def async_register_commands(hass) -> None:
    for command in (
        ws_subscribe, ws_get_state, ws_add_chore, ws_update_chore, ws_delete_chore,
        ws_complete, ws_approve, ws_reject, ws_reopen,
        ws_add_routine, ws_update_routine, ws_delete_routine, ws_routine_step, ws_adjust,
    ):
        websocket_api.async_register_command(hass, command)


def _today():
    return dt_util.now().date()


def _day(msg):
    return logic.parse_date(msg["date"]) if msg.get("date") else _today()


def _now():
    return dt_util.utcnow().isoformat()


async def _actor(hass, connection, msg):
    try:
        return await people_mod.async_resolve_actor(hass, connection, msg.get("as_person"))
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
        "pending": logic.pending(data),
        "runs": logic.day_runs(data, day),
        "balances": logic.balances(data),
        "history": logic.history(data),
    })


# ---- chores (adults) -------------------------------------------------------

CHORE_FIELDS = {
    vol.Required("name"): str,
    vol.Optional("emoji"): str,
    vol.Optional("points"): vol.Coerce(int),
    vol.Optional("assignees"): [str],
    vol.Optional("recurrence"): dict,
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
    await _mutate(hass, connection, msg, lambda d, a: logic.complete(d, msg["chore_id"], _day(msg), a, _now()))


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
    vol.Required("done"): bool, **DAY, **AS,
})
@websocket_api.async_response
async def ws_routine_step(hass, connection, msg) -> None:
    await _mutate(hass, connection, msg, lambda d, a: logic.routine_step(
        d, msg["routine_id"], _day(msg), a, msg["step_id"], msg["done"], _now()))


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
