import { useState } from 'react';
import { Button } from '../../components/Common/Button';
import './ProjectForm.css';

export function ProjectForm({ onSubmit, onCancel, submitting = false, project = null }) {
  const [formData, setFormData] = useState({
    name: project?.name ?? '',
    description: project?.description ?? '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" className="form-label">Project Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-input"
          value={formData.name}
          onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          className="form-input"
          value={formData.description}
          onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Enter project description"
          rows="3"
        />
      </div>

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} type="button" disabled={submitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : project ? 'Guardar cambios' : 'Crear proyecto'}
        </Button>
      </div>
    </form>
  );
}
