---
title: The family calendar
---

# The family calendar

School, sport, dentist, birthdays and reminders in one place, with each person's face and colour.

![Calendar](/shots/calendar-month.webp)

## Views

**Month**, **Week**, **Day** and **Agenda** (what is coming up) are the tabs at the top. The month and year are shown above the calendar, with arrows and **Today** under it.

- **Month** shows a small card for the day you tap. In **Calendar settings** you choose where it goes: right, left, bottom or top (on a phone it sits at the bottom).
  Every day with something on it shows it: the emoji of the events and a **✓ 3** for the three chores due.
- **Day** is the quick look at today, with the face of who each thing is for.
- A row of people at the top shows the calendar for **Everyone** or one person.

## Add an event

Press **+** (top bar) → **Event**, or **Add** in the calendar. Choose:

- **Type**: School, Sport, Appointment, Reminder, Birthday, Family or Other. The type picks a colour and a starting emoji, and you can pick your own emoji.
- **Who is it for**: one person, several, or nobody for the whole family.
- **All day** or a start and end **time**, or a **multi-day** trip.
- **Repeat**: daily, weekly on chosen days, monthly, yearly, or custom, with an optional end date.
- **Location** and **notes**.
- **Reminder**: at the time, 10 or 30 minutes before, 1 hour before or 1 day before. It goes to the phone of each person it is for, or shows in Home Assistant's notifications. A `ksh_calendar_reminder` event fires too ([automations](./automations)).

::: tip Birthdays
**+ → Birthdays** starts an all-day event that repeats every year.
:::

## Chores in the calendar

Chores can show on the days they are due. In **Calendar settings** choose which views show them (Day, Week, Agenda, Month). In the Day view an adult or the child can **tick a chore** straight from the calendar, and **Open chores** takes you to the Chores page.

## Home Assistant calendars

**Calendar settings → Home Assistant calendars**: switch on any calendar that Home Assistant already has (Google, a school calendar, public holidays…). They show alongside, read only.

## Whose face goes where

**Calendar settings → Who it belongs to**: faces on the **left** (the default) or the **right** of each card. The coloured stripe always stays on the left.

## Who can add events

Adults add, change and delete events. Children see their own and the family's. Guests see only what is for them.
