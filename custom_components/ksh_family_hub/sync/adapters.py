"""One adapter per document: reads it out of the hub's storage and writes a merged copy back.

They use the storages' own attributes rather than the websocket commands, because a sync replaces whole documents at once
(and keeps the ids the phone chose), which the one-record-at-a-time commands cannot do.
"""
from __future__ import annotations

import asyncio
import copy
import re
from typing import Any

from .core import SyncError

_TIME = re.compile(r"^\d{4}-\d{2}-\d{2}")


def _need(doc: dict, key: str, kind: type) -> Any:
    value = doc.get(key)
    if not isinstance(value, kind):
        raise SyncError(f"{key} must be a {'list' if kind is list else 'dict'}")
    return value


def _records(items: list, what: str) -> list[dict]:
    for r in items:
        if not isinstance(r, dict) or not isinstance(r.get("id", ""), str):
            raise SyncError(f"Every {what} needs an id")
    return items


class StoreAdapter:
    """Chores, calendar and finance keep their whole document as `store.data`."""

    events: tuple[str, ...] = ()

    def __init__(self, name: str, store: Any, empty, required: dict[str, type]) -> None:
        self.name = name
        self._store = store
        self._empty = empty
        self._required = required
        self.lock = store.lock

    async def get(self) -> dict:
        return copy.deepcopy(self._store.data)

    async def set(self, doc: dict) -> None:
        for key, kind in self._required.items():
            if key in doc and not isinstance(doc[key], kind):
                raise SyncError(f"{key} must be a {'list' if kind is list else 'dict'}")
        merged = {**self._empty(), **doc}
        if "settings" in merged and isinstance(self._empty().get("settings"), dict):
            merged["settings"] = {**self._empty()["settings"], **merged["settings"]}
        self._store.data = merged
        await self._store.async_save()      # also tells every open card


class PeopleAdapter:
    events: tuple[str, ...] = ()

    def __init__(self, people_store: Any, roles: tuple[str, ...], colours: list[str], now) -> None:
        self.name = "people"
        self._store = people_store
        self._roles = roles
        self._colours = colours
        self._now = now
        self.lock = asyncio.Lock()

    async def get(self) -> dict:
        return {"people": copy.deepcopy(await self._store.all())}

    async def set(self, doc: dict) -> None:
        people = _records(_need(doc, "people", list), "person")
        seen: set[str] = set()
        clean = []
        for i, p in enumerate(people):
            pid = p.get("id")
            name = str(p.get("name", "")).strip()
            if not pid or pid in seen or not name or len(name) > 40:
                raise SyncError("Every person needs a name and their own id")
            if p.get("role") not in self._roles:
                raise SyncError("A person is an adult, a child or a guest")
            seen.add(pid)
            clean.append({
                "id": pid, "name": name, "emoji": p.get("emoji") or "🙂", "color": p.get("color") or self._colours[i % len(self._colours)],
                "role": p["role"], "user_id": p.get("user_id") or None, "preferred_name": str(p.get("preferred_name") or "").strip()[:40],
                "photo": p.get("photo") or None, "pin_salt": p.get("pin_salt") or None, "pin_hash": p.get("pin_hash") or None,
                "notify": p.get("notify") or None, "created_at": p.get("created_at") or self._now(),
            })
        await self._store.load()
        self._store._people[:] = clean
        await self._store.save()


_LIST_FIELDS = ("name", "icon", "created_at", "updated_at")
_ITEM_FIELDS = ("list_id", "name", "category_id", "product_id", "quantity", "unit", "note", "checked", "checked_at", "price", "estimated_total", "created_at", "updated_at")


class ShoppingAdapter:
    """Shared lists and their items. A private list (one with an owner) is never sent and never touched; what the phone calls a
    list's picture is an emoji, Home Assistant's an icon name, so an icon name is shown as the default cart."""

    events = ("ksh_shopping_list_updated",)

    def __init__(self, storage: Any, list_cls: Any, item_cls: Any) -> None:
        self.name = "shopping"
        self._s = storage
        self._list = list_cls
        self._item = item_cls
        self.lock = asyncio.Lock()

    @staticmethod
    def _emoji(icon: str | None) -> str:
        return "🛒" if not icon or icon.startswith("mdi:") else icon

    async def get(self) -> dict:
        lists, items = [], {}
        for lst in self._s._lists.values():
            if lst.owner_id:
                continue
            lists.append({"id": lst.id, "name": lst.name, "icon": self._emoji(lst.icon), "created_at": lst.created_at, "updated_at": lst.updated_at})
            items[lst.id] = [{k: getattr(i, k) for k in ("id",) + _ITEM_FIELDS} for i in self._s._items.get(lst.id, [])]
        return {"lists": lists, "items": items}

    async def set(self, doc: dict) -> None:
        s = self._s
        lists_in = _records(_need(doc, "lists", list), "list")
        items_in = _need(doc, "items", dict)
        ids = [d["id"] for d in lists_in]
        if len(set(ids)) != len(ids) or not all(ids):
            raise SyncError("Every list needs its own id")
        for d in lists_in:
            if not str(d.get("name", "")).strip():
                raise SyncError("Every list needs a name")
            old = s._lists.get(d["id"])
            if old is not None and old.owner_id:
                raise SyncError("That list is private to someone")
        for list_id, items in items_in.items():
            if list_id not in ids:
                raise SyncError("Items must be on a list that exists")
            _records(items, "item")
            for it in items:
                if not it.get("id") or not str(it.get("name", "")).strip():
                    raise SyncError("Every item needs a name and an id")

        private = {k: v for k, v in s._lists.items() if v.owner_id}
        shared_old = [k for k, v in s._lists.items() if not v.owner_id]
        new_lists: dict[str, Any] = {}
        for d in lists_in:
            old = s._lists.get(d["id"])
            if old is not None:
                old.name = str(d["name"]).strip()[:60]
                if self._emoji(old.icon) != d.get("icon") and d.get("icon"):      # only when it was changed on the phone
                    old.icon = d["icon"]
                old.updated_at = d.get("updated_at") or old.updated_at
                new_lists[d["id"]] = old
            else:
                lst = self._list(id=d["id"], name=str(d["name"]).strip()[:60], icon=d.get("icon") if d.get("icon") and not str(d["icon"]).startswith("🛒") else "mdi:cart",
                                 category_order=[c.id for c in s._categories])
                for f in ("created_at", "updated_at"):
                    if d.get(f):
                        setattr(lst, f, d[f])
                new_lists[d["id"]] = lst
        # keep the order lists already had, then add the new ones
        ordered: dict[str, Any] = {}
        for k, v in s._lists.items():
            if v.owner_id or k in new_lists:
                ordered[k] = v if v.owner_id else new_lists[k]
        for k, v in new_lists.items():
            ordered.setdefault(k, v)
        s._lists = ordered
        for k in shared_old:
            if k not in new_lists:
                s._items.pop(k, None)
        if not any(v.active for v in s._lists.values()) and s._lists:
            next(iter(new_lists.values()) if new_lists else iter(s._lists.values())).active = True

        for list_id in ids:
            existing = {i.id: i for i in s._items.get(list_id, [])}
            result = []
            for n, it in enumerate(items_in.get(list_id, [])):
                cur = existing.get(it["id"])
                if cur is None:
                    cur = self._item(id=it["id"], list_id=list_id, name=str(it["name"]).strip()[:80], category_id=it.get("category_id") or "other", order_index=n)
                for f in _ITEM_FIELDS:
                    if f in it and f != "list_id":
                        setattr(cur, f, it[f])
                cur.list_id = list_id
                cur.name = str(cur.name).strip()[:80]
                result.append(cur)
            s._items[list_id] = result
        await s._save_lists()
        await s._save_items()


class RecipesAdapter:
    events = ("ksh_recipes_recipe_updated", "ksh_recipes_meal_plan_updated")

    def __init__(self, storage: Any, recipe_cls: Any, entry_cls: Any, meal_types: list[str]) -> None:
        self.name = "recipes"
        self._s = storage
        self._recipe = recipe_cls
        self._entry = entry_cls
        self._meals = meal_types
        self.lock = asyncio.Lock()

    async def get(self) -> dict:
        return {"recipes": [r.to_dict() for r in self._s._recipes.values()], "meal_plan": [e.to_dict() for e in self._s._meal_plans.values()]}

    async def set(self, doc: dict) -> None:
        recipes = _records(_need(doc, "recipes", list), "recipe")
        plan = _records(_need(doc, "meal_plan", list), "meal")
        out = {}
        for d in recipes:
            if not d.get("id") or not str(d.get("name", "")).strip():
                raise SyncError("Every recipe needs a name and an id")
            out[d["id"]] = self._recipe.from_dict(d)
        entries = {}
        for d in plan:
            if d.get("recipe_id") not in out:
                continue                                      # a meal for a recipe that is gone
            if d.get("meal_type") not in self._meals or not _TIME.match(str(d.get("date", ""))):
                raise SyncError("A planned meal needs a day and a meal")
            entries[d["id"]] = self._entry.from_dict(d)
        self._s._recipes = out
        self._s._meal_plans = entries
        await self._s._save_recipes()
        await self._s._save_meal_plans()
