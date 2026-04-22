import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGetProjectCount = vi.fn();
const mockCreateProject = vi.fn();
const mockCreateTask = vi.fn();
const mockCreateComment = vi.fn();
const mockCreateSession = vi.fn();

vi.mock('../../src/lib/workflowApi', () => ({
  getProjectCount: (...args) => mockGetProjectCount(...args),
  createProject: (...args) => mockCreateProject(...args),
  createTask: (...args) => mockCreateTask(...args),
  createComment: (...args) => mockCreateComment(...args),
  createSession: (...args) => mockCreateSession(...args),
}));

describe('localMigration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockGetProjectCount.mockResolvedValue(0);
    mockCreateProject.mockResolvedValue({ id: 'remote-project-1' });
    mockCreateTask.mockResolvedValue({ id: 'remote-task-1' });
    mockCreateComment.mockResolvedValue({ id: 'remote-comment-1' });
    mockCreateSession.mockResolvedValue({ id: 'remote-session-1' });
  });

  it('resumes a partially completed migration without duplicating prior inserts', async () => {
    localStorage.setItem('projects', JSON.stringify([
      { id: 'local-project-1', name: 'Project 1', description: '', status: 'Active' },
    ]));
    localStorage.setItem('tasks', JSON.stringify([
      { id: 'local-task-1', projectId: 'local-project-1', name: 'Task 1', description: '', status: 'To Do' },
    ]));
    localStorage.setItem('comments', JSON.stringify([
      { id: 'local-comment-1', taskId: 'local-task-1', text: 'Comment 1' },
    ]));
    localStorage.setItem('pomodoroSessions', JSON.stringify([
      {
        id: 'local-session-1',
        taskId: 'local-task-1',
        type: 'Work',
        duration: 25,
        startTime: '2026-01-01T00:00:00.000Z',
        endTime: '2026-01-01T00:25:00.000Z',
        status: 'Completed',
      },
    ]));

    const { migrateLocalDataToSupabase } = await import('../../src/lib/localMigration');

    mockCreateTask.mockRejectedValueOnce(new Error('task insert failed'));
    await expect(migrateLocalDataToSupabase('user-1')).rejects.toThrow('task insert failed');

    const savedState = JSON.parse(localStorage.getItem('workflow:supabaseMigration:user-1'));
    expect(savedState.projectMap).toEqual({ 'local-project-1': 'remote-project-1' });
    expect(mockCreateProject).toHaveBeenCalledTimes(1);

    mockCreateTask.mockResolvedValueOnce({ id: 'remote-task-1' });
    await expect(migrateLocalDataToSupabase('user-1')).resolves.toEqual({ migrated: true });

    expect(mockCreateProject).toHaveBeenCalledTimes(1);
    expect(mockCreateTask).toHaveBeenCalledTimes(2);
    expect(mockCreateComment).toHaveBeenCalledTimes(1);
    expect(mockCreateSession).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('workflow:supabaseMigration:user-1')).toBe('done');
  });
});
