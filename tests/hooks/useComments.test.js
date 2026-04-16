import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useComments } from '../../src/hooks/useComments';

const mockListComments = vi.fn();

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1' },
    isConfigured: true,
  }),
}));

vi.mock('../../src/lib/workflowApi', () => ({
  listComments: (...args) => mockListComments(...args),
  createComment: vi.fn(),
  updateComment: vi.fn(),
  deleteComment: vi.fn(),
}));

describe('useComments hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListComments.mockResolvedValue([]);
  });

  it('loads comments on mount', async () => {
    mockListComments.mockResolvedValue([{ id: '1', taskId: 'task-1', text: 'Comment 1', createdAt: '2026-01-01' }]);
    const { result } = renderHook(() => useComments());

    await waitFor(() => expect(result.current.comments).toHaveLength(1));
    expect(result.current.commentCount()).toBe(1);
  });
});
