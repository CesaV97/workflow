import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tasks } from '../../src/features/Tasks/Tasks';

vi.mock('../../src/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    taskCount: () => 0,
  }),
}));

describe('Tasks', () => {
  it('should render tasks', () => {
    render(<Tasks />);
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });
});
