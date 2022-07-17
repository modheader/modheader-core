import { takeRight, filterEnabled } from './utils.js';

describe('utils', () => {
  test('takeRight', () => {
    expect(takeRight('Profile 1')).toEqual('1');
    expect(takeRight(1)).toEqual('1');
    expect(takeRight('')).toEqual('0');
  });

  test('filterEnabled', () => {
    const actual = filterEnabled([
      { enabled: true, name: 'Test 1' },
      { name: 'Test 2' },
      { enabled: true, value: 'Test 3' }
    ]);

    expect(actual).toEqual([{ enabled: true, name: 'Test 1' }]);
  });
});
