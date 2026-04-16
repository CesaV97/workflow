import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createSession,
  deleteSession,
  listSessions,
  updateSession,
} from '../lib/workflowApi';

export function usePomodoroSessions() {
  const { user, isConfigured } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSessions = useCallback(async () => {
    if (!user || !isConfigured) {
      setSessions([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const nextSessions = await listSessions(user.id);
      setSessions(nextSessions);
    } catch (loadError) {
      setError(loadError.message ?? 'No se pudieron cargar las sesiones.');
    } finally {
      setLoading(false);
    }
  }, [isConfigured, user]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const addSession = useCallback(async (data) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    const created = await createSession(user.id, data);
    setSessions((prev) => [created, ...prev]);
    return created;
  }, [user]);

  const updateSessionById = useCallback(async (id, updates) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    const updated = await updateSession(user.id, id, updates);
    setSessions((prev) => prev.map((session) => (session.id === id ? updated : session)));
    return updated;
  }, [user]);

  const deleteSessionById = useCallback(async (id) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    await deleteSession(user.id, id);
    setSessions((prev) => prev.filter((session) => session.id !== id));
    return true;
  }, [user]);

  return useMemo(() => ({
    sessions,
    loading,
    error,
    addSession,
    getSessionById: (id) => sessions.find((session) => session.id === id),
    getSessionsByTaskId: (taskId) => sessions.filter((session) => session.taskId === taskId),
    getSessionsByType: (type) => sessions.filter((session) => session.type === type),
    updateSession: updateSessionById,
    deleteSession: deleteSessionById,
    sessionCount: () => sessions.length,
    reloadSessions: loadSessions,
  }), [addSession, deleteSessionById, error, loadSessions, loading, sessions, updateSessionById]);
}
