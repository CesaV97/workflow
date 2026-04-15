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
