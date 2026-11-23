# KSH Family Hub

Recipes, meal planning and shopping lists for Home Assistant, in **one** integration and **one** app.

> **Beta.** This is the first combined build of [Recipe Manager](https://github.com/thekiwismarthome/Recipe-Manager)
> and [Shopping List Manager](https://github.com/thekiwismarthome/shopping-list-manager). It is the base for a larger
> family hub, so expect rough edges and a lot of "coming soon" tiles.

## What you get

| Menu entry | Status |
| --- | --- |
| **Home** | Today's meals, open shopping items, shortcuts, hub settings |
| **Shopping** | Everything Shopping List Manager does: lists, catalogue, loyalty cards, supermarkets, households |
| **Meals** | Everything Recipe Manager does: recipes, importers, meal planner, timers |
| Wishlist, Chores, Finances, Medicine, Reminders, Birthdays, Expiry, Cards, Routines | Placeholders for what comes next |
| Timetables, Chat, Location | Placeholders, shown locked |

**Phone:** a floating bottom bar (Home, Shopping, Meals, Wishlist, More) and a *More* sheet with every section.
**Tablet / desktop (≥ 700 px wide):** a slim icon rail down the left with every section.

### Switch parts on and off

Don't want shopping, or don't want recipes? Turn either off in **Home → ⚙ Hub settings → Parts of the hub**
(administrators only) or from the integration's **Configure** button. A switched-off part disappears from the
menus and its backend is not loaded. Its data is left alone, so switching it back on restores everything.
At least one part has to stay on.

## Install (HACS)

1. HACS → ⋮ → **Custom repositories** → add `https://github.com/thekiwismarthome/ksh-family-hub`, type **Integration**.
2. Download **KSH Family Hub**. Because this is a beta, enable *Show beta versions* if HACS does not offer it.
3. Restart Home Assistant.
4. Settings → Devices & services → **Add integration → KSH Family Hub**. Pick which parts to switch on and your shopping country.
5. A **Family Hub** entry appears in the sidebar. Hard-refresh the browser (Ctrl+Shift+R) if it doesn't.

The card is also available for dashboards: `type: custom:ksh-family-hub-card` (best in a *panel* view).
There is nothing to add under Dashboard resources; the integration serves and loads the card itself.

### Already using Recipe Manager / Shopping List Manager?

The first time each part starts, KSH Family Hub **copies** your existing data from
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
