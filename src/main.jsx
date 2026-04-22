import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { AuthProvider } from './context/AuthContext'
import { ProjectsProvider } from './context/ProjectsContext'
import { ThemeProvider } from './context/ThemeContext'
import { TasksProvider } from './context/TasksContext'
import { SettingsProvider } from './context/SettingsContext'
import { PomodoroProvider } from './context/PomodoroContext'
import './styles/theme.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ProjectsProvider>
          <TasksProvider>
            <SettingsProvider>
              <PomodoroProvider>
                <App />
              </PomodoroProvider>
            </SettingsProvider>
          </TasksProvider>
        </ProjectsProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
