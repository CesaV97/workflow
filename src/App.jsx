import { useState } from 'react';
import { Sidebar } from './features/Layout/Sidebar';
import { TopBar } from './features/Layout/TopBar';
import { MainContent } from './features/Layout/MainContent';
import { Dashboard } from './features/Dashboard/Dashboard';
import { Projects } from './features/Projects/Projects';
import { Tasks } from './features/Tasks/Tasks';
import './App.css';

/**
 * App component - Root component with layout and routing
 * Provides navigation between main app sections
 */
export function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleNavClick = (view) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <Projects />;
      case 'tasks':
        return <Tasks />;
      default:
        return <Dashboard />;
    }
  };

  const getTopBarTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'projects':
        return 'Projects';
      case 'tasks':
        return 'Tasks';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="app">
      <Sidebar onNavigate={handleNavClick} currentView={currentView} />
      <div className="app-main">
        <TopBar title={getTopBarTitle()} />
        <MainContent>
          {renderContent()}
        </MainContent>
      </div>
    </div>
  );
}
