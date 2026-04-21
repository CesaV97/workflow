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
    loading: false,
    addComment: vi.fn(),
    getCommentsByTaskId: () => [
      { id: '1', taskId: '1', text: 'Comment 1', createdAt: new Date().toISOString() },
    ],
  }),
}));

vi.mock('../../src/context/TasksContext', () => ({
  useTasksContext: () => ({
    updateTask: vi.fn(),
  }),
}));

vi.mock('../../src/context/PomodoroContext', () => ({
  usePomodoro: () => ({
    taskId: null, isActive: false, mm: '25', ss: '00', sessionType: 'Work',
  }),
}));

vi.mock('../../src/features/Pomodoro/PomodoroTimer', () => ({
  PomodoroTimer: () => <div data-testid="pomodoro-timer" />,
}));

vi.mock('../../src/constants/taskStatus', () => ({
  TASK_STATUS: {
    TO_DO: 'To Do', IN_PROGRESS: 'In Progress',
    PAUSED: 'Paused', BLOCKED: 'Blocked', DONE: 'Done',
  },
}));

describe('TaskDetail feature', () => {
  it('should render task detail panel', () => {
    render(<TaskDetailPanel task={mockTask} onClose={vi.fn()} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should display task name', () => {
    render(<TaskDetailPanel task={mockTask} onClose={vi.fn()} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should display task status as dropdown', () => {
    render(<TaskDetailPanel task={mockTask} onClose={vi.fn()} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('In Progress');
  });

  it('should display task description', () => {
    render(<TaskDetailPanel task={mockTask} onClose={vi.fn()} />);
    expect(screen.getByText('Task description')).toBeInTheDocument();
  });

  it('should render close button', () => {
    render(<TaskDetailPanel task={mockTask} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: /cerrar panel/i })).toBeInTheDocument();
  });

  it('should show existing comments', () => {
    render(<TaskDetailPanel task={mockTask} onClose={vi.fn()} />);
    expect(screen.getByText('Comment 1')).toBeInTheDocument();
  });
});
