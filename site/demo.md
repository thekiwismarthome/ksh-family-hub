---
layout: page
title: Live demo
sidebar: false
---

<script setup>
import { withBase } from 'vitepress';
const mia = withBase('/sandbox/app.html?kids=Mia');
const leo = withBase('/sandbox/app.html?kids=Leo&style=ocean');
</script>

<div class="demo-page">

# Try it before you install it

The real KSH Family Hub, running on sample data in your browser. Nothing is saved: reload and it starts again. You are signed in as Jordan, an adult, so you can do everything.

<DemoFrame height="860" />

## Things to try

- **Chores** → tick **Make bed**, or open Mia's morning routine and work through the steps. Then tap the name at the top to switch to Leo (PIN `1234`) and see his view.
- **Points** → ask for a reward as a child, then switch back to Jordan and approve it.
- **Finance** → look at Mia's Cash and Bank accounts and record a purchase.
- **Calendar** → open a day, add an event, try Month, Week, Day and Agenda.
- **Settings** (the three lines, top right) → change the theme, reorder the menu, hide a part for one person.
- **Kids screen** → <a :href="mia" target="_blank" rel="noopener">open Mia's screen</a> or <a :href="leo" target="_blank" rel="noopener">Leo's, in the ocean look</a> (PIN `1234`).

On a phone, use **Open full screen**.

</div>

<style>
.demo-page { max-width: 1180px; margin: 0 auto; padding: 48px 24px 80px; }
.demo-page h1 { font: 800 clamp(30px, 4vw, 44px) var(--kh-display); letter-spacing: -.02em; margin: 0 0 12px; }
.demo-page > p { color: var(--vp-c-text-2); max-width: 44em; margin: 0 0 12px; }
.demo-page ul { max-width: 52em; }
</style>
