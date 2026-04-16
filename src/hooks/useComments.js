import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createComment,
  deleteComment,
  listComments,
  updateComment,
} from '../lib/workflowApi';

export function useComments() {
  const { user, isConfigured } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadComments = useCallback(async () => {
    if (!user || !isConfigured) {
      setComments([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const nextComments = await listComments(user.id);
      setComments(nextComments);
    } catch (loadError) {
      setError(loadError.message ?? 'No se pudieron cargar los comentarios.');
    } finally {
      setLoading(false);
    }
  }, [isConfigured, user]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const addComment = useCallback(async (taskId, text) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    const created = await createComment(user.id, { taskId, text });
    setComments((prev) => [...prev, created]);
    return created;
  }, [user]);

  const updateCommentById = useCallback(async (id, updates) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    const updated = await updateComment(user.id, id, updates);
    setComments((prev) => prev.map((comment) => (comment.id === id ? updated : comment)));
    return updated;
  }, [user]);

  const deleteCommentById = useCallback(async (id) => {
    if (!user) {
      throw new Error('No authenticated user found.');
    }

    await deleteComment(user.id, id);
    setComments((prev) => prev.filter((comment) => comment.id !== id));
    return true;
  }, [user]);

  return useMemo(() => ({
    comments,
    loading,
    error,
    addComment,
    getCommentById: (id) => comments.find((comment) => comment.id === id),
    getCommentsByTaskId: (taskId) => comments.filter((comment) => comment.taskId === taskId),
    updateComment: updateCommentById,
    deleteComment: deleteCommentById,
    commentCount: () => comments.length,
    reloadComments: loadComments,
  }), [addComment, comments, deleteCommentById, error, loadComments, loading, updateCommentById]);
}
