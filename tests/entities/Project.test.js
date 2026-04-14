import { describe, it, expect, beforeEach } from 'vitest';
import { createProject, projectSchema } from '../../src/data/entities/Project';
import { PROJECT_STATUS } from '../../src/constants/projectStatus';

describe('Project entity', () => {
  let projectData;

  beforeEach(() => {
    projectData = {
      name: 'Test Project',
      description: 'A test project',
      startDate: '2026-04-13',
      endDate: '2026-05-13',
    };
  });

  it('should have correct schema shape', () => {
    expect(projectSchema).toHaveProperty('id');
    expect(projectSchema).toHaveProperty('name');
    expect(projectSchema).toHaveProperty('description');
    expect(projectSchema).toHaveProperty('startDate');
    expect(projectSchema).toHaveProperty('endDate');
    expect(projectSchema).toHaveProperty('status');
    expect(projectSchema).toHaveProperty('createdAt');
    expect(projectSchema).toHaveProperty('updatedAt');
  });

  it('should create project with generated ID', () => {
    const project = createProject(projectData);
    expect(project.id).toBeDefined();
    expect(project.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should create project with default status', () => {
    const project = createProject(projectData);
    expect(project.status).toBe('Active');
  });

  it('should set timestamps on creation', () => {
    const beforeCreate = new Date().getTime();
    const project = createProject(projectData);
    const afterCreate = new Date().getTime();

    expect(new Date(project.createdAt).getTime()).toBeGreaterThanOrEqual(beforeCreate);
    expect(new Date(project.createdAt).getTime()).toBeLessThanOrEqual(afterCreate);
    expect(project.updatedAt).toBe(project.createdAt);
  });

  it('should preserve provided data in project', () => {
    const project = createProject(projectData);
    expect(project.name).toBe('Test Project');
    expect(project.description).toBe('A test project');
    expect(project.startDate).toBe('2026-04-13');
    expect(project.endDate).toBe('2026-05-13');
  });

  it('should create unique projects', () => {
    const project1 = createProject(projectData);
    const project2 = createProject(projectData);
    expect(project1.id).not.toBe(project2.id);
  });
});
