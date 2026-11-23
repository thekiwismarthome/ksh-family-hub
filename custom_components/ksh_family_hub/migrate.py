"""One-time import of data from the standalone Recipe Manager / Shopping List Manager."""
from __future__ import annotations

import json
import logging
import os
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

_LOGGER = logging.getLogger(__name__)

MARKER_KEY = "ksh_family_hub.migration"


def _read_legacy_files(storage_dir: str, old_domain: str, new_domain: str) -> dict[str, dict[str, Any]]:
    """Read ``.storage/<old>.*`` and return the storage envelopes keyed by their new key."""
    found: dict[str, dict[str, Any]] = {}
    if not os.path.isdir(storage_dir):
        return found
    prefix = f"{old_domain}."
    for name in sorted(os.listdir(storage_dir)):
        if not name.startswith(prefix):
            continue
        try:
            with open(os.path.join(storage_dir, name), encoding="utf-8") as fh:
                envelope = json.load(fh)
            if "data" not in envelope or "version" not in envelope:
                raise ValueError("not a storage file")
        except (OSError, ValueError) as err:
            _LOGGER.warning("Could not read %s for import: %s", name, err)
            continue
        found[f"{new_domain}.{name[len(prefix):]}"] = envelope
    return found


async def async_import_legacy_storage(
    hass: HomeAssistant, module: str, old_domain: str, new_domain: str
) -> list[str]:
    """Import the data of a standalone integration the first time a module starts.

    Files are written through ``Store.async_save``. Copying files into ``.storage``
    by hand does not work: Home Assistant lists that folder once at startup and treats
    any file created later as non-existent, so the new module would load empty.

    The originals are left untouched. Images already live in ``www/images/...`` and keep
    the same paths. A marker is saved once a module has been imported, so this never runs
    twice and never overwrites data created in the hub afterwards.
    """
    marker = Store(hass, 1, MARKER_KEY)
    state = await marker.async_load() or {}
    if module in state:
        return []

    envelopes = await hass.async_add_executor_job(
        _read_legacy_files, hass.config.path(".storage"), old_domain, new_domain
    )
    imported: list[str] = []
    for key, env in envelopes.items():
        store = Store(hass, env["version"], key, minor_version=env.get("minor_version", 1))
        await store.async_save(env["data"])
        imported.append(key)

    state[module] = imported
    await marker.async_save(state)
    if imported:
        _LOGGER.warning("KSH Family Hub imported %s data from %s: %s", module, old_domain, ", ".join(imported))
    else:
        _LOGGER.warning("KSH Family Hub found no %s data to import (looked for .storage/%s.*)", module, old_domain)
    return imported


async def async_import_report(hass: HomeAssistant) -> dict[str, list[str]]:
    """Which storage files each part imported (for the About section)."""
    return await Store(hass, 1, MARKER_KEY).async_load() or {}
