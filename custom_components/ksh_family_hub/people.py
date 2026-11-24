"""People: the members of the family, with or without a Home Assistant login.

People are added by an adult (or a Home Assistant administrator), never created for you: a Home Assistant login does
not become a family member until someone adds it. A person can be linked to a login (so that login is always them) or
have none, like a child, a grandparent or a guest. A person has a role (adult, child or guest), an emoji and colour, an optional PIN that guards
switching to their profile on a shared device, and an optional notify service for reminders.

Roles: adults manage things and approve; children do things; guests only see what is assigned to them.
"""
from __future__ import annotations

import hashlib
import hmac
import logging
import secrets
import time
import uuid
from datetime import datetime, timezone
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
import voluptuous as vol

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

STORE_KEY = f"{DOMAIN}.people"
EVENT_PEOPLE_UPDATED = f"{DOMAIN}_people_updated"
ROLES = ("adult", "child", "guest")
COLOURS = ["#4fd1a1", "#f59a4d", "#6f80f2", "#e8639f", "#3db6cc", "#e2ac3f", "#cf6fb6", "#e46d5e"]
NAME = vol.All(str, vol.Length(min=1, max=40))
# Every command that acts for someone takes these: who, and the proof of their PIN (see ws_verify_pin)
AS = {vol.Optional("as_person"): str, vol.Optional("pin_token"): str}
PIN_TOKEN_DAYS = 60
MAX_PIN_TRIES = 5
PIN_LOCK_SECONDS = 60


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _hash_pin(pin: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}:{pin}".encode()).hexdigest()


class PeopleStore:
    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store = Store(hass, 1, STORE_KEY)
        self._people: list[dict[str, Any]] | None = None

    async def load(self) -> list[dict[str, Any]]:
        if self._people is None:
            data = await self._store.async_load() or {}
            self._people = list(data.get("people", []))
        return self._people

    async def _save(self) -> None:
        await self._store.async_save({"people": self._people})
        self._hass.bus.async_fire(EVENT_PEOPLE_UPDATED, {})

    @staticmethod
    def public(p: dict) -> dict:
        return {
            "id": p["id"], "name": p["name"], "emoji": p.get("emoji", "🙂"), "color": p.get("color", COLOURS[0]),
            "role": p["role"], "user_id": p.get("user_id"), "has_pin": bool(p.get("pin_hash")),
            "notify": p.get("notify"),
        }

    async def all(self) -> list[dict]:
        return await self.load()

    async def get(self, person_id: str | None) -> dict | None:
        if not person_id:
            return None
        return next((p for p in await self.load() if p["id"] == person_id), None)

    async def by_user(self, user_id: str) -> dict | None:
        return next((p for p in await self.load() if p.get("user_id") == user_id), None)

    async def add(self, name: str, role: str, emoji: str, pin: str | None, notify: str | None, user_id: str | None = None) -> dict:
        people = await self.load()
        person = {
            "id": uuid.uuid4().hex, "name": name.strip(), "emoji": emoji or "🙂", "color": COLOURS[len(people) % len(COLOURS)],
            "role": role, "user_id": user_id or None, "pin_salt": None, "pin_hash": None, "notify": notify or None, "created_at": _now(),
        }
        self.set_pin(person, pin)
        people.append(person)
        await self._save()
        return person

    @staticmethod
    def set_pin(person: dict, pin: str | None) -> None:
        if pin:
            person["pin_salt"] = secrets.token_hex(8)
            person["pin_hash"] = _hash_pin(pin, person["pin_salt"])
        else:
            person["pin_salt"] = person["pin_hash"] = None

    @staticmethod
    def check_pin(person: dict, pin: str) -> bool:
        if not person.get("pin_hash"):
            return True
        return hmac.compare_digest(_hash_pin(pin or "", person["pin_salt"]), person["pin_hash"])

    async def save(self) -> None:
        await self._save()

    async def remove(self, person: dict) -> None:
        (await self.load()).remove(person)
        await self._save()


def store(hass: HomeAssistant) -> PeopleStore:
    hub = hass.data.setdefault(DOMAIN, {})
    if "people" not in hub:
        hub["people"] = PeopleStore(hass)
    return hub["people"]


class ActorError(Exception):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


def _tokens(hass: HomeAssistant) -> dict:
    return hass.data.setdefault(DOMAIN, {}).setdefault("pin_tokens", {})


def issue_pin_token(hass: HomeAssistant, user_id: str, person_id: str) -> str:
    """Proof that `person_id`'s PIN was entered on a login. Kept in memory, so a restart asks for the PIN again."""
    now = time.time()
    tokens = _tokens(hass)
    for key in [k for k, v in tokens.items() if v[2] < now]:
        del tokens[key]
    token = secrets.token_urlsafe(18)
    tokens[token] = (user_id, person_id, now + PIN_TOKEN_DAYS * 86400)
    return token


def _token_ok(hass: HomeAssistant, token: str | None, user_id: str, person_id: str) -> bool:
    entry = _tokens(hass).get(token or "")
    return bool(entry and entry[0] == user_id and entry[1] == person_id and entry[2] > time.time())


async def async_resolve_actor(hass: HomeAssistant, connection, as_person: str | None, pin_token: str | None = None) -> dict:
    """The person a request is made on behalf of.

    A Home Assistant user who is linked to a person can only act as that person (administrators may act as anyone,
    which is how a shared tablet switches between family members). A shared login that is not linked to anyone
    chooses the person in the card. An administrator with no profile is treated as an adult.
    """
    ps = store(hass)
    user = connection.user
    linked = await ps.by_user(user.id)
    if user.is_admin:
        if as_person:
            person = await ps.get(as_person)
            if person is None:
                raise ActorError("not_found", "That person no longer exists")
            return person
        return linked or {"id": f"admin:{user.id}", "name": user.name or "Admin", "role": "adult", "user_id": user.id}
    if linked:
        if as_person and as_person != linked["id"]:
            raise ActorError("unauthorized", "You can only act as yourself")
        return linked
    person = await ps.get(as_person)
    if person is None:
        raise ActorError("not_found", "Choose who you are first")
    # A shared login: nobody has to take anybody's word for who they are. A profile with a PIN needs the PIN
    # (entered once on this login), and an adult profile must have one so a child cannot pick it.
    if person["role"] == "adult" and not person.get("pin_hash"):
        raise ActorError("pin_required", f"Set a PIN for {person['name']} to use this profile on a shared login")
    if person.get("pin_hash") and not _token_ok(hass, pin_token, user.id, person["id"]):
        raise ActorError("pin_required", f"Enter {person['name']}'s PIN")
    return person


def is_adult(actor: dict) -> bool:
    return actor.get("role") == "adult"


# ---------------------------------------------------------------------------
# WebSocket API
# ---------------------------------------------------------------------------

def async_register_commands(hass: HomeAssistant) -> None:
    for command in (ws_list, ws_users, ws_add, ws_update, ws_delete, ws_verify_pin, ws_set_pin):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/people/list"})
@websocket_api.async_response
async def ws_list(hass, connection, msg) -> None:
    ps = store(hass)
    await ps.load()
    me = await ps.by_user(connection.user.id)
    connection.send_result(msg["id"], {
        "people": [ps.public(p) for p in await ps.all()],
        "me": me["id"] if me else None,
    })


async def _require_adult(hass, connection, msg):
    try:
        actor = await async_resolve_actor(hass, connection, msg.get("as_person"), msg.get("pin_token"))
    except ActorError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return None
    if not is_adult(actor):
        connection.send_error(msg["id"], "unauthorized", "Only an adult can change people")
        return None
    return actor


async def _check_login(hass, ps, user_id: str | None, person_id: str | None = None) -> str | None:
    """Why a Home Assistant login cannot be linked to this person, or None when it can."""
    if not user_id:
        return None
    user = await hass.auth.async_get_user(user_id)
    if user is None or not user.is_active or user.system_generated:
        return "That Home Assistant login does not exist"
    other = await ps.by_user(user_id)
    if other is not None and other["id"] != person_id:
        return f"That login is already {other['name']}"
    return None


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/people/users", **AS})
@websocket_api.async_response
async def ws_users(hass, connection, msg) -> None:
    """The Home Assistant logins an adult can link to a person, and who each is linked to already."""
    if await _require_adult(hass, connection, msg) is None:
        return
    ps = store(hass)
    people = await ps.all()
    linked = {p["user_id"]: p for p in people if p.get("user_id")}
    users = [u for u in await hass.auth.async_get_users() if u.is_active and not u.system_generated]
    connection.send_result(msg["id"], {"users": [
        {"id": u.id, "name": u.name or "Unnamed", "is_admin": u.is_admin,
         "linked_to": linked[u.id]["id"] if u.id in linked else None} for u in users]})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/people/add",
    **AS,
    vol.Required("name"): NAME,
    vol.Optional("role", default="child"): vol.In(ROLES),
    vol.Optional("emoji", default="🙂"): vol.All(str, vol.Length(max=8)),
    vol.Optional("pin"): vol.Any(None, vol.All(str, vol.Match(r"^\d{4}$"))),
    vol.Optional("notify"): vol.Any(None, vol.All(str, vol.Match(r"^notify\.[a-z0-9_]+$"))),
    vol.Optional("user_id"): vol.Any(None, str),
})
@websocket_api.async_response
async def ws_add(hass, connection, msg) -> None:
    if await _require_adult(hass, connection, msg) is None:
        return
    if not msg["name"].strip():
        connection.send_error(msg["id"], "invalid_format", "Give them a name")
        return
    ps = store(hass)
    problem = await _check_login(hass, ps, msg.get("user_id"))
    if problem:
        connection.send_error(msg["id"], "invalid_format", problem)
        return
    person = await ps.add(msg["name"], msg.get("role", "child"), msg.get("emoji", "🙂"), msg.get("pin"), msg.get("notify"), msg.get("user_id"))
    connection.send_result(msg["id"], {"person": ps.public(person)})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/people/update",
    **AS,
    vol.Required("person_id"): str,
    vol.Optional("name"): NAME,
    vol.Optional("role"): vol.In(ROLES),
    vol.Optional("emoji"): vol.All(str, vol.Length(max=8)),
    vol.Optional("pin"): vol.Any(None, vol.All(str, vol.Match(r"^\d{4}$"))),
    vol.Optional("notify"): vol.Any(None, vol.All(str, vol.Match(r"^notify\.[a-z0-9_]+$"))),
    vol.Optional("user_id"): vol.Any(None, str),
})
@websocket_api.async_response
async def ws_update(hass, connection, msg) -> None:
    actor = await _require_adult(hass, connection, msg)
    if actor is None:
        return
    ps = store(hass)
    person = await ps.get(msg["person_id"])
    if person is None:
        connection.send_error(msg["id"], "not_found", "Person not found")
        return
    if "role" in msg and msg["role"] != "adult" and person["role"] == "adult":
        adults = [p for p in await ps.all() if p["role"] == "adult" and p["id"] != person["id"]]
        if not adults:
            connection.send_error(msg["id"], "invalid_format", "There has to be at least one adult")
            return
    if "user_id" in msg:
        problem = await _check_login(hass, ps, msg["user_id"], person["id"])
        if problem:
            connection.send_error(msg["id"], "invalid_format", problem)
            return
        person["user_id"] = msg["user_id"] or None
    for key in ("name", "role", "emoji", "notify"):
        if key in msg:
            person[key] = msg[key].strip() if isinstance(msg[key], str) else msg[key]
    if "pin" in msg:
        ps.set_pin(person, msg["pin"])
    await ps.save()
    connection.send_result(msg["id"], {"person": ps.public(person)})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/people/delete",
    **AS,
    vol.Required("person_id"): str,
})
@websocket_api.async_response
async def ws_delete(hass, connection, msg) -> None:
    if await _require_adult(hass, connection, msg) is None:
        return
    ps = store(hass)
    person = await ps.get(msg["person_id"])
    if person is None:
        connection.send_error(msg["id"], "not_found", "Person not found")
        return
    if person["role"] == "adult" and not connection.user.is_admin:
        others = [p for p in await ps.all() if p["role"] == "adult" and p["id"] != person["id"]]
        if not others:
            connection.send_error(msg["id"], "invalid_format", "There has to be at least one adult")
            return
    await ps.remove(person)
    connection.send_result(msg["id"], {"deleted": True})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/people/verify_pin",
    vol.Required("person_id"): str,
    vol.Required("pin"): str,
})
@websocket_api.async_response
async def ws_verify_pin(hass, connection, msg) -> None:
    """Check a PIN. On success the answer carries a token that proves it, to send with later requests."""
    ps = store(hass)
    person = await ps.get(msg["person_id"])
    if person is None:
        connection.send_error(msg["id"], "not_found", "Person not found")
        return
    tries = hass.data[DOMAIN].setdefault("pin_tries", {})
    count, until = tries.get(person["id"], (0, 0.0))
    if until > time.time():
        connection.send_error(msg["id"], "unauthorized", "Too many wrong tries. Wait a minute and try again.")
        return
    if not ps.check_pin(person, msg["pin"]):
        count += 1
        tries[person["id"]] = (0, time.time() + PIN_LOCK_SECONDS) if count >= MAX_PIN_TRIES else (count, 0.0)
        connection.send_result(msg["id"], {"ok": False})
        return
    tries.pop(person["id"], None)
    connection.send_result(msg["id"], {"ok": True, "token": issue_pin_token(hass, connection.user.id, person["id"])
                                       if person.get("pin_hash") else None})


@websocket_api.websocket_command({
    vol.Required("type"): f"{DOMAIN}/people/set_pin",
    vol.Required("person_id"): str,
    vol.Required("pin"): vol.Any(None, vol.All(str, vol.Match(r"^\d{4}$"))),
    **AS,
})
@websocket_api.async_response
async def ws_set_pin(hass, connection, msg) -> None:
    """Set, change or remove a PIN: a person for themselves, or an adult for anyone."""
    try:
        actor = await async_resolve_actor(hass, connection, msg.get("as_person"), msg.get("pin_token"))
    except ActorError as err:
        connection.send_error(msg["id"], err.code, err.message)
        return
    ps = store(hass)
    person = await ps.get(msg["person_id"])
    if person is None:
        connection.send_error(msg["id"], "not_found", "Person not found")
        return
    if not is_adult(actor) and actor.get("id") != person["id"]:
        connection.send_error(msg["id"], "unauthorized", "You can only change your own PIN")
        return
    ps.set_pin(person, msg["pin"])
    await ps.save()
    # The PIN that was just set is proof enough on this login
    token = issue_pin_token(hass, connection.user.id, person["id"]) if msg["pin"] else None
    connection.send_result(msg["id"], {"person": ps.public(person), "token": token})
