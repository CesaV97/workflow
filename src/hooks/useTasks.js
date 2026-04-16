import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createTask as createTaskEntity } from '../data/entities/Task';
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from '../lib/workflowApi';

export function useTasks() {
  const { user, isConfigured } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    if (!user || !isConfigured) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const nextTasks = await listTasks(user.id);
      setTasks(nextTasks);
    } catch (loadError) {
      setError(loadError.message ?? 'No se pudieron cargar las tareas.');
    } finally {
      setLoading(false);
    }
  }, [isConfigured, user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = useCallback(async (data) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    const payload = createTaskEntity(data);
    const created = await createTask(user.id, payload);
    setTasks((prev) => [created, ...prev]);
    return created;
  }, [user]);

  const updateTaskById = useCallback(async (id, updates) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    const updated = await updateTask(user.id, id, updates);
    setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    return updated;
  }, [user]);

  const deleteTaskById = useCallback(async (id) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    await deleteTask(user.id, id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
    return true;
  }, [user]);

  return useMemo(() => ({
    tasks,
    loading,
    error,
    addTask,
    getTaskById: (id) => tasks.find((task) => task.id === id),
    getTasksByProjectId: (projectId) => tasks.filter((task) => task.projectId === projectId),
    getTasksByStatus: (status) => tasks.filter((task) => task.status === status),
    updateTask: updateTaskById,
    deleteTask: deleteTaskById,
    taskCount: () => tasks.length,
    reloadTasks: loadTasks,
  }), [addTask, deleteTaskById, error, loadTasks, loading, tasks, updateTaskById]);
}
