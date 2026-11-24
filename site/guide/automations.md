---
title: Reminders and automations
---

# Reminders and automations

The hub sends its own reminders and also fires **events** you can use in automations.

## Built-in reminders

- **Chores** with *Remind* on: at the chore's due time, a notification goes to the phone of each person it is for, or shows in Home Assistant's notifications if nobody has a phone set.
- **Calendar events** with a reminder: at the chosen time before.

Set a person's phone under **People & guests → Phone notifications**, using the `notify.mobile_app_…` service of their phone (find it in Developer tools → Actions).

## Events

| Event | When | Data |
| --- | --- | --- |
| `ksh_chores_due` | A chore with a reminder reaches its due time | `chore_id`, `name`, `due_time`, `assignees` (person ids) |
| `ksh_calendar_reminder` | A calendar event's reminder is due | `event_id`, `title`, `date`, `start_time`, `people` |
| `ksh_chores_updated` | Anything about chores changed | none |
| `ksh_calendar_updated` | Anything about the calendar changed | none |
| `ksh_shopping_item_added` / `_checked` / `_updated` / `_deleted` | A shopping item changed | the item |
| `ksh_shopping_list_updated` / `_deleted` | A list changed | the list |

## Example: announce a chore on a speaker

```yaml
automation:
  - alias: Announce chores
    triggers:
      - trigger: event
        event_type: ksh_chores_due
    actions:
      - action: tts.speak
        target:
          entity_id: tts.home_assistant_cloud
        data:
          media_player_entity_id: media_player.kitchen
          message: "Time for {{ trigger.event.data.name }}"
```

## Example: flash a light when a calendar reminder fires

```yaml
automation:
  - alias: Calendar reminder light
    triggers:
      - trigger: event
        event_type: ksh_calendar_reminder
    actions:
      - action: light.turn_on
        target:
          entity_id: light.hallway
        data:
          flash: short
```

## Timers

With the **Meals** part on, cooking timers are also exposed as a sensor, `sensor.ksh_family_hub_timers`, and mirror View Assist or Voice PE timers if you use them.
