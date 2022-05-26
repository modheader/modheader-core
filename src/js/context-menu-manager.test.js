import { jest } from '@jest/globals';

const mockContextMenu = {
  clearContextMenu: jest.fn(),
  createContextMenu: jest.fn(),
  updateContextMenu: jest.fn()
};
jest.doMock('./context-menu.js', () => mockContextMenu);

const { resetContextMenu, __testing__ } = require('./context-menu-manager.js');

describe('context-menu-manager', () => {
  afterEach(() => {
    for (const key in __testing__.currentSettings) {
      delete __testing__.currentSettings[key];
    }
  });

  test('Show pause menu', async () => {
    const chromeLocal = { isPaused: false };
    await resetContextMenu(chromeLocal);

    expect(mockContextMenu.updateContextMenu).toHaveBeenCalledWith(
      __testing__.PAUSE_MENU_ID,
      expect.objectContaining({
        title: expect.stringContaining('Pause ')
      })
    );
  });

  test('Show unpause menu', async () => {
    const chromeLocal = { isPaused: true };
    await resetContextMenu(chromeLocal);

    expect(mockContextMenu.updateContextMenu).toHaveBeenCalledWith(
      __testing__.PAUSE_MENU_ID,
      expect.objectContaining({
        title: expect.stringContaining('Unpause ')
      })
    );
  });
});
