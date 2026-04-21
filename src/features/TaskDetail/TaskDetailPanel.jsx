import { useState, useEffect } from 'react';
import { useComments } from '../../hooks/useComments';
import { useTasksContext } from '../../context/TasksContext';
import { usePomodoro } from '../../context/PomodoroContext';
import { PomodoroTimer } from '../Pomodoro/PomodoroTimer';
import { TASK_STATUS } from '../../constants/taskStatus';
import './TaskDetail.css';

const STATUS_COLORS = {
  'To Do': '#8b949e',
  'In Progress': '#58a6ff',
  'Paused': '#9e6a03',
  'Blocked': '#da3633',
  'Done': '#238636',
};

export function TaskDetailPanel({ task, onClose }) {
  const { getCommentsByTaskId, addComment, loading } = useComments();
  const { updateTask } = useTasksContext();
  const { taskId: pomodoroTaskId, isActive, mm, ss, sessionType } = usePomodoro();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const comments = getCommentsByTaskId(task.id);

  useEffect(() => {
    setCurrentStatus(task.status);
  }, [task.id, task.status]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    setUpdatingStatus(true);
    try {
      await updateTask(task.id, { ...task, status: newStatus });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await addComment(task.id, newComment);
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

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
          <div className="status-select-wrapper" style={{ '--status-color': STATUS_COLORS[currentStatus] || '#8b949e' }}>
            <select
              className="status-select"
              value={currentStatus}
              onChange={handleStatusChange}
              disabled={updatingStatus}
            >
              {Object.values(TASK_STATUS).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
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
          {isActive && pomodoroTaskId !== task.id ? (
            <div className="pomodoro-busy-notice">
              <span className="pomodoro-busy-icon">🍅</span>
              <div>
                <div className="pomodoro-busy-title">Sesión activa en otra tarea</div>
                <div className="pomodoro-busy-time">{mm}:{ss} · {sessionType}</div>
              </div>
            </div>
          ) : (
            <PomodoroTimer taskId={task.id} />
          )}
        </div>

        <div className="panel-section">
          <label className="panel-label">Comentarios ({comments.length})</label>

          {loading ? (
            <p className="empty-state">Cargando comentarios...</p>
          ) : comments.length === 0 ? (
            <p className="empty-state">Sin comentarios aún.</p>
          ) : (
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
