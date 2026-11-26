// A part of the hub can show its header buttons on the hub's tab row, next to the settings gear, to save a row on a phone.
// The part lists them in `hubActions` and handles a press in `runHubAction(id)`; the hub draws them.
export function publishActions(el) {
  const actions = el.hubActions;
  const key = JSON.stringify(actions);
  if (key === el._actionsKey) return;
  el._actionsKey = key;
  el.dispatchEvent(new CustomEvent('module-actions-changed', { detail: { actions } }));
}
