import { useTasks } from '../../hooks/useTasks';
import './Tasks.css';

export function Tasks({ onTaskSelect }) {
  const { tasks, taskCount } = useTasks();

  return (
    <main className="tasks">
      <h1 className="tasks-title">Tareas</h1>
      <p className="tasks-count">{taskCount()} tareas</p>
      {tasks.length === 0 ? (
        <p className="empty-state">No hay tareas aún</p>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="task-item task-item--clickable"
              onClick={() => onTaskSelect && onTaskSelect(task)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onTaskSelect && onTaskSelect(task)}
            >
              <h3 className="task-name">{task.name}</h3>
              <span className={`task-status status-${(task.status ?? '').toLowerCase().replaceAll(' ', '-')}`}>
                {task.status}
              </span>
              {task.description && <p className="task-description">{task.description}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
