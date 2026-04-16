import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Button } from '../../components/Common/Button';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { Modal } from '../../components/Common/Modal';
import './Projects.css';

export function Projects() {
  const { projects, addProject, loading, error } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleAddProject = async (data) => {
    setSubmitting(true);
    setSaveError('');
    try {
      await addProject(data);
      setShowForm(false);
    } catch (submitError) {
      setSaveError(submitError.message ?? 'No se pudo crear el proyecto.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="projects">
      <div className="projects-header">
        <h1 className="projects-title">Projects</h1>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          + New Project
        </Button>
      </div>

      {(error || saveError) && <div className="projects-error">{error || saveError}</div>}

      {loading ? (
        <div className="empty-state">
          <p>Cargando proyectos...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => !submitting && setShowForm(false)} title="New Project">
        <ProjectForm onSubmit={handleAddProject} onCancel={() => setShowForm(false)} submitting={submitting} />
      </Modal>
    </div>
  );
}
