import { jest } from '@jest/globals';

const mockStorage = {
  getLocal: jest.fn(),
  setLocal: jest.fn(),
  removeLocal: jest.fn(),
  getSync: jest.fn()
};
jest.doMock('./storage.js', () => mockStorage);

const mockProfile = {
  fixProfiles: jest.fn()
};
jest.doMock('./profile.js', () => mockProfile);

const { initStorage } = require('./storage-loader.js');

describe('storage-loader', () => {
  beforeEach(() => {
    mockProfile.fixProfiles.mockImplementation((profiles) => profiles);
  });

  test('Setup default profile', async () => {
    mockStorage.getLocal.mockResolvedValue({});
    mockProfile.fixProfiles.mockImplementation((profiles) => {
      profiles.push({ title: 'Default profile' });
      return true;
    });
    const local = await initStorage();
    expect(local).toEqual({
      profiles: [{ title: 'Default profile' }],
      selectedProfile: 0
    });
    expect(mockStorage.getLocal).toHaveBeenCalledTimes(1);
    expect(mockStorage.setLocal).toHaveBeenCalledTimes(1);
    expect(mockProfile.fixProfiles).toHaveBeenCalledTimes(1);
  });

  test('Load from sync profile', async () => {
    mockStorage.getLocal.mockResolvedValue({});
    mockStorage.getSync.mockResolvedValue({
      1: [{ title: 'Profile 1' }],
      2: [{ title: 'Profile 2' }]
    });
    const local = await initStorage();
    expect(local).toEqual({
      profiles: [
        expect.objectContaining({
          title: 'Profile 2'
        })
      ],
      selectedProfile: 0,
      savedToCloud: true
    });
    expect(mockStorage.getLocal).toHaveBeenCalledTimes(1);
    expect(mockStorage.getSync).toHaveBeenCalledTimes(1);
    expect(mockStorage.setLocal).toHaveBeenCalledTimes(1);
  });

  test('No mutation', async () => {
    mockStorage.getLocal.mockResolvedValue({
      profiles: [{ title: 'Default profile' }],
      selectedProfile: 0
    });
    mockProfile.fixProfiles.mockReturnValue(false);
    const local = await initStorage();
    expect(local).toEqual({
      profiles: [{ title: 'Default profile' }],
      selectedProfile: 0
    });
    expect(mockStorage.getLocal).toHaveBeenCalledTimes(1);
    expect(mockStorage.getSync).not.toHaveBeenCalled();
    expect(mockStorage.setLocal).not.toHaveBeenCalled();
    expect(mockProfile.fixProfiles).toHaveBeenCalledTimes(1);
  });
});
