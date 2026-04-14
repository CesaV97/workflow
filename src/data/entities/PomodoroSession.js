import { generateId } from '../../utils/idGenerator';

export const pomodoroSessionSchema = {
  id: '',
  taskId: '',
  type: '',
  duration: 0,
  startTime: '',
  endTime: '',
  status: '',
};

/**
 * Create a new PomodoroSession entity
 * Sessions are stored separately from Tasks, linked via taskId
 * Type can be 'Work' or 'Rest'
 * @param {object} data - Session data (taskId, type, duration, startTime, endTime, status)
 * @returns {object} Complete PomodoroSession object with generated ID
 */
export function createPomodoroSession(data) {
  return {
    ...pomodoroSessionSchema,
    ...data,
    id: generateId(),
  };
}

/**
 * Validate session has required fields
 * @param {object} session - Session object to validate
 * @returns {boolean} True if valid
 */
export function isValidPomodoroSession(session) {
  return (
    session.taskId &&
    session.taskId.trim().length > 0 &&
    (session.type === 'Work' || session.type === 'Rest') &&
    session.duration >= 1 &&
    session.duration <= 60 &&
    new Date(session.endTime) > new Date(session.startTime)
  );
}
