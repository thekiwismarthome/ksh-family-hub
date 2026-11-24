---
title: Install and set up
---

# Install and set up

About ten minutes, most of it adding your family.

## Before you start

- Home Assistant 2024.8 or newer, and [HACS](https://hacs.xyz) installed.
- You are signed in as a Home Assistant **administrator**.

## 1. Install with HACS

1. In HACS open the ⋮ menu → **Custom repositories**.
2. Add `https://github.com/thekiwismarthome/ksh-family-hub`, type **Integration**.
3. Find **KSH Family Hub**, **Download**, then **restart Home Assistant**.

::: tip One button
On a phone or computer that is signed in to Home Assistant, this opens the repository in HACS for you:
[Open in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=thekiwismarthome&repository=ksh-family-hub&category=integration).
:::

## 2. Add the integration

Settings → Devices & services → **Add integration** → **KSH Family Hub**.

You choose the **parts** you want. You can change this later in the hub's settings, and switching a part off keeps its data.

| Part | What it is |
| --- | --- |
| Meals | Recipes, meal planner, timers |
| Shopping | Shopping lists and catalogue (you also pick your **country**, which decides the product catalogue) |
| Chores | Chores, routines, points, rewards |
| Calendar | Family calendar |
| Finance | Pocket money accounts |

## 3. Open the hub

A **Family Hub** entry appears in the Home Assistant sidebar. If it does not, hard-refresh the browser (**Ctrl+Shift+R**; in the phone app, reset the frontend cache in Settings → Companion app → Troubleshooting).

On a phone you see a bar at the bottom (Home, then your first three parts, then More). On a tablet or computer the same entries are a rail down the left.

## 4. Add your family

Nobody is added for you. Open the menu (☰, top right) → **People & guests** and add yourself first, linking your own Home Assistant login. Then the children. The next page walks through it: [Add your family](./people).

## 5. Try something

- Add a chore under **Chores**.
- Add an item to a shopping list.
- Add an event to the calendar from the **+** button at the top.

## What next

- [Add your family](./people)
- [Change the look and the menu](./themes-menu)
- [Use it away from home](./away-from-home)
