import { useEffect, useRef, useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { ProjectForm } from './ProjectForm';
import { ProjectDetailPanel } from './ProjectDetailPanel';
import { Modal } from '../../components/Common/Modal';
import './Projects.css';

const STATUS_FILTERS = ['Todos', 'Active', 'On Hold', 'Completed', 'Archived'];

function statusSlug(s = '') {
  return s.toLowerCase().replaceAll(' ', '-');
}

export function Projects({ highlightId, onHighlightClear, onTaskSelect }) {
  const { projects, addProject, updateProject, deleteProject, loading, error } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const cardRefs = useRef({});

  useEffect(() => {
    if (!highlightId || loading) return;
    const el = cardRefs.current[highlightId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('project-card-highlight');
      const t = setTimeout(() => {
        el.classList.remove('project-card-highlight');
        onHighlightClear?.();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [highlightId, loading, onHighlightClear]);

  // Keep selectedProject in sync if the project data updates
  useEffect(() => {
    if (!selectedProject) return;
    const updated = projects.find(p => p.id === selectedProject.id);
    if (updated) setSelectedProject(updated);
    else setSelectedProject(null);
  }, [projects]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    setSaveError('');
    try {
      await addProject(data);
      setShowNewForm(false);
    } catch (err) {
      setSaveError(err.message ?? 'No se pudo crear el proyecto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    setSaveError('');
    try {
      await updateProject(editingProject.id, { ...editingProject, ...data });
      setEditingProject(null);
    } catch (err) {
      setSaveError(err.message ?? 'No se pudo actualizar el proyecto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    const ok = window.confirm(`¿Eliminar "${selectedProject.name}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    try {
      await deleteProject(selectedProject.id);
      setSelectedProject(null);
    } catch (err) {
      setSaveError(err.message ?? 'No se pudo eliminar el proyecto.');
    }
  };

  const filtered = statusFilter === 'Todos'
    ? projects
    : projects.filter(p => p.status === statusFilter);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <main className="page" style={{ flex: 1, overflow: 'auto' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="page-title">Proyectos</h1>
            <p className="page-subtitle">{projects.length} proyectos · {projects.filter(p => p.status === 'Active').length} activos</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowNewForm(true)}>
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
              <div
                className={`project-card-lg${selectedProject?.id === project.id ? ' project-card-selected' : ''}`}
                key={project.id}
                ref={el => { cardRefs.current[project.id] = el; }}
                onClick={() => setSelectedProject(project)}
              >
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

        <Modal isOpen={showNewForm} onClose={() => !submitting && setShowNewForm(false)} title="Nuevo proyecto">
          <ProjectForm onSubmit={handleCreate} onCancel={() => setShowNewForm(false)} submitting={submitting} />
        </Modal>

        <Modal isOpen={!!editingProject} onClose={() => !submitting && setEditingProject(null)} title="Editar proyecto">
          <ProjectForm
            project={editingProject}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProject(null)}
            submitting={submitting}
          />
        </Modal>
      </main>

      {selectedProject && (
        <ProjectDetailPanel
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onEdit={() => setEditingProject(selectedProject)}
          onDelete={handleDelete}
          onTaskSelect={onTaskSelect}
        />
      )}
    </div>
  );
}
