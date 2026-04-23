import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthScreen.css';

function AuthLogo() {
  return (
    <span className="auth-logo-wrap">
      <img src="/taskFlow_icon_2.png" className="auth-logo-icon" alt="Task Flow" />
    </span>
  );
}

const ERROR_MAP = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'Email not confirmed': 'Confirma tu correo antes de iniciar sesión.',
  'User already registered': 'Este correo ya tiene una cuenta registrada.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'Unable to validate email address: invalid format': 'Formato de correo inválido.',
};

function translateAuthError(message) {
  if (!message) return 'No se pudo completar la autenticación.';
  for (const [key, translation] of Object.entries(ERROR_MAP)) {
    if (message.includes(key)) return translation;
  }
  return message;
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function PasswordInput({ id, value, onChange, placeholder, minLength, autoComplete = 'current-password' }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-password-wrapper">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? ''}
        minLength={minLength}
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        className="auth-password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}

function RecoveryForm({ updatePassword, onSuccess }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await updatePassword(password);
      onSuccess('Contraseña actualizada. Inicia sesión con tu nueva contraseña.');
    } catch (err) {
      setError(translateAuthError(err.message));
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-by-line">by VegaLabs</div>
          <span className="auth-kicker"><AuthLogo /><span className="auth-kicker-task">TASK</span><span className="auth-kicker-flow">FLOW</span></span>
          <h1 className="auth-title">Nueva contraseña</h1>
          <p className="auth-copy">Elige una contraseña segura para tu cuenta.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Nueva contraseña</span>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} autoComplete="new-password" />
          </label>
          <label className="auth-field">
            <span>Confirmar contraseña</span>
            <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repite la contraseña" minLength={6} autoComplete="new-password" />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-submit" disabled={submitting} type="submit">
            {submitting ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
        <span className="auth-version">v1.0.0</span>
      </div>
    </div>
  );
}

function ForgotForm({ sendPasswordReset, onBack }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(translateAuthError(err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-by-line">by VegaLabs</div>
          <span className="auth-kicker"><AuthLogo /><span className="auth-kicker-task">TASK</span><span className="auth-kicker-flow">FLOW</span></span>
          <h1 className="auth-title">Recuperar contraseña</h1>
          <p className="auth-copy">
            {sent
              ? 'Revisa tu correo. Te enviamos un enlace para restablecer tu contraseña.'
              : 'Ingresa tu correo y te enviaremos un enlace de recuperación.'}
          </p>
        </div>
        {!sent && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </label>
            {error && <div className="auth-error">{error}</div>}
            <button className="auth-submit" disabled={submitting} type="submit">
              {submitting ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}
        <button className="auth-link" type="button" onClick={onBack}>
          ← Volver al inicio de sesión
        </button>
        <span className="auth-version">v1.0.0</span>
      </div>
    </div>
  );
}

export function AuthScreen({ configurationError = false }) {
  const { signIn, signUp, sendPasswordReset, updatePassword, isRecovery } = useAuth();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signin') {
        await signIn(form.email, form.password);
      } else {
        await signUp(form.email, form.password);
        setMessage('Cuenta creada. Revisa tu correo para confirmar tu cuenta.');
      }
    } catch (submitError) {
      setError(translateAuthError(submitError.message));
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

  if (isRecovery) {
    return (
      <RecoveryForm
        updatePassword={updatePassword}
        onSuccess={(msg) => { setMode('signin'); setMessage(msg); }}
      />
    );
  }

  if (mode === 'forgot') {
    return (
      <ForgotForm
        sendPasswordReset={sendPasswordReset}
        onBack={() => setMode('signin')}
      />
    );
  }

  if (mode === 'signup') {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-by-line">by VegaLabs</div>
            <span className="auth-kicker"><AuthLogo /><span className="auth-kicker-task">TASK</span><span className="auth-kicker-flow">FLOW</span></span>
            <h1 className="auth-title">Crea tu cuenta</h1>
            <p className="auth-copy">Guarda proyectos, tareas y sesiones Pomodoro en la nube.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </label>
            <label className="auth-field">
              <span>Contraseña</span>
              <PasswordInput value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="Mínimo 6 caracteres" minLength={6} autoComplete="new-password" />
            </label>
            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-message">{message}</div>}
            <button className="auth-submit" disabled={submitting} type="submit">
              {submitting ? 'Procesando...' : 'Crear cuenta'}
            </button>
          </form>
          <span className="auth-version">v1.0.0</span>
        </div>
        <div className="auth-secondary-card">
          <p>¿Ya tienes cuenta?{' '}
            <button className="auth-link-inline" type="button" onClick={() => { setMode('signin'); setError(''); setMessage(''); }}>
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-by-line">by VegaLabs</div>
          <span className="auth-kicker"><AuthLogo /><span className="auth-kicker-task">TASK</span><span className="auth-kicker-flow">FLOW</span></span>
          <h1 className="auth-title">Bienvenido de vuelta</h1>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="auth-field">
            <div className="auth-field-header">
              <span>Contraseña</span>
              <button className="auth-link-forgot" type="button" onClick={() => setMode('forgot')}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <PasswordInput
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="••••••••"
              minLength={6}
              autoComplete="current-password"
            />
          </label>
          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-message">{message}</div>}
          <button className="auth-submit" disabled={submitting} type="submit">
            {submitting ? 'Procesando...' : 'Entrar'}
          </button>
        </form>
        <span className="auth-version">v1.0.0</span>
      </div>
      <div className="auth-secondary-card">
        <p>¿Nuevo en TaskFlow?{' '}
          <button className="auth-link-inline" type="button" onClick={() => { setMode('signup'); setError(''); setMessage(''); }}>
            Crear una cuenta
          </button>
        </p>
      </div>
    </div>
  );
}
