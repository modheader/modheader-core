import { writable } from 'svelte/store';

export const toastMessage = writable('');
export const undoable = writable(false);

export function showMessage(message, { canUndo = false } = {}) {
  toastMessage.set('');
  toastMessage.set(message);
  undoable.set(canUndo);
}

export function hideMessage() {
  toastMessage.set('');
}
