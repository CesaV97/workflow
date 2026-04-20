import { useState } from 'react';

function statusSlug(s = '') {
  return s.toLowerCase().replaceAll(' ', '-');
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

export function ProjectCard({ project, taskCount = 0, doneCount = 0, progress = 0, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const progressColor = progress >= 70 ? 'var(--color-accent)' : progress >= 40 ? 'var(--color-warning)' : 'var(--color-danger)';

  const endDateLabel = project.endDate
    ? new Date(`${project.endDate}T00:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
    : null;

  return (
    <div
      className="project-card"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setConfirmDelete(false); }}
    >
      <div className="project-header">
        <h3 className="project-name">{project.name}</h3>
        <span className={`project-status ${statusSlug(project.status)}`}>{project.status}</span>
      </div>

      {project.description && (
        <p className="project-description">{project.description}</p>
      )}

      <div className="project-progress">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%`, background: progressColor }}
          />
        </div>
        <div className="progress-meta">
          <span>{doneCount}/{taskCount} tareas</span>
          <span>{progress}%</span>
        </div>
      </div>

      <div className="project-footer">
        {endDateLabel && (
          <span className="project-footer-chip">
            <CalendarIcon /> {endDateLabel}
          </span>
        )}
        <span className="project-footer-chip">
          <UsersIcon /> 1
        </span>

        {showActions && (
          <div className="project-card-actions">
            {confirmDelete ? (
              <>
                <button className="card-action-btn danger" onClick={() => onDelete(project.id)}>Confirmar</button>
                <button className="card-action-btn" onClick={() => setConfirmDelete(false)}>Cancelar</button>
              </>
            ) : (
              <>
                <button className="card-action-btn" onClick={() => onEdit(project)}>Editar</button>
                <button className="card-action-btn danger" onClick={() => setConfirmDelete(true)}>Eliminar</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
