---
title: Use it away from home
---

# Use it away from home

Away from home your phone talks to Home Assistant over the internet (Home Assistant Cloud, a reverse proxy, a tunnel). That link is slower than your Wi-Fi, so the hub is built to send as little as possible and to wait for as little as possible.

## What makes it quick

| What | Why it helps |
| --- | --- |
| A **2 KB loader** is the only thing Home Assistant puts on every page | Other Home Assistant pages are not slowed down by the hub |
| The app, and **each part** (Shopping, Meals, Chores, Calendar, Finance), load the first time you open them | You download only what you use |
| Files are **cached for good** by the browser (their names change when the hub is updated) | After the first visit nothing big is downloaded again |
| Files are served **pre-compressed** | About a quarter of the size |
| Heavy extras (barcode scanner, backup, emoji list) load **only when used** | Shopping went from 1.5 MB to 0.6 MB |
| A chore or routine step shows as **done at once** | No waiting for the round trip to see your tick |
| Photos are sent **once** and remembered | Lists stay small |
| The hub **does not redraw** for unrelated Home Assistant changes | Saves battery, and keeps the screen calm |
| The calendar asks for events, chores and Home Assistant calendars **at the same moment** | One round trip, not three |
| **"Today" is the family's today** (Home Assistant's time zone) | The right chores when the phone is abroad |

## Tips

- Add the hub to your phone's home screen (browser menu → *Add to Home screen*), or use the Home Assistant app.
- **Do not** turn off the browser cache for the Home Assistant address.
- Data saver and slow (2G/3G) connections skip the background preloading of the small parts.
- If something seems stuck after an update, hard-refresh once (**Ctrl+Shift+R**, or reset the frontend cache in the phone app). Updating changes the file names, so you only ever get a fresh copy once.

## Security of the link

The hub uses Home Assistant's own login and websocket, so everything Home Assistant does to protect your remote access (HTTPS, login, two-factor) applies. Do not expose Home Assistant to the internet without HTTPS.
