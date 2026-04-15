import { useState } from 'react';
import { useComments } from '../../hooks/useComments';
import './CommentThread.css';

export function CommentThread({ taskId }) {
  const { getCommentsByTaskId, addComment } = useComments();
  const [newComment, setNewComment] = useState('');
  const comments = getCommentsByTaskId(taskId);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(taskId, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="comment-thread">
      <div className="comments-list">
        {comments.map((comment) => (
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
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
        />
        <button
          className="comment-submit"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          Add Comment
        </button>
      </div>
    </div>
  );
}
