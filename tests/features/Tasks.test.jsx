import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tasks } from '../../src/features/Tasks/Tasks';

vi.mock('../../src/context/TasksContext', () => ({
  useTasksContext: () => ({
    tasks: [],
    loading: false,
    error: '',
    taskCount: () => 0,
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    getTasksByProjectId: vi.fn(() => []),
  }),
}));

vi.mock('../../src/context/ProjectsContext', () => ({
  useProjectsContext: () => ({
    projects: [],
    loading: false,
  }),
}));

vi.mock('../../src/context/PomodoroContext', () => ({
  usePomodoro: () => ({
    taskId: null, isActive: false,
  }),
}));

describe('Tasks', () => {
  it('should render tasks page title', () => {
    render(<Tasks />);
    expect(screen.getByText('Tareas')).toBeInTheDocument();
  });

  it('should render empty state when no tasks', () => {
    render(<Tasks />);
    expect(screen.getByText(/crea un proyecto/i)).toBeInTheDocument();
  });
});
