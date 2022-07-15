import { setLocal } from './storage.js';
import { parseProfile } from './api.js';
import { fixProfiles } from './profile.js';

export const Status = {
  ACTIVE: 'active',
  PAUSED: 'paused'
};

export async function reloadLiveProfile(profile) {
  try {
    const importedProfiles = await parseProfile({ data: profile.liveProfileUrl });
    if (importedProfiles.length) {
      console.log('Updated profile. Profile URL', profile.liveProfileUrl);
      return {
        ...importedProfiles[0],
        profileId: profile.liveProfileUrl,
        liveProfileUrl: profile.liveProfileUrl,
        liveProfileStatus: Status.ACTIVE,
        liveProfileLastSyncTimestamp: Date.now()
      };
    }
  } catch (err) {
    console.log('Reload live profile failed with error', err);
  }
}

export async function reloadAllLiveProfile(allProfiles) {
  let needUpdate = false;
  for (let i = 0; i < allProfiles.length; ++i) {
    const profile = allProfiles[i];
    if (profile.liveProfileUrl && profile.liveProfileStatus === Status.ACTIVE) {
      const importedProfile = await reloadLiveProfile(profile);
      if (importedProfile) {
        allProfiles[i] = importedProfile;
        needUpdate = true;
      }
    }
  }
  if (needUpdate && fixProfiles(allProfiles)) {
    await setLocal({ profiles: allProfiles });
  }
}
