import { clearContextMenu, createContextMenu, updateContextMenu } from './context-menu.js';
import { setPaused } from './storage-writer.js';

const PAUSE_MENU_ID = 'pause';
const BROWSER_ACTION_CONTEXT = ['browser_action'];

const currentSettings = {};

export const __testing__ = {
  PAUSE_MENU_ID,
  currentSettings
};

export async function initContextMenu() {
  await clearContextMenu();
  await createContextMenu({
    id: PAUSE_MENU_ID,
    title: 'Pause',
    contexts: BROWSER_ACTION_CONTEXT
  });
}

async function updateContextMenuIfNeeded(id, { title, onclick }) {
  if (currentSettings[id] === title) {
    return;
  }
  currentSettings[id] = title;
  await updateContextMenu(id, {
    title,
    contexts: BROWSER_ACTION_CONTEXT,
    onclick
  });
}

export async function resetContextMenu(chromeLocal) {
  if (chromeLocal.isPaused) {
    await updateContextMenuIfNeeded(PAUSE_MENU_ID, {
      title: 'Unpause ModHeader',
      onclick: () => setPaused(false)
    });
  } else {
    await updateContextMenuIfNeeded(PAUSE_MENU_ID, {
      title: 'Pause ModHeader',
      onclick: () => setPaused(true)
    });
  }
}