import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { SearchBar } from '../../components/Common/SearchBar';
import { TaskListItem } from './TaskListItem';
import { TaskFilter } from './TaskFilter';
import './Tasks.css';

/**
 * Tasks component - Main tasks management page
 * Displays all tasks with filtering and status management
 */
export function Tasks() {
  const { tasks, taskCount } = useTasks();
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="tasks">
      <div className="tasks-header">
        <div>
          <h1 className="tasks-title">Tasks</h1>
          <p className="tasks-count">{filteredTasks.length} of {taskCount()}</p>
        </div>
      </div>

      <div className="tasks-controls">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search tasks..."
        />
        <TaskFilter
          currentStatus={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Create one to get started!</p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              project={projects.find(p => p.id === task.projectId)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
