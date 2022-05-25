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
  PROFILE_VERSION,
  selectedProfile,
  fixProfiles,
  addProfile,
  removeProfile,
  cloneProfile,
  sortProfiles,
  exportProfile,
  importProfiles,
  restoreToProfiles
} = require('./profile.js');

jest.useFakeTimers();

describe('profile', () => {
  beforeEach(() => {
    mockDatasource.profiles.set([]);
    mockDatasource.selectedProfileIndex.set(0);
    mockDatasource.isInitialized.set(false);
  });

  afterEach(() => {
    delete window.chrome;
  });

  test('Fix profiles - initialize empty profile', () => {
    const profiles = [];
    const isMutated = fixProfiles(profiles);

    expect(profiles).toEqual([
      {
        version: PROFILE_VERSION,
        backgroundColor: expect.any(String),
        urlFilters: [],
        excludeUrlFilters: [],
        resourceFilters: [],
        tabFilters: [],
        tabGroupFilters: [],
        windowFilters: [],
        headers: [
          {
            comment: '',
            enabled: true,
            name: '',
            value: ''
          }
        ],
        hideComment: true,
        respHeaders: [],
        cookieHeaders: [],
        setCookieHeaders: [],
        shortTitle: '1',
        textColor: expect.any(String),
        title: 'Profile 1',
        urlReplacements: []
      }
    ]);
    expect(isMutated).toEqual(true);
  });

  test('Fix profiles - Do not mutate good profile', () => {
    const profiles = [
      {
        version: PROFILE_VERSION,
        backgroundColor: '#000000',
        urlFilters: [],
        excludeUrlFilters: [],
        resourceFilters: [],
        tabFilters: [],
        tabGroupFilters: [],
        windowFilters: [],
        headers: [
          {
            comment: '',
            enabled: true,
            name: '',
            value: ''
          }
        ],
        hideComment: true,
        respHeaders: [],
        cookieHeaders: [],
        setCookieHeaders: [],
        shortTitle: '1',
        textColor: '#ffffff',
        title: 'Profile 1',
        urlReplacements: []
      }
    ];
    const isMutated = fixProfiles(profiles);

    expect(profiles).toEqual([
      {
        version: PROFILE_VERSION,
        backgroundColor: '#000000',
        urlFilters: [],
        excludeUrlFilters: [],
        resourceFilters: [],
        tabFilters: [],
        tabGroupFilters: [],
        windowFilters: [],
        headers: [
          {
            comment: '',
            enabled: true,
            name: '',
            value: ''
          }
        ],
        hideComment: true,
        respHeaders: [],
        cookieHeaders: [],
        setCookieHeaders: [],
        shortTitle: '1',
        textColor: '#ffffff',
        title: 'Profile 1',
        urlReplacements: []
      }
    ]);
    expect(isMutated).toEqual(false);
  });

  test('Fix profiles - populate missing properties', () => {
    const profiles = [{}];
    const isMutated = fixProfiles(profiles);

    expect(profiles).toEqual([
      {
        version: PROFILE_VERSION,
        backgroundColor: expect.any(String),
        urlFilters: [],
        excludeUrlFilters: [],
        resourceFilters: [],
        tabFilters: [],
        tabGroupFilters: [],
        windowFilters: [],
        headers: [
          {
            comment: '',
            enabled: true,
            name: '',
            value: ''
          }
        ],
        hideComment: true,
        respHeaders: [],
        cookieHeaders: [],
        setCookieHeaders: [],
        shortTitle: '1',
        textColor: expect.any(String),
        title: 'Profile 1',
        urlReplacements: []
      }
    ]);
    expect(isMutated).toEqual(true);
  });

  test('Fix profiles - fix append mode', () => {
    const profiles = [
      {
        appendMode: true,
        headers: [
          {
            comment: '',
            enabled: true,
            name: '',
            value: ''
          }
        ]
      }
    ];
    const isMutated = fixProfiles(profiles);

    expect(profiles).toEqual([
      expect.objectContaining({
        headers: [
          {
            appendMode: 'append',
            comment: '',
            enabled: true,
            name: '',
            value: ''
          }
        ]
      })
    ]);
    expect(isMutated).toEqual(true);
  });

  test('Fix profiles - fix send empty header', () => {
    const profiles = [
      {
        sendEmptyHeader: true,
        headers: [
          {
            comment: '',
            enabled: true,
            name: '',
            value: ''
          }
        ]
      }
    ];
    const isMutated = fixProfiles(profiles);

    expect(profiles).toEqual([
      expect.objectContaining({
        headers: [
          {
            sendEmptyHeader: true,
            comment: '',
            enabled: true,
            name: '',
            value: ''
          }
        ]
      })
    ]);
    expect(isMutated).toEqual(true);
  });

  test('Fix profiles - restore default fields', () => {
    const profiles = [
      {
        version: PROFILE_VERSION,
        title: 'Local Profile',
        shortTitle: '1',
        headers: [
          { enabled: true, name: 'test name 1', value: 'test value 1', comment: 'test comment' },
          { enabled: false, name: 'test name 2', value: 'test value 2' }
        ],
        headersAutocomplete: {
          autocompleteName: ['test1', 'test2'],
          autocompleteValue: []
        }
      }
    ];
    fixProfiles(profiles);
    expect(profiles).toEqual([
      {
        version: PROFILE_VERSION,
        title: 'Local Profile',
        shortTitle: '1',
        backgroundColor: expect.any(String),
        textColor: expect.any(String),
        hideComment: true,
        headers: [
          { enabled: true, name: 'test name 1', value: 'test value 1', comment: 'test comment' },
          { enabled: false, name: 'test name 2', value: 'test value 2', comment: '' }
        ],
        headersAutocomplete: {
          autocompleteName: ['test1', 'test2'],
          autocompleteValue: []
        },
        respHeaders: [],
        cookieHeaders: [],
        setCookieHeaders: [],
        urlReplacements: [],
        tabFilters: [],
        tabGroupFilters: [],
        windowFilters: [],
        urlFilters: [],
        excludeUrlFilters: [],
        resourceFilters: []
      }
    ]);
  });

  test('Add profile', () => {
    addProfile();

    expect(mockDatasource.commitData).toHaveBeenCalledTimes(1);
    expect(mockDatasource.commitData).toHaveBeenCalledWith({
      newIndex: 0,
      newProfiles: [
        expect.objectContaining({
          title: 'Profile 1'
        })
      ]
    });

    addProfile();

    expect(mockDatasource.commitData).toHaveBeenCalledTimes(2);
    expect(mockDatasource.commitData).toHaveBeenCalledWith({
      newIndex: 1,
      newProfiles: [
        expect.objectContaining({
          title: 'Profile 1'
        }),
        expect.objectContaining({
          title: 'Profile 2'
        })
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

  test('Export profiles - Drop default fields', () => {
    const profile = {
      version: PROFILE_VERSION,
      title: 'Local Profile',
      shortTitle: '1',
      backgroundColor: '#000',
      textColor: '#fff',
      hideComment: true,
      headers: [
        { enabled: true, name: 'test name 1', value: 'test value 1', comment: 'test comment' },
        { enabled: false, name: 'test name 2', value: 'test value 2', comment: '' }
      ],
      headersAutocomplete: {
        autocompleteName: ['test1', 'test2'],
        autocompleteValue: []
      },
      respHeaders: [],
      respHeadersAutocomplete: {
        autocompleteName: [],
        autocompleteValue: []
      }
    };
    const exportedProfile = exportProfile(profile);
    expect(exportedProfile).toEqual({
      version: PROFILE_VERSION,
      title: 'Local Profile',
      shortTitle: '1',
      headers: [
        { enabled: true, name: 'test name 1', value: 'test value 1', comment: 'test comment' },
        { enabled: false, name: 'test name 2', value: 'test value 2' }
      ],
      headersAutocomplete: {
        autocompleteName: ['test1', 'test2'],
        autocompleteValue: []
      }
    });
  });

  test('Export profiles - Retain styles', () => {
    const profile = {
      version: PROFILE_VERSION,
      title: 'Local Profile',
      shortTitle: '1',
      backgroundColor: '#000',
      textColor: '#fff',
      hideComment: true
    };
    const exportedProfiles = exportProfile(profile, { keepStyles: true });
    expect(exportedProfiles).toEqual({
      version: PROFILE_VERSION,
      title: 'Local Profile',
      shortTitle: '1',
      backgroundColor: '#000',
      textColor: '#fff'
    });
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
    const saveToStorageMock = jest.fn();
    window.chrome = {
      extension: {
        getBackgroundPage: () => ({
          saveToStorage: saveToStorageMock
        })
      }
    };
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
    expect(saveToStorageMock).toHaveBeenCalledTimes(1);
    expect(saveToStorageMock).toHaveBeenCalledWith({
      profiles: [
        {
          title: 'Local Profile 1'
        },
        {
          title: 'Local Profile 2'
        }
      ],
      selectedProfile: 0
    });

    mockDatasource.selectedProfileIndex.set(1);

    jest.clearAllMocks();
    jest.runAllTimers();
    expect(saveToStorageMock).toHaveBeenCalledTimes(1);
    expect(saveToStorageMock).toHaveBeenCalledWith({
      profiles: [
        {
          title: 'Local Profile 1'
        },
        {
          title: 'Local Profile 2'
        }
      ],
      selectedProfile: 1
    });
  });
});
