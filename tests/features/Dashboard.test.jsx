import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../../src/features/Dashboard/Dashboard';

vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [],
    projectCount: () => 0,
  }),
}));

vi.mock('../../src/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    taskCount: () => 0,
  }),
}));

describe('Dashboard', () => {
  it('should render dashboard', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
