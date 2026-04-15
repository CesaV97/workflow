import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { ProjectGrid } from './ProjectGrid';
import { WeeklyTasksList } from './WeeklyTasksList';
import './Dashboard.css';

export function Dashboard() {
  const projectsHook = useProjects();
  const { tasks, taskCount } = useTasks();
  const [projects, setProjects] = useState(projectsHook.projects);

  const handleAddProject = (data) => {
    const newProject = projectsHook.addProject(data);
    setProjects((prev) => [...prev, newProject]);
  };

  const handleUpdateProject = (id, data) => {
    const updated = projectsHook.updateProject(id, data);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const handleDeleteProject = (id) => {
    projectsHook.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat">
            <span className="stat-value">{projects.length}</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat">
            <span className="stat-value">{taskCount()}</span>
            <span className="stat-label">Tasks</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h2 className="section-title">Projects</h2>
          <ProjectGrid
            projects={projects}
            onAdd={handleAddProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
          />
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Tasks</h2>
          <WeeklyTasksList tasks={tasks} />
        </section>
      </div>
    </main>
  );
}
