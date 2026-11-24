---
title: Add the hub to a dashboard
---

# Add the hub to a dashboard

The **Family Hub** sidebar entry is the full app and needs nothing else. If you also want it (or the kids screen) on a **dashboard**, there are two cards. Nothing needs to be added under Dashboard resources: the integration loads them itself.

## The whole hub

```yaml
type: custom:ksh-family-hub-card
```

Best in a **panel** view (a view with a single card that fills the screen): edit the dashboard → the view's settings → **View type: Panel**.

## The kids screen

```yaml
type: custom:ksh-family-hub-kids-card
person: Mia            # the name in People & guests
style: galaxy          # optional: galaxy, candy, ocean, jungle
height: 100vh          # optional
```

You can also add it from the card picker (**KSH Family Hub: Kids view**), and the easiest way to get the exact text is **Chores → settings → Kids screen → Card**. See [A screen for the kids' bedroom](./kids-screen).

## Full screen without a dashboard

The kids screen opens full screen at the sidebar address with `?kids=` and the person's name:

```
https://your-home-assistant/ksh-family-hub?kids=Mia
https://your-home-assistant/ksh-family-hub?kids=Leo&style=ocean
```

## "Custom element doesn't exist"

You see this in the dashboard editor when the browser is still holding an older copy of the cards. Hard-refresh (**Ctrl+Shift+R**), or in the phone app reset the frontend cache. If the card picker lists **KSH Family Hub: Kids view**, the new version is loaded. See [Troubleshooting](./troubleshooting).
