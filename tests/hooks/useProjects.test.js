import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProjects } from '../../src/hooks/useProjects';

const mockListProjects = vi.fn();

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1' },
    isConfigured: true,
  }),
}));

vi.mock('../../src/lib/workflowApi', () => ({
  listProjects: (...args) => mockListProjects(...args),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}));

describe('useProjects hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListProjects.mockResolvedValue([]);
  });

  it('loads projects on mount', async () => {
    mockListProjects.mockResolvedValue([{ id: '1', name: 'Project 1', description: '', status: 'Active', createdAt: '2026-01-01', updatedAt: '2026-01-01' }]);
    const { result } = renderHook(() => useProjects());

    await waitFor(() => expect(result.current.projects).toHaveLength(1));
    expect(result.current.projectCount()).toBe(1);
  });
});
