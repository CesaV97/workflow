import { describe, it, expect } from 'vitest';
import { TASK_STATUS, TASK_STATUS_COLORS, TASK_DEFAULTS } from '../../src/constants/taskStatus';

describe('taskStatus constants', () => {
  it('should export all task status enums', () => {
    expect(TASK_STATUS.TO_DO).toBe('To Do');
    expect(TASK_STATUS.IN_PROGRESS).toBe('In Progress');
    expect(TASK_STATUS.PAUSED).toBe('Paused');
    expect(TASK_STATUS.BLOCKED).toBe('Blocked');
    expect(TASK_STATUS.DONE).toBe('Done');
  });

  it('should have color mapping for all statuses', () => {
    Object.values(TASK_STATUS).forEach((status) => {
      expect(TASK_STATUS_COLORS[status]).toBeDefined();
      expect(TASK_STATUS_COLORS[status]).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  it('should have task defaults', () => {
    expect(TASK_DEFAULTS.status).toBe('To Do');
  });
});
