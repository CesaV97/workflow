import { useState } from 'react';
import { useComments } from '../../hooks/useComments';
import { Button } from '../../components/Common/Button';
import './Comments.css';

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
      <h3 className="comments-title">Comments</h3>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p className="comment-text">{comment.text}</p>
            <span className="comment-meta">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="comment-form">
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="2"
          className="comment-textarea"
        />
        <Button
          variant="primary"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          Comment
        </Button>
      </div>
    </div>
  );
}
