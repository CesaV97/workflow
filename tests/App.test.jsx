import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

vi.mock('../src/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [],
    projectCount: () => 0,
    addProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
  }),
}));

vi.mock('../src/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    taskCount: () => 0,
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    getTasksByProjectId: vi.fn(() => []),
    getTasksByStatus: vi.fn(() => []),
  }),
}));

vi.mock('../src/hooks/usePomodoroSessions', () => ({
  usePomodoroSessions: () => ({
    sessions: [],
    addSession: vi.fn(),
    getSessionsByTaskId: vi.fn(() => []),
    sessionCount: () => 0,
  }),
}));

describe('App component', () => {
  it('renders Sidebar and TopBar', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
  });

  it('renders Dashboard by default', () => {
    render(<App />);
    expect(screen.getByText('Dashboard', { selector: 'h1' })).toBeInTheDocument();
  });

  it('navigates to Proyectos view', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Proyectos'));
    expect(document.querySelector('.main-content')).toBeInTheDocument();
  });

  it('navigates to Reportes view', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Reportes'));
    expect(screen.getByText('Reportes', { selector: 'h1' })).toBeInTheDocument();
  });

  it('navigates to Configuración view', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Configuración'));
    expect(screen.getByText('Configuración', { selector: 'h1' })).toBeInTheDocument();
  });
});
