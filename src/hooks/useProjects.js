import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createProject as createProjectEntity } from '../data/entities/Project';
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from '../lib/workflowApi';

export function useProjects() {
  const { user, isConfigured } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProjects = useCallback(async () => {
    if (!user || !isConfigured) {
      setProjects([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const nextProjects = await listProjects(user.id);
      setProjects(nextProjects);
    } catch (loadError) {
      setError(loadError.message ?? 'No se pudieron cargar los proyectos.');
    } finally {
      setLoading(false);
    }
  }, [isConfigured, user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const addProject = useCallback(async (data) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    const payload = createProjectEntity(data);
    const created = await createProject(user.id, payload);
    setProjects((prev) => [created, ...prev]);
    return created;
  }, [user]);

  const updateProjectById = useCallback(async (id, updates) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    const updated = await updateProject(user.id, id, updates);
    setProjects((prev) => prev.map((project) => (project.id === id ? updated : project)));
    return updated;
  }, [user]);

  const deleteProjectById = useCallback(async (id) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    await deleteProject(user.id, id);
    setProjects((prev) => prev.filter((project) => project.id !== id));
    return true;
  }, [user]);

  return useMemo(() => ({
    projects,
    loading,
    error,
    addProject,
    getProjectById: (id) => projects.find((project) => project.id === id),
    updateProject: updateProjectById,
    deleteProject: deleteProjectById,
    projectCount: () => projects.length,
    reloadProjects: loadProjects,
  }), [addProject, deleteProjectById, error, loadProjects, loading, projects, updateProjectById]);
}
