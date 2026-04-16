import { useAuth } from '../../context/AuthContext';
import './Settings.css';

export function Settings() {
  const { user } = useAuth();

  return (
    <main className="settings">
      <h1 className="settings-title">Configuración</h1>
      <p className="settings-description">
        Esta fase usa Supabase como fuente principal de datos.
      </p>

      <div className="settings-card">
        <h2>Sesión activa</h2>
        <p>{user?.email ?? 'Sin usuario autenticado'}</p>
      </div>
    </main>
  );
}
