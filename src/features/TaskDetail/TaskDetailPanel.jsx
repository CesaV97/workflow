import { useState } from 'react';
import { useComments } from '../../hooks/useComments';
import { PomodoroTimer } from '../Pomodoro/PomodoroTimer';
import './TaskDetail.css';

export function TaskDetailPanel({ task, onClose }) {
  const { getCommentsByTaskId, addComment, loading } = useComments();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const comments = getCommentsByTaskId(task.id);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      await addComment(task.id, newComment);
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColorMap = {
    'To Do': '#8b949e',
    'In Progress': '#58a6ff',
    Paused: '#9e6a03',
    Blocked: '#da3633',
    Done: '#238636',
  };
  const statusColor = statusColorMap[task.status] || '#8b949e';

  return (
    <aside className="task-detail-panel">
      <div className="panel-header">
        <h3 className="panel-header-title">Detalles de tarea</h3>
        <button className="panel-close" onClick={onClose} aria-label="Cerrar panel">×</button>
      </div>

      <div className="panel-body">
        <div className="panel-section">
          <h2 className="task-detail-title">{task.name}</h2>
          {task.projectName && <div className="task-detail-project">{task.projectName}</div>}
        </div>

        <div className="panel-row">
          <label className="panel-label">Estado</label>
          <span className="task-detail-status" style={{ background: statusColor }}>
            {task.status}
          </span>
        </div>

        {(task.startDate || task.endDate) && (
          <div className="panel-section">
            <label className="panel-label">Fechas</label>
            <div className="panel-dates">
              {task.startDate && (
                <div className="date-item">
                  <div className="date-label">Inicio</div>
                  <div className="date-value">
                    {new Date(`${task.startDate}T00:00:00`).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              )}
              {task.endDate && (
                <div className="date-item">
                  <div className="date-label">Vencimiento</div>
                  <div className="date-value">
                    {new Date(`${task.endDate}T00:00:00`).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {task.description && (
          <div className="panel-section">
            <label className="panel-label">Descripción</label>
            <div className="task-detail-description">{task.description}</div>
          </div>
        )}

        <div className="panel-section">
          <label className="panel-label">Pomodoro timer</label>
          <PomodoroTimer taskId={task.id} />
        </div>

        <div className="panel-section">
          <label className="panel-label">Comentarios ({comments.length})</label>

          {loading ? (
            <p className="empty-state">Cargando comentarios...</p>
          ) : comments.length > 0 && (
            <div className="comments-list">
              {comments.map((comment, index) => (
                <div key={comment.id} className={`comment-item ${index < comments.length - 1 ? 'comment-item--bordered' : ''}`}>
                  <div className="comment-meta">
                    <span className="comment-author">Tú</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="comment-input-box">
            <textarea
              className="comment-textarea"
              placeholder="Agregar comentario..."
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              rows={2}
            />
            <div className="comment-submit-row">
              <button className="comment-submit-btn" onClick={handleAddComment} disabled={!newComment.trim() || submitting}>
                {submitting ? 'Guardando...' : '+ Agregar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
