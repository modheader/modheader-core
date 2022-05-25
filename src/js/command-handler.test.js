import { jest } from '@jest/globals';

const mockStorageLoader = {
  setPaused: jest.fn(),
  setSelectedProfileIndex: jest.fn()
};
jest.doMock('./storage-writer.js', () => mockStorageLoader);

const { onCommandReceived, __testing__ } = require('./command-handler.js');

describe('command-handler', () => {
  test('Toggle pause - to paused', async () => {
    const chromeLocal = { isPaused: false };
    await onCommandReceived(chromeLocal, __testing__.Command.TOGGLE_PAUSE);

    expect(mockStorageLoader.setPaused).toHaveBeenCalledTimes(1);
    expect(mockStorageLoader.setPaused).toHaveBeenCalledWith(true);
  });

  test('Toggle pause - to unpaused', async () => {
    const chromeLocal = { isPaused: true };
    await onCommandReceived(chromeLocal, __testing__.Command.TOGGLE_PAUSE);

    expect(mockStorageLoader.setPaused).toHaveBeenCalledTimes(1);
    expect(mockStorageLoader.setPaused).toHaveBeenCalledWith(false);
  });

  test('Switch profile - ignore profile out of bound', async () => {
    const chromeLocal = { profiles: [{ title: 'Profile 1' }] };
    await onCommandReceived(chromeLocal, __testing__.Command.SWITCH_TO_PROFILE_2);

    expect(mockStorageLoader.setSelectedProfileIndex).toHaveBeenCalledTimes(0);
  });

  test('Switch profile - all supported switches', async () => {
    const profiles = [];
    for (let i = 0; i < 5; ++i) {
      profiles.push({ title: `Profile ${i + 1}` });
    }
    const chromeLocal = { profiles };

    await onCommandReceived(chromeLocal, __testing__.Command.SWITCH_TO_PROFILE_1);
    expect(mockStorageLoader.setSelectedProfileIndex).toHaveBeenCalledTimes(1);
    expect(mockStorageLoader.setSelectedProfileIndex).toHaveBeenCalledWith(0);
    jest.clearAllMocks();

    await onCommandReceived(chromeLocal, __testing__.Command.SWITCH_TO_PROFILE_2);
    expect(mockStorageLoader.setSelectedProfileIndex).toHaveBeenCalledTimes(1);
    expect(mockStorageLoader.setSelectedProfileIndex).toHaveBeenCalledWith(1);
    jest.clearAllMocks();

    await onCommandReceived(chromeLocal, __testing__.Command.SWITCH_TO_PROFILE_3);
    expect(mockStorageLoader.setSelectedProfileIndex).toHaveBeenCalledTimes(1);
    expect(mockStorageLoader.setSelectedProfileIndex).toHaveBeenCalledWith(2);
    jest.clearAllMocks();

    await onCommandReceived(chromeLocal, __testing__.Command.SWITCH_TO_PROFILE_4);
    expect(mockStorageLoader.setSelectedProfileIndex).toHaveBeenCalledTimes(1);
    expect(mockStorageLoader.setSelectedProfileIndex).toHaveBeenCalledWith(3);
    jest.clearAllMocks();
  });
});
