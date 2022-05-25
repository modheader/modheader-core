import { writable } from 'svelte/store';

export const showExportDialog = writable(false);
export const showExportJsonDialog = writable(false);
export const showImportDialog = writable(false);
export const showCloudBackupDialog = writable(false);
export const showUpgradeDialog = writable(false);
export const upgradeDialogString = writable('');
export const requireSignInForExportDialog = writable(false);

export function showUpgradeRequired(upgradeText) {
  showUpgradeDialog.set(true);
  upgradeDialogString.set(upgradeText);
}
