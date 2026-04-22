import { useState, useEffect } from 'react';
import { useComments } from '../../hooks/useComments';
import { useTasksContext } from '../../context/TasksContext';
import { usePomodoro } from '../../context/PomodoroContext';
import { PomodoroTimer } from '../Pomodoro/PomodoroTimer';
import { TASK_STATUS } from '../../constants/taskStatus';
import './TaskDetail.css';

const STATUS_COLORS = {
  'To Do':       '#8b949e',
  'In Progress': '#58a6ff',
  'Paused':      '#9e6a03',
  'Blocked':     '#da3633',
  'Done':        '#238636',
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function StopwatchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8"/>
      <polyline points="12 9 12 13 14.5 13"/>
      <path d="M9 3h6M12 3v2M5.6 5.6l1.4 1.4M18.4 5.6l-1.4 1.4"/>
    </svg>
  );
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(`${dateStr}T00:00:00`) < new Date(new Date().toDateString());
}

export function TaskDetailPanel({ task, onClose }) {
  const { getCommentsByTaskId, addComment, loading } = useComments();
  const { updateTask } = useTasksContext();
  const { taskId: pomodoroTaskId, isActive, mm, ss, sessionType } = usePomodoro();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const comments = getCommentsByTaskId(task.id);

  useEffect(() => { setCurrentStatus(task.status); }, [task.id, task.status]);

  const statusColor = STATUS_COLORS[currentStatus] || '#8b949e';
  const statusRgb   = hexToRgb(statusColor);

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

      {/* Header contextual con color de estado */}
      <div
        className="panel-task-header"
        style={{
          background: `linear-gradient(135deg, rgba(${statusRgb},0.14) 0%, rgba(${statusRgb},0.03) 100%)`,
          borderBottomColor: `rgba(${statusRgb},0.22)`,
        }}
      >
        <div className="panel-task-header-top">
          {/* Status pill select */}
          <div className="panel-status-wrap" style={{ '--status-color': statusColor, '--status-rgb': statusRgb }}>
            <select
              className="panel-status-select"
              value={currentStatus}
              onChange={handleStatusChange}
              disabled={updatingStatus}
            >
              {Object.values(TASK_STATUS).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <svg className="panel-status-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <button className="panel-close" onClick={onClose} aria-label="Cerrar panel">×</button>
        </div>

        <h2 className="panel-task-title">{task.name}</h2>
        {task.projectName && (
          <div className="panel-task-project">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            {task.projectName}
          </div>
        )}
      </div>

      <div className="panel-body">

        {/* Fechas compactas */}
        {(task.startDate || task.endDate) && (
          <div className="panel-dates-row">
            {task.startDate && (
              <div className="panel-date-cell">
                <span className="panel-date-label">Inicio</span>
                <span className="panel-date-value">
                  {new Date(`${task.startDate}T00:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            )}
            {task.startDate && task.endDate && <div className="panel-date-divider" />}
            {task.endDate && (
              <div className="panel-date-cell">
                <span className="panel-date-label">Vence</span>
                <span className={`panel-date-value${isOverdue(task.endDate) && currentStatus !== 'Done' ? ' panel-date-overdue' : ''}`}>
                  {new Date(`${task.endDate}T00:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Descripción */}
        {task.description && (
          <div className="panel-section">
            <div className="panel-section-label">Descripción</div>
            <div className="task-detail-description">{task.description}</div>
          </div>
        )}

        {/* Pomodoro */}
        <div className="panel-section">
          <div className="panel-pomodoro-label">
            <span className="panel-pomodoro-icon"><StopwatchIcon /></span>
            <span>Pomodoro</span>
            <span className="panel-pomodoro-line" />
          </div>

          {isActive && pomodoroTaskId !== task.id ? (
            <div className="pomodoro-busy-notice">
              <span className="pomodoro-busy-icon">⏱</span>
              <div>
                <div className="pomodoro-busy-title">Sesión activa en otra tarea</div>
                <div className="pomodoro-busy-time">{mm}:{ss} · {sessionType}</div>
              </div>
            </div>
          ) : (
            <PomodoroTimer taskId={task.id} />
          )}
        </div>

        {/* Comentarios */}
        <div className="panel-section">
          <div className="panel-section-label">Comentarios ({comments.length})</div>

          {loading ? (
            <p className="empty-state">Cargando...</p>
          ) : comments.length === 0 ? (
            <p className="empty-state">Sin comentarios aún.</p>
          ) : (
            <div className="comments-list">
              {comments.map((comment, index) => (
                <div key={comment.id} className={`comment-item${index < comments.length - 1 ? ' comment-item--bordered' : ''}`}>
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
              onChange={e => setNewComment(e.target.value)}
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
