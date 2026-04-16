import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { TaskFormModal } from './TaskFormModal';
import './Tasks.css';

export function Tasks({ onTaskSelect }) {
  const tasksHook = useTasks();
  const projectsHook = useProjects();
  const { tasks, taskCount, addTask, updateTask, deleteTask, loading, error } = tasksHook;
  const { projects, loading: projectsLoading } = projectsHook;
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = async (formData) => {
    setSubmitting(true);
    setSaveError('');
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, formData);
      } else {
        await addTask(formData);
      }
      setShowForm(false);
      setSelectedTask(null);
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

  return (
    <main className="tasks">
      <div className="tasks-header">
        <div>
          <h1 className="tasks-title">Tareas</h1>
          <p className="tasks-count">{taskCount()} tareas</p>
        </div>
        <button className="tasks-create-button" onClick={() => { setSelectedTask(null); setShowForm(true); }} disabled={projectsLoading || projects.length === 0}>
          + Nueva tarea
        </button>
      </div>

      {(error || saveError) && <div className="tasks-error">{error || saveError}</div>}
      {projects.length === 0 && !projectsLoading && (
        <p className="empty-state">Crea un proyecto antes de registrar tareas.</p>
      )}

      {loading ? (
        <p className="empty-state">Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p className="empty-state">No hay tareas aún</p>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="task-item task-item--clickable"
              onClick={() => onTaskSelect?.(task)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => event.key === 'Enter' && onTaskSelect?.(task)}
            >
              <div className="task-item-main">
                <div className="task-item-header">
                  <h3 className="task-name">{task.name}</h3>
                  <span className={`task-status status-${(task.status ?? '').toLowerCase().replaceAll(' ', '-')}`}>
                    {task.status}
                  </span>
                </div>
                {task.projectName && <p className="task-project-name">{task.projectName}</p>}
                {task.description && <p className="task-description">{task.description}</p>}
              </div>
              <div className="task-item-actions">
                <button onClick={(event) => { event.stopPropagation(); setSelectedTask(task); setShowForm(true); }}>Editar</button>
                <button onClick={(event) => { event.stopPropagation(); handleDelete(task.id); }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskFormModal
        isOpen={showForm}
        onClose={() => !submitting && setShowForm(false)}
        onSave={handleSave}
        task={selectedTask}
        projects={projects}
        submitting={submitting}
      />
    </main>
  );
}
