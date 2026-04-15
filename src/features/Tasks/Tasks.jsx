import { useTasks } from '../../hooks/useTasks';
import './Tasks.css';

export function Tasks() {
  const { tasks, taskCount } = useTasks();

  return (
    <main className="tasks">
      <h1 className="tasks-title">Tasks</h1>
      <p className="tasks-count">{taskCount()} tasks</p>
      {tasks.length === 0 ? (
        <p className="empty-state">No tasks yet</p>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-item">
              <h3>{task.name}</h3>
              <span className={`task-status status-${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
              </span>
              {task.description && <p>{task.description}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
