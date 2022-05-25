import { get } from 'svelte/store';
import {
  startIgnoringChange,
  stopIgnoringChange,
  canUndoChange,
  undoChange,
  commit,
  setChangeField,
  __testing__
} from './change-stack.js';

describe('change-stack', () => {
  beforeEach(() => {
    __testing__.changes.length = 0;
  });

  test('Commit and undo', () => {
    commit(() => ({}));
    commit(() => ({ field1: 'value1' }));
    commit(() => ({ field2: 'value2' }));
    commit(() => ({ field3: 'value3' }));

    expect(get(canUndoChange)).toEqual(true);
    expect(undoChange()).toEqual({ field3: 'value3' });
    expect(get(canUndoChange)).toEqual(true);
    expect(undoChange()).toEqual({ field2: 'value2' });
    expect(get(canUndoChange)).toEqual(true);
    expect(undoChange()).toEqual({ field1: 'value1' });
    expect(get(canUndoChange)).toEqual(false);
  });

  test('Ignore identical commit', () => {
    setChangeField('field1', 'value1');
    setChangeField('field2', 'value2');
    setChangeField('field2', 'value2');

    expect(get(canUndoChange)).toEqual(true);
    expect(undoChange()).toEqual({ field2: 'value2' });
    expect(get(canUndoChange)).toEqual(false);
  });

  test('Commit change on difference', () => {
    setChangeField('field1', 'value1');
    setChangeField('field2', 'value2');
    setChangeField('field2', 'value3');

    expect(get(canUndoChange)).toEqual(true);
    expect(undoChange()).toEqual({ field2: 'value3' });
    expect(get(canUndoChange)).toEqual(true);
    expect(undoChange()).toEqual({ field2: 'value2' });
    expect(get(canUndoChange)).toEqual(false);
  });

  test('Ignoring changes on difference', () => {
    startIgnoringChange();
    setChangeField('field1', 'value1');
    setChangeField('field2', 'value2');
    setChangeField('field2', 'value3');
    stopIgnoringChange();

    expect(get(canUndoChange)).toEqual(false);
    expect(__testing__.changes).toEqual([]);
  });
});
