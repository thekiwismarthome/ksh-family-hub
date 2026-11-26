"""Pictures live in ``www/images/ksh-family-hub/<part>/``. This moves a part over from the older folders, once.

Files are *copied*, never moved or deleted: the standalone Recipe Manager and Shopping List Manager use the old folders and
may still be installed. Stored links are pointed at the copies, and a link only changes if its picture really was copied.
Before a stored file is changed, its previous content is kept under ``ksh_family_hub.before_picture_move.<name>``.
"""
from __future__ import annotations

import filecmp
import logging
import os
import shutil
from pathlib import Path
from typing import Any
from urllib.parse import unquote

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

_LOGGER = logging.getLogger(__name__)

MARKER_KEY = "ksh_family_hub.picture_folders"
BACKUP_PREFIX = "ksh_family_hub.before_picture_move."
PICTURE_TYPES = {".webp", ".jpg", ".jpeg", ".png", ".gif", ".svg", ".avif"}

SHOPPING_FOLDER = "www/images/ksh-family-hub/shopping"
SHOPPING_URL = "/local/images/ksh-family-hub/shopping/"
RECIPES_FOLDER = "www/images/ksh-family-hub/recipes"
RECIPES_URL = "/local/images/ksh-family-hub/recipes/"

# Per part: where it goes, where it may be now (the first folder keeps its file names if two have the same one),
# the stored files that can hold links, and old *folder* settings that should now name the new folder.
PARTS: dict[str, dict[str, Any]] = {
    "shopping": {
        "version": 2,       # the shopping part's STORAGE_VERSION
        "folder": SHOPPING_FOLDER,
        "url": SHOPPING_URL,
        "old": [
            # "groceries" is the card's earlier default folder for pictures matched by product name
            ("www/images/groceries", "/local/images/groceries/"),
            ("www/images/shopping_list_manager", "/local/images/shopping_list_manager/"),
            ("www/shopping_list_manager/images", "/local/shopping_list_manager/images/"),
        ],
        "stores": [
            "ksh_shopping.items", "ksh_shopping.products", "ksh_shopping.categories", "ksh_shopping.loyalty_cards",
            "ksh_shopping.lists", "ksh_shopping.supermarkets", "ksh_shopping.user_settings",
        ],
        "folder_settings": {"/local/images/groceries", "/local/images/shopping_list_manager"},
    },
    "recipes": {
        "version": 1,       # the recipes part's STORAGE_VERSION
        "folder": RECIPES_FOLDER,
        "url": RECIPES_URL,
        "old": [
            ("www/images/recipe_manager", "/local/images/recipe_manager/"),
            ("www/recipe_manager/images", "/local/recipe_manager/images/"),
        ],
        "stores": ["ksh_recipes.recipes", "ksh_recipes.meal_plans", "ksh_recipes.global_timers"],
        "folder_settings": set(),
    },
}


def _free_name(wanted: Path, source: Path) -> tuple[Path, bool]:
    """Where ``source`` should be copied to, and whether it is already there. Never overwrites a different picture."""
    candidate, n = wanted, 1
    while candidate.exists():
        if candidate.is_file() and filecmp.cmp(source, candidate, shallow=False):
            return candidate, True
        n += 1
        candidate = wanted.with_name(f"{wanted.stem}_{n}{wanted.suffix}")
    return candidate, False


def _copy_pictures(config_dir: str, part: dict) -> tuple[dict[str, str], int, int]:
    """Copy every picture into the new folder (blocking: run in the executor).

    Returns ``{old link: new link}`` for the pictures that are now in the new folder, how many files were newly copied,
    and how many could not be copied.
    """
    target = Path(config_dir, part["folder"])
    target.mkdir(parents=True, exist_ok=True)
    links: dict[str, str] = {}
    copied = failed = 0
    for folder, old_url in part["old"]:
        source = Path(config_dir, folder)
        if not source.is_dir():
            continue
        for src in sorted(source.rglob("*")):
            relative = src.relative_to(source)
            # leave hidden files and the folders sync tools keep for themselves
            if any(p.startswith(".") or p == "_gsdata_" for p in relative.parts):
                continue
            if not src.is_file() or src.suffix.lower() not in PICTURE_TYPES:
                continue
            try:
                (target / relative).parent.mkdir(parents=True, exist_ok=True)
                dest, there = _free_name(target / relative, src)
                if not there:
                    # copy under another name first, so an interrupted copy never looks like a finished picture
                    temporary = dest.with_name(dest.name + ".part")
                    shutil.copy2(src, temporary)
                    os.replace(temporary, dest)
                    copied += 1
            except OSError as err:
                _LOGGER.warning("Could not copy picture %s: %s", src, err)
                failed += 1
                continue
            links[old_url + relative.as_posix()] = part["url"] + dest.relative_to(target).as_posix()
    return links, copied, failed


def rewrite_links(value: Any, links: dict[str, str], folders: dict[str, str]) -> tuple[Any, int]:
    """``value`` with old picture links replaced, and how many were. Anything else is returned as it was."""
    if isinstance(value, str):
        if not value.startswith("/local/"):
            return value, 0
        path, mark, query = value.partition("?")
        new = links.get(path) or links.get(unquote(path))
        return (new + mark + query, 1) if new else (value, 0)
    if isinstance(value, list):
        results = [rewrite_links(v, links, folders) for v in value]
        return [r[0] for r in results], sum(r[1] for r in results)
    if isinstance(value, dict):
        out, count = {}, 0
        for key, item in value.items():
            if key == "localImagePath" and isinstance(item, str) and item.rstrip("/") in folders:
                out[key], changed = folders[item.rstrip("/")], 1
            else:
                out[key], changed = rewrite_links(item, links, folders)
            count += changed
        return out, count
    return value, 0


async def async_move_pictures(hass: HomeAssistant, name: str) -> None:
    """Run the move for one part ("shopping" or "recipes"). Call before that part loads its storage.

    Runs until it has fully succeeded once. A problem never stops the part from loading: the old links keep working,
    and it is tried again at the next start.
    """
    part = PARTS[name]
    try:
        marker = Store(hass, 1, MARKER_KEY)
        state = await marker.async_load() or {}
        if name in state:
            return

        links, copied, failed = await hass.async_add_executor_job(_copy_pictures, hass.config.config_dir, part)
        # a folder setting only moves when everything in that folder made it across
        folders = {} if failed else {old: part["url"].rstrip("/") for old in part["folder_settings"]}

        changed = 0
        for key in part["stores"]:
            store = Store(hass, part["version"], key)
            data = await store.async_load()
            if data is None:
                continue
            new_data, count = rewrite_links(data, links, folders)
            if not count:
                continue
            await Store(hass, 1, BACKUP_PREFIX + key).async_save(data)    # kept as it was, in case it is ever needed
            await store.async_save(new_data)
            changed += count

        if failed:
            _LOGGER.warning("%d %s pictures could not be copied; trying again at the next start", failed, name)
            return
        state[name] = {"copied": copied, "links": changed}
        await marker.async_save(state)
        if copied or changed:
            _LOGGER.warning(
                "KSH Family Hub copied %d %s pictures to %s and updated %d links. The old folders were left as they are.",
                copied, name, part["folder"], changed,
            )
    except Exception:  # noqa: BLE001 - the part must still load
        _LOGGER.exception("Could not move the %s pictures to their new folder; the old links still work", name)


async def async_picture_report(hass: HomeAssistant) -> dict[str, dict[str, int]]:
    """What was moved, for the About section."""
    return await Store(hass, 1, MARKER_KEY).async_load() or {}
