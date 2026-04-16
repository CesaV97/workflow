import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'user@example.com' },
    loading: false,
    signOut: vi.fn(),
    isConfigured: true,
  }),
}));

vi.mock('../src/lib/localMigration', () => ({
  migrateLocalDataToSupabase: vi.fn(async () => ({ migrated: false })),
}));

vi.mock('../src/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [],
    loading: false,
    error: '',
    projectCount: () => 0,
    addProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
  }),
}));

vi.mock('../src/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    loading: false,
    error: '',
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
    loading: false,
    error: '',
    addSession: vi.fn(),
    getSessionsByTaskId: vi.fn(() => []),
    sessionCount: () => 0,
  }),
}));

describe('App component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Sidebar and TopBar', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByRole('navigation')).toBeInTheDocument());
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
  });

  it('renders Dashboard by default', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText('Dashboard', { selector: 'h1' })).toBeInTheDocument());
  });

  it('navigates to Proyectos view', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByRole('navigation')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Proyectos'));
    expect(document.querySelector('.main-content')).toBeInTheDocument();
  });

  it('navigates to Reportes view', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByRole('navigation')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Reportes'));
    expect(screen.getByText('Reportes', { selector: 'h1' })).toBeInTheDocument();
  });

  it('navigates to Configuración view', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByRole('navigation')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Configuración'));
    expect(screen.getByText('Configuración', { selector: 'h1' })).toBeInTheDocument();
  });
});
