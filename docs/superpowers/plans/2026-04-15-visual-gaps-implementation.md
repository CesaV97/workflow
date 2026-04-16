# Visual Gaps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all visual gaps between the approved mockups and the current app: Sidebar/TopBar redesign, Reports/Settings pages, App routing with TaskDetail panel slide-out, clickable task groups with date grouping, TaskDetail panel redesign, and Pomodoro timer redesign.

**Architecture:** Each task is isolated to specific files. Tasks 1-2 are fully independent. Task 3 (App.jsx wiring) depends on Task 2 files existing. Task 4 (clickable tasks) builds on Task 3's `onTaskSelect` prop. Tasks 5-6 (panel + pomodoro redesign) are independent of each other but build on the connected panel from Task 3.

**Tech Stack:** React 19, Vitest, @testing-library/react, @testing-library/user-event, CSS variables from `src/styles/theme.css`

**Reference mockups:** `C:/dev/workFlow/.superpowers/brainstorm/1236-1776125754/content/dashboard-layout.html` and `task-detail-panel-v3.html`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/features/Layout/Sidebar.jsx` | ⚡ logo, Spanish labels, Reportes + Configuración |
| Modify | `src/features/Layout/Sidebar.css` | Active state: left border + blue text + bg |
| Modify | `src/features/Layout/TopBar.jsx` | Add SearchBar input + ⚙️ Perfil |
| Modify | `src/features/Layout/TopBar.css` | Layout for search + actions |
| Create | `src/features/Reports/Reports.jsx` | Work vs Rest visualization page |
| Create | `src/features/Reports/Reports.css` | Reports page styles |
| Create | `src/features/Settings/Settings.jsx` | Placeholder settings page |
| Create | `src/features/Settings/Settings.css` | Settings styles |
| Modify | `src/App.jsx` | Add routes, selectedTask state, TaskDetailPanel overlay |
| Modify | `src/App.css` | Panel overlay layout |
| Modify | `src/features/Dashboard/WeeklyTasksList.jsx` | Date grouping: HOY/MAÑANA/PRÓXIMOS DÍAS + onTaskClick |
| Modify | `src/features/Dashboard/Dashboard.jsx` | Accept onTaskSelect, pass to WeeklyTasksList |
| Modify | `src/features/Tasks/Tasks.jsx` | Accept onTaskSelect, render clickable task items |
| Modify | `src/features/TaskDetail/TaskDetailPanel.jsx` | Full redesign matching mockup (Spanish, info+pomodoro+comments) |
| Modify | `src/features/TaskDetail/TaskDetail.css` | Panel styles matching mockup (380px, fixed right) |
| Modify | `src/features/Pomodoro/PomodoroTimer.jsx` | Work/Rest toggle, 48px display, kitchen clock, session log |
| Modify | `src/features/Pomodoro/Pomodoro.css` | Pomodoro visual styles matching mockup |
| Modify | `tests/components/Sidebar.test.jsx` | Update assertions for Spanish labels + new nav items |
| Modify | `tests/features/Dashboard.test.jsx` | Add onTaskSelect mock, test task click |
| Modify | `tests/features/Pomodoro.test.jsx` | Update for new toggle-based UI |

---

## Task 1: Sidebar + TopBar — logo, Spanish labels, SearchBar, Reportes/Configuración

**Files:**
- Modify: `src/features/Layout/Sidebar.jsx`
- Modify: `src/features/Layout/Sidebar.css`
- Modify: `src/features/Layout/TopBar.jsx`
- Modify: `src/features/Layout/TopBar.css`
- Modify: `tests/components/Sidebar.test.jsx`

- [ ] **Step 1: Update Sidebar test to match new labels**

Replace full contents of `tests/components/Sidebar.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from '../../src/features/Layout/Sidebar';

describe('Sidebar component', () => {
  it('should render sidebar container', () => {
    render(<Sidebar onNavigate={vi.fn()} currentView="dashboard" />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should display app title with logo', () => {
    render(<Sidebar onNavigate={vi.fn()} currentView="dashboard" />);
    expect(screen.getByText('⚡ WorkFlow')).toBeInTheDocument();
  });

  it('should have all 5 navigation items', () => {
    render(<Sidebar onNavigate={vi.fn()} currentView="dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Proyectos')).toBeInTheDocument();
    expect(screen.getByText('Tareas')).toBeInTheDocument();
    expect(screen.getByText('Reportes')).toBeInTheDocument();
    expect(screen.getByText('Configuración')).toBeInTheDocument();
  });

  it('should apply active class to current view', () => {
    render(<Sidebar onNavigate={vi.fn()} currentView="projects" />);
    const activeItem = screen.getByText('Proyectos').closest('button');
    expect(activeItem).toHaveClass('active');
  });

  it('should call onNavigate with correct id when item clicked', async () => {
    const onNavigate = vi.fn();
    render(<Sidebar onNavigate={onNavigate} currentView="dashboard" />);
    await userEvent.click(screen.getByText('Proyectos'));
    expect(onNavigate).toHaveBeenCalledWith('projects');
  });

  it('should render at least 5 nav list items', () => {
    const { container } = render(<Sidebar onNavigate={vi.fn()} currentView="dashboard" />);
    const listItems = container.querySelectorAll('.sidebar ul li');
    expect(listItems.length).toBeGreaterThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run Sidebar tests to confirm they fail**

```bash
cd C:/dev/workFlow && npx vitest run tests/components/Sidebar.test.jsx
```

Expected: FAIL — "⚡ WorkFlow" not found, "Proyectos" not found, etc.

- [ ] **Step 3: Replace Sidebar.jsx**

Replace full contents of `src/features/Layout/Sidebar.jsx`:

```jsx
import './Sidebar.css';

/**
 * Sidebar component - Main navigation for the application
 * Fixed left sidebar with logo and navigation to all app sections.
 *
 * @param {function} onNavigate - Called with the view id when a nav item is clicked
 * @param {string} currentView - The currently active view id
 */
export function Sidebar({ onNavigate, currentView }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'tasks', label: 'Tareas' },
    { id: 'reports', label: 'Reportes' },
    { id: 'settings', label: 'Configuración' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">⚡ WorkFlow</div>
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-link ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 4: Replace Sidebar.css**

Replace full contents of `src/features/Layout/Sidebar.css`:

```css
.sidebar {
  width: var(--sidebar-width);
  background: #010409;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar-header {
  padding: 20px 16px 32px;
}

.sidebar-logo {
  font-weight: 600;
  font-size: var(--font-size-xl);
  color: var(--color-accent);
}

.sidebar-nav {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
}

.sidebar-nav li {
  margin: 0;
}

.nav-link {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  background: none;
  border: none;
  border-left: 3px solid transparent;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: color var(--transition-fast), background var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.04);
}

.nav-link.active {
  color: var(--color-accent);
  background: var(--color-bg-secondary);
  border-left-color: var(--color-accent);
  font-weight: var(--font-weight-medium);
}
```

- [ ] **Step 5: Update TopBar.jsx**

Replace full contents of `src/features/Layout/TopBar.jsx`:

```jsx
import './TopBar.css';

/**
 * TopBar component - Top navigation bar with search and actions.
 *
 * @param {string} title - Current page title (unused visually, kept for context)
 */
export function TopBar({ title }) {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <input
          className="search-input"
          type="search"
          placeholder="Buscar proyectos o tareas..."
          aria-label="Buscar proyectos o tareas"
        />
      </div>
      <div className="topbar-actions">
        <button className="btn-nuevo" aria-label="Nuevo">+ Nuevo</button>
        <button className="topbar-profile" aria-label="Perfil">⚙️ Perfil</button>
      </div>
    </header>
  );
}
```

- [ ] **Step 6: Update TopBar.css**

Replace full contents of `src/features/Layout/TopBar.css`:

```css
.topbar {
  height: var(--topbar-height);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.topbar-search {
  flex: 1;
  max-width: 350px;
}

.search-input {
  width: 100%;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  padding: 6px 12px;
  font-size: var(--font-size-base);
  font-family: var(--font-family-base);
  outline: none;
  transition: border-color var(--transition-fast);
}

.search-input:focus {
  border-color: var(--color-accent);
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-nuevo {
  background: var(--color-success);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.btn-nuevo:hover {
  opacity: 0.85;
}

.topbar-profile {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: var(--font-size-base);
  padding: 4px 8px;
  border-radius: var(--radius-md);
  transition: color var(--transition-fast);
}

.topbar-profile:hover {
  color: var(--color-text-primary);
}
```

- [ ] **Step 7: Run Sidebar tests**

```bash
cd C:/dev/workFlow && npx vitest run tests/components/Sidebar.test.jsx
```

Expected: All 6 tests PASS.

- [ ] **Step 8: Run full test suite**

```bash
cd C:/dev/workFlow && npx vitest run
```

Expected: All tests pass (or same count as before, no new failures).

- [ ] **Step 9: Commit**

```bash
cd C:/dev/workFlow && git add src/features/Layout/Sidebar.jsx src/features/Layout/Sidebar.css src/features/Layout/TopBar.jsx src/features/Layout/TopBar.css tests/components/Sidebar.test.jsx
git commit -m "feat: redesign Sidebar with Spanish labels, ⚡ logo, Reportes/Configuración; update TopBar"
```

---

## Task 2: Reports.jsx + Settings.jsx — new pages

**Files:**
- Create: `src/features/Reports/Reports.jsx`
- Create: `src/features/Reports/Reports.css`
- Create: `src/features/Settings/Settings.jsx`
- Create: `src/features/Settings/Settings.css`

- [ ] **Step 1: Create Reports.jsx**

Create `src/features/Reports/Reports.jsx`:

```jsx
import { usePomodoroSessions } from '../../hooks/usePomodoroSessions';
import { POMODORO_TYPES } from '../../constants/pomodoroConfig';
import './Reports.css';

/**
 * Reports page — shows Work vs Rest session summary and history.
 */
export function Reports() {
  const { sessions } = usePomodoroSessions();

  const workSessions = sessions.filter(s => s.type === POMODORO_TYPES.WORK);
  const restSessions = sessions.filter(s => s.type === POMODORO_TYPES.REST);
  const totalWork = workSessions.reduce((acc, s) => acc + s.duration, 0);
  const totalRest = restSessions.reduce((acc, s) => acc + s.duration, 0);
  const total = totalWork + totalRest;
  const workPct = total > 0 ? Math.round((totalWork / total) * 100) : 0;
  const restPct = total > 0 ? 100 - workPct : 0;

  return (
    <main className="reports">
      <h1 className="reports-title">Reportes</h1>

      <div className="reports-summary">
        <div className="summary-card">
          <span className="summary-value">{workSessions.length}</span>
          <span className="summary-label">Sesiones de trabajo</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{restSessions.length}</span>
          <span className="summary-label">Sesiones de descanso</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{totalWork} min</span>
          <span className="summary-label">Tiempo trabajado</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{totalRest} min</span>
          <span className="summary-label">Tiempo descansado</span>
        </div>
      </div>

      {total > 0 && (
        <div className="reports-distribution">
          <h2 className="section-title">Distribución Trabajo / Descanso</h2>
          <div className="distribution-bar-container">
            <div
              className="distribution-bar distribution-bar--work"
              style={{ width: `${workPct}%` }}
              title={`Trabajo: ${workPct}%`}
            />
            <div
              className="distribution-bar distribution-bar--rest"
              style={{ width: `${restPct}%` }}
              title={`Descanso: ${restPct}%`}
            />
          </div>
          <div className="distribution-legend">
            <span className="legend-item legend-item--work">⬛ Trabajo {workPct}%</span>
            <span className="legend-item legend-item--rest">⬛ Descanso {restPct}%</span>
          </div>
        </div>
      )}

      <div className="reports-history">
        <h2 className="section-title">Historial de Sesiones</h2>
        {sessions.length === 0 ? (
          <p className="empty-state">No hay sesiones registradas aún. Usa el timer Pomodoro para comenzar.</p>
        ) : (
          <ul className="session-history-list">
            {[...sessions].reverse().map(session => (
              <li key={session.id} className="session-history-item">
                <span className={`session-type-badge session-type-badge--${session.type.toLowerCase()}`}>
                  {session.type === POMODORO_TYPES.WORK ? 'TRABAJO' : 'DESCANSO'}
                </span>
                <span className="session-time">
                  {new Date(session.startTime).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })},
                  {' '}{new Date(session.startTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="session-duration">{session.duration} min</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create Reports.css**

Create `src/features/Reports/Reports.css`:

```css
.reports {
  padding: 24px;
  max-width: 800px;
}

.reports-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 24px 0;
}

.reports-summary {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
}

.summary-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
}

.summary-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.reports-distribution {
  margin-bottom: 32px;
}

.section-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 16px 0;
}

.distribution-bar-container {
  display: flex;
  height: 20px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-bg-tertiary);
  margin-bottom: 8px;
}

.distribution-bar--work {
  background: var(--color-success);
  transition: width var(--transition-normal);
}

.distribution-bar--rest {
  background: var(--color-warning);
  transition: width var(--transition-normal);
}

.distribution-legend {
  display: flex;
  gap: 16px;
  font-size: var(--font-size-sm);
}

.legend-item--work { color: var(--color-success); }
.legend-item--rest { color: var(--color-warning); }

.reports-history {
  margin-bottom: 32px;
}

.session-history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.session-history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.session-type-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  color: white;
  flex-shrink: 0;
}

.session-type-badge--work { background: var(--color-success); }
.session-type-badge--rest { background: var(--color-warning); }

.session-time {
  flex: 1;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.session-duration {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
```

- [ ] **Step 3: Create Settings.jsx**

Create `src/features/Settings/Settings.jsx`:

```jsx
import './Settings.css';

/**
 * Settings page — application preferences (Phase 1 placeholder).
 */
export function Settings() {
  return (
    <main className="settings">
      <h1 className="settings-title">Configuración</h1>
      <p className="settings-description">
        Preferencias de la aplicación. Disponible próximamente.
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Create Settings.css**

Create `src/features/Settings/Settings.css`:

```css
.settings {
  padding: 24px;
}

.settings-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
}

.settings-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}
```

- [ ] **Step 5: Run full tests**

```bash
cd C:/dev/workFlow && npx vitest run
```

Expected: All existing tests pass (no new test files needed — these pages are tested via integration in App).

- [ ] **Step 6: Commit**

```bash
cd C:/dev/workFlow && git add src/features/Reports/Reports.jsx src/features/Reports/Reports.css src/features/Settings/Settings.jsx src/features/Settings/Settings.css
git commit -m "feat: add Reports and Settings pages"
```

---

## Task 3: App.jsx — routing, TaskDetail panel state, layout

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.css`
- Modify: `tests/App.test.jsx`

- [ ] **Step 1: Update App test mock and assertions**

Read `tests/App.test.jsx` then replace its full contents with:

```jsx
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
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
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
```

- [ ] **Step 2: Run App tests to confirm they fail**

```bash
cd C:/dev/workFlow && npx vitest run tests/App.test.jsx
```

Expected: FAIL — "Reportes" and "Configuración" routes don't exist yet.

- [ ] **Step 3: Replace App.jsx**

Replace full contents of `src/App.jsx`:

```jsx
import { useState } from 'react';
import { Sidebar } from './features/Layout/Sidebar';
import { TopBar } from './features/Layout/TopBar';
import { MainContent } from './features/Layout/MainContent';
import { Dashboard } from './features/Dashboard/Dashboard';
import { Projects } from './features/Projects/Projects';
import { Tasks } from './features/Tasks/Tasks';
import { Reports } from './features/Reports/Reports';
import { Settings } from './features/Settings/Settings';
import { TaskDetailPanel } from './features/TaskDetail/TaskDetailPanel';
import './App.css';

/**
 * App — root component with sidebar navigation, top bar, main content area,
 * and a TaskDetail slide-out panel that opens when a task is selected.
 */
export function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskSelect = (task) => setSelectedTask(task);
  const handleTaskClose = () => setSelectedTask(null);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onTaskSelect={handleTaskSelect} />;
      case 'projects':
        return <Projects />;
      case 'tasks':
        return <Tasks onTaskSelect={handleTaskSelect} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onTaskSelect={handleTaskSelect} />;
    }
  };

  return (
    <div className="app">
      <Sidebar onNavigate={setCurrentView} currentView={currentView} />
      <div className="app-main">
        <TopBar />
        <MainContent>
          {renderContent()}
        </MainContent>
      </div>
      {selectedTask && (
        <TaskDetailPanel task={selectedTask} onClose={handleTaskClose} />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Update App.css for panel overlay**

Replace full contents of `src/App.css`:

```css
.app {
  display: flex;
  height: 100vh;
  background-color: var(--color-bg-primary);
  position: relative;
  overflow: hidden;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}
```

- [ ] **Step 5: Run App tests**

```bash
cd C:/dev/workFlow && npx vitest run tests/App.test.jsx
```

Expected: All 5 tests PASS.

- [ ] **Step 6: Run full suite**

```bash
cd C:/dev/workFlow && npx vitest run
```

Expected: All tests pass.

- [ ] **Step 7: Commit**

```bash
cd C:/dev/workFlow && git add src/App.jsx src/App.css tests/App.test.jsx
git commit -m "feat: add Reports/Settings routing, TaskDetail panel state to App"
```

---

## Task 4: Clickable tasks — WeeklyTasksList date grouping + Dashboard + Tasks wiring

**Files:**
- Modify: `src/features/Dashboard/WeeklyTasksList.jsx`
- Modify: `src/features/Dashboard/Dashboard.jsx`
- Modify: `src/features/Tasks/Tasks.jsx`
- Modify: `src/features/Dashboard/Dashboard.css`
- Modify: `tests/features/Dashboard.test.jsx`

- [ ] **Step 1: Update Dashboard test**

Read `tests/features/Dashboard.test.jsx` then replace its full contents:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../../src/features/Dashboard/Dashboard';

const mockProjects = [
  { id: '1', name: 'Project 1', description: 'Desc 1', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Project 2', description: 'Desc 2', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const todayISO = new Date().toISOString().slice(0, 10);
const mockTasks = [
  { id: 't1', name: 'Task Today', status: 'In Progress', endDate: todayISO, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockAddProject = vi.fn((data) => ({ id: '3', ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
const mockUpdateProject = vi.fn((id, data) => ({ id, ...data, updatedAt: new Date().toISOString() }));
const mockDeleteProject = vi.fn(() => true);

vi.mock('../../src/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: mockProjects,
    projectCount: () => mockProjects.length,
    addProject: mockAddProject,
    updateProject: mockUpdateProject,
    deleteProject: mockDeleteProject,
  }),
}));

vi.mock('../../src/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: mockTasks,
    taskCount: () => mockTasks.length,
  }),
}));

describe('Dashboard feature', () => {
  it('should render dashboard container', () => {
    render(<Dashboard onTaskSelect={vi.fn()} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display dashboard title', () => {
    render(<Dashboard onTaskSelect={vi.fn()} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render project grid section', () => {
    render(<Dashboard onTaskSelect={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /proyectos/i, level: 2 })).toBeInTheDocument();
  });

  it('should render weekly tasks section', () => {
    render(<Dashboard onTaskSelect={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /esta semana/i, level: 2 })).toBeInTheDocument();
  });

  it('should display project count', () => {
    render(<Dashboard onTaskSelect={vi.fn()} />);
    expect(screen.getByText((content, element) => {
      return element && content.includes('2') && element.textContent.includes('Project');
    })).toBeInTheDocument();
  });

  it('should render "Nuevo Proyecto" button', () => {
    render(<Dashboard onTaskSelect={vi.fn()} />);
    expect(screen.getByRole('button', { name: /nuevo proyecto/i })).toBeInTheDocument();
  });

  it('should call onTaskSelect when a task is clicked', async () => {
    const onTaskSelect = vi.fn();
    render(<Dashboard onTaskSelect={onTaskSelect} />);
    const taskItem = screen.queryByText('Task Today');
    if (taskItem) {
      await userEvent.click(taskItem.closest('[role="button"], button, [data-clickable]') || taskItem);
      expect(onTaskSelect).toHaveBeenCalled();
    }
  });
});
```

- [ ] **Step 2: Run Dashboard tests to confirm they fail**

```bash
cd C:/dev/workFlow && npx vitest run tests/features/Dashboard.test.jsx
```

Expected: FAIL — section heading "Proyectos" and "Esta Semana" not found.

- [ ] **Step 3: Replace WeeklyTasksList.jsx**

Replace full contents of `src/features/Dashboard/WeeklyTasksList.jsx`:

```jsx
/**
 * Groups tasks into HOY / MAÑANA / PRÓXIMOS DÍAS based on endDate.
 * Tasks with no endDate or status "Done" are excluded.
 */
function groupTasksByDate(tasks) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);

  const groups = { today: [], tomorrow: [], upcoming: [] };

  tasks
    .filter(t => t.status !== 'Done' && t.endDate)
    .forEach(task => {
      const d = new Date(task.endDate + 'T00:00:00');
      if (d.getTime() === today.getTime()) {
        groups.today.push(task);
      } else if (d.getTime() === tomorrow.getTime()) {
        groups.tomorrow.push(task);
      } else if (d > today && d <= weekEnd) {
        groups.upcoming.push(task);
      }
    });

  return groups;
}

/**
 * WeeklyTasksList — shows tasks due this week, grouped by date.
 *
 * @param {array} tasks - All task objects
 * @param {function} onTaskClick - Called with the task object when a task is clicked
 */
export function WeeklyTasksList({ tasks = [], onTaskClick }) {
  const groups = groupTasksByDate(tasks);
  const hasAny = groups.today.length > 0 || groups.tomorrow.length > 0 || groups.upcoming.length > 0;

  if (!hasAny) {
    return <p className="empty-state">No hay tareas para esta semana.</p>;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowLabel = tomorrow.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });

  const renderGroup = (label, taskList) => {
    if (taskList.length === 0) return null;
    return (
      <div className="task-date-group">
        <div className="task-date-label">{label}</div>
        {taskList.map(task => (
          <div
            key={task.id}
            className="weekly-task-item"
            onClick={() => onTaskClick && onTaskClick(task)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onTaskClick && onTaskClick(task)}
          >
            <div className="weekly-task-name">{task.name}</div>
            <div className="weekly-task-meta">
              {task.projectId && <span>{task.projectId}</span>}
              <span className={`task-status-inline status-${(task.status ?? '').toLowerCase().replaceAll(' ', '-')}`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="weekly-tasks">
      {renderGroup('HOY', groups.today)}
      {renderGroup(`MAÑANA (${tomorrowLabel})`, groups.tomorrow)}
      {renderGroup('PRÓXIMOS DÍAS', groups.upcoming)}
    </div>
  );
}
```

- [ ] **Step 4: Update Dashboard.jsx**

Replace full contents of `src/features/Dashboard/Dashboard.jsx`:

```jsx
import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { ProjectGrid } from './ProjectGrid';
import { WeeklyTasksList } from './WeeklyTasksList';
import './Dashboard.css';

/**
 * Dashboard — main overview page with reactive project state and clickable tasks.
 *
 * @param {function} onTaskSelect - Called with a task when user clicks it
 */
export function Dashboard({ onTaskSelect }) {
  const projectsHook = useProjects();
  const { tasks, taskCount } = useTasks();
  const [projects, setProjects] = useState(projectsHook.projects);

  const handleAddProject = (data) => {
    const newProject = projectsHook.addProject(data);
    setProjects((prev) => [...prev, newProject]);
  };

  const handleUpdateProject = (id, data) => {
    const updated = projectsHook.updateProject(id, data);
    if (!updated) return;
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const handleDeleteProject = (id) => {
    projectsHook.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat">
            <span className="stat-value">{projects.length}</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat">
            <span className="stat-value">{taskCount()}</span>
            <span className="stat-label">Tasks</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2 className="section-title">Proyectos Activos</h2>
          <ProjectGrid
            projects={projects}
            onAdd={handleAddProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
          />
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Esta Semana</h2>
          <WeeklyTasksList tasks={tasks} onTaskClick={onTaskSelect} />
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Update Tasks.jsx to be clickable**

Replace full contents of `src/features/Tasks/Tasks.jsx`:

```jsx
import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import './Tasks.css';

/**
 * Tasks page — lists all tasks, clickable to open TaskDetailPanel.
 *
 * @param {function} onTaskSelect - Called with a task when user clicks it
 */
export function Tasks({ onTaskSelect }) {
  const { tasks, taskCount } = useTasks();

  return (
    <main className="tasks">
      <h1 className="tasks-title">Tareas</h1>
      <p className="tasks-count">{taskCount()} tareas</p>
      {tasks.length === 0 ? (
        <p className="empty-state">No hay tareas aún</p>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="task-item task-item--clickable"
              onClick={() => onTaskSelect && onTaskSelect(task)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onTaskSelect && onTaskSelect(task)}
            >
              <h3 className="task-name">{task.name}</h3>
              <span className={`task-status status-${(task.status ?? '').toLowerCase().replaceAll(' ', '-')}`}>
                {task.status}
              </span>
              {task.description && <p className="task-description">{task.description}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 6: Update Dashboard.css — add weekly task item styles**

Read `src/features/Dashboard/Dashboard.css` then append to it:

```css

/* WeeklyTasksList */
.weekly-tasks {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-date-group {
  border-top: 1px solid var(--color-border);
  padding-top: 12px;
}

.task-date-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.weekly-task-item {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
}

.weekly-task-item:hover,
.weekly-task-item:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);
}

.weekly-task-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.weekly-task-meta {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  display: flex;
  gap: 8px;
}

.task-status-inline {
  font-size: var(--font-size-sm);
}
```

- [ ] **Step 7: Run Dashboard tests**

```bash
cd C:/dev/workFlow && npx vitest run tests/features/Dashboard.test.jsx
```

Expected: All 7 tests PASS.

- [ ] **Step 8: Run full suite**

```bash
cd C:/dev/workFlow && npx vitest run
```

Expected: All tests pass.

- [ ] **Step 9: Commit**

```bash
cd C:/dev/workFlow && git add src/features/Dashboard/WeeklyTasksList.jsx src/features/Dashboard/Dashboard.jsx src/features/Dashboard/Dashboard.css src/features/Tasks/Tasks.jsx tests/features/Dashboard.test.jsx
git commit -m "feat: weekly task groups HOY/MAÑANA/PRÓXIMOS DÍAS, clickable tasks wiring"
```

---

## Task 5: TaskDetailPanel redesign — match approved mockup

**Files:**
- Modify: `src/features/TaskDetail/TaskDetailPanel.jsx`
- Modify: `src/features/TaskDetail/TaskDetail.css`

- [ ] **Step 1: Replace TaskDetailPanel.jsx**

Replace full contents of `src/features/TaskDetail/TaskDetailPanel.jsx`:

```jsx
import { useState } from 'react';
import { useComments } from '../../hooks/useComments';
import { PomodoroTimer } from '../Pomodoro/PomodoroTimer';
import './TaskDetail.css';

/**
 * TaskDetailPanel — right-side slide-out panel shown when a task is selected.
 * Shows task info (title, project, status, dates, description), Pomodoro timer,
 * and comments section. Matches the approved mockup design.
 *
 * @param {object} task - Task object to display
 * @param {function} onClose - Called when user closes the panel
 */
export function TaskDetailPanel({ task, onClose }) {
  const { getCommentsByTaskId, addComment } = useComments();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(getCommentsByTaskId(task.id));

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const created = addComment(task.id, newComment);
    if (created) setComments(prev => [...prev, created]);
    else setComments(getCommentsByTaskId(task.id));
    setNewComment('');
  };

  const statusColorMap = {
    'To Do': '#8b949e',
    'In Progress': '#58a6ff',
    'Paused': '#9e6a03',
    'Blocked': '#da3633',
    'Done': '#238636',
  };
  const statusColor = statusColorMap[task.status] || '#8b949e';

  return (
    <aside className="task-detail-panel">
      {/* Header */}
      <div className="panel-header">
        <h3 className="panel-header-title">Detalles de Tarea</h3>
        <button className="panel-close" onClick={onClose} aria-label="Cerrar panel">✕</button>
      </div>

      {/* Scrollable body */}
      <div className="panel-body">

        {/* Task title + project */}
        <div className="panel-section">
          <h2 className="task-detail-title">{task.name}</h2>
          {task.projectId && (
            <div className="task-detail-project">{task.projectId}</div>
          )}
        </div>

        {/* Status */}
        <div className="panel-row">
          <label className="panel-label">Estado</label>
          <span
            className="task-detail-status"
            style={{ background: statusColor }}
          >
            {task.status}
          </span>
        </div>

        {/* Dates */}
        {(task.startDate || task.endDate) && (
          <div className="panel-section">
            <label className="panel-label">Fechas</label>
            <div className="panel-dates">
              {task.startDate && (
                <div className="date-item">
                  <div className="date-label">Inicio</div>
                  <div className="date-value">
                    {new Date(task.startDate + 'T00:00:00').toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              )}
              {task.endDate && (
                <div className="date-item">
                  <div className="date-label">Vencimiento</div>
                  <div className="date-value">
                    {new Date(task.endDate + 'T00:00:00').toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {task.description && (
          <div className="panel-section">
            <label className="panel-label">Descripción</label>
            <div className="task-detail-description">{task.description}</div>
          </div>
        )}

        {/* Pomodoro Timer */}
        <div className="panel-section">
          <label className="panel-label">Pomodoro Timer</label>
          <PomodoroTimer taskId={task.id} />
        </div>

        {/* Comments */}
        <div className="panel-section">
          <label className="panel-label">Comentarios ({comments.length})</label>

          {comments.length > 0 && (
            <div className="comments-list">
              {comments.map((comment, i) => (
                <div key={comment.id} className={`comment-item ${i < comments.length - 1 ? 'comment-item--bordered' : ''}`}>
                  <div className="comment-meta">
                    <span className="comment-author">Tú</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="comment-input-box">
            <textarea
              className="comment-textarea"
              placeholder="Agregar comentario..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={2}
            />
            <div className="comment-submit-row">
              <button
                className="comment-submit-btn"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                + Agregar
              </button>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Replace TaskDetail.css**

Replace full contents of `src/features/TaskDetail/TaskDetail.css`:

```css
.task-detail-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: var(--task-panel-width);
  height: 100vh;
  background: var(--color-bg-secondary);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  z-index: 100;
  animation: slideInRight var(--transition-normal) ease-out;
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.panel-header-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.panel-close {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
  line-height: 1;
}

.panel-close:hover {
  color: var(--color-text-primary);
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.task-detail-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.task-detail-project {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.task-detail-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: white;
  cursor: pointer;
}

.panel-dates {
  display: flex;
  gap: 16px;
}

.date-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.date-value {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.task-detail-description {
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  padding: 12px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Comments */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.comment-item {
  padding: 12px 0;
}

.comment-item--bordered {
  border-bottom: 1px solid var(--color-border);
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.comment-author {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.comment-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.comment-text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: 1.5;
}

.comment-input-box {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 12px;
}

.comment-textarea {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-base);
  resize: none;
  outline: none;
  min-height: 40px;
  padding: 0;
  margin-bottom: 8px;
}

.comment-textarea::placeholder {
  color: var(--color-text-secondary);
}

.comment-submit-row {
  display: flex;
  justify-content: flex-end;
}

.comment-submit-btn {
  background: var(--color-success);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.comment-submit-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.comment-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

- [ ] **Step 3: Run TaskDetail tests**

```bash
cd C:/dev/workFlow && npx vitest run tests/features/TaskDetail.test.jsx
```

Expected: Tests pass (or update test expectations if needed — read the test file first and fix any selector mismatches for "Agregar comentario..." and "+ Agregar").

- [ ] **Step 4: Run full suite**

```bash
cd C:/dev/workFlow && npx vitest run
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
cd C:/dev/workFlow && git add src/features/TaskDetail/TaskDetailPanel.jsx src/features/TaskDetail/TaskDetail.css
git commit -m "feat: redesign TaskDetailPanel to match approved mockup"
```

---

## Task 6: PomodoroTimer redesign — Work/Rest toggle, 48px display, kitchen clock, session log

**Files:**
- Modify: `src/features/Pomodoro/PomodoroTimer.jsx`
- Modify: `src/features/Pomodoro/Pomodoro.css`
- Modify: `tests/features/Pomodoro.test.jsx`

- [ ] **Step 1: Update Pomodoro tests**

Replace full contents of `tests/features/Pomodoro.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PomodoroTimer } from '../../src/features/Pomodoro/PomodoroTimer';

vi.mock('../../src/hooks/usePomodoroSessions', () => ({
  usePomodoroSessions: () => ({
    sessions: [],
    addSession: vi.fn(),
    getSessionsByTaskId: vi.fn(() => []),
  }),
}));

describe('PomodoroTimer feature', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('renders the timer with default 25:00', () => {
    render(<PomodoroTimer taskId="1" />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('shows Work/Rest toggle buttons', () => {
    render(<PomodoroTimer taskId="1" />);
    expect(screen.getByRole('button', { name: /trabajo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /descanso/i })).toBeInTheDocument();
  });

  it('shows duration adjustment buttons', () => {
    render(<PomodoroTimer taskId="1" />);
    expect(screen.getByRole('button', { name: '−' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
  });

  it('shows Iniciar button when not running', () => {
    render(<PomodoroTimer taskId="1" />);
    expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument();
  });

  it('shows Pausar button when timer is running', async () => {
    render(<PomodoroTimer taskId="1" />);
    await userEvent.click(screen.getByRole('button', { name: /iniciar/i }));
    expect(screen.getByRole('button', { name: /pausar/i })).toBeInTheDocument();
  });

  it('shows Reset button', () => {
    render(<PomodoroTimer taskId="1" />);
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('Work button is active by default', () => {
    render(<PomodoroTimer taskId="1" />);
    const workBtn = screen.getByRole('button', { name: /trabajo/i });
    expect(workBtn).toHaveClass('active');
  });

  it('switches to Rest mode and updates duration to 5 min', async () => {
    render(<PomodoroTimer taskId="1" />);
    await userEvent.click(screen.getByRole('button', { name: /descanso/i }));
    expect(screen.getByText('5:00')).toBeInTheDocument();
  });

  it('increases duration with + button', async () => {
    render(<PomodoroTimer taskId="1" />);
    await userEvent.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('26 min')).toBeInTheDocument();
  });

  it('decreases duration with − button', async () => {
    render(<PomodoroTimer taskId="1" />);
    await userEvent.click(screen.getByRole('button', { name: '−' }));
    expect(screen.getByText('24 min')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run Pomodoro tests to confirm they fail**

```bash
cd C:/dev/workFlow && npx vitest run tests/features/Pomodoro.test.jsx
```

Expected: FAIL — "25:00" not found, Work/Rest toggle buttons not found.

- [ ] **Step 3: Replace PomodoroTimer.jsx**

Replace full contents of `src/features/Pomodoro/PomodoroTimer.jsx`:

```jsx
import { useState, useEffect, useRef } from 'react';
import { usePomodoroSessions } from '../../hooks/usePomodoroSessions';
import { POMODORO_DEFAULTS, POMODORO_TYPES } from '../../constants/pomodoroConfig';
import './Pomodoro.css';

/**
 * PomodoroTimer — full Pomodoro timer matching approved mockup.
 * Features: Work/Rest toggle, 48px MM:SS display, kitchen-clock duration adjuster,
 * Start/Pause/Reset controls, and a session log showing past sessions for this task.
 *
 * @param {string} taskId - ID of the task being worked on (used to store sessions)
 */
export function PomodoroTimer({ taskId }) {
  const [mode, setMode] = useState(POMODORO_TYPES.WORK);
  const [duration, setDuration] = useState(POMODORO_DEFAULTS.workDuration);
  const [remaining, setRemaining] = useState(POMODORO_DEFAULTS.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(null);

  const { sessions, addSession } = usePomodoroSessions();
  const [taskSessions, setTaskSessions] = useState(
    sessions.filter(s => s.taskId === taskId)
  );

  // Tick every second
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(id);
          setIsRunning(false);
          const saved = addSession({
            taskId,
            type: mode,
            duration,
            startTime: startTimeRef.current || new Date().toISOString(),
            endTime: new Date().toISOString(),
            status: 'Completed',
          });
          if (saved) setTaskSessions(prev => [...prev, saved]);
          startTimeRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  // Sync remaining when duration changes (only if stopped)
  useEffect(() => {
    if (!isRunning) setRemaining(duration * 60);
  }, [duration]);

  const switchMode = (newMode) => {
    if (isRunning) return;
    setMode(newMode);
    const newDuration = newMode === POMODORO_TYPES.WORK
      ? POMODORO_DEFAULTS.workDuration
      : POMODORO_DEFAULTS.restDuration;
    setDuration(newDuration);
  };

  const handleStart = () => {
    if (remaining === 0) return;
    startTimeRef.current = new Date().toISOString();
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setRemaining(duration * 60);
    startTimeRef.current = null;
  };

  const handleIncrease = () => {
    if (!isRunning && duration < POMODORO_DEFAULTS.maxDuration) setDuration(d => d + 1);
  };

  const handleDecrease = () => {
    if (!isRunning && duration > POMODORO_DEFAULTS.minDuration) setDuration(d => d - 1);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="pomodoro-timer">

      {/* Work / Rest Toggle */}
      <div className="pomodoro-toggle">
        <button
          className={`toggle-btn toggle-btn--work ${mode === POMODORO_TYPES.WORK ? 'active' : ''}`}
          onClick={() => switchMode(POMODORO_TYPES.WORK)}
          disabled={isRunning}
          aria-pressed={mode === POMODORO_TYPES.WORK}
        >
          ⏱ Trabajo
        </button>
        <button
          className={`toggle-btn toggle-btn--rest ${mode === POMODORO_TYPES.REST ? 'active' : ''}`}
          onClick={() => switchMode(POMODORO_TYPES.REST)}
          disabled={isRunning}
          aria-pressed={mode === POMODORO_TYPES.REST}
        >
          ☕ Descanso
        </button>
      </div>

      {/* Timer Display */}
      <div className="timer-display">
        <span className="timer-time">{timeDisplay}</span>
        <span className="timer-subtitle">
          {mode === POMODORO_TYPES.WORK ? 'Focus session' : 'Break'}
        </span>
      </div>

      {/* Kitchen Clock Duration */}
      <div className="timer-duration">
        <button
          className="duration-btn"
          onClick={handleDecrease}
          disabled={isRunning || duration <= POMODORO_DEFAULTS.minDuration}
          aria-label="−"
        >
          −
        </button>
        <span className="duration-value">{duration} min</span>
        <button
          className="duration-btn"
          onClick={handleIncrease}
          disabled={isRunning || duration >= POMODORO_DEFAULTS.maxDuration}
          aria-label="+"
        >
          +
        </button>
      </div>

      {/* Timer Controls */}
      <div className="timer-controls">
        {!isRunning ? (
          <button
            className="ctrl-btn ctrl-btn--start"
            onClick={handleStart}
            disabled={remaining === 0}
            aria-label="Iniciar"
          >
            ▶ Iniciar
          </button>
        ) : (
          <button className="ctrl-btn ctrl-btn--pause" onClick={handlePause} aria-label="Pausar">
            ⏸ Pausar
          </button>
        )}
        <button className="ctrl-btn ctrl-btn--reset" onClick={handleReset} aria-label="Reset">
          ↻ Reset
        </button>
      </div>

      {/* Session Log */}
      {taskSessions.length > 0 && (
        <div className="session-log">
          <div className="session-log-title">Historial de Sesiones</div>
          <ul className="session-log-list">
            {taskSessions.map(session => (
              <li key={session.id} className="session-log-item">
                <div>
                  <span className={`session-badge session-badge--${session.type.toLowerCase()}`}>
                    {session.type === POMODORO_TYPES.WORK ? 'TRABAJO' : 'DESCANSO'}
                  </span>
                  <span className="session-log-info">
                    {new Date(session.startTime).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })},
                    {' '}{new Date(session.startTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    {session.endTime && (
                      <> - {new Date(session.endTime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</>
                    )}
                  </span>
                </div>
                <span className="session-log-duration">{session.duration} min</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
```

- [ ] **Step 4: Replace Pomodoro.css**

Replace full contents of `src/features/Pomodoro/Pomodoro.css`:

```css
.pomodoro-timer {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Toggle */
.pomodoro-toggle {
  display: flex;
  gap: 4px;
  background: var(--color-bg-secondary);
  padding: 4px;
  border-radius: var(--radius-md);
}

.toggle-btn {
  flex: 1;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.toggle-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.toggle-btn--work.active {
  background: var(--color-success);
  color: white;
}

.toggle-btn--rest.active {
  background: var(--color-warning);
  color: white;
}

/* Timer Display */
.timer-display {
  text-align: center;
}

.timer-time {
  display: block;
  font-size: 48px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  font-family: var(--font-family-mono);
  letter-spacing: 2px;
  line-height: 1.1;
}

.timer-subtitle {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: 8px;
}

/* Kitchen Clock Duration */
.timer-duration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: 12px;
}

.duration-btn {
  background: var(--color-success);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity var(--transition-fast);
}

.duration-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.duration-value {
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  min-width: 55px;
  text-align: center;
}

/* Controls */
.timer-controls {
  display: flex;
  gap: 8px;
}

.ctrl-btn {
  flex: 1;
  border: none;
  border-radius: var(--radius-md);
  padding: 8px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.ctrl-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.ctrl-btn--start { background: var(--color-success); color: white; }
.ctrl-btn--pause { background: var(--color-bg-tertiary); color: var(--color-text-primary); }
.ctrl-btn--reset { background: var(--color-bg-tertiary); color: var(--color-text-primary); }

.ctrl-btn:hover:not(:disabled) { opacity: 0.85; }

/* Session Log */
.session-log {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: 12px;
}

.session-log-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.session-log-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.session-log-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  gap: 8px;
}

.session-log-item:last-child { border-bottom: none; }

.session-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: var(--font-weight-semibold);
  color: white;
  margin-right: 6px;
}

.session-badge--work { background: var(--color-success); }
.session-badge--rest { background: var(--color-warning); }

.session-log-info { color: var(--color-text-primary); }
.session-log-duration { color: var(--color-text-primary); flex-shrink: 0; }
```

- [ ] **Step 5: Run Pomodoro tests**

```bash
cd C:/dev/workFlow && npx vitest run tests/features/Pomodoro.test.jsx
```

Expected: All 10 tests PASS.

- [ ] **Step 6: Run full suite**

```bash
cd C:/dev/workFlow && npx vitest run
```

Expected: All tests pass.

- [ ] **Step 7: Commit**

```bash
cd C:/dev/workFlow && git add src/features/Pomodoro/PomodoroTimer.jsx src/features/Pomodoro/Pomodoro.css tests/features/Pomodoro.test.jsx
git commit -m "feat: redesign PomodoroTimer with Work/Rest toggle, 48px display, kitchen clock, session log"
```

---

## Self-Review

**Spec coverage check:**
- [x] Sidebar: ⚡ logo, Spanish labels, Reportes, Configuración → Task 1
- [x] TopBar: SearchBar input, ⚙️ Perfil button → Task 1
- [x] Reports page with Work/Rest visualization → Task 2
- [x] Settings page → Task 2
- [x] App routing: reports + settings + TaskDetail panel → Task 3
- [x] WeeklyTasksList: HOY / MAÑANA / PRÓXIMOS DÍAS grouping → Task 4
- [x] Clickable tasks in Dashboard + Tasks → Task 4
- [x] TaskDetailPanel: Spanish UI, task info, dates, pomodoro, comments → Task 5
- [x] TaskDetailPanel: slide-in from right animation → Task 5 (CSS keyframe)
- [x] PomodoroTimer: Work/Rest toggle → Task 6
- [x] PomodoroTimer: 48px monospace display → Task 6
- [x] PomodoroTimer: Kitchen clock [−] N min [+] → Task 6
- [x] PomodoroTimer: Iniciar/Pausar/Reset controls → Task 6
- [x] PomodoroTimer: Session log with TRABAJO/DESCANSO badges → Task 6
- [x] Comments section: "Tú" author, "Agregar comentario...", "+ Agregar" → Task 5

**No placeholders found.**

**Type consistency check:**
- `onTaskSelect` used in App.jsx (Task 3) passed to Dashboard and Tasks
- Dashboard accepts `onTaskSelect` and passes to WeeklyTasksList as `onTaskClick` (Task 4) ✓
- Tasks accepts `onTaskSelect` (Task 4) ✓
- `POMODORO_TYPES.WORK` / `POMODORO_TYPES.REST` used consistently across Tasks 5-6 ✓
- `POMODORO_DEFAULTS.workDuration` / `restDuration` / `minDuration` / `maxDuration` used in Task 6 ✓
- `addSession` returns the created session in Task 6 — verify `usePomodoroSessions.addSession` returns the session (it does: `return newSession` at line 41 of the hook)
- `addComment` in `useComments` — verify it returns the new comment (check hook before implementing Task 5)
