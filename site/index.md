---
layout: home
title: KSH Family Hub
titleTemplate: Shopping, meals, chores and pocket money for Home Assistant
hero:
  name: Home Assistant integration
  text: The whole household, in one app.
  tagline: Shopping lists, meals, chores and routines, a family calendar and pocket money for the kids. Fast on your phone, also away from home. Free and open source.
  image:
    src: /logo.png
    alt: KSH Family Hub
  actions:
    - theme: brand
      text: Try the live demo
      link: /demo
    - theme: alt
      text: Install with HACS
      link: /guide/getting-started
features:
  - icon: 🛒
    title: Shopping
    details: Shared real-time lists, a product catalogue for your country, supermarkets and loyalty cards. Tiles or list.
    link: /guide/shopping
  - icon: 🍽️
    title: Meals
    details: Your recipe book, import from any website, a weekly meal planner, cooking timers and a "Tonight" card.
    link: /guide/meals
  - icon: ✅
    title: Chores and routines
    details: Assign, repeat and remind. Children tick, adults approve. Points, rewards and fireworks when they finish.
    link: /guide/chores-routines
  - icon: 📅
    title: Family calendar
    details: School, sport, appointments and birthdays, with each person's face and colour. Your chores and Home Assistant calendars alongside.
    link: /guide/calendar
  - icon: 💰
    title: Pocket money
    details: A Cash and a Bank account for each child. Points turn into pocket money each week, and what it was spent on is always visible.
    link: /guide/money
  - icon: 🌙
    title: A screen for the kids
    details: A big, colourful chores, routines and stars screen for the bedside tablet. Children do not need a Home Assistant login.
    link: /guide/kids-screen
---

## Try it now

This is the real hub, running on sample data in your browser. Nothing is saved: reload to start again.

<DemoFrame height="780" />

<p class="kh-lead">Switch the theme in the menu (the three lines, top right, then Settings), tick a chore as Mia, add something to the shopping list, or open the calendar. On a phone the demo is easier to use full screen.</p>

## Install in three steps

<div class="kh-steps">
<div>

### Add the repository

HACS → ⋮ → Custom repositories, add `thekiwismarthome/ksh-family-hub` as an **Integration**.

</div>
<div>

### Download and restart

Download **KSH Family Hub** in HACS and restart Home Assistant.

</div>
<div>

### Set it up

Settings → Devices & services → Add integration → **KSH Family Hub**. Choose the parts you want.

</div>
</div>

Then open **Family Hub** in the sidebar, go to the menu → **People & guests** and add your family. The full walk-through is in [Install and set up](/guide/getting-started).

## Built to be quick away from home

Home Assistant loads a 2 KB loader on every page, not the whole app. The app and each part are fetched the first time you open them and kept by the browser. Chores tick instantly. See [Use it away from home](/guide/away-from-home).

## Replaces Recipe Manager and Shopping List Manager

KSH Family Hub is the next step for both: it imports your recipes, meal plans, lists and products. See [Move from Recipe Manager and Shopping List Manager](/guide/migrate).
