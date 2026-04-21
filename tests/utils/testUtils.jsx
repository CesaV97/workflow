import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { SettingsProvider } from '../../src/context/SettingsContext';

// Minimal mock context values for tests
export const mockAuthValue = {
  user: { id: 'user-1', email: 'test@example.com' },
  loading: false,
  signOut: vi.fn(),
  isConfigured: true,
};

export const mockPomodoroValue = {
  taskId: null,
  duration: 25,
  sessionType: 'Work',
  remaining: 1500,
  running: false,
  startedAt: null,
  saving: false,
  progress: 0,
  mm: '25',
  ss: '00',
  isActive: false,
  toasts: [],
  dismissToast: vi.fn(),
  attachTask: vi.fn(),
  setDuration: vi.fn(),
  setSessionType: vi.fn(),
  handleStart: vi.fn(),
  handlePause: vi.fn(),
  handleStop: vi.fn(),
};

export const mockTasksContextValue = {
  tasks: [],
  loading: false,
  error: '',
  taskCount: () => 0,
  addTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  getTaskById: vi.fn(),
  getTasksByProjectId: vi.fn(() => []),
  getTasksByStatus: vi.fn(() => []),
  reloadTasks: vi.fn(),
};

// Wraps with only theme + settings (no auth/tasks needed)
export function renderWithBaseProviders(ui) {
  return render(
    <ThemeProvider>
      <SettingsProvider>
        {ui}
      </SettingsProvider>
    </ThemeProvider>
  );
}
