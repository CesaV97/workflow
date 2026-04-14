import { useState } from 'react';
import { Button } from '../../components/Common/Button';
import './ProjectForm.css';

/**
 * ProjectForm component - Form for creating/editing projects
 *
 * @param {function} onSubmit - Callback with form data
 * @param {function} onCancel - Callback to cancel form
 */
export function ProjectForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ name: '', description: '' });
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
          onChange={handleChange}
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
          onChange={handleChange}
          placeholder="Enter project description"
          rows="3"
        />
      </div>

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Create Project
        </Button>
      </div>
    </form>
  );
}
