# Project CRUD UI — Design Spec
**Date:** 2026-04-14  
**Status:** Approved

## Overview

Add a full CRUD interface for projects directly in the Dashboard. Users can create, edit, and delete projects using a reusable modal form. No new pages are required.

---

## Architecture & Components

### New files in `src/features/Dashboard/`

**`ProjectFormModal.jsx`**  
Reusable modal form for creating and editing projects. Wraps the existing `Modal` component.

- Props: `isOpen`, `onClose`, `onSave`, `project` (optional)
- If `project` is provided → edit mode (pre-fills fields, calls `updateProject`)
- If `project` is absent → create mode (empty fields, calls `addProject`)
- Validates on submit: name required, endDate must be ≥ startDate
- Displays field-level error messages

**`ProjectCard.jsx`**  
Extracted from `ProjectGrid`. Renders a single project card with Edit and Delete actions.

- Props: `project`, `onEdit`, `onDelete`
- Edit button → opens `ProjectFormModal` in edit mode
- Delete button → shows inline confirmation (`"¿Eliminar este proyecto?"` + Confirm/Cancel)
- No separate confirmation modal needed

### Modified files

**`ProjectGrid.jsx`**  
Manages modal state and CRUD actions.

- State: `isModalOpen` (boolean), `selectedProject` (object | null)
- Renders "Nuevo Proyecto" button that opens modal in create mode
- Passes `onEdit` and `onDelete` handlers down to `ProjectCard`
- On save: calls `addProject` or `updateProject` from `useProjects`, then closes modal
- On delete confirmed: calls `deleteProject` from `useProjects`

---

## Form Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Nombre | text | Yes | Min 1 char |
| Descripción | textarea | No | — |
| Fecha inicio | date | No | — |
| Fecha fin | date | No | Must be ≥ startDate if both set |
| Estado | select | Yes | Options from `PROJECT_STATUS` constants; default `Active` |

---

## Data Flow

**Create:**
1. User clicks "Nuevo Proyecto" in Dashboard
2. `ProjectGrid` sets `isModalOpen = true`, `selectedProject = null`
3. `ProjectFormModal` opens in create mode
4. User fills form, submits
5. `addProject(formData)` called
6. Modal closes, grid re-renders with new project

**Edit:**
1. User clicks "Editar" on a `ProjectCard`
2. `ProjectGrid` sets `isModalOpen = true`, `selectedProject = project`
3. `ProjectFormModal` opens in edit mode, pre-filled
4. User modifies fields, submits
5. `updateProject(id, formData)` called
6. Modal closes, card re-renders with updated data

**Delete:**
1. User clicks "Eliminar" on a `ProjectCard`
2. Inline confirmation appears on the card
3. User confirms → `deleteProject(id)` called, card disappears
4. User cancels → confirmation dismisses, no change

---

## Validation & Error Handling

- `nombre` empty → error message: `"El nombre es requerido"`
- `endDate < startDate` → error message: `"La fecha de fin debe ser posterior al inicio"`
- Uses existing `isValidProject()` from `src/data/entities/Project.js`
- Errors shown inline below the relevant field
- Submit button disabled while errors exist

---

## Out of Scope

- Project search or filtering (existing Tasks feature handles its own filtering)
- Pagination of project list
- Bulk delete
- Project detail page (future work)
