import { useEffect } from 'react';
import { usePomodoro } from '../../context/PomodoroContext';
import './Pomodoro.css';

const CORNER_DURATIONS = [
  { value: 5,  pos: 'tl' },
  { value: 10, pos: 'tr' },
  { value: 25, pos: 'bl' },
  { value: 50, pos: 'br' },
];

export function PomodoroTimer({ taskId }) {
  const {
    duration, sessionType, running, saving,
    progress, mm, ss,
    setDuration, setSessionType,
    handleStart, handlePause, handleStop,
    attachTask,
  } = usePomodoro();

  useEffect(() => { attachTask(taskId); }, [taskId, attachTask]);

  const r = 74;
  const C = 2 * Math.PI * r;

  return (
    <div className="pomodoro-timer">

      {/* Ring with corner presets + flanking adj buttons */}
      <div className="timer-display">
        {CORNER_DURATIONS.map(({ value, pos }) => (
          <button
            key={value}
            className={`timer-corner-btn timer-corner-${pos}${duration === value ? ' active' : ''}`}
            onClick={() => setDuration(value)}
            disabled={running}
            title={`${value} min`}
          >
            {value}
            <span>min</span>
          </button>
        ))}

        <div className="timer-ring-row">
          <button
            className="timer-adj-btn"
            onClick={() => setDuration(Math.max(1, duration - 1))}
            disabled={running}
            aria-label="Reducir 1 minuto"
          >−</button>

          <div className={`timer-ring${sessionType === 'Rest' ? ' rest' : ''}`}>
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

          <button
            className="timer-adj-btn"
            onClick={() => setDuration(Math.min(120, duration + 1))}
            disabled={running}
            aria-label="Aumentar 1 minuto"
          >+</button>
        </div>
      </div>

      {/* Single controls row: Work | Rest | Start | Stop */}
      <div className="timer-controls-row">
        <button
          className={`timer-mode-btn${sessionType === 'Work' ? ' active' : ''}`}
          onClick={() => setSessionType('Work')}
          disabled={running}
        >Work</button>
        <button
          className={`timer-mode-btn${sessionType === 'Rest' ? ' active rest' : ''}`}
          onClick={() => setSessionType('Rest')}
          disabled={running}
        >Rest</button>

        <div className="timer-controls-divider" />

        {!running ? (
          <button className="btn btn-primary timer-action-btn" onClick={handleStart} aria-label="Iniciar">▶</button>
        ) : (
          <button className="btn btn-secondary timer-action-btn" onClick={handlePause} aria-label="Pausar">⏸</button>
        )}
        <button className="btn btn-secondary timer-action-btn" onClick={handleStop} disabled={saving} aria-label="Detener">
          {saving ? '…' : '■'}
        </button>
      </div>

    </div>
  );
}
