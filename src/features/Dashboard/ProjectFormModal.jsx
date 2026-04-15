import { useState, useEffect } from 'react';
import { Modal } from '../../components/Common/Modal';
import { PROJECT_STATUS, PROJECT_DEFAULTS } from '../../constants/projectStatus';

// Empty form constant - used as initial state and stale reference prevention in useEffect
const EMPTY_FORM = { name: '', description: '', startDate: '', endDate: '', status: PROJECT_DEFAULTS.status };

export function ProjectFormModal({ isOpen, onClose, onSave, project }) {
  const isEditing = Boolean(project);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(
        project
          ? { name: project.name || '', description: project.description || '', startDate: project.startDate || '', endDate: project.endDate || '', status: project.status || PROJECT_DEFAULTS.status }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [isOpen, project]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    // ISO strings (YYYY-MM-DD) are lexicographically ordered — string comparison is intentional
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior al inicio';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}>
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-field">
          <label htmlFor="project-name">Nombre *</label>
          <input
            id="project-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="project-description">Descripción</label>
          <textarea
            id="project-description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="project-startDate">Fecha de inicio</label>
          <input
            id="project-startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="project-endDate">Fecha de fin</label>
          <input
            id="project-endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
          {errors.endDate && <span className="field-error">{errors.endDate}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="project-status">Estado</label>
          <select
            id="project-status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {Object.values(PROJECT_STATUS).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>Cancelar</button>
          <button type="submit">{isEditing ? 'Guardar cambios' : 'Crear proyecto'}</button>
        </div>
      </form>
    </Modal>
  );
}
