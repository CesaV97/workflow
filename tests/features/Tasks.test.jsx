import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tasks } from '../../src/features/Tasks/Tasks';

vi.mock('../../src/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    loading: false,
    error: '',
    taskCount: () => 0,
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  }),
}));

vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [],
    loading: false,
  }),
}));

describe('Tasks', () => {
  it('should render tasks', () => {
    render(<Tasks />);
    expect(screen.getByText('Tareas')).toBeInTheDocument();
  });
});
