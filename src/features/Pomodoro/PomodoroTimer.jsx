import { useState } from 'react';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';
import { usePomodoroSessions } from '../../hooks/usePomodoroSessions';
import { Button } from '../../components/Common/Button';
import './Pomodoro.css';

export function PomodoroTimer({ taskId }) {
  const [duration, setDuration] = useState(25);
  const [sessionType, setSessionType] = useState('Work');
  const [startedAt, setStartedAt] = useState(null);
  const [saving, setSaving] = useState(false);
  const timer = usePomodoroTimer(duration);
  const { addSession } = usePomodoroSessions();

  const handleStart = () => {
    if (!startedAt) {
      setStartedAt(new Date().toISOString());
    }
    timer.start();
  };

  const handleStop = async () => {
    const elapsedSeconds = timer.getElapsed();
    if (startedAt && elapsedSeconds > 0) {
      setSaving(true);
      try {
        await addSession({
          taskId,
          type: sessionType,
          duration,
          startTime: startedAt,
          endTime: new Date().toISOString(),
          status: timer.isTimeUp() ? 'Completed' : 'Abandoned',
        });
      } finally {
        setSaving(false);
      }
    }

    setStartedAt(null);
    timer.stop();
  };

  const minutes = Math.floor(timer.getRemaining() / 60);
  const seconds = timer.getRemaining() % 60;

  return (
    <div className="pomodoro-timer">
      <div className="timer-display">
        <span className="timer-time">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <span className="timer-type">{sessionType}</span>
      </div>

      <div className="timer-controls">
        <Button variant={timer.isRunning() ? 'secondary' : 'primary'} onClick={timer.isRunning() ? () => timer.pause() : handleStart}>
          {timer.isRunning() ? 'Pause' : 'Start'}
        </Button>
        <Button variant="secondary" onClick={handleStop} disabled={saving}>
          {saving ? 'Saving...' : 'Stop'}
        </Button>
      </div>

      <div className="timer-settings">
        <label>Duration (min):</label>
        <input
          type="number"
          min="1"
          max="60"
          value={duration}
          onChange={(event) => setDuration(Number(event.target.value))}
          disabled={timer.isRunning()}
        />

        <label>Type:</label>
        <select value={sessionType} onChange={(event) => setSessionType(event.target.value)} disabled={timer.isRunning()}>
          <option>Work</option>
          <option>Rest</option>
        </select>
      </div>
    </div>
  );
}
