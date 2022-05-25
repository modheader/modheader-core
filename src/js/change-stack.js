import { writable } from 'svelte/store';
import lodashCloneDeep from 'lodash/cloneDeep.js';
import lodashIsEqual from 'lodash/isEqual.js';
import lodashLast from 'lodash/last.js';

const changes = [];
export const canUndoChange = writable(false);
let ignoringChangeStack = true;

export const __testing__ = { ignoringChangeStack, changes };

function updateCanUndo() {
  canUndoChange.set(changes.length > 1);
}

export function undoChange() {
  if (changes.length > 0) {
    const change = changes.pop();
    updateCanUndo();
    return change;
  }
}

export function commit(changeHandler) {
  ignoringChangeStack = true;
  try {
    const change = changeHandler();
    changes.push(change);
    updateCanUndo();
  } finally {
    ignoringChangeStack = false;
  }
}

export function startIgnoringChange() {
  ignoringChangeStack = true;
}

export function stopIgnoringChange() {
  ignoringChangeStack = false;
}

export function setChangeField(name, value) {
  if (!ignoringChangeStack) {
    if (changes.length === 0 || !lodashIsEqual(lodashLast(changes)[name], value)) {
      const valueCopy = lodashCloneDeep(value);
      changes.push({ [name]: valueCopy });
      updateCanUndo();
    }
  }
}
