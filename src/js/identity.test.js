import { jest } from '@jest/globals';
import { get } from 'svelte/store';

global.fetch = jest.fn();
const mockStorage = {
  removeLocal: jest.fn(),
  setLocal: jest.fn()
};
jest.doMock('./storage.js', () => mockStorage);

const mockTabs = {
  openUrl: jest.fn()
};
jest.doMock('./tabs.js', () => mockTabs);

const { loadSignedInUser, signedInUser, signOut } = require('./identity.js');

describe('identity', () => {
  test('Load signed in user', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        email: 'foobar@gmail.com'
      })
    });
    await loadSignedInUser();

    expect(mockStorage.setLocal).toHaveBeenCalledTimes(1);
    expect(mockStorage.setLocal).toHaveBeenCalledWith({
      signedInUser: { email: 'foobar@gmail.com' }
    });
    expect(get(signedInUser)).toEqual({ email: 'foobar@gmail.com' });
  });

  test('Sign out remove signed in user', async () => {
    signedInUser.set({ email: 'foobar@gmail.com' });

    await signOut();

    expect(mockStorage.removeLocal).toHaveBeenCalledTimes(1);
    expect(mockStorage.removeLocal).toHaveBeenCalledWith(['signedInUser']);
    expect(get(signedInUser)).toEqual(undefined);
  });
});
