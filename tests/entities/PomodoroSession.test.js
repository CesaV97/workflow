import { describe, it, expect } from 'vitest';
import { createPomodoroSession, pomodoroSessionSchema } from '../../src/data/entities/PomodoroSession';
import { POMODORO_TYPES, POMODORO_STATUS } from '../../src/constants/pomodoroConfig';

describe('PomodoroSession entity', () => {
  it('should have correct schema shape', () => {
    expect(pomodoroSessionSchema).toHaveProperty('id');
    expect(pomodoroSessionSchema).toHaveProperty('taskId');
    expect(pomodoroSessionSchema).toHaveProperty('type');
    expect(pomodoroSessionSchema).toHaveProperty('duration');
    expect(pomodoroSessionSchema).toHaveProperty('startTime');
    expect(pomodoroSessionSchema).toHaveProperty('endTime');
    expect(pomodoroSessionSchema).toHaveProperty('status');
  });

  it('should create session with generated ID', () => {
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + 25 * 60000).toISOString();

    const session = createPomodoroSession({
      taskId: 'task-uuid-123',
      type: 'Work',
      duration: 25,
      startTime,
      endTime,
    });

    expect(session.id).toBeDefined();
    expect(session.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should create session with correct data', () => {
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + 25 * 60000).toISOString();

    const session = createPomodoroSession({
      taskId: 'task-uuid-123',
      type: 'Work',
      duration: 25,
      startTime,
      endTime,
      status: 'Completed',
    });

    expect(session.taskId).toBe('task-uuid-123');
    expect(session.type).toBe('Work');
    expect(session.duration).toBe(25);
    expect(session.status).toBe('Completed');
  });

  it('should create unique session IDs', () => {
    const now = new Date();
    const session1 = createPomodoroSession({
      taskId: 'task-123',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });

    const session2 = createPomodoroSession({
      taskId: 'task-123',
      type: 'Rest',
      duration: 5,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 5 * 60000).toISOString(),
    });

    expect(session1.id).not.toBe(session2.id);
  });
});
