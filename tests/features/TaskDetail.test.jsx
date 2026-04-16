import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskDetailPanel } from '../../src/features/TaskDetail/TaskDetailPanel';

const mockTask = {
  id: '1',
  projectId: '1',
  name: 'Test Task',
  description: 'Task description',
  status: 'In Progress',
  startDate: '',
  endDate: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

vi.mock('../../src/hooks/useComments', () => ({
  useComments: () => ({
    comments: [
      { id: '1', taskId: '1', text: 'Comment 1', createdAt: new Date().toISOString() },
    ],
    addComment: vi.fn(),
    getCommentsByTaskId: (taskId) => [
      { id: '1', taskId: '1', text: 'Comment 1', createdAt: new Date().toISOString() },
    ],
  }),
}));

vi.mock('../../src/features/Pomodoro/PomodoroTimer', () => ({
  PomodoroTimer: () => <div data-testid="pomodoro-timer" />,
}));

describe('TaskDetail feature', () => {
  it('should render task detail panel', () => {
    render(<TaskDetailPanel task={mockTask} onClose={() => {}} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should display task name', () => {
    render(<TaskDetailPanel task={mockTask} onClose={() => {}} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should display task status', () => {
    render(<TaskDetailPanel task={mockTask} onClose={() => {}} />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should display task description', () => {
    render(<TaskDetailPanel task={mockTask} onClose={() => {}} />);
    expect(screen.getByText('Task description')).toBeInTheDocument();
  });

  it('should render close button', () => {
    render(<TaskDetailPanel task={mockTask} onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /cerrar panel/i })).toBeInTheDocument();
  });
});
