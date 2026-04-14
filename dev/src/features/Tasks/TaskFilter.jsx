import './TaskFilter.css';

const TASK_STATUSES = ['To Do', 'In Progress', 'Paused', 'Blocked', 'Done'];

/**
 * TaskFilter component - Filter tasks by status
 *
 * @param {string} currentStatus - Currently selected status
 * @param {function} onStatusChange - Callback when status changes
 */
export function TaskFilter({ currentStatus, onStatusChange }) {
  return (
    <div className="task-filter">
      <label className="filter-label">Status:</label>
      <div className="filter-buttons">
        <button
          className={`filter-btn ${!currentStatus ? 'active' : ''}`}
          onClick={() => onStatusChange('')}
        >
          All
        </button>
        {TASK_STATUSES.map((status) => (
          <button
            key={status}
            className={`filter-btn ${currentStatus === status ? 'active' : ''}`}
            onClick={() => onStatusChange(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
