import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../../src/features/Dashboard/Dashboard';

// Mock the hooks
vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [
      { id: '1', name: 'Project 1', description: 'Desc 1', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', name: 'Project 2', description: 'Desc 2', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    projectCount: () => 2,
  }),
}));

vi.mock('../../src/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [
      { id: '1', projectId: '1', name: 'Task 1', status: 'To Do', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', projectId: '1', name: 'Task 2', status: 'In Progress', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    taskCount: () => 2,
  }),
}));

describe('Dashboard feature', () => {
  it('should render dashboard container', () => {
    render(<Dashboard />);
    const dashboard = screen.getByRole('main');
    expect(dashboard).toBeInTheDocument();
  });

  it('should display dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render project grid section', () => {
    render(<Dashboard />);
    const projectSection = screen.getByRole('heading', { name: /projects/i, level: 2 });
    expect(projectSection).toBeInTheDocument();
  });

  it('should render weekly tasks section', () => {
    render(<Dashboard />);
    const tasksSection = screen.getByRole('heading', { name: /tasks/i, level: 2 });
    expect(tasksSection).toBeInTheDocument();
  });

  it('should display project count', () => {
    render(<Dashboard />);
    const text = screen.getByText((content, element) => {
      return element && content.includes('2') && element.textContent.includes('Project');
    });
    expect(text).toBeInTheDocument();
  });

  it('should display task count', () => {
    render(<Dashboard />);
    const text = screen.getByText((content, element) => {
      return element && content.includes('2') && element.textContent.includes('Task');
    });
    expect(text).toBeInTheDocument();
  });
});
