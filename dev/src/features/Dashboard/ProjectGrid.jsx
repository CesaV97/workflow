/**
 * ProjectGrid component - Displays projects in a grid layout
 *
 * @param {array} projects - Array of project objects
 */
export function ProjectGrid({ projects = [] }) {
  if (projects.length === 0) {
    return <p className="empty-state">No projects yet. Create one to get started!</p>;
  }

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <div key={project.id} className="project-card">
          <div className="project-header">
            <h3 className="project-name">{project.name}</h3>
            <span className="project-status">{project.status}</span>
          </div>
          <p className="project-description">{project.description || 'No description'}</p>
          <div className="project-meta">
            <span className="project-date">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
