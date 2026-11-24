# Release notes

Versions now follow the date: **YEAR.MONTH.RELEASE**, with a `-betaN` suffix while in beta (the first one is 2026.11.1-beta6, after 0.1.0-beta.5).

## 2026.11.1-beta7

- **Preferred name and pictures for people.** Each person can have a preferred name (shown everywhere, never taken from the Home Assistant login) and a picture: an emoji, the Home Assistant picture of their linked login, or a photo of their own (shrunk to a small square on the device). The picture shows in the Chores and Calendar filters, on every chore, on calendar events, in Finance and in the people lists.
- **New logo**: the house with "Family Hub" under it, in the image itself.
- **Chores show who they are for**: the faces of the assigned people (or of who did it) sit at the left of each chore, with their colour as a stripe.
- **Routines are listed per person.** A routine for several children is one card for each child, under their name, each with its own progress and points. An adult can open a child's card and tick steps for them. (Assign a routine to several people as before; only the view changed.)
- **Calendar**: the month and year are shown above the calendar; every day with something on it shows it (event emojis, and the number of chores) on a phone too; chores now show in the month view by default; the **Open chores** button in a chore's popup works.
- **Kids screen** (new card `custom:ksh-family-hub-kids-card`): a big, colourful chores, routines and points screen for one child, made for a bedside display (Kiosk Satellite, Fully Kiosk, a wall tablet). Tick chores, go through a routine one step at a time, see stars, pocket money progress and rewards to ask for. Four looks (galaxy, candy, ocean, jungle). A child with a PIN is asked for it once on a device that is not signed in as them. Copy the card from Chores settings → Kids screen.

## 2026.11.1-beta6

- **People are no longer created from Home Assistant logins.** An adult (or a Home Assistant administrator) adds each person under People & guests, and can link them to a login if they have one (that login is then always them). Logins nobody linked simply pick a person on a shared tablet. A person who has a login can now be removed (the login is not touched), so profiles that the earlier beta created for every login can be cleared out there.

## 0.1.0-beta.5

- **Chores** (new part of the hub, can be switched off like Shopping and Meals):
  - Assign a chore to one person, several, or **Anyone**. Repeat **Daily, Weekly** (pick the days) or **Custom** (every N days, weeks or months).
  - **Children** mark a chore done, **adults** approve it. Points are paid **once**, when it is approved (an adult doing a chore themselves counts straight away). An adult can send a chore back or undo an approved one, which takes the points back.
  - **Routines**: step-by-step morning or evening routines for children, paying into the same points balance when the last step is done.
  - A **reminder at each chore's own due time**: sent to the phones set up for the people it is assigned to, otherwise shown in Home Assistant's notifications. A `ksh_chores_due` event fires too, for automations.
  - A **standard list** of about 30 chores (with emojis) and two standard routines to start from.
  - Points: balances for everyone, a history, and adults can add or take away points.
- **People & guests**: every Home Assistant user gets a profile; adults can add children and guests who have **no Home Assistant login**, give each a role (adult, child, guest), an emoji and an optional PIN, and pick who is using a shared tablet. Guests only see chores assigned to them.
- **Calendar** (new part, own tab, can be switched off): family events for school, sport, appointments, reminders and birthdays.
  - **Month, Week, Day and Agenda** views. In the month view a day card next to the month lists the chores and events of the day you tap; put it on the **right, left, bottom or top** (Calendar settings, per device).
  - Events: type (School, Sport, Appointment, Reminder, Birthday, Family, Other), emoji, who it is for, all day or timed, multi-day trips, **repeats** (daily, weekly on chosen days, monthly, yearly, custom, with an optional end date), location, notes and a **reminder** (at the time, 10/30 minutes, 1 hour or 1 day before) sent like chore reminders. A `ksh_calendar_reminder` event fires too.
  - Shows your **chores** on the days they are due, and any **Home Assistant calendars** you switch on (Google, local, school, holidays...), read only.
  - Quick add has Event, Reminders and Birthdays now. Guests only see events they are on.
- **Chores**: routine **steps have their own days** (pack the school bag on weekdays only, brush teeth every day); chores have a **starting date** and a **Once** option; a chore is **overdue** only after its day has ended or its due time has passed, never before it starts, and an Overdue section shows on Today; Today has an **All / Chores / Routines / Calendar** switch.
- **PIN logins**: a person with a PIN can pick their own name on any device and tick off their own chores and routines. On a shared login the integration now checks the PIN itself (a token is kept on that device); an adult profile needs a PIN there, so a child cannot pick it. Anyone can set or change their own PIN from Chores > Settings; five wrong tries lock it for a minute.
- **Celebrations**: when a child finishes a chore or routine an animation plays (ticker tape, fireworks, balloons or a star shower, or off). Each person picks their own under Chores > Settings > Celebration; adults can pick for anyone. A short one for a chore, a bigger one for a routine or the last chore of the day. Chores ticked in the calendar's Day view celebrate too.
- Calendar: chores can be shown in the Day, Week, Agenda and Month views (per device) and ticked off from the Day view; the faces (picture or emoji, in the person's colour) of who each event or chore is for sit on the left or right of its card (per device); the two month/face settings sit side by side on a wide display.
- Settings: Parts of the hub and Menu order are now one **Menu** list with arrows and switches.
- **Finance** (new part, can be switched off): pocket money. Every child has a **Cash** account and a **Bank** account and sees what they have and what it was spent on. Adults add money, record a purchase (taken from Cash, Bank or some of each, never below zero), move money between Cash and Bank, and can undo an entry. A child only sees their own.
- **Spend your points** (Chores > Points): a list of rewards with a points cost, with 12 standard ones to start from (screen time, choose dinner, ice cream, sleepover...). A child asks, an adult says yes and the points are spent once; an adult spends straight away.
- **Pocket money rules** (Chores > Points), per child: how many points to earn each week or month, how much it pays, and whether it goes into Cash or Bank. When the week or month ends it is paid into their Finance account automatically, once. It starts with the next full week or month; chores and routines count, bonuses do not.
- The empty **Routines** menu entry is gone (routines live in Chores). **Finances** is back as the new Finance part.
- Chores settings: the duplicate "Who is using this device" block is gone; tap your name at the top to switch.
- **Menu order and access**: each login can move the menu entries into the order it wants (Settings > Menu order); administrators can hide entries from individual people (Settings > Who can see what). Hiding only tidies the menu, it is not a lock. The Finances entry is gone.
- Menu: People & guests; Quick add > Chores opens the add-a-chore list.
- Pop-ups close by swiping them down.
- Tablet: the logo sits top left with the menu below it; the household name has no label; the logo is a little bigger.
- The Settings tab on Shopping, Meals and Chores is now an icon, always at the right of the tab row.

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
