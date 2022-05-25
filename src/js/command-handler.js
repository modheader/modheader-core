import { setPaused, setSelectedProfileIndex } from './storage-writer.js';

const Command = {
  TOGGLE_PAUSE: 'toggle_pause',
  SWITCH_TO_PROFILE_1: 'switch_to_profile_1',
  SWITCH_TO_PROFILE_2: 'switch_to_profile_2',
  SWITCH_TO_PROFILE_3: 'switch_to_profile_3',
  SWITCH_TO_PROFILE_4: 'switch_to_profile_4'
};

export const __testing__ = { Command };

async function switchToProfile(chromeLocal, index) {
  if (index < chromeLocal.profiles.length) {
    await setSelectedProfileIndex(index);
  }
}

export async function onCommandReceived(chromeLocal, command) {
  switch (command) {
    case Command.TOGGLE_PAUSE:
      await setPaused(!chromeLocal.isPaused);
      break;
    case Command.SWITCH_TO_PROFILE_1:
      await switchToProfile(chromeLocal, 0);
      break;
    case Command.SWITCH_TO_PROFILE_2:
      await switchToProfile(chromeLocal, 1);
      break;
    case Command.SWITCH_TO_PROFILE_3:
      await switchToProfile(chromeLocal, 2);
      break;
    case Command.SWITCH_TO_PROFILE_4:
      await switchToProfile(chromeLocal, 3);
      break;
  }
}
