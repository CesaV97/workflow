import { useLocalStorage } from './useLocalStorage';
import { createTask } from '../data/entities/Task';

/**
 * Custom hook for managing tasks with localStorage persistence
 * Provides CRUD operations and filtering by project/status
 *
 * @returns {object} Task management interface:
 *   - tasks: Array of all tasks
 *   - addTask(data): Create and add new task
 *   - getTaskById(id): Retrieve task by ID
 *   - getTasksByProjectId(projectId): Get all tasks for a project
 *   - getTasksByStatus(status): Get all tasks with a status
 *   - updateTask(id, updates): Update task properties
 *   - deleteTask(id): Remove task by ID
 *   - taskCount(): Get total number of tasks
 */
export function useTasks() {
  const storage = useLocalStorage('tasks');

  // Load tasks from localStorage, default to empty array
  let tasks = storage.getItem() || [];

  /**
   * Save tasks to localStorage
   */
  const saveTasks = () => {
    storage.setItem(tasks);
  };

  /**
   * Add a new task
   * @param {object} data - Task data (projectId, name, status, etc.)
   * @returns {object} Created task with ID and timestamps
   */
  const addTask = (data) => {
    const newTask = createTask(data);
    tasks.push(newTask);
    saveTasks();
    return newTask;
  };

  /**
   * Get all tasks
   * @returns {array} All tasks
   */
  const getAllTasks = () => tasks;

  /**
   * Get task by ID
   * @param {string} id - Task ID
   * @returns {object|undefined} Task or undefined if not found
   */
  const getTaskById = (id) => {
    return tasks.find(t => t.id === id);
  };

  /**
   * Get all tasks for a project
   * @param {string} projectId - Project ID
   * @returns {array} Tasks for the project
   */
  const getTasksByProjectId = (projectId) => {
    return tasks.filter(t => t.projectId === projectId);
  };

  /**
   * Get all tasks with a specific status
   * @param {string} status - Task status (To Do, In Progress, etc.)
   * @returns {array} Tasks with the status
   */
  const getTasksByStatus = (status) => {
    return tasks.filter(t => t.status === status);
  };

  /**
   * Update a task
   * @param {string} id - Task ID
   * @param {object} updates - Fields to update
   * @returns {object|undefined} Updated task or undefined if not found
   */
  const updateTask = (id, updates) => {
    const task = getTaskById(id);
    if (!task) {
      return undefined;
    }

    const updated = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const index = tasks.findIndex(t => t.id === id);
    tasks[index] = updated;
    saveTasks();
    return updated;
  };

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteTask = (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      return false;
    }

    tasks.splice(index, 1);
    saveTasks();
    return true;
  };

  /**
   * Get total task count
   * @returns {number} Number of tasks
   */
  const taskCount = () => tasks.length;

  return {
    get tasks() {
      return getAllTasks();
    },
    addTask,
    getTaskById,
    getTasksByProjectId,
    getTasksByStatus,
    updateTask,
    deleteTask,
    taskCount,
  };
}
