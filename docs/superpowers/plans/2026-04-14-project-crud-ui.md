# Project CRUD UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full CRUD interface for projects in the Dashboard using a reusable modal form.

**Architecture:** `Dashboard` becomes the reactive state owner — it holds `useState` for projects and wraps the localStorage CRUD functions. `ProjectGrid` receives projects + CRUD callbacks as props and manages only modal open/close state. Two new components are added: `ProjectCard` (card with edit/delete actions) and `ProjectFormModal` (reusable form modal for create and edit).

**Tech Stack:** React 19, Vitest, @testing-library/react, @testing-library/user-event, jsdom

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/features/Dashboard/ProjectCard.jsx` | Single project card with inline delete confirmation |
| Create | `src/features/Dashboard/ProjectFormModal.jsx` | Reusable modal form for create/edit |
| Modify | `src/features/Dashboard/ProjectGrid.jsx` | Uses ProjectCard + ProjectFormModal, manages modal state |
| Modify | `src/features/Dashboard/Dashboard.jsx` | Owns reactive projects useState, passes CRUD callbacks |
| Create | `tests/features/ProjectCard.test.jsx` | Unit tests for ProjectCard |
| Create | `tests/features/ProjectFormModal.test.jsx` | Unit tests for ProjectFormModal |
| Modify | `tests/features/Dashboard.test.jsx` | Update mock to include addProject/updateProject/deleteProject |

---

## Task 1: ProjectCard component

**Files:**
- Create: `src/features/Dashboard/ProjectCard.jsx`
- Create: `tests/features/ProjectCard.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `tests/features/ProjectCard.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectCard } from '../../src/features/Dashboard/ProjectCard';

const mockProject = {
  id: '1',
  name: 'My Project',
  description: 'A test project',
  status: 'Active',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('ProjectCard', () => {
  it('renders project name and status', () => {
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('My Project')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders project description', () => {
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('A test project')).toBeInTheDocument();
  });

  it('renders "No description" when description is empty', () => {
    const p = { ...mockProject, description: '' };
    render(<ProjectCard project={p} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('No description')).toBeInTheDocument();
  });

  it('calls onEdit with project when Edit button is clicked', async () => {
    const onEdit = vi.fn();
    render(<ProjectCard project={mockProject} onEdit={onEdit} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /editar/i }));
    expect(onEdit).toHaveBeenCalledWith(mockProject);
  });

  it('shows inline delete confirmation when Delete button is clicked', async () => {
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(screen.getByText(/¿eliminar este proyecto\?/i)).toBeInTheDocument();
  });

  it('calls onDelete with project id when Confirm is clicked', async () => {
    const onDelete = vi.fn();
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('hides confirmation and does not delete when Cancel is clicked', async () => {
    const onDelete = vi.fn();
    render(<ProjectCard project={mockProject} onEdit={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: /eliminar/i }));
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByText(/¿eliminar este proyecto\?/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd C:/dev/workFlow && npx vitest run tests/features/ProjectCard.test.jsx
```

Expected: FAIL — `ProjectCard` is not defined.

- [ ] **Step 3: Create ProjectCard component**

Create `src/features/Dashboard/ProjectCard.jsx`:

```jsx
import { useState } from 'react';

export function ProjectCard({ project, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-name">{project.name}</h3>
        <span className="project-status">{project.status}</span>
      </div>
      <p className="project-description">{project.description || 'No description'}</p>
      <div className="project-meta">
        <span className="project-date">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="project-actions">
        <button onClick={() => onEdit(project)}>Editar</button>
        {confirmDelete ? (
          <span className="delete-confirm">
            <span>¿Eliminar este proyecto?</span>
            <button onClick={() => onDelete(project.id)}>Confirmar</button>
            <button onClick={() => setConfirmDelete(false)}>Cancelar</button>
          </span>
        ) : (
          <button onClick={() => setConfirmDelete(true)}>Eliminar</button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd C:/dev/workFlow && npx vitest run tests/features/ProjectCard.test.jsx
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd C:/dev/workFlow && git add src/features/Dashboard/ProjectCard.jsx tests/features/ProjectCard.test.jsx
git commit -m "feat: add ProjectCard component with edit and delete actions"
```

---

## Task 2: ProjectFormModal component

**Files:**
- Create: `src/features/Dashboard/ProjectFormModal.jsx`
- Create: `tests/features/ProjectFormModal.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `tests/features/ProjectFormModal.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectFormModal } from '../../src/features/Dashboard/ProjectFormModal';

const mockProject = {
  id: '1',
  name: 'Existing Project',
  description: 'Existing description',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  status: 'Active',
};

describe('ProjectFormModal', () => {
  it('renders nothing when isOpen is false', () => {
    render(<ProjectFormModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/nombre/i)).not.toBeInTheDocument();
  });

  it('renders form fields when isOpen is true', () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estado/i)).toBeInTheDocument();
  });

  it('shows "Nuevo Proyecto" title in create mode', () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText('Nuevo Proyecto')).toBeInTheDocument();
  });

  it('shows "Editar Proyecto" title in edit mode', () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} project={mockProject} />);
    expect(screen.getByText('Editar Proyecto')).toBeInTheDocument();
  });

  it('pre-fills fields with project data in edit mode', () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} project={mockProject} />);
    expect(screen.getByLabelText(/nombre/i)).toHaveValue('Existing Project');
    expect(screen.getByLabelText(/descripción/i)).toHaveValue('Existing description');
  });

  it('shows error when submitting with empty name', async () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }));
    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
  });

  it('does not call onSave when name is empty', async () => {
    const onSave = vi.fn();
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }));
    expect(onSave).not.toHaveBeenCalled();
  });

  it('calls onSave with form data when form is valid', async () => {
    const onSave = vi.fn();
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);
    await userEvent.type(screen.getByLabelText(/nombre/i), 'New Project');
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Project' }));
  });

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn();
    render(<ProjectFormModal isOpen={true} onClose={onClose} onSave={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows endDate error when endDate is before startDate', async () => {
    render(<ProjectFormModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Test');
    await userEvent.type(screen.getByLabelText(/fecha de inicio/i), '2026-06-01');
    await userEvent.type(screen.getByLabelText(/fecha de fin/i), '2026-01-01');
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }));
    expect(screen.getByText('La fecha de fin debe ser posterior al inicio')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd C:/dev/workFlow && npx vitest run tests/features/ProjectFormModal.test.jsx
```

Expected: FAIL — `ProjectFormModal` is not defined.

- [ ] **Step 3: Create ProjectFormModal component**

Create `src/features/Dashboard/ProjectFormModal.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { Modal } from '../../components/Common/Modal';
import { PROJECT_STATUS } from '../../constants/projectStatus';

export function ProjectFormModal({ isOpen, onClose, onSave, project }) {
  const isEditing = Boolean(project);

  const emptyForm = { name: '', description: '', startDate: '', endDate: '', status: 'Active' };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(
        project
          ? { name: project.name || '', description: project.description || '', startDate: project.startDate || '', endDate: project.endDate || '', status: project.status || 'Active' }
          : emptyForm
      );
      setErrors({});
    }
  }, [isOpen, project]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior al inicio';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}>
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-field">
          <label htmlFor="project-name">Nombre *</label>
          <input
            id="project-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="project-description">Descripción</label>
          <textarea
            id="project-description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="project-startDate">Fecha de inicio</label>
          <input
            id="project-startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="project-endDate">Fecha de fin</label>
          <input
            id="project-endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
          {errors.endDate && <span className="field-error">{errors.endDate}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="project-status">Estado</label>
          <select
            id="project-status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {Object.values(PROJECT_STATUS).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>Cancelar</button>
          <button type="submit">{isEditing ? 'Guardar cambios' : 'Crear proyecto'}</button>
        </div>
      </form>
    </Modal>
  );
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd C:/dev/workFlow && npx vitest run tests/features/ProjectFormModal.test.jsx
```

Expected: All 10 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd C:/dev/workFlow && git add src/features/Dashboard/ProjectFormModal.jsx tests/features/ProjectFormModal.test.jsx
git commit -m "feat: add ProjectFormModal component with create and edit support"
```

---

## Task 3: Update ProjectGrid to manage modal state

**Files:**
- Modify: `src/features/Dashboard/ProjectGrid.jsx`

`ProjectGrid` now receives `projects`, `onAdd`, `onUpdate`, `onDelete` as props. It manages only modal open/close and selected project state.

- [ ] **Step 1: Replace ProjectGrid content**

Replace the full contents of `src/features/Dashboard/ProjectGrid.jsx` with:

```jsx
import { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectFormModal } from './ProjectFormModal';

export function ProjectGrid({ projects, onAdd, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleNew = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSave = (formData) => {
    if (selectedProject) {
      onUpdate(selectedProject.id, formData);
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div>
      <div className="project-grid-header">
        <button className="btn-new-project" onClick={handleNew}>+ Nuevo Proyecto</button>
      </div>
      {projects.length === 0 ? (
        <p className="empty-state">No hay proyectos aún. ¡Crea uno para empezar!</p>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        project={selectedProject}
      />
    </div>
  );
}
```

- [ ] **Step 2: Run existing Dashboard tests to see which break**

```bash
cd C:/dev/workFlow && npx vitest run tests/features/Dashboard.test.jsx
```

Expected: Some tests will FAIL because mock needs `addProject`, `updateProject`, `deleteProject`.

- [ ] **Step 3: Commit**

```bash
cd C:/dev/workFlow && git add src/features/Dashboard/ProjectGrid.jsx
git commit -m "refactor: update ProjectGrid to use ProjectCard and ProjectFormModal"
```

---

## Task 4: Update Dashboard to own reactive projects state

**Files:**
- Modify: `src/features/Dashboard/Dashboard.jsx`
- Modify: `tests/features/Dashboard.test.jsx`

`Dashboard` uses `useState` to hold a reactive copy of projects. It wraps each CRUD function to also update local state, then passes callbacks to `ProjectGrid`.

- [ ] **Step 1: Write the failing tests**

Replace the full contents of `tests/features/Dashboard.test.jsx` with:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../../src/features/Dashboard/Dashboard';

const mockProjects = [
  { id: '1', name: 'Project 1', description: 'Desc 1', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Project 2', description: 'Desc 2', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
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
    tasks: [],
    taskCount: () => 0,
  }),
}));

describe('Dashboard feature', () => {
  it('should render dashboard container', () => {
    render(<Dashboard />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render project grid section', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { name: /projects/i, level: 2 })).toBeInTheDocument();
  });

  it('should render weekly tasks section', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { name: /tasks/i, level: 2 })).toBeInTheDocument();
  });

  it('should display project count', () => {
    render(<Dashboard />);
    expect(screen.getByText((content, element) => {
      return element && content.includes('2') && element.textContent.includes('Project');
    })).toBeInTheDocument();
  });

  it('should render "Nuevo Proyecto" button', () => {
    render(<Dashboard />);
    expect(screen.getByRole('button', { name: /nuevo proyecto/i })).toBeInTheDocument();
  });

  it('should open modal when "Nuevo Proyecto" is clicked', async () => {
    render(<Dashboard />);
    await userEvent.click(screen.getByRole('button', { name: /nuevo proyecto/i }));
    expect(screen.getByText('Nuevo Proyecto')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd C:/dev/workFlow && npx vitest run tests/features/Dashboard.test.jsx
```

Expected: FAIL — `ProjectGrid` now expects `onAdd`, `onUpdate`, `onDelete` props.

- [ ] **Step 3: Update Dashboard component**

Replace the full contents of `src/features/Dashboard/Dashboard.jsx` with:

```jsx
import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { ProjectGrid } from './ProjectGrid';
import { WeeklyTasksList } from './WeeklyTasksList';
import './Dashboard.css';

export function Dashboard() {
  const projectsHook = useProjects();
  const { tasks, taskCount } = useTasks();
  const [projects, setProjects] = useState(projectsHook.projects);

  const handleAddProject = (data) => {
    const newProject = projectsHook.addProject(data);
    setProjects((prev) => [...prev, newProject]);
  };

  const handleUpdateProject = (id, data) => {
    const updated = projectsHook.updateProject(id, data);
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
          <h2 className="section-title">Projects</h2>
          <ProjectGrid
            projects={projects}
            onAdd={handleAddProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
          />
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Tasks</h2>
          <WeeklyTasksList tasks={tasks} />
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run all tests**

```bash
cd C:/dev/workFlow && npx vitest run
```

Expected: All tests PASS — Dashboard, ProjectCard, ProjectFormModal, Tasks, Common.

- [ ] **Step 5: Commit**

```bash
cd C:/dev/workFlow && git add src/features/Dashboard/Dashboard.jsx tests/features/Dashboard.test.jsx
git commit -m "feat: wire Dashboard as reactive state owner for project CRUD"
```

---

## Self-Review

**Spec coverage check:**
- [x] Button "Nuevo Proyecto" in Dashboard → Task 3 (ProjectGrid header) + Task 4 (Dashboard renders ProjectGrid)
- [x] Modal form for create → Task 2 (ProjectFormModal create mode)
- [x] Modal form for edit → Task 2 (ProjectFormModal edit mode, pre-filled fields)
- [x] Inline delete confirmation → Task 1 (ProjectCard)
- [x] Validation: name required → Task 2
- [x] Validation: endDate ≥ startDate → Task 2
- [x] Field-level error messages → Task 2
- [x] Status select from PROJECT_STATUS constants → Task 2
- [x] Full CRUD wired to useProjects hook → Task 4 (Dashboard)
- [x] Project count in Dashboard header stays reactive → Task 4 (`projects.length` from useState)

**No placeholders found.**

**Type consistency:**
- `onAdd`, `onUpdate`, `onDelete` used consistently in ProjectGrid (Task 3) and Dashboard (Task 4)
- `handleAddProject`, `handleUpdateProject`, `handleDeleteProject` defined in Dashboard and passed as `onAdd`, `onUpdate`, `onDelete`
- `project` prop in ProjectFormModal is `null | object` — consistent across all tasks
- `selectedProject` state in ProjectGrid: `null` (create) or `project object` (edit) — consistent
