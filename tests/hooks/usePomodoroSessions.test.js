import { describe, it, expect, beforeEach } from 'vitest';
import { usePomodoroSessions } from '../../src/hooks/usePomodoroSessions';
import { createPomodoroSession } from '../../src/data/entities/PomodoroSession';

describe('usePomodoroSessions hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty array', () => {
    const { sessions } = usePomodoroSessions();
    expect(Array.isArray(sessions)).toBe(true);
    expect(sessions.length).toBe(0);
  });

  it('should add a new session', () => {
    const { addSession, sessions } = usePomodoroSessions();
    const now = new Date();
    const endTime = new Date(now.getTime() + 25 * 60000);

    const newSession = addSession({
      taskId: 'task-1',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: endTime.toISOString(),
      status: 'Completed',
    });

    expect(newSession.id).toBeDefined();
    expect(newSession.taskId).toBe('task-1');
    expect(newSession.type).toBe('Work');
    expect(sessions.length).toBe(1);
  });

  it('should retrieve all sessions', () => {
    const { addSession, sessions } = usePomodoroSessions();
    const now = new Date();
    addSession({
      taskId: 'task-1',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });
    addSession({
      taskId: 'task-1',
      type: 'Rest',
      duration: 5,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 5 * 60000).toISOString(),
    });

    expect(sessions.length).toBe(2);
  });

  it('should retrieve session by ID', () => {
    const { addSession, getSessionById } = usePomodoroSessions();
    const now = new Date();
    const added = addSession({
      taskId: 'task-1',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });

    const retrieved = getSessionById(added.id);
    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(added.id);
    expect(retrieved.type).toBe('Work');
  });

  it('should return undefined for non-existent session ID', () => {
    const { getSessionById } = usePomodoroSessions();
    const result = getSessionById('non-existent-id');
    expect(result).toBeUndefined();
  });

  it('should get sessions by task ID', () => {
    const { addSession, getSessionsByTaskId } = usePomodoroSessions();
    const now = new Date();
    addSession({
      taskId: 'task-1',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });
    addSession({
      taskId: 'task-1',
      type: 'Rest',
      duration: 5,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 5 * 60000).toISOString(),
    });
    addSession({
      taskId: 'task-2',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });

    const task1Sessions = getSessionsByTaskId('task-1');
    expect(task1Sessions.length).toBe(2);
    expect(task1Sessions.every(s => s.taskId === 'task-1')).toBe(true);
  });

  it('should return empty array for task with no sessions', () => {
    const { getSessionsByTaskId } = usePomodoroSessions();
    const result = getSessionsByTaskId('non-existent-task');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should get sessions by type', () => {
    const { addSession, getSessionsByType } = usePomodoroSessions();
    const now = new Date();
    addSession({
      taskId: 'task-1',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });
    addSession({
      taskId: 'task-1',
      type: 'Rest',
      duration: 5,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 5 * 60000).toISOString(),
    });
    addSession({
      taskId: 'task-2',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });

    const workSessions = getSessionsByType('Work');
    expect(workSessions.length).toBe(2);
    expect(workSessions.every(s => s.type === 'Work')).toBe(true);
  });

  it('should return empty array for type with no sessions', () => {
    const { getSessionsByType } = usePomodoroSessions();
    const result = getSessionsByType('NonExistent');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should update a session', () => {
    const { addSession, updateSession, getSessionById } = usePomodoroSessions();
    const now = new Date();
    const added = addSession({
      taskId: 'task-1',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });

    const updated = updateSession(added.id, { status: 'Completed' });
    expect(updated.status).toBe('Completed');
    expect(updated.taskId).toBe('task-1');

    const retrieved = getSessionById(added.id);
    expect(retrieved.status).toBe('Completed');
  });

  it('should return undefined when updating non-existent session', () => {
    const { updateSession } = usePomodoroSessions();
    const result = updateSession('non-existent-id', { status: 'Completed' });
    expect(result).toBeUndefined();
  });

  it('should delete a session', () => {
    const { addSession, deleteSession, getSessionById } = usePomodoroSessions();
    const now = new Date();
    const added = addSession({
      taskId: 'task-1',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });

    const deleted = deleteSession(added.id);
    expect(deleted).toBe(true);
    expect(getSessionById(added.id)).toBeUndefined();
  });

  it('should return false when deleting non-existent session', () => {
    const { deleteSession } = usePomodoroSessions();
    const result = deleteSession('non-existent-id');
    expect(result).toBe(false);
  });

  it('should persist sessions to localStorage', () => {
    const { addSession } = usePomodoroSessions();
    const now = new Date();
    addSession({
      taskId: 'task-1',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });

    const { sessions } = usePomodoroSessions();
    expect(sessions.length).toBe(1);
    expect(sessions[0].taskId).toBe('task-1');
  });

  it('should provide session count', () => {
    const { addSession, sessionCount } = usePomodoroSessions();
    const now = new Date();
    expect(sessionCount()).toBe(0);
    addSession({
      taskId: 'task-1',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });
    expect(sessionCount()).toBe(1);
  });

  it('should return fresh sessions array on each access', () => {
    const hook = usePomodoroSessions();
    const count1 = hook.sessions.length;
    const now = new Date();
    hook.addSession({
      taskId: 'task-1',
      type: 'Work',
      duration: 25,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + 25 * 60000).toISOString(),
    });
    const count2 = hook.sessions.length;

    expect(count1).toBe(0);
    expect(count2).toBe(1);
  });
});
