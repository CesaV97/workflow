import { generateId } from '../../utils/idGenerator';
import { TASK_DEFAULTS } from '../../constants/taskStatus';

export const taskSchema = {
  id: '',
  projectId: '',
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: '',
  createdAt: '',
  updatedAt: '',
};

/**
 * Create a new Task entity
 * NOTE: Task does NOT contain nested comments or pomodoroSessions.
 * These are stored as separate entities with taskId foreign key.
 * @param {object} data - Task data (projectId, name, description, startDate, endDate, status)
 * @returns {object} Complete Task object with generated ID and timestamps
 */
export function createTask(data) {
  const now = new Date().toISOString();
  return {
    ...taskSchema,
    ...data,
    id: generateId(),
    status: data.status || TASK_DEFAULTS.status,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Validate task has required fields
 * @param {object} task - Task object to validate
 * @returns {boolean} True if valid
 */
export function isValidTask(task) {
  return (
    task.projectId &&
    task.projectId.trim().length > 0 &&
    task.name &&
    task.name.trim().length > 0 &&
    (!task.endDate || !task.startDate || new Date(task.endDate) >= new Date(task.startDate))
  );
}
