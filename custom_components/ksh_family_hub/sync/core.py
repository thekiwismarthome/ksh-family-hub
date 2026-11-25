"""The sync backend, with no Home Assistant code in it so it can be tested on its own.

A *document* is one part of the hub as a plain dict (people, chores, calendar, finance, shopping, recipes). An *adapter* reads
and writes one document from the hub's real storage. The backend adds the fingerprints and the "only if nothing changed
since you looked" check.
"""
from __future__ import annotations

import asyncio
import copy
import hashlib
import json
from typing import Any, Protocol

PROTOCOL = 1
DOC_NAMES = ("people", "chores", "calendar", "finance", "shopping", "recipes")


class SyncError(Exception):
    def __init__(self, message: str, code: str = "invalid_format") -> None:
        super().__init__(message)
        self.code = code
        self.message = message


def digest(doc: Any) -> str:
    """A short fingerprint of a document. The same content always gives the same fingerprint."""
    text = json.dumps(doc, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:32]


class Adapter(Protocol):
    name: str
    lock: asyncio.Lock
    events: tuple[str, ...]

    async def get(self) -> dict: ...
    async def set(self, doc: dict) -> None: ...


class Backend:
    """What the websocket commands call. `adapters` maps a document name to its adapter."""

    def __init__(self, adapters: dict[str, Adapter]) -> None:
        self.adapters = adapters

    def info(self) -> dict:
        return {"protocol": PROTOCOL, "docs": [n for n in DOC_NAMES if n in self.adapters]}

    def _adapter(self, name: str) -> Adapter:
        adapter = self.adapters.get(name)
        if adapter is None:
            raise SyncError(f"{name} is not switched on in this Home Assistant", "not_found")
        return adapter

    async def digests(self) -> dict[str, str]:
        return {name: digest(await a.get()) for name, a in self.adapters.items()}

    async def pull(self, names: list[str]) -> dict[str, dict]:
        out = {}
        for name in names:
            doc = await self._adapter(name).get()
            out[name] = {"doc": doc, "digest": digest(doc)}
        return out

    async def push(self, name: str, data: Any, expect: str) -> dict:
        """Replace a document with `data`, but only if it is still exactly what the caller last saw (`expect`).
        Answers with the document as it now stands, which is what the caller should keep as its copy."""
        adapter = self._adapter(name)
        if not isinstance(data, dict):
            raise SyncError("A document must be an object")
        async with adapter.lock:
            current = await adapter.get()
            if digest(current) != expect:
                raise SyncError("This changed since you last looked", "conflict")
            await adapter.set(copy.deepcopy(data))
            doc = await adapter.get()
        return {"doc": doc, "digest": digest(doc), "events": list(adapter.events)}
