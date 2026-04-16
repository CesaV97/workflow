import { useEffect, useState } from 'react';
import { Modal } from '../../components/Common/Modal';
import { TASK_DEFAULTS, TASK_STATUS } from '../../constants/taskStatus';

const EMPTY_FORM = {
  projectId: '',
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: TASK_DEFAULTS.status,
};

export function TaskFormModal({ isOpen, onClose, onSave, task, projects, submitting = false }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(task);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(
      task
        ? {
            projectId: task.projectId || '',
            name: task.name || '',
            description: task.description || '',
            startDate: task.startDate || '',
            endDate: task.endDate || '',
            status: task.status || TASK_DEFAULTS.status,
          }
        : { ...EMPTY_FORM, projectId: projects[0]?.id ?? '' }
    );
    setErrors({});
  }, [isOpen, projects, task]);

  const validate = () => {
    const nextErrors = {};
    if (!formData.projectId) {
      nextErrors.projectId = 'Selecciona un proyecto';
    }
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

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar tarea' : 'Nueva tarea'}>
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="task-form-grid">
          <label className="task-form-field">
            <span>Proyecto *</span>
            <select value={formData.projectId} onChange={(event) => setField('projectId', event.target.value)}>
              <option value="">Selecciona un proyecto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            {errors.projectId && <span className="field-error">{errors.projectId}</span>}
          </label>

          <label className="task-form-field task-form-field--full">
            <span>Nombre *</span>
            <input type="text" value={formData.name} onChange={(event) => setField('name', event.target.value)} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label className="task-form-field task-form-field--full">
            <span>Descripción</span>
            <textarea value={formData.description} onChange={(event) => setField('description', event.target.value)} rows={3} />
          </label>

          <label className="task-form-field">
            <span>Inicio</span>
            <input type="date" value={formData.startDate} onChange={(event) => setField('startDate', event.target.value)} />
          </label>

          <label className="task-form-field">
            <span>Fin</span>
            <input type="date" value={formData.endDate} onChange={(event) => setField('endDate', event.target.value)} />
            {errors.endDate && <span className="field-error">{errors.endDate}</span>}
          </label>

          <label className="task-form-field">
            <span>Estado</span>
            <select value={formData.status} onChange={(event) => setField('status', event.target.value)}>
              {Object.values(TASK_STATUS).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="task-form-actions">
          <button type="button" onClick={onClose} disabled={submitting}>Cancelar</button>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear tarea'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
