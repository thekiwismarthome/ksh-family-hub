import { defineConfig } from 'vitepress';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(readFileSync(resolve(here, '../../package.json'), 'utf8'));
const REPO = 'https://github.com/thekiwismarthome/ksh-family-hub';

// Served from /ksh-family-hub/ on GitHub Pages (the same address as the other The Kiwi Smart Home sites). SITE_BASE=/ for a custom domain.
const BASE = process.env.SITE_BASE || '/ksh-family-hub/';

export default defineConfig({
  title: 'KSH Family Hub',
  description: 'Shopping, meals, chores, a family calendar and pocket money in one Home Assistant integration. Free and open source, made in New Zealand.',
  lang: 'en-NZ',
  base: BASE,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${BASE}favicon-64.png` }],
    ['meta', { name: 'theme-color', content: '#0B6BC0' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'KSH Family Hub',
    nav: [
      { text: 'Live demo', link: '/demo' },
      { text: 'Tutorials', link: '/guide/getting-started', activeMatch: '/guide/(getting|people|chores|money|shopping|meals|calendar|kids)' },
      { text: 'How-tos', link: '/guide/themes-menu', activeMatch: '/guide/(themes|away|migrate|cards|automations|backup|logins|troubleshooting)' },
      { text: `v${version}`, items: [
        { text: 'Release notes', link: `${REPO}/releases` },
        { text: 'Source on GitHub', link: REPO },
        { text: 'Report a problem', link: `${REPO}/issues` },
        { text: 'The Kiwi Smart Home', link: 'https://thekiwismarthome.github.io/' },
      ] },
    ],
    sidebar: {
      '/guide/': [
        { text: 'Start here', items: [
          { text: 'Overview', link: '/guide/' },
          { text: 'Install and set up', link: '/guide/getting-started' },
        ] },
        { text: 'Tutorials', items: [
          { text: 'Add your family', link: '/guide/people' },
          { text: 'Chores and routines', link: '/guide/chores-routines' },
          { text: 'Points, rewards and pocket money', link: '/guide/money' },
          { text: 'Shopping lists', link: '/guide/shopping' },
          { text: 'Recipes and the meal planner', link: '/guide/meals' },
          { text: 'The family calendar', link: '/guide/calendar' },
          { text: 'A screen for the kids\' bedroom', link: '/guide/kids-screen' },
        ] },
        { text: 'How-tos', items: [
          { text: 'Change the look and the menu', link: '/guide/themes-menu' },
          { text: 'Logins, PINs and who can do what', link: '/guide/logins' },
          { text: 'Use it away from home', link: '/guide/away-from-home' },
          { text: 'Add the hub to a dashboard', link: '/guide/cards' },
          { text: 'Reminders and automations', link: '/guide/automations' },
          { text: 'Move from Recipe Manager and Shopping List Manager', link: '/guide/migrate' },
          { text: 'Back up and restore', link: '/guide/backup' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' },
        ] },
      ],
    },
    socialLinks: [{ icon: 'github', link: REPO }],
    search: { provider: 'local' },
    editLink: { pattern: `${REPO}/edit/main/site/:path`, text: 'Edit this page on GitHub' },
    outline: { level: [2, 3], label: 'On this page' },
    footer: { message: 'Open source under the MIT licence. Made in New Zealand.', copyright: 'The Kiwi Smart Home' },
  },
  vite: { server: { fs: { strict: false } } },
});
