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
  updatedAt: new Date().toISOString(),
};

vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: vi.fn(() => ({
    projects: [mockProject],
    projectCount: () => 1,
    addProject: vi.fn(),
  })),
}));

describe('Projects feature', () => {
  it('should render projects container', () => {
    render(<Projects />);
    const container = document.querySelector('.projects');
    expect(container).toBeInTheDocument();
  });

  it('should display projects title', () => {
    render(<Projects />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('should display add project button', () => {
    render(<Projects />);
    expect(screen.getByRole('button', { name: /add|new|create/i })).toBeInTheDocument();
  });

  it('should display project cards', () => {
    render(<Projects />);
    expect(screen.getByText('Project 1')).toBeInTheDocument();
  });
});
