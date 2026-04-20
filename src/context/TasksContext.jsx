import { createContext, useContext } from 'react';
import { useTasks } from '../hooks/useTasks';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const tasksHook = useTasks();
  return <TasksContext.Provider value={tasksHook}>{children}</TasksContext.Provider>;
}

export function useTasksContext() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasksContext must be used within TasksProvider');
  return ctx;
}
