import { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectFormModal } from './ProjectFormModal';

export function ProjectGrid({ projects, tasks = [], onAdd, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      if (selectedProject) {
        await onUpdate(selectedProject.id, formData);
      } else {
        await onAdd(formData);
      }
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (saveError) {
      setError(saveError.message ?? 'No se pudo guardar el proyecto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await onDelete(id);
    } catch (deleteError) {
      setError(deleteError.message ?? 'No se pudo eliminar el proyecto.');
    }
  };

  return (
    <div>
      <div className="project-grid-header">
        <button className="btn-new-project" onClick={() => { setSelectedProject(null); setIsModalOpen(true); }}>
          + Nuevo proyecto
        </button>
      </div>
      {error && <p className="empty-state">{error}</p>}
      {projects.length === 0 ? (
        <p className="empty-state">No hay proyectos aún. Crea uno para empezar.</p>
      ) : (
        <div className="project-grid">
          {projects.map((project) => {
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            const doneTasks = projectTasks.filter(t => t.status === 'Done');
            const progress = projectTasks.length > 0
              ? Math.round((doneTasks.length / projectTasks.length) * 100)
              : 0;
            return (
              <ProjectCard
                key={project.id}
                project={project}
                taskCount={projectTasks.length}
                doneCount={doneTasks.length}
                progress={progress}
                onEdit={(p) => { setSelectedProject(p); setIsModalOpen(true); }}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        onSave={handleSave}
        project={selectedProject}
        submitting={submitting}
      />
    </div>
  );
}
