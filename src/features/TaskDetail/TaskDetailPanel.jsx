import { useComments } from '../../hooks/useComments';
import { useState } from 'react';
import { Button } from '../../components/Common/Button';
import { Badge } from '../../components/Common/Badge';
import './TaskDetail.css';

export function TaskDetailPanel({ task, onClose }) {
  const { getCommentsByTaskId, addComment } = useComments();
  const [newComment, setNewComment] = useState('');
  const taskComments = getCommentsByTaskId(task.id);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(task.id, newComment);
      setNewComment('');
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'info';
    switch (status.toLowerCase()) {
      case 'to do': return 'info';
      case 'in progress': return 'warning';
      case 'done': return 'success';
      default: return 'info';
    }
  };

  return (
    <div className="task-detail-panel">
      <div className="detail-header">
        <h2 className="detail-title">{task.name}</h2>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>

      <div className="task-info">
        <div className="info-group">
          <label className="info-label">Status</label>
          <Badge color={getStatusColor(task.status)}>{task.status}</Badge>
        </div>

        {task.description && (
          <div className="info-group">
            <label className="info-label">Description</label>
            <p className="info-value">{task.description}</p>
          </div>
        )}

        <div className="info-group">
          <label className="info-label">Created</label>
          <p className="info-value">{new Date(task.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="comments-section">
        <h3 className="section-title">Comments</h3>

        {taskComments.length > 0 && (
          <div className="comments-list">
            {taskComments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <p className="comment-text">{comment.text}</p>
                <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        <div className="comment-input-group">
          <textarea
            className="comment-input"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
          />
          <Button
            variant="primary"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
