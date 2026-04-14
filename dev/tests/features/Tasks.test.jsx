import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tasks } from '../../src/features/Tasks/Tasks';

// Mock the hooks
vi.mock('../../src/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [
      { id: '1', projectId: '1', name: 'Task 1', status: 'To Do', description: 'Desc 1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', projectId: '1', name: 'Task 2', status: 'In Progress', description: 'Desc 2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    taskCount: () => 2,
    getTasksByStatus: (status) => [
      { id: '1', projectId: '1', name: 'Task 1', status: 'To Do', description: 'Desc 1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
  }),
}));

vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [
      { id: '1', name: 'Project 1', description: 'Desc 1', status: 'Active', startDate: '', endDate: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
  }),
}));

describe('Tasks feature', () => {
  it('should render tasks container', () => {
    render(<Tasks />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should display tasks title', () => {
    render(<Tasks />);
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('should display task count', () => {
    render(<Tasks />);
    const countText = screen.getByText(/2 of 2/);
    expect(countText).toBeInTheDocument();
  });

  it('should render filter section', () => {
    render(<Tasks />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should display task list', () => {
    render(<Tasks />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('should render filter buttons with status options', () => {
    render(<Tasks />);
    const allButton = screen.getByRole('button', { name: 'All' });
    expect(allButton).toBeInTheDocument();
    const toDoButtons = screen.getAllByRole('button', { name: 'To Do' });
    expect(toDoButtons.length).toBeGreaterThan(0);
  });
});
