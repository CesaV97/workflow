import { useState, useEffect, useRef } from 'react';
import { usePomodoroSessions } from '../../hooks/usePomodoroSessions';
import './Pomodoro.css';

const DURATIONS = [15, 25, 50];

export function PomodoroTimer({ taskId }) {
  const [duration, setDuration] = useState(25);
  const [sessionType, setSessionType] = useState('Work');
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef(null);
  const { addSession } = usePomodoroSessions();

  useEffect(() => {
    if (!running) setRemaining(duration * 60);
  }, [duration, sessionType]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleStart = () => {
    if (!startedAt) setStartedAt(new Date().toISOString());
    setRunning(true);
  };

  const handleStop = async () => {
    setRunning(false);
    const elapsed = duration * 60 - remaining;
    if (startedAt && elapsed > 0) {
      setSaving(true);
      try {
        await addSession({
          taskId,
          type: sessionType,
          duration,
          startTime: startedAt,
          endTime: new Date().toISOString(),
          status: remaining === 0 ? 'Completed' : 'Abandoned',
        });
      } finally {
        setSaving(false);
      }
    }
    setStartedAt(null);
    setRemaining(duration * 60);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const progress = 1 - remaining / (duration * 60);
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
          <button className="btn btn-primary" onClick={handleStart}>
            ▶ Start
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={() => setRunning(false)}>
            ⏸ Pause
          </button>
        )}
        <button className="btn btn-secondary" onClick={handleStop} disabled={saving}>
          {saving ? 'Guardando...' : '⏹ Stop'}
        </button>
      </div>

      <div className="timer-duration-control">
        <button
          className="timer-adj-btn"
          onClick={() => { if (!running) setDuration(d => Math.max(1, d - 1)); }}
          disabled={running}
          aria-label="Reducir duración"
        >−</button>
        <span className="timer-duration-value">{duration} min</span>
        <button
          className="timer-adj-btn"
          onClick={() => { if (!running) setDuration(d => Math.min(120, d + 1)); }}
          disabled={running}
          aria-label="Aumentar duración"
        >+</button>
      </div>

      <div className="timer-meta">
        <span>Duración: <span className="meta-num">{duration} min</span></span>
        <span>Tipo: <span className="meta-num">{sessionType}</span></span>
      </div>

      <div className="timer-presets">
        {DURATIONS.map(d => (
          <button
            key={d}
            className={`filter-chip ${duration === d ? 'active' : ''}`}
            onClick={() => { if (!running) setDuration(d); }}
          >
            {d} min
          </button>
        ))}
        <button
          className={`filter-chip ${sessionType === 'Work' ? 'active' : ''}`}
          onClick={() => { if (!running) setSessionType('Work'); }}
        >
          Work
        </button>
        <button
          className={`filter-chip ${sessionType === 'Rest' ? 'active' : ''}`}
          onClick={() => { if (!running) setSessionType('Rest'); }}
        >
          Rest
        </button>
      </div>
    </div>
  );
}
