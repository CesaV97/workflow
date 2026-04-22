import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PomodoroTimer } from '../../src/features/Pomodoro/PomodoroTimer';

vi.mock('../../src/context/PomodoroContext', () => ({
  usePomodoro: () => ({
    taskId: '1',
    duration: 25,
    sessionType: 'Work',
    remaining: 1500,
    running: false,
    saving: false,
    progress: 0,
    mm: '25',
    ss: '00',
    isActive: false,
    attachTask: vi.fn(),
    setDuration: vi.fn(),
    setSessionType: vi.fn(),
    handleStart: vi.fn(),
    handlePause: vi.fn(),
    handleStop: vi.fn(),
  }),
}));

describe('PomodoroTimer feature', () => {
  it('should render timer component', () => {
    render(<PomodoroTimer taskId="1" />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('should display duration corner presets', () => {
    render(<PomodoroTimer taskId="1" />);
    expect(screen.getByTitle('25 min')).toBeInTheDocument();
  });

  it('should show Start button when not running', () => {
    render(<PomodoroTimer taskId="1" />);
    expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument();
  });

  it('should show Stop button', () => {
    render(<PomodoroTimer taskId="1" />);
    expect(screen.getByRole('button', { name: /detener/i })).toBeInTheDocument();
  });

  it('should show Work and Rest preset buttons', () => {
    render(<PomodoroTimer taskId="1" />);
    expect(screen.getByRole('button', { name: 'Work' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rest' })).toBeInTheDocument();
  });
});
