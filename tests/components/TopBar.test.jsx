import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopBar } from '../../src/features/Layout/TopBar';

vi.mock('../../src/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}));

vi.mock('../../src/context/PomodoroContext', () => ({
  usePomodoro: () => ({
    isActive: false, mm: '25', ss: '00', sessionType: 'Work',
    handlePause: vi.fn(), handleStop: vi.fn(),
  }),
}));

const props = {
  userEmail: 'user@example.com',
  onSignOut: vi.fn(),
  onNavigate: vi.fn(),
  onMenuToggle: vi.fn(),
  onNewTask: vi.fn(),
};

describe('TopBar component', () => {
  it('should render topbar container', () => {
    render(<TopBar {...props} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should render with correct CSS class', () => {
    render(<TopBar {...props} />);
    expect(screen.getByRole('banner')).toHaveClass('topbar');
  });

  it('should render search input', () => {
    render(<TopBar {...props} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('should render search input with correct placeholder', () => {
    render(<TopBar {...props} />);
    expect(screen.getByPlaceholderText('Buscar proyectos o tareas...')).toBeInTheDocument();
  });

  it('should render new task button', () => {
    render(<TopBar {...props} />);
    expect(screen.getByRole('button', { name: /nueva tarea/i })).toBeInTheDocument();
  });

  it('should have correct semantic structure', () => {
    const { container } = render(<TopBar {...props} />);
    expect(container.querySelector('header.topbar')).toBeInTheDocument();
    expect(container.querySelector('.topbar-search')).toBeInTheDocument();
  });
});
