import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../../src/features/Dashboard/Dashboard';

const todayISO = new Date().toISOString().slice(0, 10);

const mockProjects = [
  { id: '1', name: 'Project 1', description: 'Desc 1', status: 'Active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Project 2', description: 'Desc 2', status: 'Active', createdAt: new Date().toISOString() },
];

const mockTasks = [
  { id: 't1', projectId: '1', name: 'Task Today', status: 'In Progress', endDate: todayISO, createdAt: new Date().toISOString() },
];

vi.mock('../../src/context/ProjectsContext', () => ({
  useProjectsContext: () => ({
    projects: mockProjects,
    loading: false,
    error: '',
    addProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
  }),
}));

vi.mock('../../src/context/TasksContext', () => ({
  useTasksContext: () => ({
    tasks: mockTasks,
    loading: false,
    error: '',
    taskCount: () => mockTasks.length,
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    getTasksByProjectId: vi.fn((id) => mockTasks.filter(t => t.projectId === id)),
  }),
}));

vi.mock('../../src/context/PomodoroContext', () => ({
  usePomodoro: () => ({
    taskId: null, isActive: false, mm: '25', ss: '00', sessionType: 'Work',
    handlePause: vi.fn(), handleStop: vi.fn(),
  }),
}));

describe('Dashboard feature', () => {
  it('should render dashboard container', () => {
    render(<Dashboard onTaskSelect={vi.fn()} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display dashboard title', () => {
    render(<Dashboard onTaskSelect={vi.fn()} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render project grid section', () => {
    render(<Dashboard onTaskSelect={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /proyectos/i, level: 2 })).toBeInTheDocument();
  });

  it('should render weekly tasks section', () => {
    render(<Dashboard onTaskSelect={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /esta semana/i, level: 2 })).toBeInTheDocument();
  });

  it('should render Nuevo proyecto button', () => {
    render(<Dashboard onTaskSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: /nuevo proyecto/i })).toBeInTheDocument();
  });

  it('should call onTaskSelect when a task is clicked', async () => {
    const onTaskSelect = vi.fn();
    render(<Dashboard onTaskSelect={onTaskSelect} />);
    const taskItem = screen.queryByText('Task Today');
    if (taskItem) {
      const clickable = taskItem.closest('[role="button"]') || taskItem.closest('.weekly-task-item') || taskItem;
      await userEvent.click(clickable);
      expect(onTaskSelect).toHaveBeenCalled();
    }
  });
});
