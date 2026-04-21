import { useTasksContext } from '../../context/TasksContext';
import '../TaskDetail/TaskDetail.css';
import './ProjectDetailPanel.css';

function statusSlug(s = '') {
  return s.toLowerCase().replaceAll(' ', '-');
}

export function ProjectDetailPanel({ project, onClose, onEdit, onDelete, onTaskSelect }) {
  const { getTasksByProjectId } = useTasksContext();
  const tasks = getTasksByProjectId(project.id);

  return (
    <aside className="task-detail-panel">
      <div className="panel-header">
        <div className="pdp-header-info">
          <h3 className="panel-header-title">{project.name}</h3>
          <span className={`project-status ${statusSlug(project.status)}`}>{project.status}</span>
        </div>
        <div className="pdp-header-actions">
          <button className="pdp-btn-edit" onClick={onEdit}>✏ Editar</button>
          <button className="pdp-btn-delete" onClick={onDelete} aria-label="Eliminar proyecto">🗑</button>
          <button className="panel-close" onClick={onClose} aria-label="Cerrar panel">×</button>
        </div>
      </div>

      <div className="panel-body">
        {(project.startDate || project.endDate) && (
          <div className="panel-section">
            <label className="panel-label">Fechas</label>
            <div className="panel-dates">
              {project.startDate && (
                <div className="date-item">
                  <div className="date-label">Inicio</div>
                  <div className="date-value">
                    {new Date(`${project.startDate}T00:00:00`).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              )}
              {project.endDate && (
                <div className="date-item">
                  <div className="date-label">Vence</div>
                  <div className="date-value">
                    {new Date(`${project.endDate}T00:00:00`).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {project.description && (
          <div className="panel-section">
            <label className="panel-label">Descripción</label>
            <div className="task-detail-description">{project.description}</div>
          </div>
        )}

        <div className="panel-section">
          <label className="panel-label">Tareas ({tasks.length})</label>
          {tasks.length === 0 ? (
            <p className="empty-state">Sin tareas asignadas.</p>
          ) : (
            <div className="pdp-task-list">
              {tasks.map(task => (
                <button
                  key={task.id}
                  className="pdp-task-item"
                  onClick={() => onTaskSelect?.(task)}
                >
                  <span className="pdp-task-name">{task.name}</span>
                  <span className={`project-status ${statusSlug(task.status)}`}>{task.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
