import { useState } from 'react';

/**
 * ProjectCard (Dashboard) - Displays a project card with edit and inline delete actions.
 * Note: for the read-only variant used in the Projects feature, see src/features/Projects/ProjectCard.jsx
 *
 * @param {object} project - Project data ({ id, name, status, description, createdAt })
 * @param {function} onEdit - Called with the full project object when Edit is clicked
 * @param {function} onDelete - Called with project.id when deletion is confirmed
 */
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
          <div className="delete-confirm">
            <span>¿Eliminar este proyecto?</span>
            <button aria-label={`Confirmar eliminación de ${project.name}`} onClick={() => onDelete(project.id)}>Confirmar</button>
            <button onClick={() => setConfirmDelete(false)}>Cancelar</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)}>Eliminar</button>
        )}
      </div>
    </div>
  );
}
