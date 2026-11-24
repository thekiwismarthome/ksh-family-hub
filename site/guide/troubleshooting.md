---
title: Troubleshooting
---

# Troubleshooting

## "Custom element doesn't exist: ksh-family-hub-kids-card" (or the hub card)

The browser or the phone app is holding an old copy. **Hard-refresh** (Ctrl+Shift+R). In the Home Assistant app: Settings → Companion app → Troubleshooting → **Reset frontend cache**. Then reopen the dashboard editor. If **Add card** lists *KSH Family Hub: Kids view*, the new copy is loaded.
Or skip dashboards: use the kids screen **Link** (`/ksh-family-hub?kids=Mia`).

## The Family Hub entry is not in the sidebar

- Check Settings → Devices & services → KSH Family Hub is **loaded**.
- Hard-refresh the browser.
- The sidebar entry can be switched off in the integration's **Configure** options (**Show in the sidebar**).

## The hub is blank, or stuck on loading

1. Hard-refresh.
2. Open Settings → System → **Logs** and look for `ksh_family_hub`.
3. In the browser's developer tools (F12) → Console, look for red errors and [open an issue](https://github.com/thekiwismarthome/ksh-family-hub/issues) with them.

## A child cannot tick a chore

- On a shared tablet, tap the **name at the top** of Chores and pick the child (and enter their PIN if they have one).
- A chore only shows for a child if it is **assigned** to them, or to **Anyone**.
- A chore does not appear before its **starting day**.

## "Enter … PIN" or "Set a PIN for …"

On a shared login, adults must have a PIN, and anyone with a PIN needs it once per device. An adult sets or resets it under **People & guests**. See [Logins, PINs and who can do what](./logins).

## Everyone I did not add is in People

Older test builds created a person for every Home Assistant user. Open **People & guests**, open each one you do not want and press **Remove**. Their logins and the points history are not touched. The current version never does this.

## Pocket money was not paid

- The **Finance** part has to be on.
- The child needs pocket money switched on, with a target and an amount, under Chores → Points → Pocket money.
- Weeks start on Monday, and the first week that counts is the first full week after you turn it on.
- A week is paid after it finishes, and only if the points target was reached.

## Reminders do not arrive

- Set the person's phone under **People & guests → Phone notifications** (`notify.mobile_app_…`). Without one, the reminder shows in Home Assistant's notification list.
- The chore needs a **due time** and **Remind** switched on.

## Times and dates look a day out

"Today" follows **Home Assistant's** time zone (Settings → System → General). Check it is set to your home.

## It is slow away from home

See [Use it away from home](./away-from-home). The first open downloads the app; after that it is cached.

## Reporting a problem

[Open an issue](https://github.com/thekiwismarthome/ksh-family-hub/issues) and say what you did, what you expected, what happened, your Home Assistant version and the hub's version (Settings → About).
