"""Finance rules, with no Home Assistant code in it so it can be tested on its own.

Every child has two accounts, Cash and Bank. Money is whole cents. The balance of an account is the sum of its
transactions, so what they have and what it was spent on always agree.

`data` is one plain dict:
  transactions  [{id, group, person_id, account, amount (+ in, - out), kind, note, emoji, at, by, key, void}]
"""
from __future__ import annotations

import uuid
from typing import Any

ACCOUNTS = ("cash", "bank")
KINDS = ("deposit", "pocket", "spend", "transfer")
MAX_AMOUNT = 10_000_000


class FinanceError(Exception):
    def __init__(self, message: str, code: str = "invalid_format") -> None:
        super().__init__(message)
        self.code = code
        self.message = message


def new_id() -> str:
    return uuid.uuid4().hex[:12]


def empty_data() -> dict[str, Any]:
    return {"transactions": []}


def _cents(value: Any) -> int:
    try:
        n = int(value)
    except (TypeError, ValueError) as err:
        raise FinanceError("Enter an amount") from err
    if n < 0 or n > MAX_AMOUNT:
        raise FinanceError("That amount is not allowed")
    return n


def balances(data: dict) -> dict[str, dict[str, int]]:
    """{person: {cash, bank}} from every transaction that has not been voided."""
    out: dict[str, dict[str, int]] = {}
    for t in data["transactions"]:
        if t.get("void"):
            continue
        acc = out.setdefault(t["person_id"], {"cash": 0, "bank": 0})
        acc[t["account"]] += t["amount"]
    return out


def balance_of(data: dict, person_id: str) -> dict[str, int]:
    return balances(data).get(person_id, {"cash": 0, "bank": 0})


def _add(data: dict, group: str, person_id: str, account: str, amount: int, kind: str, note: str, emoji: str,
         now: str, by: str, key: str | None = None) -> dict:
    tx = {"id": new_id(), "group": group, "person_id": person_id, "account": account, "amount": amount, "kind": kind,
          "note": note, "emoji": emoji, "at": now, "by": by, "key": key, "void": False}
    data["transactions"].append(tx)
    return tx


def deposit(data: dict, person_id: str, account: str, cents: Any, note: str, now: str, by: str,
            kind: str = "deposit", key: str | None = None, emoji: str = "") -> dict | None:
    """Money in. A `key` pays once: the same key again changes nothing (returns None)."""
    if account not in ACCOUNTS:
        raise FinanceError("Choose Cash or Bank")
    cents = _cents(cents)
    if cents == 0:
        raise FinanceError("Enter an amount")
    if key and any(t.get("key") == key for t in data["transactions"]):
        return None
    note = str(note).strip()[:80] or ("Pocket money" if kind == "pocket" else "Money in")
    return _add(data, new_id(), person_id, account, cents, kind, note, emoji or ("💰" if kind == "pocket" else "➕"), now, by, key)


def spend(data: dict, person_id: str, parts: dict, note: str, now: str, by: str, emoji: str = "🛍️") -> list[dict]:
    """Money out of Cash, Bank, or some of each. Neither account may go below zero."""
    note = str(note).strip()[:80]
    if not note:
        raise FinanceError("Say what it was spent on")
    want = {a: _cents(parts.get(a, 0)) for a in ACCOUNTS}
    if sum(want.values()) == 0:
        raise FinanceError("Enter how much was spent")
    have = balance_of(data, person_id)
    for a in ACCOUNTS:
        if want[a] > have[a]:
            raise FinanceError(f"Not enough in {a.capitalize()} ({have[a] / 100:.2f} available)")
    group = new_id()
    return [_add(data, group, person_id, a, -want[a], "spend", note, emoji or "🛍️", now, by) for a in ACCOUNTS if want[a]]


def transfer(data: dict, person_id: str, src: str, dst: str, cents: Any, now: str, by: str) -> list[dict]:
    if src not in ACCOUNTS or dst not in ACCOUNTS or src == dst:
        raise FinanceError("Move money between Cash and Bank")
    cents = _cents(cents)
    if cents == 0:
        raise FinanceError("Enter an amount")
    if balance_of(data, person_id)[src] < cents:
        raise FinanceError(f"Not enough in {src.capitalize()}")
    group = new_id()
    note = f"{src.capitalize()} to {dst.capitalize()}"
    return [_add(data, group, person_id, src, -cents, "transfer", note, "🔁", now, by),
            _add(data, group, person_id, dst, cents, "transfer", note, "🔁", now, by)]


def void(data: dict, tx_id: str) -> int:
    """Cancel a transaction (and the rest of the same purchase or transfer). Refused if it would leave an account below zero."""
    tx = next((t for t in data["transactions"] if t["id"] == tx_id), None)
    if tx is None or tx.get("void"):
        raise FinanceError("That entry is not there any more", "not_found")
    group = [t for t in data["transactions"] if t["group"] == tx["group"] and not t.get("void")]
    for t in group:
        t["void"] = True
    have = balance_of(data, tx["person_id"])
    if any(v < 0 for v in have.values()):
        for t in group:
            t["void"] = False
        raise FinanceError("Cancelling that would leave an account below zero")
    return len(group)


def visible(data: dict, person_ids: set[str] | None, limit: int = 300) -> list[dict]:
    """Newest first. `person_ids` None means everyone's."""
    rows = [t for t in data["transactions"] if person_ids is None or t["person_id"] in person_ids]
    return list(reversed(rows[-limit:]))


def prune(data: dict, keep: int = 5000) -> None:
    del data["transactions"][:-keep]
