# WorkFlow App - Phase 1 Design Specification

**Document Version:** 1.0  
**Date:** April 13, 2026  
**Phase:** Phase 1 (MVP)  
**Status:** Design Complete  

---

## Executive Summary

WorkFlow is a personal productivity and workflow management application designed to help users organize projects, manage tasks, track time with Pomodoro timers, and maintain focus during work sessions. This specification defines the complete design for Phase 1, including UI/UX, data model, architecture, and implementation strategy.

**Target Users:** Individual professionals managing multiple projects and tasks  
**Core Value Proposition:** Simple, visual, lightweight project and task management with integrated time tracking  
**Technology Stack:** React, Vite, JavaScript, CSS  
**Data Storage (Phase 1):** JSON files (localStorage migration planned for Phase 2)  

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Visual Design & Layout](#2-visual-design--layout)
3. [Task Detail Panel Design](#3-task-detail-panel-design)
4. [Data Model & Architecture](#4-data-model--architecture)
5. [Project Structure](#5-project-structure)
6. [State Management](#6-state-management)
7. [User Workflows](#7-user-workflows)
8. [Error Handling & Validation](#8-error-handling--validation)
9. [Testing Strategy](#9-testing-strategy)
10. [Phase 1 Scope & Completion Criteria](#10-phase-1-scope--completion-criteria)

---

## 1. Product Overview

### 1.1 Objectives

WorkFlow enables users to:

- **Organize Projects** — Create and manage multiple active projects with dates and descriptions
- **Track Tasks** — Define tasks within projects with clear dates, status, and descriptions
- **Monitor Progress** — View individual task status and overall project health
- **Maintain Comments** — Add timestamped notes and blockers to tasks
- **Time Track** — Use Pomodoro timer for focused work sessions and rest breaks
- **Analyze Effort** — Review session history classified by work vs. rest time

### 1.2 Design Principles

| Principle | Meaning |
|-----------|---------|
| **Simplicity** | Minimal UI, focused on core features. No unnecessary complexity. |
| **Clarity** | Clear visual hierarchy and labeling. Users know what each element does. |
| **Dark Mode** | Reduce eye strain, modern aesthetic inspired by GitHub/Supabase. |
| **Minimalist** | Apple-inspired design. Elegant whitespace, clean typography. |
| **Focused on Productivity** | Every feature supports focused work and time tracking. |

### 1.3 Success Metrics (Phase 1)

- ✅ Core features work end-to-end (create, edit, view, delete projects/tasks)
- ✅ Pomodoro timer logs sessions with classification
- ✅ Data persists across page refreshes
- ✅ Dashboard displays projects and weekly tasks
- ✅ User can manage task status (5 states)
- ✅ Comments appear with timestamps
- ✅ UI matches design mockups (dark mode, minimalist)

---

## 2. Visual Design & Layout

### 2.1 Overall Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR    │             TOP BAR                 │ PROFILE  │
│  (200px)    │   SEARCH   │  + NUEVO  │ FILTERS   │          │
├─────────────┼─────────────────────────────────────┼──────────┤
│             │                                     │          │
│  Dashboard  │                                     │  TASK    │
│  Proyectos  │     MAIN CONTENT AREA              │  DETAIL  │
│  Tareas     │                                     │  PANEL   │
│  Reportes   │   • Projects Overview              │  (380px) │
│  Config     │   • This Week's Tasks              │          │
│             │     (grouped by date)               │          │
│             │                                     │          │
└─────────────┴─────────────────────────────────────┴──────────┘
```

### 2.2 Color Palette (Dark Mode)

| Element | Color | Usage |
|---------|-------|-------|
| **Background** | #0d1117 | Main page background |
| **Cards/Surface** | #161b22 | Component backgrounds |
| **Text Primary** | #c9d1d9 | Main text content |
| **Text Secondary** | #8b949e | Labels, metadata |
| **Accent** | #58a6ff | Links, highlights, active states |
| **Success** | #238636 | Active status, success actions |
| **Warning** | #9e6a03 | Amber, rest/break badge |
| **Danger** | #da3633 | Errors, blocked status |
| **Border** | #30363d | Component dividers |

### 2.3 Sidebar Navigation

**Fixed Left Sidebar:**
- Logo: "⚡ WorkFlow"
- Navigation Items:
  - Dashboard (default)
  - Proyectos
  - Tareas
  - Reportes
  - Configuración
- Active indicator (left border + background highlight)

### 2.4 Top Bar Components

**Search Bar:**
- Placeholder: "Buscar proyectos o tareas..."
- Full-width search (350px suggested)
- Debounced search for performance

**New Button (+Nuevo):**
- Primary green button (#238636)
- Opens dropdown or modal with options:
  - Crear Proyecto
  - Crear Tarea

**Profile Menu:**
- Icon-based (⚙️ or user avatar)
- Settings/profile options (Phase 1+)

### 2.5 Projects Overview Section

**Layout:** Grid of minimal project cards
- **Grid columns:** 3-4 columns, responsive
- **Card size:** 150px × 100px
- **Content per card:**
  - Project name (h3, bold)
  - Status badge (small, colored)
  - Examples: "Active" (green), "On Hold" (amber)

**Interaction:**
- Hover effect: slight shadow/scale
- Click: opens Projects page or project detail (Phase 1+)

### 2.6 Weekly Tasks Section

**Grouping:** Tasks grouped by date
- "HOY" (Today)
- "MAÑANA" (Tomorrow, with date)
- "PRÓXIMOS DÍAS" (Later this week, with date)

**Task Item Layout:**
```
┌────────────────────────────────────┐
│ Task Name                          │
│ Project Name • In Progress         │
└────────────────────────────────────┘
```

**Interaction:**
- Click → opens TaskDetailPanel (slides in from right)
- Visual feedback on hover

### 2.7 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title (h1) | System Sans | 24px | 600 |
| Section Title (h2) | System Sans | 16px | 600 |
| Card Title (h3) | System Sans | 14px | 600 |
| Body Text | System Sans | 13px | 400 |
| Secondary Text | System Sans | 12px | 400 |
| Monospace (timer) | Monaco | 48px | 600 |

**Font Stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### 2.8 Spacing & Layout Grid

- **Base unit:** 8px
- **Common spacing:** 8px, 12px, 16px, 20px, 24px, 32px
- **Card padding:** 16px
- **Container max-width:** Full-width responsive
- **Section gap:** 24px

---

## 3. Task Detail Panel Design

### 3.1 Panel Structure

**Type:** Right-side slide-out panel (fixed position)  
**Width:** 380px  
**Trigger:** Click on any task  
**Close:** Click ✕ or click outside (escape key)  
**Animation:** Smooth slide-in from right (200ms)

### 3.2 Panel Header

```
┌────────────────────────────────────┐
│ Detalles de Tarea          [✕]    │
└────────────────────────────────────┘
```

- Title: "Detalles de Tarea"
- Close button (✕)
- Divider line below

### 3.3 Task Information Section

**Fields Displayed:**
- **Task Title** (h2, large, editable)
- **Project Name** (secondary text, read-only link)
- **Status** (badge/dropdown, editable)
  - Options: To Do, In Progress, Paused, Blocked, Done
  - Color-coded: Green, Blue, Yellow, Red, Gray
- **Dates**
  - Start Date (label + date)
  - End Date (label + date)
- **Description** (larger read-only text area)

### 3.4 Pomodoro Timer Section

**Layout:**

```
┌────────────────────────────────────┐
│ POMODORO TIMER                     │
├────────────────────────────────────┤
│ [⏱ TRABAJO]  [☕ DESCANSO]        │  Work/Rest Toggle
├────────────────────────────────────┤
│             25:00                  │  Timer Display (monospace)
│          Focus session             │  Subtitle
├────────────────────────────────────┤
│    [−]    25 min    [+]           │  Adjust Duration (Kitchen Clock)
├────────────────────────────────────┤
│ [▶ INICIAR] [⏸ PAUSAR] [↻ RESET] │ Timer Controls
├────────────────────────────────────┤
│ HISTORIAL DE SESIONES              │ Session Log Header
│ [TRABAJO] Apr 13, 2:30 PM (25 min)│
│ [DESCANSO] Apr 13, 2:55 PM (10 min)│
│ [TRABAJO] Apr 13, 3:15 PM (25 min)│
└────────────────────────────────────┘
```

**Work/Rest Toggle:**
- Two buttons: "⏱ Trabajo" (green, default) | "☕ Descanso" (amber)
- Active button highlighted
- Switching modes updates default duration

**Timer Display:**
- Large monospace font (48px)
- Format: MM:SS
- Color: Accent blue (#58a6ff)
- Subtitle indicates mode (Focus session / Break)

**Duration Adjustment (Kitchen Clock Style):**
- Left button: "−" (minus, decreases by 1 min)
- Center display: "25 min" (current duration)
- Right button: "+" (plus, increases by 1 min)
- Minimum: 1 minute, Maximum: 60 minutes (configurable)

**Timer Controls:**
- "▶ Iniciar" button (green, starts timer)
- "⏸ Pausar" button (gray, pauses timer)
- "↻ Reset" button (gray, resets to initial duration)

**Session Log:**
- Header: "Historial de Sesiones"
- Classified list of completed sessions:
  - **TRABAJO sessions** (green badge)
  - **DESCANSO sessions** (amber badge)
- Each entry shows: [TIPO] Date Time - Time (Duration)
- Example: `[TRABAJO] Apr 13, 2:30 PM - 2:55 PM (25 min)`
- Scrollable if many sessions
- Latest sessions at bottom (chronological order)

### 3.5 Comments Section

**Layout:**

```
┌────────────────────────────────────┐
│ COMENTARIOS (N)                    │
├────────────────────────────────────┤
│ Tú                    Apr 13, 2:15  │  Comment Header
│ Started Vite setup...              │  Comment Text
├────────────────────────────────────┤
│ Tú                    Apr 13, 4:25  │
│ Config complete. Next: routing     │
├────────────────────────────────────┤
│ ┌──────────────────────────────────┐│  Add Comment Input
│ │ Agregar comentario...            ││
│ └──────────────────────────────────┘│
│        [+ AGREGAR] (align right)    │
└────────────────────────────────────┘
```

**Comment List:**
- Chronological order (oldest first)
- Each comment shows:
  - Author: "Tú" (in Phase 1, single user)
  - Date/Time: "Apr 13, 2:15 PM" (right-aligned)
  - Text: Multi-line support
- Divider between comments

**Add Comment Input:**
- Textarea: "Agregar comentario..." placeholder
- Expands on focus (min-height: 40px, max-height: 120px)
- "+ Agregar" button (green, right-aligned)
- On submit:
  - Timestamp auto-added (current date/time)
  - Comment appears in thread
  - Input cleared
  - Focus returns to input (optional UX refinement)

### 3.6 Panel Scroll Behavior

- Panel content scrollable
- Header and footer sticky? (Optional refinement)
- Smooth scrolling
- Scrollbar styled to match theme

---

## 4. Data Model & Architecture

### 4.1 Entity Definitions

#### PROJECT Entity

```javascript
{
  id: string,              // UUID v4, generated with generateId()
  name: string,            // Required, min 1 character
  description: string,     // Optional
  startDate: string,       // ISO date format: YYYY-MM-DD
  endDate: string,         // ISO date format: YYYY-MM-DD
  status: string,          // Enum: "Active" | "On Hold" | "Completed" | "Archived"
  createdAt: string,       // ISO timestamp: YYYY-MM-DDTHH:mm:ssZ
  updatedAt: string        // ISO timestamp: YYYY-MM-DDTHH:mm:ssZ
}
```

#### TASK Entity

```javascript
{
  id: string,              // UUID v4, generated with generateId()
  projectId: string,       // Foreign key to Project.id (required)
  name: string,            // Required, min 1 character
  description: string,     // Optional
  startDate: string,       // ISO date format: YYYY-MM-DD
  endDate: string,         // ISO date format: YYYY-MM-DD
  status: string,          // Enum: "To Do" | "In Progress" | "Paused" | "Blocked" | "Done"
  createdAt: string,       // ISO timestamp
  updatedAt: string        // ISO timestamp
}
```

**Note:** Task entity does NOT contain nested comments or pomodoro sessions. These are stored as separate entities with `taskId` foreign key.

#### COMMENT Entity

```javascript
{
  id: string,              // UUID v4, generated with generateId()
  taskId: string,          // Foreign key to Task.id (required)
  text: string,            // Comment content (required, min 1 character)
  createdAt: string        // ISO timestamp
}
```

#### POMODOROSESSION Entity

```javascript
{
  id: string,              // UUID v4, generated with generateId()
  taskId: string,          // Foreign key to Task.id (required)
  type: string,            // Enum: "Work" | "Rest"
  duration: number,        // In minutes (min 1, max 60)
  startTime: string,       // ISO timestamp when session started
  endTime: string,         // ISO timestamp when session ended
  status: string           // Enum: "Completed" | "Abandoned"
}
```

### 4.2 Entity Relationships

```
┌─────────────┐         ┌──────────┐
│  PROJECT    │◄─────┬──│  TASK    │
│ id (PK)     │      │  │ id (PK)  │
└─────────────┘      │  │ projectId│ (FK)
                     │  └──────────┘
                     │
                     ├───────┬──────────────┐
                     │       │              │
                  TASK (1)  (Many)         (Many)
                     │       │              │
                     ▼       ▼              ▼
                  ┌─────────────────┐ ┌──────────────────┐
                  │ COMMENT         │ │ POMODOROSESSION  │
                  │ id (PK)         │ │ id (PK)          │
                  │ taskId (FK) ───┘ │ taskId (FK) ────┘
                  └─────────────────┘ └──────────────────┘
```

**Relationship Types:**
- Project (1) → (Many) Task: One project has many tasks
- Task (1) → (Many) Comment: One task has many comments
- Task (1) → (Many) PomodoroSession: One task has many Pomodoro sessions

**Querying Related Data:**
- Get all comments for a task: Filter `comments.json` where `taskId === taskId`
- Get all sessions for a task: Filter `pomodoroSessions.json` where `taskId === taskId`
- Get all tasks for a project: Filter `tasks.json` where `projectId === projectId`

### 4.3 Normalized Data Storage

**Storage Location:** `src/data/storage/`

**Files:**

1. **projects.json** — Array of Project entities
   ```json
   [
     { "id": "uuid-1", "name": "WorkFlow Dev", "status": "Active", ... },
     { "id": "uuid-2", "name": "Learning React", "status": "On Hold", ... }
   ]
   ```

2. **tasks.json** — Array of Task entities
   ```json
   [
     { "id": "uuid-10", "projectId": "uuid-1", "name": "Setup React", ... },
     { "id": "uuid-11", "projectId": "uuid-1", "name": "Design Dashboard", ... }
   ]
   ```

3. **comments.json** — Array of Comment entities
   ```json
   [
     { "id": "uuid-20", "taskId": "uuid-10", "text": "Started Vite setup...", ... },
     { "id": "uuid-21", "taskId": "uuid-10", "text": "Config complete...", ... }
   ]
   ```

4. **pomodoroSessions.json** — Array of PomodoroSession entities
   ```json
   [
     { "id": "uuid-30", "taskId": "uuid-10", "type": "Work", "duration": 25, ... },
     { "id": "uuid-31", "taskId": "uuid-10", "type": "Rest", "duration": 5, ... }
   ]
   ```

### 4.4 ID Generation Strategy

**Utility Function:** `src/utils/idGenerator.js`

```javascript
/**
 * Generate a unique identifier using crypto.randomUUID()
 * Returns a v4 UUID string (36 characters with hyphens)
 *
 * @returns {string} UUID v4 identifier
 * @example "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Generate multiple IDs at once
 * @param {number} count - Number of IDs to generate
 * @returns {string[]} Array of UUID identifiers
 */
export function generateIds(count) {
  return Array.from({ length: count }, () => crypto.randomUUID());
}
```

**Advantages:**
- ✅ Built-in to JavaScript (crypto.randomUUID())
- ✅ Generates v4 UUIDs (random, globally unique)
- ✅ No external dependencies
- ✅ Works in modern browsers and Node.js
- ✅ Deterministic and collision-resistant
- ✅ Human-readable and easy to debug

**Browser Support:** Chrome 92+, Firefox 76+, Safari 15.1+, Edge 92+

### 4.5 Constants & Enums

**Location:** `src/constants/`

**Files:**

**taskStatus.js**
```javascript
export const TASK_STATUS = {
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  PAUSED: 'Paused',
  BLOCKED: 'Blocked',
  DONE: 'Done',
};

export const TASK_STATUS_COLORS = {
  'To Do': '#8b949e',
  'In Progress': '#58a6ff',
  'Paused': '#9e6a03',
  'Blocked': '#da3633',
  'Done': '#238636',
};

export const TASK_DEFAULTS = {
  status: 'To Do',
};
```

**projectStatus.js**
```javascript
export const PROJECT_STATUS = {
  ACTIVE: 'Active',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
};

export const PROJECT_STATUS_COLORS = {
  'Active': '#238636',
  'On Hold': '#9e6a03',
  'Completed': '#6e40aa',
  'Archived': '#30363d',
};
```

**pomodoroConfig.js**
```javascript
export const POMODORO_TYPES = {
  WORK: 'Work',
  REST: 'Rest',
};

export const POMODORO_DEFAULTS = {
  workDuration: 25,      // minutes
  restDuration: 5,       // minutes
  longRestDuration: 15,  // after 4 cycles (Phase 2+)
  minDuration: 1,        // minimum minutes
  maxDuration: 60,       // maximum minutes
};

export const POMODORO_STATUS = {
  COMPLETED: 'Completed',
  ABANDONED: 'Abandoned',
};
```

---

## 5. Project Structure

### 5.1 Feature-Based Architecture

```
workflow-app/
src/
├── features/                          # Feature-based modules
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── ProjectGrid.jsx
│   │   ├── WeeklyTasksList.jsx
│   │   └── Dashboard.css
│   │
│   ├── Projects/
│   │   ├── Projects.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectList.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── ProjectForm.jsx
│   │   └── Projects.css
│   │
│   ├── Tasks/
│   │   ├── Tasks.jsx
│   │   ├── TaskListItem.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskFilter.jsx
│   │   ├── TaskForm.jsx
│   │   └── Tasks.css
│   │
│   ├── TaskDetail/
│   │   ├── TaskDetailPanel.jsx
│   │   ├── TaskInfo.jsx
│   │   └── TaskDetail.css
│   │
│   ├── Pomodoro/
│   │   ├── PomodoroTimer.jsx
│   │   ├── WorkRestToggle.jsx
│   │   ├── TimerDisplay.jsx
│   │   ├── TimerControls.jsx
│   │   ├── SessionLog.jsx
│   │   └── Pomodoro.css
│   │
│   ├── Comments/
│   │   ├── CommentThread.jsx
│   │   ├── CommentList.jsx
│   │   ├── CommentItem.jsx
│   │   ├── CommentInput.jsx
│   │   └── Comments.css
│   │
│   ├── Reports/
│   │   ├── Reports.jsx
│   │   └── Reports.css
│   │
│   └── Settings/
│       ├── Settings.jsx
│       └── Settings.css
│
├── components/                        # Shared/Common components
│   ├── Layout/
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── MainContent.jsx
│   │   └── Layout.css
│   │
│   └── Common/
│       ├── Button.jsx
│       ├── Modal.jsx
│       ├── Badge.jsx
│       ├── SearchBar.jsx
│       └── Common.css
│
├── data/                              # Data layer
│   ├── entities/
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── Comment.js
│   │   └── PomodoroSession.js
│   │
│   └── storage/
│       ├── projects.json
│       ├── tasks.json
│       ├── comments.json
│       └── pomodoroSessions.json
│
├── hooks/                             # Custom React hooks
│   ├── useProjects.js
│   ├── useTasks.js
│   ├── useComments.js
│   ├── usePomodoroSessions.js
│   ├── usePomodoroTimer.js
│   └── useLocalStorage.js
│
├── styles/                            # Global styles
│   ├── global.css
│   └── theme.css
│
├── utils/                             # Utility functions
│   ├── idGenerator.js
│   ├── dateHelpers.js
│   ├── storageManager.js
│   └── statusHelpers.js
│
├── constants/                         # Application constants
│   ├── taskStatus.js
│   ├── projectStatus.js
│   └── pomodoroConfig.js
│
├── App.jsx
└── main.jsx
```

### 5.2 CSS Organization Strategy

**Feature-Level Styling:**
- Each feature folder has ONE CSS file that contains all styles for components in that feature
- Example: `Dashboard.css` contains styles for Dashboard, ProjectGrid, and WeeklyTasksList

**Example: Dashboard.css**
```css
/* Dashboard feature styles */
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ProjectGrid component */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.project-card {
  background: #161b22;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.project-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* WeeklyTasksList component */
.weekly-tasks {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.task-date-group {
  border-top: 1px solid #30363d;
  padding-top: 1rem;
}

.task-date-label {
  color: #8b949e;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;
}
```

**Global CSS Strategy:**
- `global.css` — CSS resets, base element styling, utility classes
- `theme.css` — CSS variables for colors, spacing, typography
- Component-level CSS handles all feature-specific styling

**Advantages:**
- ✅ Easy to maintain and modify
- ✅ Can delete a feature folder and its CSS together
- ✅ No orphaned stylesheets
- ✅ Clear boundaries between features
- ✅ Reduces global CSS namespace pollution

---

## 6. State Management

### 6.1 Custom Hooks Architecture

All state management handled through custom React hooks. No Redux/Context in Phase 1.

#### useProjects()

```javascript
const {
  projects,      // array of Project objects
  loading,       // boolean, true while loading
  error,         // string | null, error message
  
  // Methods
  getProjects,                // () -> Project[]
  getProjectById,             // (id: string) -> Project | null
  getActiveProjects,          // () -> Project[]
  createProject,              // (data: object) -> Promise<Project>
  updateProject,              // (id: string, data: object) -> Promise<Project>
  deleteProject,              // (id: string) -> Promise<void>
} = useProjects();
```

**Responsibilities:**
- Load/save projects from projects.json
- CRUD operations for projects
- Filter projects by status

#### useTasks()

```javascript
const {
  tasks,         // array of Task objects
  loading,
  error,
  
  // Methods
  getTasksByProject,          // (projectId: string) -> Task[]
  getTasksByWeek,             // () -> Task[]
  getTodaysTasks,             // () -> Task[]
  getTasksByStatus,           // (status: string) -> Task[]
  createTask,                 // (data: object) -> Promise<Task>
  updateTask,                 // (id: string, data: object) -> Promise<Task>
  deleteTask,                 // (id: string) -> Promise<void> (cascades to comments & sessions)
} = useTasks();
```

**Responsibilities:**
- Load/save tasks from tasks.json
- CRUD operations for tasks
- Filter and group tasks
- Cascade delete (removes associated comments & sessions)

#### useComments()

```javascript
const {
  comments,      // array of Comment objects
  loading,
  error,
  
  // Methods
  getCommentsByTask,          // (taskId: string) -> Comment[]
  addComment,                 // (taskId: string, text: string) -> Promise<Comment>
  deleteComment,              // (id: string) -> Promise<void>
  deleteCommentsByTask,       // (taskId: string) -> Promise<void> (cascade delete)
} = useComments();
```

**Responsibilities:**
- Load/save comments from comments.json
- Query comments by taskId
- Add/delete comments with automatic timestamps

#### usePomodoroSessions()

```javascript
const {
  sessions,      // array of PomodoroSession objects
  loading,
  error,
  
  // Methods
  getSessionsByTask,          // (taskId: string) -> PomodoroSession[]
  getWorkSessions,            // (taskId: string) -> PomodoroSession[]
  getRestSessions,            // (taskId: string) -> PomodoroSession[]
  createSession,              // (taskId: string, sessionData: object) -> Promise<PomodoroSession>
  deleteSession,              // (id: string) -> Promise<void>
  deleteSessionsByTask,       // (taskId: string) -> Promise<void> (cascade delete)
} = usePomodoroSessions();
```

**Responsibilities:**
- Load/save Pomodoro sessions from pomodoroSessions.json
- Query sessions by taskId and type
- Create new sessions with classification

#### usePomodoroTimer(taskId)

```javascript
const {
  currentDuration,   // number in minutes
  elapsedTime,       // number in seconds
  isRunning,         // boolean
  mode,              // 'Work' | 'Rest'
  
  // Methods
  startTimer,        // () -> void
  pauseTimer,        // () -> void
  resetTimer,        // () -> void
  setDuration,       // (minutes: number) -> void
  switchMode,        // (mode: 'Work' | 'Rest') -> void
  increaseDuration,  // () -> void (increments by 1 min)
  decreaseDuration,  // () -> void (decrements by 1 min)
  logSession,        // () -> Promise<PomodoroSession> (saves to storage)
} = usePomodoroTimer(taskId);
```

**Responsibilities:**
- Manage timer state (duration, elapsed, running)
- Start/pause/reset timer
- Adjust duration with +/- buttons
- Log completed sessions (calls usePomodoroSessions internally)

#### useLocalStorage()

```javascript
const {
  loadData,   // (filename: string) -> Promise<any[]>
  saveData,   // (filename: string, data: any[]) -> Promise<void>
  deleteData, // (filename: string) -> Promise<void>
} = useLocalStorage();
```

**Responsibilities:**
- Abstract JSON file I/O operations
- Handle file loading errors
- Persist data to storage

### 6.2 Data Flow Architecture

```
┌──────────────────┐
│   React          │
│   Components     │
└────────┬─────────┘
         │
         ├─→ useProjects() ─→ useTasks() ─→ useComments() ─→ usePomodoroSessions()
         │
         └─→ All hooks use useLocalStorage() internally
                        │
                        ▼
                ┌──────────────────┐
                │ src/data/storage/│
                │  projects.json   │
                │  tasks.json      │
                │  comments.json   │
                │  pomodoro...json │
                └──────────────────┘
```

**Data Flow Principle:**
- Components dispatch actions through hooks
- Hooks manage state and call useLocalStorage
- useLocalStorage handles file I/O
- All data flows through hooks as single source of truth
- No nested data (normalized structure)
- Queries by filtering using ID references

---

## 7. User Workflows

### 7.1 Primary Workflow: Work on a Task

1. **User opens app** → Dashboard displays projects overview + this week's tasks
2. **User clicks task** in "ESTA SEMANA" section
3. **TaskDetailPanel slides in** showing:
   - Task information (name, project, dates, description)
   - Status badge
   - Pomodoro timer
   - Comments thread
   - Session history

4. **User starts Pomodoro session:**
   - Select Work or Rest mode (toggle)
   - Adjust duration with +/− buttons
   - Click "▶ Iniciar"
   - Timer counts down with MM:SS display
   - User can "⏸ Pausar" or "↻ Reset" anytime

5. **When timer reaches 0:00:**
   - Session auto-saved with classification (TRABAJO or DESCANSO)
   - Session appears in "Historial de Sesiones"
   - Timer resets to initial duration

6. **User adds comments:**
   - Type in "Agregar comentario..." field
   - Click "+ Agregar"
   - Comment appears in thread with timestamp
   - Input clears

7. **User changes task status:**
   - Click status badge
   - Select from dropdown
   - Task status updates
   - If status = "Done", task disappears from weekly view

8. **User closes panel** → Clicks ✕ or clicks outside
   - Panel slides out
   - Returns to dashboard
   - All changes persisted to JSON files

### 7.2 Workflow: Create New Project

1. User clicks "+ Nuevo" button
2. Modal opens with fields:
   - Project name (required)
   - Description
   - Start date
   - End date
3. User submits form
4. Project created with status "Active"
5. Project appears in "PROYECTOS ACTIVOS" section
6. Modal closes

### 7.3 Workflow: Create New Task

1. User clicks "+ Nuevo" → "Crear Tarea"
2. TaskForm modal opens
3. Fields pre-populated or selectable:
   - Task name (required)
   - Project (dropdown)
   - Description
   - Start date
   - End date
   - Status (defaults to "To Do")
4. User submits form
5. Task created and linked to project
6. If end date is this week, appears in "ESTA SEMANA"
7. Modal closes

### 7.4 Navigation Flows

**Dashboard** (default view):
- Shows: Projects overview + weekly tasks
- Click project card: Project detail page (Phase 1+)
- Click task: Task detail panel (overlay)

**Proyectos** (Projects page):
- Shows: All projects with full details
- Filter/search available
- Click project: Project detail
- Create new project: Modal

**Tareas** (Tasks page):
- Shows: All tasks across all projects
- Filter by: project, status, date range
- Search available
- Click task: Task detail panel
- Create new task: Modal

**Reportes** (Phase 1+ scope):
- Time tracking summary
- Work vs rest distribution
- Productivity trends (future)

**Configuración** (Settings):
- App preferences (future)
- Data export (future)

---

## 8. Error Handling & Validation

### 8.1 Validation Rules

**Project Validation:**
- `name`: required, min 1 character
- `endDate >= startDate` (if both provided)
- `status`: must be valid enum (Active, On Hold, Completed, Archived)

**Task Validation:**
- `name`: required, min 1 character
- `projectId`: required, must reference existing project
- `endDate >= startDate` (if both provided)
- `status`: must be valid enum (To Do, In Progress, Paused, Blocked, Done)

**Comment Validation:**
- `text`: required, min 1 character
- `taskId`: required, must reference existing task

**Pomodoro Session Validation:**
- `taskId`: required, must reference existing task
- `duration`: required, 1 ≤ duration ≤ 60 minutes
- `type`: must be "Work" or "Rest"
- `endTime > startTime` (for completed sessions)

### 8.2 Form Validation UX

**Real-Time Validation:**
- Validate as user types (debounced)
- Red border on invalid fields
- Error message displayed below field
- Submit button disabled until all required fields valid

**On Submit:**
- If invalid: Show inline errors, focus first invalid field
- If valid: Submit form, show loading state
- On error: Show toast notification

### 8.3 Error Scenarios & Handling

| Scenario | Handling | UX |
|----------|----------|-----|
| Missing required field | Block submission | Red border + error text |
| Invalid date range (end < start) | Block submission | Error: "End date must be after start date" |
| File I/O failure | Use empty defaults, let user continue | Toast: "Failed to load data" (auto-dismiss 4s) |
| Concurrent timer sessions | Ask user: "Stop current timer?" | Modal confirmation |
| Timer at 0 duration | Prevent (set min to 1) | Disable minus button when at 1 |
| Delete task with comments | Ask: "This will delete X comments" | Modal confirmation |
| Project not found (orphaned task) | Handle gracefully, show warning | Toast: "Project not found" |

### 8.4 Error Messages

**Toast Notifications (transient, auto-dismiss 4s):**
- ✓ "Task created successfully"
- ✗ "Failed to save comment. Try again."
- ℹ "Project deleted"
- ⚠ "Failed to load data. Refresh the page."

**Modal Alerts (require acknowledgment):**
- "Cannot delete project with active tasks"
- "Failed to load projects. Please refresh."
- "About to delete 3 comments. Continue?"

**Inline Field Errors:**
- "Project name is required"
- "End date must be after start date"
- "Comment cannot be empty"

---

## 9. Testing Strategy

### 9.1 Unit Tests

**Entity Factory Tests (Jest):**
```javascript
// Project.js tests
test('createProject generates unique ID', () => { ... })
test('createProject sets createdAt timestamp', () => { ... })
test('createProject includes default status', () => { ... })
test('createProject validates required fields', () => { ... })

// Task.js tests
test('createTask sets default status to "To Do"', () => { ... })
test('createTask references correct projectId', () => { ... })
test('createTask generates unique ID', () => { ... })

// Comment.js tests
test('createComment sets createdAt automatically', () => { ... })
test('createComment requires taskId', () => { ... })

// PomodoroSession.js tests
test('createSession defaults to "Work" type', () => { ... })
test('createSession validates duration range', () => { ... })
```

**Hook Tests (React Testing Library):**
```javascript
// useProjects() tests
test('getProjects returns all projects', async () => { ... })
test('createProject adds new project to state', async () => { ... })
test('updateProject modifies existing project', async () => { ... })
test('deleteProject removes project', async () => { ... })

// useTasks() tests
test('getTasksByProject filters correctly', () => { ... })
test('getTasksByWeek returns current week', () => { ... })
test('deleteTask cascades to comments & sessions', async () => { ... })

// usePomodoroTimer() tests
test('startTimer begins countdown', () => { ... })
test('pauseTimer stops countdown', () => { ... })
test('increaseDuration increments by 1 min', () => { ... })
test('logSession saves to storage', async () => { ... })
```

**Utility Tests:**
```javascript
// idGenerator.js tests
test('generateId returns valid UUID v4', () => { ... })
test('generateIds(n) returns n unique IDs', () => { ... })

// dateHelpers.js tests
test('isThisWeek identifies current week tasks', () => { ... })
test('formatDate returns correct format', () => { ... })

// statusHelpers.js tests
test('getStatusColor returns correct hex', () => { ... })
test('isTaskDone returns true only for "Done"', () => { ... })
```

### 9.2 Component Tests (Optional, Priority 2)

**Key Components:**
- Dashboard (renders projects + weekly tasks)
- TaskDetailPanel (renders task info + pomodoro + comments)
- PomodoroTimer (timer countdown, adjustments)
- CommentThread (comment list + input)

**Test Approach:**
- Mock hooks with sample data
- Test rendering
- Test user interactions (clicks, form submissions)
- Verify state updates

### 9.3 Manual Testing (Priority 1)

**Core Workflows:**
1. ✅ Create project → appears in dashboard
2. ✅ Create task → appears in weekly list
3. ✅ Open task detail panel → all sections render
4. ✅ Start Pomodoro → timer counts down
5. ✅ Adjust duration → +/− buttons work
6. ✅ Switch Work/Rest → mode changes
7. ✅ Log session → appears in history with correct classification
8. ✅ Add comment → appears with timestamp
9. ✅ Change status → task updates
10. ✅ Data persists → refresh page, data still exists

**Test Coverage Targets:**
- Entities & Hooks: 80%+
- Utils: 90%+
- Components: 60%+

### 9.4 Testing Tools

- **Unit Tests:** Jest
- **Component Tests:** React Testing Library
- **Manual Testing:** Browser + DevTools
- **No E2E tests in Phase 1** (scope focused)

---

## 10. Phase 1 Scope & Completion Criteria

### 10.1 MVP Features (Must Have)

✅ **Dashboard**
- Projects overview (grid of minimal project cards)
- Weekly tasks (grouped by date)
- Direct access to task detail panel

✅ **Project Management**
- Create new projects (form)
- View all projects
- Edit project details
- Delete projects
- Project status (Active, On Hold, Completed, Archived)

✅ **Task Management**
- Create new tasks (form)
- View all tasks (with filtering)
- Edit task details
- Delete tasks
- Task status (To Do, In Progress, Paused, Blocked, Done)
- Task dates (start, end)

✅ **Task Detail Panel**
- Task information display
- Status management
- Date display

✅ **Pomodoro Timer**
- Work/Rest mode toggle
- Timer display (MM:SS)
- Duration adjustment (+/− buttons)
- Start, Pause, Reset controls
- Session logging (Work/Rest classified)
- Session history display

✅ **Comments**
- Add comments with automatic timestamps
- View comment thread
- Delete comments (Phase 1+)

✅ **Data Persistence**
- JSON file-based storage
- Normalized entity structure
- Load/save on every operation

✅ **UI/UX**
- Dark mode (GitHub/Supabase inspired)
- Minimalist design
- Responsive layout
- Smooth interactions (panel slide-in, animations)

✅ **Navigation**
- Sidebar navigation (5 main sections)
- Task detail panel overlay
- Context-aware views

### 10.2 Nice-to-Have (Phase 1+)

- Drag & drop task organization
- Bulk actions (mark multiple as done)
- Advanced filtering/search
- Data export/import
- Custom Pomodoro durations per project
- Task templates
- Keyboard shortcuts
- Project detail page

### 10.3 Not in Scope (Phase 2+)

- Backend API / Database
- Multi-user / Collaboration
- Real-time sync
- Mobile app
- Advanced analytics
- Calendar integration
- Notifications
- Dark mode toggle (stays dark)
- User authentication

### 10.4 Completion Checklist

**Before shipping Phase 1:**

- [ ] All MVP features implemented and tested
- [ ] Manual testing passed on all core workflows
- [ ] Unit tests written for entities, hooks, utils (80%+ coverage)
- [ ] UI matches design mockups (dark mode, minimalist)
- [ ] Data persists across page refreshes
- [ ] No console errors or warnings
- [ ] Responsive layout tested on desktop
- [ ] Accessibility basic checks (keyboard nav, contrast)
- [ ] Design spec document reviewed and approved
- [ ] Code review completed
- [ ] Ready for Phase 2 planning

---

## Approval & Sign-Off

### Design Review Status

| Section | Status | Reviewer | Date |
|---------|--------|----------|------|
| Product Overview | ✅ Approved | Product Owner | 2026-04-13 |
| Visual Design | ✅ Approved | Product Owner | 2026-04-13 |
| Task Detail Panel | ✅ Approved | Product Owner | 2026-04-13 |
| Data Model | ✅ Approved | Tech Lead | 2026-04-13 |
| Architecture | ✅ Approved | Tech Lead | 2026-04-13 |
| State Management | ✅ Approved | Tech Lead | 2026-04-13 |
| User Workflows | ✅ Approved | Product Owner | 2026-04-13 |
| Testing Strategy | ✅ Approved | QA Lead | 2026-04-13 |

### Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-13 | Initial design specification, all sections approved |

---

## Next Steps

1. **Implementation Planning** — Invoke `writing-plans` skill to create detailed implementation roadmap
2. **Setup Development Environment** — Initialize Vite project, install dependencies
3. **Begin Implementation** — Start with entity definitions and hooks (data layer first)
4. **Incremental Development** — Implement features in order of dependencies
5. **Testing** — Unit tests for entities/hooks, manual testing of workflows
6. **Code Review** — Review against this spec
7. **Phase 1 Release** — Ship MVP with all features from 10.1

---

**Document Status:** APPROVED ✅  
**Ready for Implementation:** YES ✅  
**Last Updated:** April 13, 2026  
