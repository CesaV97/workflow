import { Badge } from '../../components/Common/Badge';

/**
 * TaskListItem component - Displays a single task in list format
 *
 * @param {object} task - Task object
 * @param {object} project - Associated project object
 */
export function TaskListItem({ task, project }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'info';
      case 'In Progress':
        return 'warning';
      case 'Done':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <div className="task-list-item">
      <div className="task-item-content">
        <h3 className="task-item-name">{task.name}</h3>
        {task.description && <p className="task-item-description">{task.description}</p>}
      </div>
      <div className="task-item-meta">
        {project && <span className="task-item-project">{project.name}</span>}
        <Badge color={getStatusColor(task.status)}>{task.status}</Badge>
      </div>
    </div>
  );
}
