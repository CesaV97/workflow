import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PomodoroTimer } from '../../src/features/Pomodoro/PomodoroTimer';

describe('PomodoroTimer feature', () => {
  it('should render timer component', () => {
    render(<PomodoroTimer taskId="1" />);
    expect(screen.getByText(/25/)).toBeInTheDocument();
  });

  it('should display duration controls', () => {
    render(<PomodoroTimer taskId="1" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should show work/rest toggle', () => {
    render(<PomodoroTimer taskId="1" />);
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue('Work');
  });
});
