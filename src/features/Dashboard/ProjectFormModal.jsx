import { useEffect, useState } from 'react';
import { Modal } from '../../components/Common/Modal';
import { PROJECT_STATUS, PROJECT_DEFAULTS } from '../../constants/projectStatus';
import '../Projects/ProjectForm.css';

const EMPTY_FORM = { name: '', description: '', startDate: '', endDate: '', status: PROJECT_DEFAULTS.status };

export function ProjectFormModal({ isOpen, onClose, onSave, project, submitting = false }) {
  const isEditing = Boolean(project);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(
      project
        ? {
            name: project.name || '',
            description: project.description || '',
            startDate: project.startDate || '',
            endDate: project.endDate || '',
            status: project.status || PROJECT_DEFAULTS.status,
          }
        : EMPTY_FORM
    );
    setErrors({});
  }, [isOpen, project]);

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = 'El nombre es requerido';
    }
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      nextErrors.endDate = 'La fecha de fin debe ser posterior al inicio';
    }
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar proyecto' : 'Nuevo proyecto'}>
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="project-name" className="form-label">Nombre *</label>
          <input
            id="project-name"
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="project-description" className="form-label">Descripción</label>
          <textarea
            id="project-description"
            className="form-input"
            value={formData.description}
            onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="project-startDate" className="form-label">Fecha de inicio</label>
          <input
            id="project-startDate"
            type="date"
            className="form-input"
            value={formData.startDate}
            onChange={(event) => setFormData((prev) => ({ ...prev, startDate: event.target.value }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="project-endDate" className="form-label">Fecha de fin</label>
          <input
            id="project-endDate"
            type="date"
            className="form-input"
            value={formData.endDate}
            onChange={(event) => setFormData((prev) => ({ ...prev, endDate: event.target.value }))}
          />
          {errors.endDate && <span className="field-error">{errors.endDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="project-status" className="form-label">Estado</label>
          <select
            id="project-status"
            className="form-input"
            value={formData.status}
            onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
          >
            {Object.values(PROJECT_STATUS).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} disabled={submitting}>Cancelar</button>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear proyecto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
