import { useLocalStorage } from './useLocalStorage';
import { createComment } from '../data/entities/Comment';

/**
 * Custom hook for managing comments with localStorage persistence
 * Provides CRUD operations and filtering by task
 *
 * @returns {object} Comment management interface:
 *   - comments: Array of all comments
 *   - addComment(taskId, text): Create and add new comment
 *   - getCommentById(id): Retrieve comment by ID
 *   - getCommentsByTaskId(taskId): Get all comments for a task
 *   - updateComment(id, updates): Update comment properties
 *   - deleteComment(id): Remove comment by ID
 *   - commentCount(): Get total number of comments
 */
export function useComments() {
  const storage = useLocalStorage('comments');

  // Load comments from localStorage, default to empty array
  let comments = storage.getItem() || [];

  /**
   * Save comments to localStorage
   */
  const saveComments = () => {
    storage.setItem(comments);
  };

  /**
   * Add a new comment
   * @param {string} taskId - ID of the parent task
   * @param {string} text - Comment text content
   * @returns {object} Created comment with ID and timestamp
   */
  const addComment = (taskId, text) => {
    const newComment = createComment(taskId, text);
    comments.push(newComment);
    saveComments();
    return newComment;
  };

  /**
   * Get all comments
   * @returns {array} All comments
   */
  const getAllComments = () => comments;

  /**
   * Get comment by ID
   * @param {string} id - Comment ID
   * @returns {object|undefined} Comment or undefined if not found
   */
  const getCommentById = (id) => {
    return comments.find(c => c.id === id);
  };

  /**
   * Get all comments for a task
   * @param {string} taskId - Task ID
   * @returns {array} Comments for the task
   */
  const getCommentsByTaskId = (taskId) => {
    return comments.filter(c => c.taskId === taskId);
  };

  /**
   * Update a comment
   * @param {string} id - Comment ID
   * @param {object} updates - Fields to update
   * @returns {object|undefined} Updated comment or undefined if not found
   */
  const updateComment = (id, updates) => {
    const comment = getCommentById(id);
    if (!comment) {
      return undefined;
    }

    const updated = {
      ...comment,
      ...updates,
    };

    const index = comments.findIndex(c => c.id === id);
    comments[index] = updated;
    saveComments();
    return updated;
  };

  /**
   * Delete a comment
   * @param {string} id - Comment ID
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteComment = (id) => {
    const index = comments.findIndex(c => c.id === id);
    if (index === -1) {
      return false;
    }

    comments.splice(index, 1);
    saveComments();
    return true;
  };

  /**
   * Get total comment count
   * @returns {number} Number of comments
   */
  const commentCount = () => comments.length;

  return {
    get comments() {
      return getAllComments();
    },
    addComment,
    getCommentById,
    getCommentsByTaskId,
    updateComment,
    deleteComment,
    commentCount,
  };
}
