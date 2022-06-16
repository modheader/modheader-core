import { get, derived, writable } from 'svelte/store';
import { removeLocal, setLocal } from './storage.js';
import { CURRENT_BROWSER } from './user-agent.js';
import { requireSignInForExportDialog } from './dialog.js';
import { getUserDetails } from './api.js';
import { openUrl } from './tabs.js';

export const signedInUser = writable(undefined);
export const isProUser = derived(
  [signedInUser],
  ([$signedInUser]) => $signedInUser && $signedInUser.subscription?.plan === 'pro',
  false
);

export async function loadSignedInUser() {
  try {
    const user = await getUserDetails();
    await setLocal({ signedInUser: user });
    signedInUser.set(user);
  } catch (err) {
    console.log(`User not logged in to ${process.env.PRODUCT_NAME}`);
  }
}

export async function goToMyAccount() {
  openUrl({ path: `/u/myaccount` });
}

export async function goToCreateLoginUrl() {
  openUrl({ path: `/u/login-url` });
}

export async function goToMySubscription() {
  openUrl({ path: `/u/mysubscription` });
}

export async function goToMyProfiles() {
  openUrl({ path: `/u/myprofiles` });
}

export async function signIn() {
  openUrl({
    path: '/login',
    params: {
      for: CURRENT_BROWSER,
      extension_id: chrome.runtime.id
    }
  });
}

export async function upgrade() {
  openUrl({
    path: '/pricing',
    params: {
      for: CURRENT_BROWSER,
      product: process.env.PRODUCT_NAME,
      extension_id: chrome.runtime.id
    }
  });
}

export async function signOut() {
  await removeLocal(['signedInUser']);
  signedInUser.set(undefined);
  openUrl({ path: `/logout` });
}

export function getSignedInUser() {
  return get(signedInUser);
}

export function requireSignInForExport() {
  if (!getSignedInUser()) {
    requireSignInForExportDialog.set(true);
    return false;
  }
  return true;
}
