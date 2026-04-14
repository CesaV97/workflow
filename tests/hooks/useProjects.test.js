import { describe, it, expect, beforeEach } from 'vitest';
import { useProjects } from '../../src/hooks/useProjects';
import { createProject } from '../../src/data/entities/Project';

describe('useProjects hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty array', () => {
    const { projects } = useProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBe(0);
  });

  it('should add a new project', () => {
    const { projects, addProject } = useProjects();
    const newProject = addProject({ name: 'Test Project', description: 'Test Description' });

    expect(newProject.id).toBeDefined();
    expect(newProject.name).toBe('Test Project');
    expect(projects.length).toBe(1);
    expect(projects[0].id).toBe(newProject.id);
  });

  it('should retrieve all projects', () => {
    const { addProject, projects } = useProjects();
    addProject({ name: 'Project 1' });
    addProject({ name: 'Project 2' });

    expect(projects.length).toBe(2);
    expect(projects[0].name).toBe('Project 1');
    expect(projects[1].name).toBe('Project 2');
  });

  it('should retrieve project by ID', () => {
    const { addProject, getProjectById } = useProjects();
    const added = addProject({ name: 'Test Project' });
    const retrieved = getProjectById(added.id);

    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(added.id);
    expect(retrieved.name).toBe('Test Project');
  });

  it('should return undefined for non-existent project ID', () => {
    const { getProjectById } = useProjects();
    const result = getProjectById('non-existent-id');
    expect(result).toBeUndefined();
  });

  it('should update an existing project', () => {
    const { addProject, updateProject, getProjectById } = useProjects();
    const added = addProject({ name: 'Original Name', description: 'Original' });

    const updated = updateProject(added.id, { name: 'Updated Name' });
    expect(updated.name).toBe('Updated Name');
    expect(updated.description).toBe('Original'); // Other fields preserved

    const retrieved = getProjectById(added.id);
    expect(retrieved.name).toBe('Updated Name');
  });

  it('should return undefined when updating non-existent project', () => {
    const { updateProject } = useProjects();
    const result = updateProject('non-existent-id', { name: 'New Name' });
    expect(result).toBeUndefined();
  });

  it('should delete a project', () => {
    const { addProject, deleteProject, getProjectById } = useProjects();
    const added = addProject({ name: 'Test Project' });

    const deleted = deleteProject(added.id);
    expect(deleted).toBe(true);
    expect(getProjectById(added.id)).toBeUndefined();
  });

  it('should return false when deleting non-existent project', () => {
    const { deleteProject } = useProjects();
    const result = deleteProject('non-existent-id');
    expect(result).toBe(false);
  });

  it('should persist projects to localStorage', () => {
    const { addProject } = useProjects();
    addProject({ name: 'Persistent Project' });

    // Simulate app restart by creating new hook instance
    const { projects } = useProjects();
    expect(projects.length).toBe(1);
    expect(projects[0].name).toBe('Persistent Project');
  });

  it('should load persisted projects on initialization', () => {
    // Set up localStorage with persisted data
    const projectData = [{ id: 'uuid-1', name: 'Loaded Project', description: '', startDate: '', endDate: '', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
    localStorage.setItem('projects', JSON.stringify(projectData));

    const { projects } = useProjects();
    expect(projects.length).toBe(1);
    expect(projects[0].name).toBe('Loaded Project');
  });

  it('should provide project count', () => {
    const { addProject, projectCount } = useProjects();
    expect(projectCount()).toBe(0);
    addProject({ name: 'Project 1' });
    expect(projectCount()).toBe(1);
    addProject({ name: 'Project 2' });
    expect(projectCount()).toBe(2);
  });
});
