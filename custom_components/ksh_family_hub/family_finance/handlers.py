"""Websocket API of the Finance module (ksh_finance/...).

Adults put money in, record what was spent and move money between Cash and Bank. A child sees their own accounts
and what the money was spent on; a guest sees nothing.
"""
from __future__ import annotations

from homeassistant.components import websocket_api
from homeassistant.core import callback
from homeassistant.util import dt as dt_util
import voluptuous as vol

from .. import people as people_mod
from . import get_store, logic
from .const import DOMAIN, EVENT_UPDATED

AS = people_mod.AS
ACCOUNT = vol.In(logic.ACCOUNTS)


def async_register_commands(hass) -> None:
    for command in (ws_subscribe, ws_get_state, ws_deposit, ws_spend, ws_transfer, ws_void):
        websocket_api.async_register_command(hass, command)


def _now() -> str:
    return dt_util.utcnow().isoformat()


async def _actor(hass, connection, msg):
    try:
        return await people_mod.async_resolve_actor(hass, connection, msg.get("as_person"), msg.get("pin_token"))
    except people_mod.ActorError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return None


async def _mutate(hass, connection, msg, action):
    """Adults change the money. Run `action(data, actor)` under the lock, save, and answer."""
    actor = await _actor(hass, connection, msg)
    if actor is None:
        return
    if not people_mod.is_adult(actor):
        connection.send_error(msg["id"], "unauthorized", "Only an adult can change the money")
        return
    store = get_store(hass)
    async with store.lock:
        try:
            result = action(store.data, actor)
        except logic.FinanceError as err:
            connection.send_error(msg["id"], err.code, err.message)
            return
        await store.async_save()
    connection.send_result(msg["id"], result or {"ok": True})


async def _known(hass, connection, msg) -> bool:
    if await people_mod.store(hass).get(msg["person_id"]) is None:
        connection.send_error(msg["id"], "not_found", "Person not found")
        return False
    return True


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@websocket_api.async_response
async def ws_subscribe(hass, connection, msg) -> None:
    @callback
    def _forward(event):
        connection.send_message(websocket_api.event_message(msg["id"], {"event_type": event.event_type}))

    unsub = hass.bus.async_listen(EVENT_UPDATED, _forward)
    connection.subscriptions[msg["id"]] = unsub
    connection.send_result(msg["id"], {"subscribed": True})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/get_state", **AS})
@websocket_api.async_response
async def ws_get_state(hass, connection, msg) -> None:
    """Balances and recent activity: everyone's for an adult, just their own for a child."""
    actor = await _actor(hass, connection, msg)
    if actor is None:
        return
    data = get_store(hass).data
    if people_mod.is_adult(actor):
        scope = None
    elif actor.get("role") == "guest":
        scope = set()
    else:
        scope = {actor["id"]}
    all_balances = logic.balances(data)
    connection.send_result(msg["id"], {
        "balances": {p: b for p, b in all_balances.items() if scope is None or p in scope},
        "transactions": logic.visible(data, scope),
    })


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/deposit", vol.Required("person_id"): str, vol.Required("account"): ACCOUNT,
    vol.Required("amount"): vol.Coerce(int), vol.Optional("note", default=""): str, **AS,
})
@websocket_api.async_response
async def ws_deposit(hass, connection, msg) -> None:
    if not await _known(hass, connection, msg):
        return
    await _mutate(hass, connection, msg, lambda d, a: logic.deposit(d, msg["person_id"], msg["account"], msg["amount"], msg.get("note", ""), _now(), a["id"]) and {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/spend", vol.Required("person_id"): str, vol.Required("cash"): vol.Coerce(int),
    vol.Required("bank"): vol.Coerce(int), vol.Required("note"): str, vol.Optional("emoji", default="🛍️"): str, **AS,
})
@websocket_api.async_response
async def ws_spend(hass, connection, msg) -> None:
    if not await _known(hass, connection, msg):
        return
    await _mutate(hass, connection, msg, lambda d, a: logic.spend(
        d, msg["person_id"], {"cash": msg["cash"], "bank": msg["bank"]}, msg["note"], _now(), a["id"], msg.get("emoji", "🛍️")) and {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/transfer", vol.Required("person_id"): str, vol.Required("from"): ACCOUNT,
    vol.Required("to"): ACCOUNT, vol.Required("amount"): vol.Coerce(int), **AS,
})
@websocket_api.async_response
async def ws_transfer(hass, connection, msg) -> None:
    if not await _known(hass, connection, msg):
        return
    await _mutate(hass, connection, msg, lambda d, a: logic.transfer(d, msg["person_id"], msg["from"], msg["to"], msg["amount"], _now(), a["id"]) and {"ok": True})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/void", vol.Required("tx_id"): str, **AS})
@websocket_api.async_response
async def ws_void(hass, connection, msg) -> None:
    await _mutate(hass, connection, msg, lambda d, a: {"voided": logic.void(d, msg["tx_id"])})
