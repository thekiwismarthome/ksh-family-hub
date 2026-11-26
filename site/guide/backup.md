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

Pictures are in `/config/www/images/ksh-family-hub/`, with a `recipes` and a `shopping` folder. The Home Assistant backup includes them when it includes the `www` folder.

### Pictures from earlier versions

The first time this version starts, it copies pictures from the older folders (`images/recipe_manager`, `images/shopping_list_manager` and `images/groceries`) into the new ones and updates the links to them. The old folders are left as they were, so Recipe Manager and Shopping List Manager keep working. If you have your own tool that copies pictures into `images/groceries`, point it at `images/ksh-family-hub/shopping` instead: pictures added to the old folder afterwards are not picked up.

PINs are stored as salted hashes, never as the digits.

## Shopping backup and restore

The Shopping part also has its own **Backup & Restore** (Shopping → settings → Support): it exports your **lists and custom products** to a file and can import them again. The catalogues for each country ship with the hub and are not part of it.

## After restoring

Restart Home Assistant, then hard-refresh the browser. PINs set on devices are asked for again after a restart.
