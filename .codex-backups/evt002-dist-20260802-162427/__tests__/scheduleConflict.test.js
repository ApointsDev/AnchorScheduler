import { findConflictingTasks, assertNoConflict, ScheduleConflictError } from "../Services/scheduleConflict.js";
describe('scheduleConflict', function () {
  var base = [{
    id: 'a',
    startTime: '2025-01-01T09:00:00.000Z',
    endTime: '2025-01-01T10:00:00.000Z'
  }, {
    id: 'b',
    startTime: '2025-01-01T10:00:00.000Z',
    endTime: '2025-01-01T11:00:00.000Z'
  }];
  test('no overlap when half-open and touching', function () {
    var candidate = {
      id: 'c',
      startTime: '2025-01-01T11:00:00.000Z',
      endTime: '2025-01-01T12:00:00.000Z'
    };
    var conflicts = findConflictingTasks(base, candidate, {
      boundaryConflict: false
    });
    expect(conflicts).toHaveLength(0);
  });
  test('detect overlap when boundary inclusive and touching', function () {
    var candidate = {
      id: 'c',
      startTime: '2025-01-01T10:00:00.000Z',
      endTime: '2025-01-01T10:30:00.000Z'
    };
    var conflicts = findConflictingTasks(base, candidate, {
      boundaryConflict: true
    });
    // boundary inclusive treats touching as conflict; both 'a' (ends at 10:00) and 'b' (starts at 10:00) conflict
    expect(conflicts).toHaveLength(2);
    var ids = conflicts.map(function (c) {
      return c.id;
    }).sort();
    expect(ids).toEqual(['a', 'b']);
  });
  test('assertNoConflict throws ScheduleConflictError when conflicts exist', function () {
    var candidate = {
      id: 'c',
      startTime: '2025-01-01T09:30:00.000Z',
      endTime: '2025-01-01T09:45:00.000Z'
    };
    expect(function () {
      return assertNoConflict(base, candidate);
    }).toThrow(ScheduleConflictError);
  });
  test('invalid dates produce no conflicts', function () {
    var candidate = {
      id: 'c',
      startTime: 'invalid',
      endTime: 'also-invalid'
    };
    var conflicts = findConflictingTasks(base, candidate);
    expect(conflicts).toHaveLength(0);
  });
});