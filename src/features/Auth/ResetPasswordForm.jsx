import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AuthScreen.css';

export function ResetPasswordForm() {
  const { updatePassword } = useAuth();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await updatePassword(form.password);
    } catch (submitError) {
      setError(submitError.message ?? 'No se pudo actualizar la contraseña.');
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-kicker">Workflow</span>
          <h1 className="auth-title">Nueva contraseña</h1>
          <p className="auth-copy">Elige una nueva contraseña para tu cuenta.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Nueva contraseña</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </label>

          <label className="auth-field">
            <span>Confirmar contraseña</span>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm((prev) => ({ ...prev, confirm: e.target.value }))}
              placeholder="Repite la contraseña"
              minLength={6}
              required
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" disabled={submitting} type="submit">
            {submitting ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
