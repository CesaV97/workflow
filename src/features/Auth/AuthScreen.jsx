import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthScreen.css';

export function AuthScreen({ configurationError = false }) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signin') {
        await signIn(form.email, form.password);
      } else if (mode === 'signup') {
        await signUp(form.email, form.password);
        setMessage('Cuenta creada. Revisa tu correo para confirmar tu cuenta.');
      } else {
        await resetPassword(form.email);
        setMessage('Correo enviado. Revisa tu bandeja de entrada para restablecer tu contraseña.');
      }
    } catch (submitError) {
      setError(submitError.message ?? 'No se pudo completar la operación.');
    } finally {
      setSubmitting(false);
    }
  };

  if (configurationError) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <h1 className="auth-title">Configura Supabase</h1>
          <p className="auth-copy">
            Define `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para usar la aplicación.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-kicker">Workflow</span>
          <h1 className="auth-title">
            {mode === 'forgot' ? 'Recuperar contraseña' : 'Accede a tu espacio de trabajo'}
          </h1>
          <p className="auth-copy">
            {mode === 'forgot'
              ? 'Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.'
              : 'Crea una cuenta con tu email para guardar proyectos, tareas y sesiones Pomodoro.'}
          </p>
        </div>

        {mode !== 'forgot' && (
          <div className="auth-mode-switch" role="tablist" aria-label="Authentication mode">
            <button
              className={`auth-mode-button ${mode === 'signin' ? 'is-active' : ''}`}
              onClick={() => switchMode('signin')}
              type="button"
            >
              Iniciar sesión
            </button>
            <button
              className={`auth-mode-button ${mode === 'signup' ? 'is-active' : ''}`}
              onClick={() => switchMode('signup')}
              type="button"
            >
              Crear cuenta
            </button>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="tu@email.com"
              required
            />
          </label>

          {mode !== 'forgot' && (
            <label className="auth-field">
              <span>Contraseña</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </label>
          )}

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-message">{message}</div>}

          <button className="auth-submit" disabled={submitting} type="submit">
            {submitting
              ? 'Procesando...'
              : mode === 'signin'
                ? 'Entrar'
                : mode === 'signup'
                  ? 'Crear cuenta'
                  : 'Enviar correo'}
          </button>

          {mode === 'signin' && (
            <button
              className="auth-forgot-link"
              onClick={() => switchMode('forgot')}
              type="button"
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {mode === 'forgot' && (
            <button
              className="auth-forgot-link"
              onClick={() => switchMode('signin')}
              type="button"
            >
              Volver a iniciar sesión
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
