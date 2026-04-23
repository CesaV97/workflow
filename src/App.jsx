import { useEffect, useState } from 'react';
import { Sidebar } from './features/Layout/Sidebar';
import { TopBar } from './features/Layout/TopBar';
import { MainContent } from './features/Layout/MainContent';
import { Footer } from './features/Layout/Footer';
import { Dashboard } from './features/Dashboard/Dashboard';
import { Projects } from './features/Projects/Projects';
import { Tasks } from './features/Tasks/Tasks';
import { Reports } from './features/Reports/Reports';
import { Settings } from './features/Settings/Settings';
import { TaskDetailPanel } from './features/TaskDetail/TaskDetailPanel';
import { TaskFormModal } from './features/Tasks/TaskFormModal';
import { ProjectForm } from './features/Projects/ProjectForm';
import { Modal } from './components/Common/Modal';
import { SpeedDial } from './components/Common/SpeedDial';
import { AuthScreen } from './features/Auth/AuthScreen';
import { ToastContainer } from './components/Common/Toast';
import { useAuth } from './context/AuthContext';
import { useProjectsContext } from './context/ProjectsContext';
import { useTasksContext } from './context/TasksContext';
import { migrateLocalDataToSupabase } from './lib/localMigration';
import './App.css';

export function App() {
  const { user, loading: authLoading, signOut, isConfigured, isRecovery } = useAuth();
  const { addTask, tasks } = useTasksContext();
  const { projects, addProject } = useProjectsContext();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState(null);
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [migrationError, setMigrationError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [highlightProjectId, setHighlightProjectId] = useState(null);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTaskSubmitting, setNewTaskSubmitting] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectSubmitting, setNewProjectSubmitting] = useState(false);

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
    return () => { active = false; };
  }, [isConfigured, user]);

  const handleTaskSelect = (task) => setSelectedTask(task);
  const handleTaskClose  = () => setSelectedTask(null);
  const handleNavigate   = (view, project = null) => {
    setCurrentView(view);
    setSidebarOpen(false);
    if (project) setHighlightProjectId(project.id);
  };
  const handleOpenNewTask = () => setNewTaskOpen(true);

  const handleNewProjectSave = async (formData) => {
    setNewProjectSubmitting(true);
    try {
      await addProject(formData);
      setNewProjectOpen(false);
    } finally {
      setNewProjectSubmitting(false);
    }
  };

  const handleNewTaskSave = async (formData) => {
    setNewTaskSubmitting(true);
    try {
      await addTask(formData);
      setNewTaskOpen(false);
    } finally {
      setNewTaskSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedTask && !tasks.some((task) => task.id === selectedTask.id)) {
      setSelectedTask(null);
    }
  }, [selectedTask, tasks]);

  if (!isConfigured) return <AuthScreen configurationError />;

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

  if (!user || isRecovery) return <AuthScreen />;

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onTaskSelect={handleTaskSelect} onNavigate={setCurrentView} onNewTask={handleOpenNewTask} />;
      case 'projects':  return <Projects highlightId={highlightProjectId} onHighlightClear={() => setHighlightProjectId(null)} onTaskSelect={handleTaskSelect} />;
      case 'tasks':     return <Tasks onTaskSelect={handleTaskSelect} />;
      case 'reports':   return <Reports />;
      case 'settings':  return <Settings />;
      default:          return <Dashboard onTaskSelect={handleTaskSelect} onNavigate={setCurrentView} onNewTask={handleOpenNewTask} />;
    }
  };

  return (
    <div className={`app${selectedTask ? ' panel-open' : ''}${sidebarOpen ? ' sidebar-mobile-open' : ''}`}>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <Sidebar onNavigate={handleNavigate} currentView={currentView} />
      <div className="app-main">
        <TopBar
          userEmail={user.email ?? ''}
          onSignOut={signOut}
          onNavigate={handleNavigate}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          onNewTask={handleOpenNewTask}
          onNewProject={() => setNewProjectOpen(true)}
          tasks={tasks}
          projects={projects}
          onTaskSelect={handleTaskSelect}
        />
        <MainContent>
          {migrationError && <div className="app-banner-error">{migrationError}</div>}
          {renderContent()}
        </MainContent>
        <Footer />
      </div>
      {selectedTask && <TaskDetailPanel task={selectedTask} onClose={handleTaskClose} />}
      <TaskFormModal
        isOpen={newTaskOpen}
        onClose={() => !newTaskSubmitting && setNewTaskOpen(false)}
        onSave={handleNewTaskSave}
        task={null}
        projects={projects}
        submitting={newTaskSubmitting}
      />
      <Modal isOpen={newProjectOpen} onClose={() => !newProjectSubmitting && setNewProjectOpen(false)} title="Nuevo proyecto">
        <ProjectForm
          onSubmit={handleNewProjectSave}
          onCancel={() => setNewProjectOpen(false)}
          submitting={newProjectSubmitting}
        />
      </Modal>

      <ToastContainer />
    </div>
  );
}
