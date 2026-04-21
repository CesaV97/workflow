import { useState } from 'react';
import { useTasksContext } from '../../context/TasksContext';
import { usePomodoro } from '../../context/PomodoroContext';
import { useProjects } from '../../hooks/useProjects';
import { TaskFormModal } from './TaskFormModal';
import './Tasks.css';

const STATUS_OPTIONS = ['Todos', 'To Do', 'In Progress', 'Paused', 'Blocked', 'Done'];

function statusClass(s = '') {
  return 'status-' + s.toLowerCase().replaceAll(' ', '-');
}

export function Tasks({ onTaskSelect }) {
  const tasksHook = useTasksContext();
  const { taskId: pomodoroTaskId, isActive } = usePomodoro();

  const projectsHook = useProjects();
  const { tasks, addTask, updateTask, deleteTask, loading, error } = tasksHook;
  const { projects, loading: projectsLoading } = projectsHook;
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [projectFilter, setProjectFilter] = useState('all');


  const handleSave = async (formData) => {
    setSubmitting(true);
    setSaveError('');
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await addTask(formData);
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (submitError) {
      setSaveError(submitError.message ?? 'No se pudo guardar la tarea.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
    } catch (deleteError) {
      setSaveError(deleteError.message ?? 'No se pudo eliminar la tarea.');
    }
  };

  const filtered = tasks.filter(t => {
    if (statusFilter !== 'Todos' && t.status !== statusFilter) return false;
    if (projectFilter !== 'all' && t.projectId !== projectFilter) return false;
    return true;
  });

  return (
    <main className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Tareas</h1>
          <p className="page-subtitle">{filtered.length} de {tasks.length} tareas</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditingTask(null); setShowForm(true); }}
          disabled={projectsLoading || projects.length === 0}
        >
          + Nueva tarea
        </button>
      </div>

      <div className="tasks-toolbar">
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginRight: 4 }}>Estatus:</span>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            className={`filter-chip ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </button>
        ))}
        <div style={{ width: 1, height: 20, background: 'var(--color-border)', margin: '0 6px' }} />
        <select
          value={projectFilter}
          onChange={e => setProjectFilter(e.target.value)}
          className="toolbar-select"
        >
          <option value="all">Todos los proyectos</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {(error || saveError) && <div className="tasks-error">{error || saveError}</div>}
      {projects.length === 0 && !projectsLoading && (
        <p className="empty-state">Crea un proyecto antes de registrar tareas.</p>
      )}

      {loading ? (
        <p className="empty-state">Cargando tareas...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">Sin tareas que coincidan con el filtro.</p>
      ) : (
        <div className="tasks-list">
          {filtered.map((task) => (
            <div
              key={task.id}
              className={`task-item${isActive && pomodoroTaskId === task.id ? ' pomodoro-active' : ''}`}
              onClick={() => onTaskSelect?.(task)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onTaskSelect?.(task)}
            >
              <div className="task-item-main">
                <div className="task-item-header">
                  <div>
                    <h3 className="task-name">
                    {isActive && pomodoroTaskId === task.id && (
                      <span className="task-pomodoro-badge" aria-label="Pomodoro activo">🍅</span>
                    )}
                    {task.name}
                  </h3>
                    {task.projectName && <p className="task-project-name">{task.projectName}</p>}
                  </div>
                  <span className={`task-status ${statusClass(task.status)}`}>{task.status}</span>
                </div>
                {task.description && <p className="task-description">{task.description}</p>}
                {task.endDate && (
                  <div className="task-item-footer">
                    <span className="meta-chip">
                      Vence {new Date(`${task.endDate}T00:00:00`).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
              <div className="task-item-actions" onClick={e => e.stopPropagation()}>
                <button onClick={() => { setEditingTask(task); setShowForm(true); }}>Editar</button>
                <button onClick={() => handleDelete(task.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskFormModal
        isOpen={showForm}
        onClose={() => !submitting && setShowForm(false)}
        onSave={handleSave}
        task={editingTask}
        projects={projects}
        submitting={submitting}
      />
    </main>
  );
}
