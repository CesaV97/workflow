import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePomodoroSessions } from '../../src/hooks/usePomodoroSessions';

const mockListSessions = vi.fn();

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1' },
    isConfigured: true,
  }),
}));

vi.mock('../../src/lib/workflowApi', () => ({
  listSessions: (...args) => mockListSessions(...args),
  createSession: vi.fn(),
  updateSession: vi.fn(),
  deleteSession: vi.fn(),
}));

describe('usePomodoroSessions hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListSessions.mockResolvedValue([]);
  });

  it('loads sessions on mount', async () => {
    mockListSessions.mockResolvedValue([{ id: '1', taskId: 'task-1', type: 'Work', duration: 25, startTime: '2026-01-01', endTime: '2026-01-01', status: 'Completed' }]);
    const { result } = renderHook(() => usePomodoroSessions());

    await waitFor(() => expect(result.current.sessions).toHaveLength(1));
    expect(result.current.sessionCount()).toBe(1);
  });
});
