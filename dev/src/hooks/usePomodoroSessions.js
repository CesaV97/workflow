import { useLocalStorage } from './useLocalStorage';
import { createPomodoroSession } from '../data/entities/PomodoroSession';

/**
 * Custom hook for managing Pomodoro sessions with localStorage persistence
 * Provides CRUD operations and filtering by task/type
 *
 * @returns {object} Session management interface:
 *   - sessions: Array of all sessions
 *   - addSession(data): Create and add new session
 *   - getSessionById(id): Retrieve session by ID
 *   - getSessionsByTaskId(taskId): Get all sessions for a task
 *   - getSessionsByType(type): Get all sessions of a type (Work/Rest)
 *   - updateSession(id, updates): Update session properties
 *   - deleteSession(id): Remove session by ID
 *   - sessionCount(): Get total number of sessions
 */
export function usePomodoroSessions() {
  const storage = useLocalStorage('pomodoroSessions');

  // Load sessions from localStorage, default to empty array
  let sessions = storage.getItem() || [];

  /**
   * Save sessions to localStorage
   */
  const saveSessions = () => {
    storage.setItem(sessions);
  };

  /**
   * Add a new session
   * @param {object} data - Session data (taskId, type, duration, startTime, endTime, status)
   * @returns {object} Created session with generated ID
   */
  const addSession = (data) => {
    const newSession = createPomodoroSession(data);
    sessions.push(newSession);
    saveSessions();
    return newSession;
  };

  /**
   * Get all sessions
   * @returns {array} All sessions
   */
  const getAllSessions = () => sessions;

  /**
   * Get session by ID
   * @param {string} id - Session ID
   * @returns {object|undefined} Session or undefined if not found
   */
  const getSessionById = (id) => {
    return sessions.find(s => s.id === id);
  };

  /**
   * Get all sessions for a task
   * @param {string} taskId - Task ID
   * @returns {array} Sessions for the task
   */
  const getSessionsByTaskId = (taskId) => {
    return sessions.filter(s => s.taskId === taskId);
  };

  /**
   * Get all sessions of a type
   * @param {string} type - Session type (Work or Rest)
   * @returns {array} Sessions of the type
   */
  const getSessionsByType = (type) => {
    return sessions.filter(s => s.type === type);
  };

  /**
   * Update a session
   * @param {string} id - Session ID
   * @param {object} updates - Fields to update
   * @returns {object|undefined} Updated session or undefined if not found
   */
  const updateSession = (id, updates) => {
    const session = getSessionById(id);
    if (!session) {
      return undefined;
    }

    const updated = {
      ...session,
      ...updates,
    };

    const index = sessions.findIndex(s => s.id === id);
    sessions[index] = updated;
    saveSessions();
    return updated;
  };

  /**
   * Delete a session
   * @param {string} id - Session ID
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteSession = (id) => {
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) {
      return false;
    }

    sessions.splice(index, 1);
    saveSessions();
    return true;
  };

  /**
   * Get total session count
   * @returns {number} Number of sessions
   */
  const sessionCount = () => sessions.length;

  return {
    get sessions() {
      return getAllSessions();
    },
    addSession,
    getSessionById,
    getSessionsByTaskId,
    getSessionsByType,
    updateSession,
    deleteSession,
    sessionCount,
  };
}
