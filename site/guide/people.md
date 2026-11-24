---
title: Add your family
---

# Add your family

People are the heart of the hub: chores, points, calendar events and pocket money all belong to a person.
**Nobody is created for you** and Home Assistant users are *not* turned into family members. An adult adds each person on purpose.

![People & guests](/shots/people.webp)

## Add a person

1. Menu (☰, top right) → **People & guests**.
2. **Add a person**.
3. Fill in:
   - **Name** and an optional **Preferred name**. The preferred name is what is shown everywhere ("Leo", not "Leonard Smith").
   - **Role**: *Adult* (manages and approves), *Child* (does chores, ticks routines), or *Guest* (only sees what is assigned to them).
   - **Home Assistant login** (optional): link this person to a login. Children, grandparents and guests do not need one.
   - **Picture**: an emoji, the picture of their Home Assistant login, or a photo of their own (it is shrunk on the device, so the upload is small).
   - **PIN** (optional, four digits).
   - **Phone notifications** (optional): the `notify.mobile_app_…` service of their phone, used for chore and calendar reminders.
4. **Save**.

::: tip Start with yourself
Add yourself first as an adult and link your own login. Then your own phone is always *you*, with no PIN needed.
:::

## Linking a login or not

| The person | Link a login? | What happens |
| --- | --- | --- |
| An adult with their own Home Assistant account | **Yes** | Their phone is always them. No PIN needed. |
| A child with their own phone and account | Yes | They only ever act as themselves. |
| A child, grandparent or guest with no account | No | They are picked on a shared tablet, with their PIN if they have one. |

The full rules are in [Logins, PINs and who can do what](./logins).

## Pictures

Pictures show next to every chore, calendar event, routine and the people filters.
For a photo: **Picture → My own**, choose an image. The hub crops it to a square and keeps it small (about 10 KB), and phones fetch it once and remember it.

## Remove a person

Open them and press **Remove**. Their Home Assistant login is not touched, and the points they earned stay in the history.

## Tips

- Give each child a **PIN** if they use a shared tablet, so a sibling cannot tick their chores.
- Give each **adult** who is not signed in with their own login a PIN too. A shared login will not let anyone act as an adult without one.
- Add grandparents or a babysitter as **Guest** and assign them a chore or two. They only see their own.
