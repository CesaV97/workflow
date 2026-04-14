import { describe, it, expect, beforeEach } from 'vitest';
import { createTask, taskSchema } from '../../src/data/entities/Task';
import { TASK_DEFAULTS, TASK_STATUS } from '../../src/constants/taskStatus';

describe('Task entity', () => {
  let taskData;

  beforeEach(() => {
    taskData = {
      projectId: 'project-uuid-123',
      name: 'Test Task',
      description: 'A test task',
      startDate: '2026-04-13',
      endDate: '2026-04-14',
    };
  });

  it('should have correct schema shape', () => {
    expect(taskSchema).toHaveProperty('id');
    expect(taskSchema).toHaveProperty('projectId');
    expect(taskSchema).toHaveProperty('name');
    expect(taskSchema).toHaveProperty('description');
    expect(taskSchema).toHaveProperty('startDate');
    expect(taskSchema).toHaveProperty('endDate');
    expect(taskSchema).toHaveProperty('status');
    expect(taskSchema).toHaveProperty('createdAt');
    expect(taskSchema).toHaveProperty('updatedAt');
  });

  it('should create task with generated ID', () => {
    const task = createTask(taskData);
    expect(task.id).toBeDefined();
    expect(task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should create task with default status "To Do"', () => {
    const task = createTask(taskData);
    expect(task.status).toBe('To Do');
  });

  it('should set timestamps on creation', () => {
    const task = createTask(taskData);
    expect(task.createdAt).toBeDefined();
    expect(task.updatedAt).toBeDefined();
    expect(task.createdAt).toBe(task.updatedAt);
  });

  it('should preserve projectId', () => {
    const task = createTask(taskData);
    expect(task.projectId).toBe('project-uuid-123');
  });

  it('should NOT contain nested comments or pomodoroSessions', () => {
    const task = createTask(taskData);
    expect(task).not.toHaveProperty('comments');
    expect(task).not.toHaveProperty('pomodoroSessions');
  });
});
