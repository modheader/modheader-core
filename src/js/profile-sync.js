import lodashLast from 'lodash/last';
import { setLocal } from './storage.js';
import { getProfile } from './api.js';
import { fixProfiles } from './profile.js';

export const Status = {
  ACTIVE: 'active',
  PAUSED: 'paused'
};

export async function isLiveProfileUrl(url) {
  return url && url.startsWith(`${process.env.URL_BASE}/profile/`);
}

export async function reloadLiveProfile(profile) {
  try {
    const parsedUrl = new URL(profile.liveProfileUrl);
    const profileId = lodashLast(parsedUrl.pathname.split('/'));
    const profileResponse = await getProfile({ profileId });
    if (profileResponse && profileResponse.profile) {
      console.log('Updated profile. Profile URL', profile.liveProfileUrl);
      return {
        ...profileResponse.profile,
        profileId: profileResponse.isOwner ? profileResponse.profileId : profile.id,
        liveProfileIsOwner: profileResponse.isOwner,
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
