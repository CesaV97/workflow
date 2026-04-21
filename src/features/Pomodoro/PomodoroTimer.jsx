import { useEffect } from 'react';
import { usePomodoro } from '../../context/PomodoroContext';
import './Pomodoro.css';

const DURATIONS = [15, 25, 50];

export function PomodoroTimer({ taskId }) {
  const {
    duration, sessionType, remaining, running, saving,
    progress, mm, ss,
    setDuration, setSessionType,
    handleStart, handlePause, handleStop,
    attachTask,
  } = usePomodoro();

  useEffect(() => {
    attachTask(taskId);
  }, [taskId, attachTask]);

  const r = 74;
  const C = 2 * Math.PI * r;

  return (
    <div className="pomodoro-timer">
      <div className="timer-display">
        <div className={`timer-ring ${sessionType === 'Rest' ? 'rest' : ''}`}>
          <svg viewBox="0 0 168 168" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="84" cy="84" r={r} fill="none" strokeWidth="6" className="timer-ring-track" />
            <circle
              cx="84" cy="84" r={r} fill="none" strokeWidth="6"
              className="timer-ring-fill"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              strokeLinecap="round"
            />
          </svg>
          <div className="timer-inner">
            <div className="timer-time">{mm}:{ss}</div>
            <div className="timer-type">{sessionType}</div>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        {!running ? (
          <button className="btn btn-primary" onClick={handleStart}>▶ Start</button>
        ) : (
          <button className="btn btn-secondary" onClick={handlePause}>⏸ Pause</button>
        )}
        <button className="btn btn-secondary" onClick={handleStop} disabled={saving}>
          {saving ? 'Guardando...' : '⏹ Stop'}
        </button>
      </div>

      <div className="timer-duration-control">
        <button className="timer-adj-btn" onClick={() => setDuration(duration - 1)} disabled={running} aria-label="Reducir duración">−</button>
        <span className="timer-duration-value">{duration} min</span>
        <button className="timer-adj-btn" onClick={() => setDuration(duration + 1)} disabled={running} aria-label="Aumentar duración">+</button>
      </div>

      <div className="timer-meta">
        <span>Duración: <span className="meta-num">{duration} min</span></span>
        <span>Tipo: <span className="meta-num">{sessionType}</span></span>
      </div>

      <div className="timer-presets">
        {DURATIONS.map(d => (
          <button key={d} className={`filter-chip ${duration === d ? 'active' : ''}`} onClick={() => setDuration(d)}>
            {d} min
          </button>
        ))}
        <button className={`filter-chip ${sessionType === 'Work' ? 'active' : ''}`} onClick={() => setSessionType('Work')}>Work</button>
        <button className={`filter-chip ${sessionType === 'Rest' ? 'active' : ''}`} onClick={() => setSessionType('Rest')}>Rest</button>
      </div>
    </div>
  );
}
