import { writable, get } from 'svelte/store';
import lodashCloneDeep from 'lodash/cloneDeep.js';
import lodashIsEqual from 'lodash/isEqual.js';
import lodashIsUndefined from 'lodash/isUndefined.js';
import { hideMessage } from './toast.js';
import { getLocal } from './storage.js';
import { setPaused } from './storage-writer.js';
import { loadSignedInUser, signedInUser } from './identity.js';
import {
  undoChange,
  commit,
  setChangeField,
  stopIgnoringChange,
  startIgnoringChange
} from './change-stack.js';

export const profiles = writable([]);
export const selectedProfileIndex = writable(0);
export const isPaused = writable(false);
export const isInitialized = writable(false);

profiles.subscribe(($profiles) => {
  setChangeField('profiles', $profiles);
});
selectedProfileIndex.subscribe(($selectedProfileIndex) => {
  setChangeField('selectedProfileIndex', $selectedProfileIndex);
});
isPaused.subscribe(async ($isPaused) => {
  setChangeField('isPaused', $isPaused);
  if (get(isInitialized)) {
    await setPaused($isPaused);
  }
});
isInitialized.subscribe(($isInitialized) => {
  if ($isInitialized) {
    stopIgnoringChange();
  } else {
    startIgnoringChange();
  }
});

export function undo() {
  let lastChange = undoChange();
  if (!lastChange) {
    return;
  }
  const currentProfiles = get(profiles);
  const currentSelectedProfileIndex = get(selectedProfileIndex);
  const currentIsPaused = get(isPaused);
  while (lastChange) {
    if (
      !lodashIsUndefined(lastChange.profiles) &&
      !lodashIsEqual(lastChange.profiles, currentProfiles)
    ) {
      break;
    }
    if (
      !lodashIsUndefined(lastChange.selectedProfileIndex) &&
      lastChange.selectedProfileIndex !== currentSelectedProfileIndex
    ) {
      break;
    }
    if (!lodashIsUndefined(lastChange.isPaused) && lastChange.isPaused !== currentIsPaused) {
      break;
    }
    lastChange = undoChange();
  }
  commitData({
    newProfiles: lastChange.profiles || currentProfiles,
    newIndex: lastChange.selectedProfileIndex,
    newIsPaused: lastChange.isPaused
  });
  hideMessage();
}

export function commitData({ newProfiles = [], newIndex = 0, newIsPaused } = {}) {
  commit(() => {
    newIndex = Math.max(0, Math.min(newProfiles.length - 1, newIndex));
    if (lodashIsUndefined(newIsPaused)) {
      newIsPaused = get(isPaused);
    }
    profiles.set(newProfiles);
    selectedProfileIndex.set(newIndex);
    isPaused.set(newIsPaused);
    return {
      profiles: lodashCloneDeep(newProfiles),
      selectedProfileIndex: newIndex,
      isPaused: newIsPaused
    };
  });
}

export async function init() {
  isInitialized.set(false);
  const chromeLocal = await getLocal(['profiles', 'selectedProfile', 'signedInUser', 'isPaused']);
  signedInUser.set(chromeLocal.signedInUser);
  loadSignedInUser();
  commitData({
    newProfiles: chromeLocal.profiles,
    newIndex: chromeLocal.selectedProfile,
    newIsPaused: !!chromeLocal.isPaused
  });
  isInitialized.set(true);
}
