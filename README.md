# KSH Family Hub

Shopping, meals, chores, a family calendar and pocket money for Home Assistant, in **one** integration and **one** app.
Free and open source, made in New Zealand.

[![Open your Home Assistant instance and open the KSH Family Hub repository in the Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=thekiwismarthome&repository=ksh-family-hub&category=integration)
[![Open your Home Assistant instance and start setting up KSH Family Hub.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=ksh_family_hub)

**Website, live demo and how-tos: <https://thekiwismarthome.github.io/ksh-family-hub/>**

KSH Family Hub replaces [Recipe Manager](https://github.com/thekiwismarthome/Recipe-Manager) and
[Shopping List Manager](https://github.com/thekiwismarthome/shopping-list-manager) (it imports their data) and adds
chores, a calendar and pocket money.

## What you get

| Part | What it does |
| --- | --- |
| **Home** | Today at a glance: open shopping items, tonight's dinner, chores to do, shortcuts |
| **Shopping** | Shared real-time lists, a product catalogue, supermarkets, loyalty cards, households, tiles or list view |
| **Meals** | Recipes (import from a website or Recipe Keeper), a weekly meal planner, cooking timers, tiles or list view |
| **Chores** | Assign chores to one person, several or anyone; repeat daily, weekly or custom; children tick, adults approve; routines with steps for certain days; points, rewards to spend them on, and reminders |
| **Calendar** | Family events (school, sport, appointments, birthdays, reminders), month / week / day / agenda, your chores and Home Assistant calendars alongside, with each person's picture and colour |
| **Finance** | Pocket money: a Cash and a Bank account for each child, what was spent on what, and rules that turn points into pocket money each week or month |
| **Kids screen** | A big, colourful screen for one child (chores, routines, stars, rewards) for a bedside display or wall tablet |
| **People** | Adults, children and guests, each with a preferred name, an emoji or picture, a colour and an optional PIN. Children do not need a Home Assistant login |

Ten colour themes (each in light and dark), a searchable emoji picker, and every part can be switched off.

## Install (HACS)

1. HACS → ⋮ → **Custom repositories** → add `https://github.com/thekiwismarthome/ksh-family-hub`, type **Integration**.
2. Download **KSH Family Hub** and restart Home Assistant.
3. Settings → Devices & services → **Add integration → KSH Family Hub**. Pick the parts you want and your shopping country.
4. A **Family Hub** entry appears in the sidebar. Hard-refresh the browser (Ctrl+Shift+R) if it does not.
5. Open the hub's menu → **People & guests** and add the family. Nobody is added for you.

There is nothing to add under Dashboard resources; the integration serves and loads the cards itself.
The full walk-through, with pictures, is in the [tutorials](https://thekiwismarthome.github.io/ksh-family-hub/guide/).

### Dashboard cards

```yaml
type: custom:ksh-family-hub-card            # the whole hub (best in a panel view)
```

```yaml
type: custom:ksh-family-hub-kids-card       # the kids screen
person: Mia                                 # the name in People & guests
style: galaxy                               # optional: galaxy, candy, ocean, jungle
```

The kids screen also opens full screen, with no dashboard, at `/ksh-family-hub?kids=Mia`.

### Already using Recipe Manager / Shopping List Manager?

The first time each part starts, KSH Family Hub **imports** your data from `.storage/recipe_manager.*` and
`.storage/shopping_list_manager.*`. The originals are not touched and images keep their paths under `www/images/`.
The hub uses its own names (`ksh_recipes/…`, `ksh_shopping/…`, `sensor.ksh_family_hub_timers`), so the old and new
integrations do not clash. Automations that use the old sensors need pointing at the new ones.

## Fast away from home

Opening the hub over the internet (Nabu Casa, a reverse proxy) is quick on purpose:

- Home Assistant loads a **2 KB** loader on every page, not the app. The app, and each part (Shopping, Meals, Chores…),
  is fetched the first time it is opened and kept by the browser for good.
- Files are served pre-compressed, and the heavy extras (barcode scanner, backup zip, emoji list) load only when used.
- A chore or routine step shows as done at once and is confirmed in the background.
- Photos are sent once and kept on the device; the hub does not redraw for unrelated Home Assistant changes.
- "Today" is the household's today (Home Assistant's time zone), also when the phone is abroad.

## Layout of this repository

```
custom_components/ksh_family_hub/
  __init__.py        loads the enabled parts, hub WebSocket API, sidebar panel
  people.py          people, PINs, who is acting
  recipes/ shopping/ chores/ family_calendar/ family_finance/   the parts (own WebSocket namespaces)
  www/               the built app (generated and committed so HACS can serve it)
src/
  loader.js          the 2 KB file every page gets
  ksh-family-hub-card.js   the app shell: menus, routing, themes; loads each part on demand
  hub/               Home, Settings, People sheets, emoji picker, themes, helpers
  modules/           shopping, recipes, chores, calendar, finance
  kids/              the kids screen
site/                the website, live demo and guides (VitePress)
tools/               generators for the themes and the emoji list
```

## Develop

```bash
npm install
npm run build        # writes custom_components/ksh_family_hub/www/
node tools/gen-themes.mjs   # after changing a palette
node tools/gen-emoji.mjs    # after updating emojibase-data
```

## Licence

MIT. The shopping product icons are by [icons8](https://icons8.com) and need attribution under their free licence.
The emoji names and keywords come from the Unicode CLDR via [emojibase](https://emojibase.dev).
