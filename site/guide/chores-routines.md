---
title: Chores and routines
---

# Chores and routines

![Chores today](/shots/chores-today.webp)

## How it works

- **Children** mark a chore done, and an **adult approves** it. Points are paid **once**, when it is approved.
- **Adults** can do a chore themselves and it counts straight away.
- A chore is **late** when an earlier day was not finished, or when today's due time has passed. A chore without a due time is only late once its day is over, and never before its starting day.
- A **routine** is a list of steps for a morning or evening. When the last step of the day is done, the routine pays its points.

## Add a chore

1. **Chores** → **+** (or **Chores** tab → **Add chore**).
2. Pick from about 30 ready-made chores (with emojis), or **Create your own**.
3. Set:
   - **Name** and **emoji**. Type a word in the emoji search ("bins", "dog", "swim") to find one.
   - **Points** it is worth.
   - **Who does it**: one person, several, or **Anyone**.
   - **Repeat**: *Once*, *Daily*, *Weekly* (choose the days), or *Custom* (every N days, weeks or months).
   - **Starts on**: the first day it appears. It is not late before this day.
   - **Due time** (optional) and **Remind** (a reminder goes out at that time).

## The Today screen

The switch at the top shows **All**, **Chores**, **Routines** or **Calendar**. Adults also get a row of people to look at one person at a time.

- **To do** shows what is left, **Overdue** what was missed, **Done** what is finished.
- Each chore shows the **face** of who it is for, in their colour, and who did it once it is done.
- **Waiting for approval** (adults only) lists what children have ticked. **Approve**, or send it back with the undo button.
- A child's tick shows at once and is confirmed in the background, so it feels instant even away from home.

## Routines

1. **Routines** tab → **Add routine**, start from a morning or evening routine or make your own.
2. Add **steps**. Each step has an emoji, text and **days** it applies to: "Pack school bag" on school days only, "Brush teeth" every day.
3. Choose **who does it**. A routine for two children is shown as **one card for each child** under their name, each with its own progress and points. An adult can open a child's card and tick steps for them.
4. When the last step of the day is done the routine pays its points and plays a celebration.

## Celebrations

When a child finishes a chore, a short animation plays; a bigger one for a whole routine or the last chore of the day.
**Chores → settings (the gear) → Celebration**: pick one per person: *Ticker tape*, *Fireworks*, *Balloons*, *Star shower* or *Off*. It stays still on a device that asks for reduced motion.

## Reminders

At a chore's due time the hub fires an event (`ksh_chores_due`, see [Reminders and automations](./automations)), sends a notification to the phone of each person it is for (set under **People & guests → Phone notifications**), or shows a notification in Home Assistant if nobody has a phone set.

## Next

[Points, rewards and pocket money](./money)
