import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTasks } from '../../src/hooks/useTasks';

const mockListTasks = vi.fn();

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1' },
    isConfigured: true,
  }),
}));

vi.mock('../../src/lib/workflowApi', () => ({
  listTasks: (...args) => mockListTasks(...args),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

describe('useTasks hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListTasks.mockResolvedValue([]);
  });

  it('loads tasks on mount', async () => {
    mockListTasks.mockResolvedValue([{ id: '1', projectId: 'project-1', name: 'Task 1', status: 'To Do', description: '', createdAt: '2026-01-01', updatedAt: '2026-01-01' }]);
    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.tasks).toHaveLength(1));
    expect(result.current.taskCount()).toBe(1);
  });
});
