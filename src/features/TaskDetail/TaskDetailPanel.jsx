import { useState } from 'react';
import { useComments } from '../../hooks/useComments';
import { Button } from '../../components/Common/Button';
import { TaskInfo } from './TaskInfo';
import './TaskDetail.css';

/**
 * TaskDetailPanel component - Detailed view of a single task
 * Shows task info and comments
 *
 * @param {object} task - Task object to display
 * @param {function} onClose - Close handler
 */
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

  return (
    <div className="task-detail-panel">
      <div className="detail-header">
        <h2 className="detail-title">{task.name}</h2>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>

      <TaskInfo task={task} />

      <div className="comments-section">
        <h3 className="section-title">Comments</h3>

        {taskComments.length > 0 && (
          <div className="comments-list">
            {taskComments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <p className="comment-text">{comment.text}</p>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
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
