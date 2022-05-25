import { jest } from '@jest/globals';
import { get, writable } from 'svelte/store';
import flushPromises from 'flush-promises';
import { __testing__ as changeStackTesting } from './change-stack.js';

const signedInUser = writable();

const mockIdentity = {
  signedInUser,
  loadSignedInUser: jest.fn()
};
jest.doMock('./identity.js', () => mockIdentity);

const mockStorage = {
  getLocal: jest.fn()
};
jest.doMock('./storage.js', () => mockStorage);

const mockStorageLoader = {
  setPaused: jest.fn()
};
jest.doMock('./storage-writer.js', () => mockStorageLoader);

const {
  init,
  commitData,
  undo,
  isInitialized,
  profiles,
  selectedProfileIndex,
  isPaused
} = require('./datasource.js');

describe('datasource', () => {
  beforeEach(() => {
    profiles.set([]);
    selectedProfileIndex.set(0);
    isPaused.set(false);
    isInitialized.set(true);
    changeStackTesting.changes.length = 0;
  });

  afterEach(() => {
    isInitialized.set(false);
  });

  test('Init loads from storage - all data available', async () => {
    mockStorage.getLocal.mockResolvedValue({
      profiles: [
        {
          title: 'Profile 1'
        }
      ],
      selectedProfile: 0,
      isPaused: true,
      signedInUser: {
        email: 'foobar@gmail.com'
      }
    });

    await init();

    expect(get(profiles)).toEqual([
      {
        title: 'Profile 1'
      }
    ]);
    expect(get(selectedProfileIndex)).toEqual(0);
    expect(get(isPaused)).toEqual(true);
    expect(get(signedInUser)).toEqual({
      email: 'foobar@gmail.com'
    });
  });

  test('Init loads from storage - fresh data', async () => {
    mockStorage.getLocal.mockResolvedValue({
      profiles: []
    });

    await init();

    expect(get(profiles)).toEqual([]);
    expect(get(selectedProfileIndex)).toEqual(0);
    expect(get(isPaused)).toEqual(false);
    expect(get(signedInUser)).toEqual(undefined);
  });

  test('Commit and undo - change profiles and index', () => {
    // First commit
    commitData({
      newProfiles: [
        {
          title: 'Profile 1'
        },
        {
          title: 'Profile 2'
        }
      ],
      newIndex: 1
    });
    expect(changeStackTesting.changes).toEqual([
      expect.objectContaining({
        profiles: [
          {
            title: 'Profile 1'
          },
          {
            title: 'Profile 2'
          }
        ],
        selectedProfileIndex: 1
      })
    ]);
    expect(get(profiles)).toEqual([
      {
        title: 'Profile 1'
      },
      {
        title: 'Profile 2'
      }
    ]);
    expect(get(selectedProfileIndex)).toEqual(1);

    // Second commit
    commitData({
      newProfiles: [
        {
          title: 'Profile 1'
        },
        {
          title: 'Profile 2'
        },
        {
          title: 'Profile 3'
        }
      ],
      newIndex: 2
    });
    expect(changeStackTesting.changes).toEqual([
      expect.objectContaining({
        profiles: [
          {
            title: 'Profile 1'
          },
          {
            title: 'Profile 2'
          }
        ],
        selectedProfileIndex: 1
      }),
      expect.objectContaining({
        profiles: [
          {
            title: 'Profile 1'
          },
          {
            title: 'Profile 2'
          },
          {
            title: 'Profile 3'
          }
        ],
        selectedProfileIndex: 2
      })
    ]);
    expect(get(profiles)).toEqual([
      {
        title: 'Profile 1'
      },
      {
        title: 'Profile 2'
      },
      {
        title: 'Profile 3'
      }
    ]);
    expect(get(selectedProfileIndex)).toEqual(2);

    // Undo second commit to get back to first commit
    undo();
    expect(changeStackTesting.changes).toEqual([
      expect.objectContaining({
        profiles: [
          {
            title: 'Profile 1'
          },
          {
            title: 'Profile 2'
          }
        ],
        selectedProfileIndex: 1
      })
    ]);
    expect(get(profiles)).toEqual([
      {
        title: 'Profile 1'
      },
      {
        title: 'Profile 2'
      }
    ]);
    expect(get(selectedProfileIndex)).toEqual(1);
  });

  test('Commit data add to change stack - change isPaused', async () => {
    // First commit
    commitData({
      newIsPaused: true
    });
    expect(changeStackTesting.changes).toEqual([
      expect.objectContaining({
        isPaused: true
      })
    ]);
    expect(get(isPaused)).toEqual(true);
    await flushPromises();
    expect(mockStorageLoader.setPaused).toHaveBeenCalledTimes(1);
    expect(mockStorageLoader.setPaused).toHaveBeenCalledWith(true);

    // Second commit
    jest.clearAllMocks();
    commitData({
      newIsPaused: false
    });
    expect(changeStackTesting.changes).toEqual([
      expect.objectContaining({
        isPaused: true
      }),
      expect.objectContaining({
        isPaused: false
      })
    ]);
    expect(get(isPaused)).toEqual(false);
    await flushPromises();
    expect(mockStorageLoader.setPaused).toHaveBeenCalledTimes(1);
    expect(mockStorageLoader.setPaused).toHaveBeenCalledWith(false);

    // Undo second commit to get back to first commit
    jest.clearAllMocks();
    undo();
    expect(changeStackTesting.changes).toEqual([
      expect.objectContaining({
        isPaused: true
      })
    ]);
    expect(get(isPaused)).toEqual(true);
    await flushPromises();
    expect(mockStorageLoader.setPaused).toHaveBeenCalledTimes(1);
    expect(mockStorageLoader.setPaused).toHaveBeenCalledWith(true);
  });
});
