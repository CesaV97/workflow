import { createContext, useContext } from 'react';
import { useProjects } from '../hooks/useProjects';

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const projectsHook = useProjects();
  return <ProjectsContext.Provider value={projectsHook}>{children}</ProjectsContext.Provider>;
}

export function useProjectsContext() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjectsContext must be used within ProjectsProvider');
  return ctx;
}
