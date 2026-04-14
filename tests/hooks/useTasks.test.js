import { describe, it, expect, beforeEach } from 'vitest';
import { useTasks } from '../../src/hooks/useTasks';
import { createTask } from '../../src/data/entities/Task';

describe('useTasks hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty array', () => {
    const { tasks } = useTasks();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBe(0);
  });

  it('should add a new task', () => {
    const { addTask, tasks } = useTasks();
    const newTask = addTask({ projectId: 'proj-1', name: 'Test Task', status: 'To Do' });

    expect(newTask.id).toBeDefined();
    expect(newTask.name).toBe('Test Task');
    expect(newTask.projectId).toBe('proj-1');
    expect(tasks.length).toBe(1);
  });

  it('should retrieve all tasks', () => {
    const { addTask, tasks } = useTasks();
    addTask({ projectId: 'proj-1', name: 'Task 1' });
    addTask({ projectId: 'proj-1', name: 'Task 2' });

    expect(tasks.length).toBe(2);
  });

  it('should retrieve task by ID', () => {
    const { addTask, getTaskById } = useTasks();
    const added = addTask({ projectId: 'proj-1', name: 'Test Task' });
    const retrieved = getTaskById(added.id);

    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(added.id);
    expect(retrieved.name).toBe('Test Task');
  });

  it('should return undefined for non-existent task ID', () => {
    const { getTaskById } = useTasks();
    const result = getTaskById('non-existent-id');
    expect(result).toBeUndefined();
  });

  it('should get tasks by project ID', () => {
    const { addTask, getTasksByProjectId } = useTasks();
    addTask({ projectId: 'proj-1', name: 'Task 1' });
    addTask({ projectId: 'proj-1', name: 'Task 2' });
    addTask({ projectId: 'proj-2', name: 'Task 3' });

    const proj1Tasks = getTasksByProjectId('proj-1');
    expect(proj1Tasks.length).toBe(2);
    expect(proj1Tasks[0].projectId).toBe('proj-1');
    expect(proj1Tasks[1].projectId).toBe('proj-1');
  });

  it('should return empty array for project with no tasks', () => {
    const { getTasksByProjectId } = useTasks();
    const result = getTasksByProjectId('non-existent-proj');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should get tasks by status', () => {
    const { addTask, getTasksByStatus } = useTasks();
    addTask({ projectId: 'proj-1', name: 'Task 1', status: 'To Do' });
    addTask({ projectId: 'proj-1', name: 'Task 2', status: 'In Progress' });
    addTask({ projectId: 'proj-1', name: 'Task 3', status: 'To Do' });

    const todoTasks = getTasksByStatus('To Do');
    expect(todoTasks.length).toBe(2);
    expect(todoTasks.every(t => t.status === 'To Do')).toBe(true);
  });

  it('should return empty array for status with no tasks', () => {
    const { getTasksByStatus } = useTasks();
    const result = getTasksByStatus('Done');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should update a task', () => {
    const { addTask, updateTask, getTaskById } = useTasks();
    const added = addTask({ projectId: 'proj-1', name: 'Original', status: 'To Do' });

    const updated = updateTask(added.id, { name: 'Updated', status: 'In Progress' });
    expect(updated.name).toBe('Updated');
    expect(updated.status).toBe('In Progress');
    expect(updated.projectId).toBe('proj-1');

    const retrieved = getTaskById(added.id);
    expect(retrieved.name).toBe('Updated');
  });

  it('should return undefined when updating non-existent task', () => {
    const { updateTask } = useTasks();
    const result = updateTask('non-existent-id', { name: 'New' });
    expect(result).toBeUndefined();
  });

  it('should delete a task', () => {
    const { addTask, deleteTask, getTaskById } = useTasks();
    const added = addTask({ projectId: 'proj-1', name: 'Task to Delete' });

    const deleted = deleteTask(added.id);
    expect(deleted).toBe(true);
    expect(getTaskById(added.id)).toBeUndefined();
  });

  it('should return false when deleting non-existent task', () => {
    const { deleteTask } = useTasks();
    const result = deleteTask('non-existent-id');
    expect(result).toBe(false);
  });

  it('should persist tasks to localStorage', () => {
    const { addTask } = useTasks();
    addTask({ projectId: 'proj-1', name: 'Persistent Task' });

    const { tasks } = useTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].name).toBe('Persistent Task');
  });

  it('should provide task count', () => {
    const { addTask, taskCount } = useTasks();
    expect(taskCount()).toBe(0);
    addTask({ projectId: 'proj-1', name: 'Task 1' });
    expect(taskCount()).toBe(1);
    addTask({ projectId: 'proj-1', name: 'Task 2' });
    expect(taskCount()).toBe(2);
  });

  it('should return fresh tasks array on each access', () => {
    const hook = useTasks();
    const count1 = hook.tasks.length;
    hook.addTask({ projectId: 'proj-1', name: 'Task 1' });
    const count2 = hook.tasks.length;

    expect(count1).toBe(0);
    expect(count2).toBe(1);  // Getter returned fresh data
  });
});
