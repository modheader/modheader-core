import Bluebird from 'bluebird';
import { get, derived } from 'svelte/store';
import lodashCloneDeep from 'lodash/cloneDeep.js';
import lodashOrderBy from 'lodash/orderBy.js';
import lodashIsEqual from 'lodash/isEqual.js';
import lodashDebounce from 'lodash/debounce.js';
import lodashClone from 'lodash/clone.js';
import { lightOrDark } from './color.js';
import { profiles, commitData, selectedProfileIndex, isInitialized } from './datasource.js';
import { showMessage } from './toast.js';
import { swap } from './utils.js';

let profileHooks;
let latestProfiles = [];
let latestSelectedProfileIndex = 0;
profiles.subscribe(($profiles) => {
  latestProfiles = $profiles;
  if (get(isInitialized)) {
    debouncedSave();
  }
});
selectedProfileIndex.subscribe(($selectedProfileIndex) => {
  latestSelectedProfileIndex = $selectedProfileIndex;
  if (get(isInitialized)) {
    debouncedSave();
  }
});
export const selectedProfile = derived(
  [profiles, selectedProfileIndex],
  ([$profiles, $selectedProfileIndex]) => $profiles[$selectedProfileIndex] || {},
  {}
);
export const buttonColor = derived(
  [selectedProfile],
  ([$selectedProfile]) =>
    lightOrDark($selectedProfile.backgroundColor) === 'light' ? 'black' : 'white',
  'white'
);

const debouncedSave = lodashDebounce(save, 500, { leading: true, trailing: true });

export function init(hooks) {
  profileHooks = hooks;
}

export async function save() {
  await profileHooks.saveProfileHook({
    profiles: latestProfiles,
    selectedProfileIndex: latestSelectedProfileIndex
  });
}

export function fixProfiles(profiles) {
  let isMutated = false;
  if (profiles.length === 0) {
    profiles.push(createProfile());
    isMutated = true;
  }
  for (let i = 0; i < profiles.length; ++i) {
    if (profileHooks.fixProfileHook({ profile: profiles[i], index: i })) {
      isMutated = true;
    }
  }
  return isMutated;
}

function isExistingProfileTitle_(title) {
  for (const profile of latestProfiles) {
    if (profile.title === title) {
      return true;
    }
  }
  return false;
}

export function createProfile() {
  let profileNum = 1;
  while (isExistingProfileTitle_('Profile ' + profileNum)) {
    ++profileNum;
  }
  return profileHooks.createProfileHook({ profileNum });
}

export function updateProfile(change) {
  const index = latestSelectedProfileIndex;
  const latestProfile = latestProfiles[index];
  // Detect if there is indeed a change. If the change is identical, then no need to reapply the change.
  let hasChanged = false;
  for (const [key, value] of Object.entries(change)) {
    if (!lodashIsEqual(latestProfile[key], value)) {
      hasChanged = true;
      break;
    }
  }
  if (hasChanged) {
    // Only deep clone the changes to minimize performance impact.
    const copy = lodashClone(latestProfile);
    for (const [key, value] of Object.entries(change)) {
      copy[key] = lodashCloneDeep(value);
    }
    latestProfiles[index] = copy;
    commitData({ newProfiles: latestProfiles, newIndex: index });
  }
}

export function addProfile() {
  const newProfile = createProfile();
  latestProfiles.push(newProfile);
  commitData({ newProfiles: latestProfiles, newIndex: latestProfiles.length - 1 });
}

export async function removeProfile(profileIndex) {
  const profile = latestProfiles[profileIndex];
  await profileHooks.removeProfileHook(profile);
  latestProfiles.splice(profileIndex, 1);
  if (latestProfiles.length === 0) {
    latestProfiles = [createProfile()];
  }
  commitData({ newProfiles: latestProfiles, newIndex: latestProfiles.length - 1 });
  showMessage('Profile deleted', { canUndo: true });
}

export async function cloneProfile(profile) {
  const newProfile = await profileHooks.cloneProfileHook(profile);
  newProfile.title = 'Copy of ' + newProfile.title;
  latestProfiles.push(newProfile);
  commitData({ newProfiles: latestProfiles, newIndex: latestProfiles.length - 1 });
  showMessage('Profile cloned', { canUndo: true });
}

export function sortProfiles(sortOrder) {
  profiles.set(lodashOrderBy(latestProfiles, ['title'], [sortOrder]));
  if (sortOrder === 'asc') {
    showMessage('Profiles sorted in ascending order', { canUndo: true });
  } else {
    showMessage('Profiles sorted in descending order', { canUndo: true });
  }
}

export function exportProfile(profile, { keepStyles } = {}) {
  return profileHooks.exportProfileHook(lodashCloneDeep(profile), { keepStyles });
}

export async function importProfiles(importProfiles) {
  await Bluebird.map(importProfiles, profileHooks.importProfileHook);
  fixProfiles(importProfiles);
  const innerProfiles = latestProfiles.concat(importProfiles);
  commitData({ newProfiles: innerProfiles, newIndex: innerProfiles.length - 1 });
  showMessage(`Imported profiles: ${importProfiles.map((p) => p.title).join(', ')}`, {
    canUndo: true
  });
}

export function restoreToProfiles(profilesToRestore) {
  fixProfiles(profilesToRestore);
  commitData({ newProfiles: profilesToRestore, newIndex: 0 });
  showMessage('Profiles restored', { canUndo: true });
}

export function selectProfile(profileIndex) {
  selectedProfileIndex.set(profileIndex);
}

export function swapProfile(profileIndex1, profileIndex2) {
  commitData({
    newProfiles: swap(latestProfiles, profileIndex1, profileIndex2),
    newIndex: profileIndex2
  });
}
