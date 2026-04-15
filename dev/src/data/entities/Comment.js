import { generateId } from '../../utils/idGenerator';

export const commentSchema = {
  id: '',
  taskId: '',
  text: '',
  createdAt: '',
};

/**
 * Create a new Comment entity
 * Comments are stored separately from Tasks, linked via taskId
 * @param {string} taskId - ID of the parent task
 * @param {string} text - Comment text content
 * @returns {object} Complete Comment object with generated ID and timestamp
 */
export function createComment(taskId, text) {
  return {
    ...commentSchema,
    id: generateId(),
    taskId,
    text,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Validate comment has required fields
 * @param {object} comment - Comment object to validate
 * @returns {boolean} True if valid
 */
export function isValidComment(comment) {
  return (
    comment.taskId &&
    comment.taskId.trim().length > 0 &&
    comment.text &&
    comment.text.trim().length > 0
  );
}
