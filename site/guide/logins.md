---
title: Logins, PINs and who can do what
---

# Logins, PINs and who can do what

The rules in one place.

## Two things that are easy to mix up

- A **Home Assistant login** is an account on your Home Assistant (a phone, a tablet, a computer).
- A **person** is a member of the family in the hub, with a role (adult, child or guest).

A person may or may not be linked to a login. People are never created from logins automatically.

## Who is acting?

| The device is signed in as | The hub acts as |
| --- | --- |
| A login **linked to a person** (not an administrator) | Always that person. They cannot act as anyone else. |
| A login **linked to a person**, and an **administrator** | That person by default, and the administrator can switch to anyone. |
| An **administrator** with no person | An adult, and can switch to anyone (handy on a family tablet). |
| A login **not linked** to anyone (a shared tablet) | The person picked on the tablet, **with their PIN** if they have one. |

On a shared tablet, tap the **name at the top of Chores** ("tap to switch") to change person.

## PINs

- A PIN is **four digits**. Set it under **People & guests**, or the person sets their own from Chores.
- On a shared (unlinked) login, a person **with a PIN** needs it once per device. After five wrong tries the PIN is locked for a minute.
- On a shared login, an **adult must have a PIN**. Without one, nobody can act as that adult from the shared login.
- A PIN is checked on the server and proof of it is kept on the device. After Home Assistant restarts, the PIN is asked for again.

## What each role can do

| | Adult | Child | Guest |
| --- | --- | --- | --- |
| Add and change chores, routines, rewards, events | ✅ | – | – |
| Add and remove people, set PINs | ✅ | – | – |
| Tick chores and routine steps | ✅ (counts at once) | ✅ (needs approval) | Only what is assigned |
| Approve chores and rewards | ✅ | – | – |
| See the calendar | ✅ everything | their own and the family's | only what is for them |
| See money (Finance) | ✅ everyone's | their own | – |
| Move money, record spending | ✅ | – | – |

Home Assistant **administrators** can also manage settings (parts on and off, who sees what) and can remove any person.

## Forgot a PIN?

An adult opens **People & guests**, opens the person, and sets a new PIN (or removes it).
