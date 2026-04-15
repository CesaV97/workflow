import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../../src/features/Dashboard/Dashboard';

const mockProjects = [
  { id: '1', name: 'Project 1', description: 'Desc 1', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Project 2', description: 'Desc 2', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockAddProject = vi.fn((data) => ({ id: '3', ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
const mockUpdateProject = vi.fn((id, data) => ({ id, ...data, updatedAt: new Date().toISOString() }));
const mockDeleteProject = vi.fn(() => true);

vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: mockProjects,
    projectCount: () => mockProjects.length,
    addProject: mockAddProject,
    updateProject: mockUpdateProject,
    deleteProject: mockDeleteProject,
  }),
}));

vi.mock('../../src/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    taskCount: () => 0,
  }),
}));

describe('Dashboard feature', () => {
  it('should render dashboard container', () => {
    render(<Dashboard />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render project grid section', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { name: /projects/i, level: 2 })).toBeInTheDocument();
  });

  it('should render weekly tasks section', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { name: /tasks/i, level: 2 })).toBeInTheDocument();
  });

  it('should display project count', () => {
    render(<Dashboard />);
    expect(screen.getByText((content, element) => {
      return element && content.includes('2') && element.textContent.includes('Project');
    })).toBeInTheDocument();
  });

  it('should render "Nuevo Proyecto" button', () => {
    render(<Dashboard />);
    expect(screen.getByRole('button', { name: /nuevo proyecto/i })).toBeInTheDocument();
  });

  it('should open modal when "Nuevo Proyecto" is clicked', async () => {
    render(<Dashboard />);
    await userEvent.click(screen.getByRole('button', { name: /nuevo proyecto/i }));
    expect(screen.getByText('Nuevo Proyecto')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
  });
});
