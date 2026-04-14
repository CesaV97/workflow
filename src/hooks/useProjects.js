import { useLocalStorage } from './useLocalStorage';
import { createProject } from '../data/entities/Project';

/**
 * Custom hook for managing projects with localStorage persistence
 * Provides CRUD operations for projects
 *
 * @returns {object} Project management interface:
 *   - projects: Array of all projects
 *   - addProject(data): Create and add new project
 *   - getProjectById(id): Retrieve project by ID
 *   - updateProject(id, updates): Update project properties
 *   - deleteProject(id): Remove project by ID
 *   - projectCount(): Get total number of projects
 */
export function useProjects() {
  const storage = useLocalStorage('projects');

  // Load projects from localStorage, default to empty array
  let projects = storage.getItem() || [];

  /**
   * Save projects to localStorage
   */
  const saveProjects = () => {
    storage.setItem(projects);
  };

  /**
   * Add a new project
   * @param {object} data - Project data (name, description, etc.)
   * @returns {object} Created project with ID and timestamps
   */
  const addProject = (data) => {
    const newProject = createProject(data);
    projects.push(newProject);
    saveProjects();
    return newProject;
  };

  /**
   * Get all projects
   * @returns {array} All projects
   */
  const getAllProjects = () => projects;

  /**
   * Get project by ID
   * @param {string} id - Project ID
   * @returns {object|undefined} Project or undefined if not found
   */
  const getProjectById = (id) => {
    return projects.find(p => p.id === id);
  };

  /**
   * Update a project
   * @param {string} id - Project ID
   * @param {object} updates - Fields to update
   * @returns {object|undefined} Updated project or undefined if not found
   */
  const updateProject = (id, updates) => {
    const project = getProjectById(id);
    if (!project) {
      return undefined;
    }

    const updated = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const index = projects.findIndex(p => p.id === id);
    projects[index] = updated;
    saveProjects();
    return updated;
  };

  /**
   * Delete a project
   * @param {string} id - Project ID
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteProject = (id) => {
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      return false;
    }

    projects.splice(index, 1);
    saveProjects();
    return true;
  };

  /**
   * Get total project count
   * @returns {number} Number of projects
   */
  const projectCount = () => projects.length;

  return {
    get projects() {
      return getAllProjects();
    },
    addProject,
    getProjectById,
    updateProject,
    deleteProject,
    projectCount,
  };
}
