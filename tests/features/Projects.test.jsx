import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Projects } from '../../src/features/Projects/Projects';

const mockProject = {
  id: '1',
  name: 'Project 1',
  description: 'Desc 1',
  status: 'Active',
  startDate: '',
  endDate: '',
  createdAt: new Date().toISOString(),
};

vi.mock('../../src/context/ProjectsContext', () => ({
  useProjectsContext: () => ({
    projects: [mockProject],
    loading: false,
    error: '',
    addProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
  }),
}));

vi.mock('../../src/context/TasksContext', () => ({
  useTasksContext: () => ({
    getTasksByProjectId: vi.fn(() => []),
    reloadTasks: vi.fn(),
  }),
}));

describe('Projects feature', () => {
  it('should render projects page', () => {
    render(<Projects />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display Proyectos title', () => {
    render(<Projects />);
    expect(screen.getByText('Proyectos')).toBeInTheDocument();
  });

  it('should display nuevo proyecto button', () => {
    render(<Projects />);
    expect(screen.getByRole('button', { name: /nuevo proyecto/i })).toBeInTheDocument();
  });

  it('should display project cards', () => {
    render(<Projects />);
    expect(screen.getByText('Project 1')).toBeInTheDocument();
  });
});
