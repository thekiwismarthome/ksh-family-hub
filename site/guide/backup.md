---
title: Back up and restore
---

# Back up and restore

## The simple way

A normal **Home Assistant backup** includes everything the hub stores. Restore the backup and the hub is back as it was. Keep your backups off the Home Assistant machine.

## What the hub stores

All in `/config/.storage`:

| File | Contains |
| --- | --- |
| `ksh_family_hub.people` | The family: names, roles, PINs (hashed), pictures |
| `ksh_chores.data` | Chores, routines, points, rewards, pocket money rules |
| `ksh_calendar.data` | Family events and calendar settings |
| `ksh_finance.data` | Cash and bank accounts and every transaction |
| `ksh_recipes.*` | Recipes, meal plans, global timers |
| `ksh_shopping.*` | Lists, items, products, categories, loyalty cards, groups, supermarkets |

Images are in `/config/www/images/recipe_manager/` (recipes) and `/config/www/images/shopping_list_manager/` (shopping). The Home Assistant backup includes them when it includes the `www` folder.

PINs are stored as salted hashes, never as the digits.

## Shopping backup and restore

The Shopping part also has its own **Backup & Restore** (Shopping → settings → Support): it exports your **lists and custom products** to a file and can import them again. The catalogues for each country ship with the hub and are not part of it.

## After restoring

Restart Home Assistant, then hard-refresh the browser. PINs set on devices are asked for again after a restart.
