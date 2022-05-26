import { jest } from '@jest/globals';
import { get, writable } from 'svelte/store';

const mockDatasource = {
  commitData: jest.fn(),
  isInitialized: writable(false),
  profiles: writable([]),
  selectedProfileIndex: writable(0)
};
jest.doMock('./datasource.js', () => mockDatasource);

const mockToast = {
  showMessage: jest.fn()
};
jest.doMock('./toast.js', () => mockToast);

const {
  init,
  selectedProfile,
  addProfile,
  removeProfile,
  cloneProfile,
  sortProfiles,
  importProfiles,
  restoreToProfiles
} = require('./profile.js');

jest.useFakeTimers();

const hooks = {
  createProfileHook: ({ profileNum }) => ({
    title: `Profile ${profileNum}`,
    profileNum
  }),
  fixProfileHook: () => false,
  saveProfileHook: jest.fn()
};

describe('profile', () => {
  beforeEach(() => {
    mockDatasource.profiles.set([]);
    mockDatasource.selectedProfileIndex.set(0);
    mockDatasource.isInitialized.set(false);
    init(hooks);
  });

  afterEach(() => {
    delete window.chrome;
  });

  test('Add profile', () => {
    addProfile();

    expect(mockDatasource.commitData).toHaveBeenCalledTimes(1);
    expect(mockDatasource.commitData).toHaveBeenCalledWith({
      newIndex: 0,
      newProfiles: [
        {
          title: 'Profile 1',
          profileNum: 1
        }
      ]
    });

    addProfile();

    expect(mockDatasource.commitData).toHaveBeenCalledTimes(2);
    expect(mockDatasource.commitData).toHaveBeenCalledWith({
      newIndex: 1,
      newProfiles: [
        {
          title: 'Profile 1',
          profileNum: 1
        },
        {
          title: 'Profile 2',
          profileNum: 2
        }
      ]
    });
  });

  test('Remove profile', () => {
    mockDatasource.profiles.set([
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

    removeProfile(1);

    expect(mockDatasource.commitData).toHaveBeenCalledTimes(1);
    expect(mockDatasource.commitData).toHaveBeenCalledWith({
      newIndex: 1,
      newProfiles: [
        expect.objectContaining({
          title: 'Profile 1'
        }),
        expect.objectContaining({
          title: 'Profile 3'
        })
      ]
    });

    removeProfile(0);

    expect(mockDatasource.commitData).toHaveBeenCalledTimes(2);
    expect(mockDatasource.commitData).toHaveBeenCalledWith({
      newIndex: 0,
      newProfiles: [
        expect.objectContaining({
          title: 'Profile 3'
        })
      ]
    });

    // Create a new profile when the last profile is removed.
    removeProfile(0);

    expect(mockDatasource.commitData).toHaveBeenCalledTimes(3);
    expect(mockDatasource.commitData).toHaveBeenCalledWith({
      newIndex: 0,
      newProfiles: [
        expect.objectContaining({
          title: 'Profile 1'
        })
      ]
    });
    expect(mockToast.showMessage).toHaveBeenCalledTimes(3);
  });

  test('Clone profile', () => {
    mockDatasource.profiles.set([
      {
        title: 'Profile 1'
      }
    ]);

    cloneProfile({
      title: 'Profile 1'
    });

    expect(mockDatasource.commitData).toHaveBeenCalledTimes(1);
    expect(mockDatasource.commitData).toHaveBeenCalledWith({
      newIndex: 1,
      newProfiles: [
        expect.objectContaining({
          title: 'Profile 1'
        }),
        expect.objectContaining({
          title: 'Copy of Profile 1'
        })
      ]
    });
    expect(mockToast.showMessage).toHaveBeenCalledTimes(1);
  });

  test('Sort profile - ascending order', () => {
    mockDatasource.profiles.set([
      {
        title: 'Profile 1'
      },
      {
        title: 'Profile 3'
      },
      {
        title: 'Profile 2'
      }
    ]);

    sortProfiles('asc');

    expect(get(mockDatasource.profiles)).toEqual([
      expect.objectContaining({
        title: 'Profile 1'
      }),
      expect.objectContaining({
        title: 'Profile 2'
      }),
      expect.objectContaining({
        title: 'Profile 3'
      })
    ]);
    expect(mockToast.showMessage).toHaveBeenCalledTimes(1);
    expect(mockToast.showMessage).toHaveBeenCalledWith('Profiles sorted in ascending order', {
      canUndo: true
    });
  });

  test('Sort profile - descending order', () => {
    mockDatasource.profiles.set([
      {
        title: 'Profile 1'
      },
      {
        title: 'Profile 3'
      },
      {
        title: 'Profile 2'
      }
    ]);

    sortProfiles('desc');

    expect(get(mockDatasource.profiles)).toEqual([
      expect.objectContaining({
        title: 'Profile 3'
      }),
      expect.objectContaining({
        title: 'Profile 2'
      }),
      expect.objectContaining({
        title: 'Profile 1'
      })
    ]);
    expect(mockToast.showMessage).toHaveBeenCalledTimes(1);
    expect(mockToast.showMessage).toHaveBeenCalledWith('Profiles sorted in descending order', {
      canUndo: true
    });
  });

  test('Import profiles', () => {
    mockDatasource.profiles.set([
      {
        title: 'Local Profile'
      }
    ]);

    importProfiles([{ title: 'Imported profile 1' }, { title: 'Imported profile 2' }]);

    expect(mockDatasource.commitData).toHaveBeenCalledTimes(1);
    expect(mockDatasource.commitData).toHaveBeenCalledWith({
      newIndex: 2,
      newProfiles: [
        expect.objectContaining({
          title: 'Local Profile'
        }),
        expect.objectContaining({
          title: 'Imported profile 1'
        }),
        expect.objectContaining({
          title: 'Imported profile 2'
        })
      ]
    });
    expect(mockToast.showMessage).toHaveBeenCalledTimes(1);
    expect(mockToast.showMessage).toHaveBeenCalledWith(
      'Imported profiles: Imported profile 1, Imported profile 2',
      {
        canUndo: true
      }
    );
  });

  test('Restore to profiles', () => {
    mockDatasource.profiles.set([
      {
        title: 'Local Profile'
      }
    ]);

    restoreToProfiles([{ title: 'Restored profile 1' }, { title: 'Restored profile 2' }]);

    expect(mockDatasource.commitData).toHaveBeenCalledTimes(1);
    expect(mockDatasource.commitData).toHaveBeenCalledWith({
      newIndex: 0,
      newProfiles: [
        expect.objectContaining({
          title: 'Restored profile 1'
        }),
        expect.objectContaining({
          title: 'Restored profile 2'
        })
      ]
    });
    expect(mockToast.showMessage).toHaveBeenCalledTimes(1);
    expect(mockToast.showMessage).toHaveBeenCalledWith('Profiles restored', {
      canUndo: true
    });
  });

  test('Selected profile is derived from profiles and selectedProfileIndex', () => {
    mockDatasource.profiles.set([
      {
        title: 'Local Profile 1'
      },
      {
        title: 'Local Profile 2'
      }
    ]);
    mockDatasource.selectedProfileIndex.set(1);

    expect(get(selectedProfile)).toEqual({
      title: 'Local Profile 2'
    });
  });

  test('Profile changes are persisted after initialization', () => {
    mockDatasource.profiles.set([
      {
        title: 'Local Profile 1'
      }
    ]);
    mockDatasource.isInitialized.set(true);
    mockDatasource.profiles.set([
      {
        title: 'Local Profile 1'
      },
      {
        title: 'Local Profile 2'
      }
    ]);
    expect(hooks.saveProfileHook).toHaveBeenCalledTimes(1);
    expect(hooks.saveProfileHook).toHaveBeenCalledWith({
      profiles: [
        {
          title: 'Local Profile 1'
        },
        {
          title: 'Local Profile 2'
        }
      ],
      selectedProfileIndex: 0
    });

    mockDatasource.selectedProfileIndex.set(1);

    jest.clearAllMocks();
    jest.runAllTimers();
    expect(hooks.saveProfileHook).toHaveBeenCalledTimes(1);
    expect(hooks.saveProfileHook).toHaveBeenCalledWith({
      profiles: [
        {
          title: 'Local Profile 1'
        },
        {
          title: 'Local Profile 2'
        }
      ],
      selectedProfileIndex: 1
    });
  });
});
