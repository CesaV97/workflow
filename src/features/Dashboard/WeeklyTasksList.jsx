/**
 * WeeklyTasksList component - Displays tasks in a list format
 *
 * @param {array} tasks - Array of task objects
 */
export function WeeklyTasksList({ tasks = [] }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Create one to get started!</p>;
  }

  return (
    <div className="tasks-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <div className="task-header">
            <h4 className="task-name">{task.name}</h4>
            <span className={`task-status status-${(task.status ?? '').toLowerCase().replaceAll(' ', '-')}`}>
              {task.status}
            </span>
          </div>
          <p className="task-description">{task.description || 'No description'}</p>
        </div>
      ))}
    </div>
  );
}
