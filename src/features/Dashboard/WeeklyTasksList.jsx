function groupTasksByDate(tasks) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);

  const groups = { today: [], tomorrow: [], upcoming: [] };

  tasks
    .filter(t => t.status !== 'Done' && t.endDate)
    .forEach(task => {
      const d = new Date(task.endDate + 'T00:00:00');
      if (d.getTime() === today.getTime()) {
        groups.today.push(task);
      } else if (d.getTime() === tomorrow.getTime()) {
        groups.tomorrow.push(task);
      } else if (d > today && d <= weekEnd) {
        groups.upcoming.push(task);
      }
    });

  return groups;
}

export function WeeklyTasksList({ tasks = [], onTaskClick }) {
  const groups = groupTasksByDate(tasks);
  const hasAny = groups.today.length > 0 || groups.tomorrow.length > 0 || groups.upcoming.length > 0;

  if (!hasAny) {
    return <p className="empty-state">No hay tareas para esta semana.</p>;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowLabel = tomorrow.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });

  const renderGroup = (label, taskList) => {
    if (taskList.length === 0) return null;
    return (
      <div className="task-date-group">
        <div className="task-date-label">{label}</div>
        {taskList.map(task => (
          <div
            key={task.id}
            className="weekly-task-item"
            onClick={() => onTaskClick && onTaskClick(task)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onTaskClick && onTaskClick(task)}
          >
            <div className="weekly-task-name">{task.name}</div>
            <div className="weekly-task-meta">
              {task.projectId && <span>{task.projectId}</span>}
              <span className={`task-status-inline status-${(task.status ?? '').toLowerCase().replaceAll(' ', '-')}`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="weekly-tasks">
      {renderGroup('HOY', groups.today)}
      {renderGroup(`MAÑANA (${tomorrowLabel})`, groups.tomorrow)}
      {renderGroup('PRÓXIMOS DÍAS', groups.upcoming)}
    </div>
  );
}
