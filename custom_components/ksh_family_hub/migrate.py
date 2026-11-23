"""One-time import of data from the standalone Recipe Manager / Shopping List Manager."""
from __future__ import annotations

import json
import logging
import os

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)


def _copy_legacy_files(storage_dir: str, old_domain: str, new_domain: str) -> list[str]:
    """Copy ``.storage/<old>.*`` to ``.storage/<new>.*`` unless the target exists."""
    copied: list[str] = []
    if not os.path.isdir(storage_dir):
        return copied
    prefix = f"{old_domain}."
    for name in sorted(os.listdir(storage_dir)):
        if not name.startswith(prefix):
            continue
        new_name = f"{new_domain}.{name[len(prefix):]}"
        target = os.path.join(storage_dir, new_name)
        if os.path.exists(target):
            continue
        try:
            with open(os.path.join(storage_dir, name), encoding="utf-8") as fh:
                data = json.load(fh)
            data["key"] = new_name
            with open(target, "w", encoding="utf-8") as fh:
                json.dump(data, fh, indent=2)
            copied.append(new_name)
        except (OSError, ValueError) as err:
            _LOGGER.warning("Could not import %s: %s", name, err)
    return copied


async def async_import_legacy_storage(
    hass: HomeAssistant, old_domain: str, new_domain: str
) -> None:
    """Import the data of a standalone integration the first time a module starts.

    The originals are left untouched, so the standalone integration keeps working
    and nothing is lost if the hub is removed again. Images already live in
    ``www/images/...`` and keep the same paths, so they need no copying.
    """
    storage_dir = hass.config.path(".storage")
    copied = await hass.async_add_executor_job(
        _copy_legacy_files, storage_dir, old_domain, new_domain
    )
    if copied:
        _LOGGER.info("Imported data from %s into KSH Family Hub: %s", old_domain, ", ".join(copied))
