import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../src/App';

// Mock hooks to avoid localStorage issues
vi.mock('../src/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [],
    projectCount: () => 0,
    addProject: vi.fn(),
  }),
}));

vi.mock('../src/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    taskCount: () => 0,
    getTasksByProjectId: () => [],
    getTasksByStatus: () => [],
  }),
}));

vi.mock('../src/hooks/useComments', () => ({
  useComments: () => ({
    comments: [],
    getCommentsByTaskId: () => [],
    addComment: vi.fn(),
  }),
}));

vi.mock('../src/hooks/usePomodoroSessions', () => ({
  usePomodoroSessions: () => ({
    sessions: [],
    sessionCount: () => 0,
    addSession: vi.fn(),
  }),
}));

describe('App component', () => {
  it('should render the app container', () => {
    render(<App />);
    const appDiv = document.querySelector('.app');
    expect(appDiv).toBeInTheDocument();
  });

  it('should render sidebar navigation', () => {
    render(<App />);
    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toBeInTheDocument();
  });

  it('should render topbar header', () => {
    render(<App />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should render main content area', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should display app title in topbar', () => {
    render(<App />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
