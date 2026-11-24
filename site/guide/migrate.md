---
title: Move from Recipe Manager and Shopping List Manager
---

# Move from Recipe Manager and Shopping List Manager

KSH Family Hub is the next step for both. It has the same recipes, planner, timers, lists, catalogue and loyalty cards, and adds chores, a calendar and pocket money.

## Your data comes with you

The **first time** each part starts, the hub **imports** your existing data:

| From | To |
| --- | --- |
| `.storage/recipe_manager.*` (recipes, meal plans, timers) | Meals |
| `.storage/shopping_list_manager.*` (lists, items, products, categories, loyalty cards, groups) | Shopping |

- The originals are **not touched**. You can keep the old integrations running next to the hub while you try it. Changes made in one do not appear in the other after the copy.
- Recipe and product **images keep their paths** under `www/images/`.
- Automations that use the old sensors need pointing at the new ones: the hub uses `ksh_recipes/…` and `ksh_shopping/…` names and `sensor.ksh_family_hub_timers`.

## Steps

1. Install KSH Family Hub ([Install and set up](./getting-started)) and switch on **Meals** and **Shopping**.
2. Restart Home Assistant. Open **Family Hub** and check your recipes and lists are there.
3. Add your family ([Add your family](./people)).
4. When you are happy, remove the old integrations and cards (HACS → each → Remove, then delete the old dashboard cards).

## What is different

- One entry in the sidebar, one theme for everything (see [Change the look and the menu](./themes-menu)).
- The old dashboard cards are replaced by the hub; the version numbers are under the hub's Settings → About.
- Shopping and Meals use the hub's people, so households and who-can-see-what work across everything.
