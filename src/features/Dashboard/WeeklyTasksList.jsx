function groupTasksByDate(tasks) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);

  const groups = { today: [], tomorrow: [], upcoming: [] };

  tasks
    .filter((task) => task.status !== 'Done' && task.endDate)
    .forEach((task) => {
      const dueDate = new Date(`${task.endDate}T00:00:00`);
      if (dueDate.getTime() === today.getTime()) {
        groups.today.push(task);
      } else if (dueDate.getTime() === tomorrow.getTime()) {
        groups.tomorrow.push(task);
      } else if (dueDate > today && dueDate <= weekEnd) {
        groups.upcoming.push(task);
      }
    });

  return groups;
}

function statusClass(s = '') {
  return 'status-' + s.toLowerCase().replaceAll(' ', '-');
}

function StatusPill({ status }) {
  return <span className={`task-status ${statusClass(status)}`}>{status}</span>;
}

export function WeeklyTasksList({ tasks = [], onTaskClick, selectedTaskId }) {
  const groups = groupTasksByDate(tasks);
  const hasAny = groups.today.length > 0 || groups.tomorrow.length > 0 || groups.upcoming.length > 0;

  if (!hasAny) {
    return <p className="empty-state">No hay tareas para esta semana.</p>;
  }

  const todayStr = new Date().toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  })();

  const renderGroup = (label, taskList) => {
    if (taskList.length === 0) return null;
    return (
      <div className="task-date-group" key={label}>
        <div className="task-date-label">{label}</div>
        {taskList.map((task) => (
          <div
            key={task.id}
            className={`weekly-task-item ${selectedTaskId === task.id ? 'selected' : ''}`}
            onClick={() => onTaskClick?.(task)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onTaskClick?.(task)}
          >
            <div className="weekly-task-top">
              <div className="weekly-task-name">{task.name}</div>
              <StatusPill status={task.status} />
            </div>
            {task.projectName && (
              <div className="weekly-task-meta">
                <span>{task.projectName}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="weekly-tasks">
      {renderGroup(`HOY · ${todayStr}`, groups.today)}
      {renderGroup(`MAÑANA · ${tomorrowStr}`, groups.tomorrow)}
      {renderGroup('PRÓXIMOS DÍAS', groups.upcoming)}
    </div>
  );
}
