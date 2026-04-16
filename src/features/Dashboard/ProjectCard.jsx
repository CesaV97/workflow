import { useState } from 'react';

export function ProjectCard({ project, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-name">{project.name}</h3>
        <span className="project-status">{project.status}</span>
      </div>
      <p className="project-description">{project.description || 'Sin descripción'}</p>
      <div className="project-meta">
        <span className="project-date">
          {new Date(project.createdAt).toLocaleDateString('es-MX')}
        </span>
      </div>
      <div className="project-actions">
        <button onClick={() => onEdit(project)}>Editar</button>
        {confirmDelete ? (
          <div className="delete-confirm">
            <span>¿Eliminar este proyecto?</span>
            <button aria-label={`Confirmar eliminación de ${project.name}`} onClick={() => onDelete(project.id)}>
              Confirmar
            </button>
            <button onClick={() => setConfirmDelete(false)}>Cancelar</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)}>Eliminar</button>
        )}
      </div>
    </div>
  );
}
