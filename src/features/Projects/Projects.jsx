import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { ProjectForm } from './ProjectForm';
import { Modal } from '../../components/Common/Modal';
import './Projects.css';

const STATUS_FILTERS = ['Todos', 'Active', 'On Hold', 'Completed', 'Archived'];

function statusSlug(s = '') {
  return s.toLowerCase().replaceAll(' ', '-');
}

export function Projects() {
  const { projects, addProject, loading, error } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

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

  const filtered = statusFilter === 'Todos'
    ? projects
    : projects.filter(p => p.status === statusFilter);

  return (
    <main className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Proyectos</h1>
          <p className="page-subtitle">{projects.length} proyectos · {projects.filter(p => p.status === 'Active').length} activos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Nuevo proyecto
        </button>
      </div>

      <div className="tasks-toolbar">
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginRight: 4 }}>Estatus:</span>
        {STATUS_FILTERS.map(s => (
          <button
            key={s}
            className={`filter-chip ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {(error || saveError) && <div className="projects-error">{error || saveError}</div>}

      {loading ? (
        <p className="empty-state">Cargando proyectos...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">No hay proyectos. Crea uno para empezar.</p>
      ) : (
        <div className="projects-grid">
          {filtered.map((project) => (
            <div className="project-card-lg" key={project.id}>
              <div className="project-header">
                <h3 className="project-name">{project.name}</h3>
                <span className={`project-status ${statusSlug(project.status)}`}>{project.status}</span>
              </div>
              {project.description && (
                <p className="project-description">{project.description}</p>
              )}
              <div className="project-meta-row">
                {project.startDate && (
                  <span className="meta-chip">
                    Inicio: {new Date(`${project.startDate}T00:00:00`).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                {project.endDate && (
                  <span className="meta-chip">
                    Vence: {new Date(`${project.endDate}T00:00:00`).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => !submitting && setShowForm(false)} title="Nuevo proyecto">
        <ProjectForm onSubmit={handleAddProject} onCancel={() => setShowForm(false)} submitting={submitting} />
      </Modal>
    </main>
  );
}
