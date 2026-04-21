import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

vi.mock('../src/context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
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
    addProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
  }),
}));

vi.mock('../src/context/TasksContext', () => ({
  TasksProvider: ({ children }) => children,
  useTasksContext: () => ({
    tasks: [],
    loading: false,
    error: '',
    taskCount: () => 0,
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    getTasksByProjectId: vi.fn(() => []),
  }),
}));

vi.mock('../src/hooks/usePomodoroSessions', () => ({
  usePomodoroSessions: () => ({
    sessions: [],
    loading: false,
    error: '',
    addSession: vi.fn(),
    getSessionsByTaskId: vi.fn(() => []),
  }),
}));

vi.mock('../src/context/PomodoroContext', () => ({
  PomodoroProvider: ({ children }) => children,
  usePomodoro: () => ({
    taskId: null, isActive: false, mm: '25', ss: '00', sessionType: 'Work',
    toasts: [], dismissToast: vi.fn(),
    attachTask: vi.fn(), setDuration: vi.fn(), setSessionType: vi.fn(),
    handleStart: vi.fn(), handlePause: vi.fn(), handleStop: vi.fn(),
  }),
}));

vi.mock('../src/context/SettingsContext', () => ({
  SettingsProvider: ({ children }) => children,
  useSettings: () => ({
    notif: true, sound: false, autoBreak: true,
    setNotif: vi.fn(), setSound: vi.fn(), setAutoBreak: vi.fn(),
  }),
}));

vi.mock('../src/context/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}));

describe('App component', () => {
  beforeEach(() => { vi.clearAllMocks(); });

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
    await waitFor(() => expect(screen.getByText('Reportes', { selector: 'h1' })).toBeInTheDocument());
  });

  it('navigates to Configuración view', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByRole('navigation')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Configuración'));
    await waitFor(() => expect(screen.getByText('Configuración', { selector: 'h1' })).toBeInTheDocument());
  });
});
