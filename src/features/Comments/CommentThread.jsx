import { useState } from 'react';
import { useComments } from '../../hooks/useComments';
import './CommentThread.css';

export function CommentThread({ taskId }) {
  const { getCommentsByTaskId, addComment, loading } = useComments();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const comments = getCommentsByTaskId(taskId);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      await addComment(taskId, newComment);
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-thread">
      <div className="comments-list">
        {loading ? (
          <p className="empty-state">Cargando comentarios...</p>
        ) : comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p className="comment-text">{comment.text}</p>
            <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="comment-input-group">
        <textarea
          className="comment-input"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          rows="3"
        />
        <button className="comment-submit" onClick={handleAddComment} disabled={!newComment.trim() || submitting}>
          {submitting ? 'Saving...' : 'Add Comment'}
        </button>
      </div>
    </div>
  );
}
