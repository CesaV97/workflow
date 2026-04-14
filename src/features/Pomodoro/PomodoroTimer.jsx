import { useState } from 'react';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';
import { usePomodoroSessions } from '../../hooks/usePomodoroSessions';
import { Button } from '../../components/Common/Button';
import './Pomodoro.css';

export function PomodoroTimer({ taskId }) {
  const [duration, setDuration] = useState(25);
  const [sessionType, setSessionType] = useState('Work');
  const timer = usePomodoroTimer(duration);
  const { addSession } = usePomodoroSessions();

  const handleStart = () => {
    timer.start();
  };

  const handleStop = () => {
    if (timer.isTimeUp()) {
      addSession({
        taskId,
        type: sessionType,
        duration,
        startTime: new Date(Date.now() - timer.getElapsed() * 1000).toISOString(),
        endTime: new Date().toISOString(),
        status: 'Completed',
      });
    }
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
        <Button
          variant={timer.isRunning() ? 'secondary' : 'primary'}
          onClick={timer.isRunning() ? () => timer.pause() : handleStart}
        >
          {timer.isRunning() ? 'Pause' : 'Start'}
        </Button>
        <Button variant="secondary" onClick={handleStop}>Stop</Button>
      </div>

      <div className="timer-settings">
        <label>Duration (min):</label>
        <input
          type="number"
          min="1"
          max="60"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          disabled={timer.isRunning()}
        />

        <label>Type:</label>
        <select
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
          disabled={timer.isRunning()}
        >
          <option>Work</option>
          <option>Rest</option>
        </select>
      </div>
    </div>
  );
}
