import { useEffect, useState } from 'react';
import { Sidebar } from './features/Layout/Sidebar';
import { TopBar } from './features/Layout/TopBar';
import { MainContent } from './features/Layout/MainContent';
import { Dashboard } from './features/Dashboard/Dashboard';
import { Projects } from './features/Projects/Projects';
import { Tasks } from './features/Tasks/Tasks';
import { Reports } from './features/Reports/Reports';
import { Settings } from './features/Settings/Settings';
import { TaskDetailPanel } from './features/TaskDetail/TaskDetailPanel';
import { AuthScreen } from './features/Auth/AuthScreen';
import { ToastContainer } from './components/Common/Toast';
import { useAuth } from './context/AuthContext';
import { migrateLocalDataToSupabase } from './lib/localMigration';
import './App.css';

export function App() {
  const { user, loading: authLoading, signOut, isConfigured } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState(null);
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [migrationError, setMigrationError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function migrate() {
      if (!user || !isConfigured) {
        setMigrationLoading(false);
        setMigrationError('');
        return;
      }

      setMigrationLoading(true);
      setMigrationError('');

      try {
        await migrateLocalDataToSupabase(user.id);
      } catch (error) {
        if (active) {
          setMigrationError(error.message ?? 'No se pudieron migrar los datos locales.');
        }
      } finally {
        if (active) {
          setMigrationLoading(false);
        }
      }
    }

    migrate();

    return () => {
      active = false;
    };
  }, [isConfigured, user]);

  const handleTaskSelect = (task) => setSelectedTask(task);
  const handleTaskClose = () => setSelectedTask(null);

  if (!isConfigured) {
    return <AuthScreen configurationError />;
  }

  if (authLoading || migrationLoading) {
    return (
      <div className="app-status-screen">
        <div className="app-status-card">
          <h1>Task Flow</h1>
          <p>{migrationLoading ? 'Sincronizando tus datos...' : 'Cargando sesión...'}</p>
          {migrationError && <p className="app-status-error">{migrationError}</p>}
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onTaskSelect={handleTaskSelect} onNavigate={setCurrentView} />;
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

  const handleNavigate = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  return (
    <div className={`app${selectedTask ? ' panel-open' : ''}${sidebarOpen ? ' sidebar-mobile-open' : ''}`}>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <Sidebar onNavigate={handleNavigate} currentView={currentView} />
      <div className="app-main">
        <TopBar
          userEmail={user.email ?? ''}
          onSignOut={signOut}
          onNavigate={setCurrentView}
          onMenuToggle={() => setSidebarOpen(o => !o)}
        />
        <MainContent>
          {migrationError && <div className="app-banner-error">{migrationError}</div>}
          {renderContent()}
        </MainContent>
      </div>
      {selectedTask && <TaskDetailPanel task={selectedTask} onClose={handleTaskClose} />}
      <ToastContainer />
    </div>
  );
}
