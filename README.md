# KSH Family Hub

Recipes, meal planning and shopping lists for Home Assistant, in **one** integration and **one** app.

[![Open your Home Assistant instance and open the KSH Family Hub repository in the Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=thekiwismarthome&repository=ksh-family-hub&category=integration)
[![Open your Home Assistant instance and start setting up KSH Family Hub.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=ksh_family_hub)

> **Beta.** This is the first combined build of [Recipe Manager](https://github.com/thekiwismarthome/Recipe-Manager)
> and [Shopping List Manager](https://github.com/thekiwismarthome/shopping-list-manager). It is the base for a larger
> family hub, so expect rough edges and a lot of "coming soon" tiles.

## What you get

| Menu entry | Status |
| --- | --- |
| **Home** | Today's meals, open shopping items, shortcuts, hub settings |
| **Shopping** | Shopping List Manager: lists, catalogue, supermarkets, households |
| **Chores** | Chores for the family: assign, repeat, reminders; children do, adults approve; routines; points |
| **Cards** | Loyalty cards (part of Shopping) |
| **Meals** | Everything Recipe Manager does: recipes, importers, meal planner, timers |
| Wishlist, Finances, Medicine, Reminders, Birthdays, Expiry, Routines, Timetables, Chat, Location | Placeholders for what comes next |

**Phone:** a floating bottom bar (Home, Shopping, Meals, Wishlist, More) and a *More* sheet with every section.
**Tablet / desktop (≥ 700 px wide):** a slim icon rail down the left with every section.

### Switch parts on and off

Every menu entry has a switch in **Home → ⚙ Hub settings → Parts of the hub** (administrators only). Shopping and
Meals load or unload that part of the integration; the other entries just show or hide their menu item. The
integration's **Configure** button has the Shopping/Meals switches too. Its data is left alone, so switching it back on restores everything.
At least one part has to stay on.

## Install (HACS)

The quickest way: press the first button at the top of this page, download **KSH Family Hub**, restart Home Assistant, then press the second button to set it up. Or by hand:

1. HACS → ⋮ → **Custom repositories** → add `https://github.com/thekiwismarthome/ksh-family-hub`, type **Integration**.
2. Download **KSH Family Hub**. Because this is a beta, enable *Show beta versions* if HACS does not offer it.
3. Restart Home Assistant.
4. Settings → Devices & services → **Add integration → KSH Family Hub**. Pick which parts to switch on and your shopping country.
5. A **Family Hub** entry appears in the sidebar. Hard-refresh the browser (Ctrl+Shift+R) if it doesn't.

The card is also available for dashboards: `type: custom:ksh-family-hub-card` (best in a *panel* view).
There is nothing to add under Dashboard resources; the integration serves and loads the card itself.

### Already using Recipe Manager / Shopping List Manager?

The first time each part starts, KSH Family Hub **imports** your existing data from
`.storage/recipe_manager.*` and `.storage/shopping_list_manager.*`. The originals are not touched, images keep
their paths under `www/images/`, and you can run the standalone integrations next to the hub while testing.
Changes made in one do not appear in the other after the copy.

The hub uses its own names (`ksh_recipes/…`, `ksh_shopping/…`, `sensor.ksh_family_hub_timers`), so the old and new
integrations don't clash. Automations that use the old sensors need pointing at the new ones.

## Layout of this repository

```
custom_components/ksh_family_hub/
  __init__.py        hub: loads the enabled parts, WebSocket get_info / set_modules, sidebar panel
  recipes/           Recipe Manager backend (namespace ksh_recipes)
  shopping/          Shopping List Manager backend (namespace ksh_shopping)
  www/               built card (generated, committed so HACS can serve it)
src/
  ksh-family-hub-card.js   the shell: menus, routing, theme
  hub/                     Home, Settings and placeholder pages
  modules/recipes/         Recipe Manager Card, with a hub mode
  modules/shopping/        Shopping List Manager Card, with a hub mode
```

## Develop

```bash
npm install
npm run build     # writes custom_components/ksh_family_hub/www/
```

## Licence

MIT. See [LICENSE](LICENSE).
