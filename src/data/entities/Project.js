import { generateId } from '../../utils/idGenerator';
import { PROJECT_DEFAULTS } from '../../constants/projectStatus';

export const projectSchema = {
  id: '',
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: '',
  createdAt: '',
  updatedAt: '',
};

/**
 * Create a new Project entity
 * @param {object} data - Project data (name, description, startDate, endDate, status)
 * @returns {object} Complete Project object with generated ID and timestamps
 */
export function createProject(data) {
  const now = new Date().toISOString();
  return {
    ...projectSchema,
    ...data,
    id: generateId(),
    status: data.status || PROJECT_DEFAULTS.status,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Validate project has required fields
 * @param {object} project - Project object to validate
 * @returns {boolean} True if valid
 */
export function isValidProject(project) {
  return (
    project.name &&
    project.name.trim().length > 0 &&
    (!project.endDate || !project.startDate || new Date(project.endDate) >= new Date(project.startDate))
  );
}
