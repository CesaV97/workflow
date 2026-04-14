import { Badge } from '../../components/Common/Badge';

/**
 * TaskInfo component - Displays task information
 *
 * @param {object} task - Task object to display
 */
export function TaskInfo({ task }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'info';
      case 'In Progress':
        return 'warning';
      case 'Done':
        return 'success';
      case 'Blocked':
      case 'Paused':
        return 'danger';
      default:
        return 'info';
    }
  };

  return (
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

      <div className="info-group">
        <label className="info-label">Last Updated</label>
        <p className="info-value">{new Date(task.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
