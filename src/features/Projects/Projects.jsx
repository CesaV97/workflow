import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Button } from '../../components/Common/Button';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { Modal } from '../../components/Common/Modal';
import './Projects.css';

/**
 * Projects component - Main projects management page
 * Displays all projects with CRUD operations
 */
export function Projects() {
  const { projects, addProject } = useProjects();
  const [showForm, setShowForm] = useState(false);

  const handleAddProject = (data) => {
    addProject(data);
    setShowForm(false);
  };

  return (
    <main className="projects">
      <div className="projects-header">
        <h1 className="projects-title">Projects</h1>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          + New Project
        </Button>
      </div>

      {projects.length === 0 ? (
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

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Project">
        <ProjectForm onSubmit={handleAddProject} onCancel={() => setShowForm(false)} />
      </Modal>
    </main>
  );
}
