# Release notes

## 0.1.0-beta.4

- **New top bar** on every page: KSH logo, then the household name on Home (the page name everywhere else).
  The logo is no longer in the menu list.
- **Households** (backend `ksh_family_hub/households/*`): the first is created from your Home Assistant name and is open
  to everyone with a login. Create more from the menu, then invite people (anyone with a Home Assistant login and a Person).
- **Menu (top right):** household switcher, Invite member, Settings, Change Region/Language.
- **Quick add** (+ left of the menu): Shopping List (adds to the active list) and Recipes (opens a new recipe).
  Reminders, Chores and Birthdays are listed and marked Soon.
- **Themes:** Settings > Theme: Midnight, Slate, Forest, Dusk (dark and light).
- The Shopping and Meals Settings sub-tabs are back; the gear moved into the menu as global Settings.

## 0.1.0-beta.3

- **KSH logo** at the top left: top of the icon rail on tablets, top left of the new top bar on phones. Tap it for Home.
- **Settings gear on every page** (top right). Shopping/Cards and Meals open their own settings; Home and the
  other pages open the hub settings. The separate Settings sub-tabs in Shopping and Meals are gone.
- The Home Assistant menu button moved into the top bar.
- The card is now cached under the new version number, so updating no longer needs a cache clear.

## 0.1.0-beta.2

- **Fixed: existing Recipe Manager / Shopping List Manager data was not imported.** Home Assistant lists `.storage`
  once at startup and treats files copied in later as missing, so the hub started empty. The import now writes
  through Home Assistant's storage API. It runs once per part (on the first start of this version) and replaces
  the empty data the previous beta created. Originals are never touched.
- **Cards** (loyalty cards) is now its own menu entry instead of a tab inside Shopping.
- Removed the padlock badges.
- Hub settings → Parts of the hub now lists every menu entry with a switch. Flip as many as you like: the page
  stays open and changes apply in the background. Shopping and Meals still load/unload their part of the
  integration; the other entries only show or hide their menu item.
- About shows how many files were imported from each old integration.


## 0.1.0-beta.1

First combined beta of Recipe Manager and Shopping List Manager.

- One integration (`ksh_family_hub`) and one card (`ksh-family-hub-card`, also a sidebar panel).
- Phone bottom bar + *More* sheet, tablet icon rail.
- Recipes and Shopping can each be switched off.
- Existing Recipe Manager / Shopping List Manager data is copied in on first start (originals untouched).
- Placeholder entries for the sections still to come.
