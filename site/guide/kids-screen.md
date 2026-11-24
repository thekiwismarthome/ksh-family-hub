---
title: A screen for the kids' bedroom
---

# A screen for the kids' bedroom

A big, colourful screen for **one child**: their chores, their routines and their stars. Made for a bedside tablet or a wall display (Kiosk Satellite, Fully Kiosk, a spare tablet), where a child can use it without anything else on screen.

![Kids screen](/shots/kids.webp)

## What the child sees

- A greeting, their **stars** and how many chores are left.
- **Chores**: big tiles. Tap one to tick it. It turns green and says a grown-up will check it, then plays their celebration.
- **Routines**: tap one to go through it **one step at a time** with a huge **Done!** button.
- **Points**: their stars, pocket money progress, and **rewards** they can ask for. They see how many stars are still needed.

## Set it up

1. Make sure the child is in **People & guests** (role *Child*) and has chores or routines assigned.
2. **Chores → settings (the gear) → Kids screen**. Each child has two buttons:
   - **Link** copies a web address like `https://your-home-assistant/ksh-family-hub?kids=Mia`. Point the tablet's browser or Kiosk app at it. No dashboard needed.
   - **Card** copies a dashboard card:

```yaml
type: custom:ksh-family-hub-kids-card
person: Mia
```

3. Optional settings for the card (or add `&style=ocean` to the link):

```yaml
type: custom:ksh-family-hub-kids-card
person: Mia
style: galaxy      # galaxy, candy, ocean or jungle
height: 100vh      # the height of the screen, if it is not full height
```

If you do not set a style, the look follows the person's colour.

## A PIN

If the child has a **PIN**, the screen asks for it **once** on a device that is not signed in as them (a big number pad, for little fingers). The tablet remembers it.
A tablet signed in with an **administrator** login does not need the PIN.

## Tips for a bedside tablet

- Sign the tablet in as a **dedicated, non-administrator** Home Assistant user, so children cannot get to settings.
- Use the **Link** with the kiosk app, so the whole tablet *is* the kids screen.
- The screen is quiet: it only redraws when something about the child changes, so it is gentle on the tablet's battery.
- It updates live: a chore an adult approves on their phone shows up on the tablet within a second.
