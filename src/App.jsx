import { useState } from 'react';
import { Sidebar } from './features/Layout/Sidebar';
import { TopBar } from './features/Layout/TopBar';
import { MainContent } from './features/Layout/MainContent';
import { Dashboard } from './features/Dashboard/Dashboard';
import { Projects } from './features/Projects/Projects';
import { Tasks } from './features/Tasks/Tasks';
import { Reports } from './features/Reports/Reports';
import { Settings } from './features/Settings/Settings';
import { TaskDetailPanel } from './features/TaskDetail/TaskDetailPanel';
import './App.css';

/**
 * App — root component with sidebar navigation, top bar, main content area,
 * and a TaskDetail slide-out panel that opens when a task is selected.
 */
export function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskSelect = (task) => setSelectedTask(task);
  const handleTaskClose = () => setSelectedTask(null);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onTaskSelect={handleTaskSelect} />;
      case 'projects':
        return <Projects />;
      case 'tasks':
        return <Tasks onTaskSelect={handleTaskSelect} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onTaskSelect={handleTaskSelect} />;
    }
  };

  return (
    <div className="app">
      <Sidebar onNavigate={setCurrentView} currentView={currentView} />
      <div className="app-main">
        <TopBar />
        <MainContent>
          {renderContent()}
        </MainContent>
      </div>
      {selectedTask && (
        <TaskDetailPanel task={selectedTask} onClose={handleTaskClose} />
      )}
    </div>
  );
}
