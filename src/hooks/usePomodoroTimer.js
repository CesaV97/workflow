/**
 * Custom hook for managing an active Pomodoro timer
 * Tracks elapsed time, provides start/pause/resume/stop controls
 * Does NOT persist to localStorage (session-only state)
 *
 * @param {number} durationMinutes - Timer duration in minutes
 * @param {function} onTimeUp - Optional callback when timer reaches zero
 * @returns {object} Timer control interface:
 *   - start(): Start the timer
 *   - pause(): Pause the timer
 *   - resume(): Resume from paused state
 *   - stop(): Stop and reset the timer
 *   - isRunning(): Check if timer is active
 *   - getElapsed(): Get elapsed seconds
 *   - getRemaining(): Get remaining seconds
 *   - isTimeUp(): Check if timer has reached zero
 */
export function usePomodoroTimer(durationMinutes, onTimeUp = null) {
  let isActive = false;
  let elapsedSeconds = 0;
  let intervalId = null;
  const durationSeconds = durationMinutes * 60;

  /**
   * Start the timer
   */
  const start = () => {
    if (isActive) {
      return; // Already running, don't start again
    }

    isActive = true;
    intervalId = setInterval(() => {
      elapsedSeconds += 1;

      if (elapsedSeconds >= durationSeconds && onTimeUp) {
        onTimeUp();
      }
    }, 1000);
  };

  /**
   * Pause the timer
   */
  const pause = () => {
    if (!isActive) {
      return; // Not running, nothing to pause
    }

    isActive = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  /**
   * Resume from paused state
   */
  const resume = () => {
    if (isActive) {
      return; // Already running
    }

    isActive = true;
    intervalId = setInterval(() => {
      elapsedSeconds += 1;

      if (elapsedSeconds >= durationSeconds && onTimeUp) {
        onTimeUp();
      }
    }, 1000);
  };

  /**
   * Stop the timer and reset elapsed time
   */
  const stop = () => {
    isActive = false;
    elapsedSeconds = 0;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  /**
   * Check if timer is running
   * @returns {boolean} True if timer is active
   */
  const isRunning = () => isActive;

  /**
   * Get elapsed seconds
   * @returns {number} Seconds elapsed since start
   */
  const getElapsed = () => elapsedSeconds;

  /**
   * Get remaining seconds
   * @returns {number} Seconds remaining until time is up
   */
  const getRemaining = () => Math.max(0, durationSeconds - elapsedSeconds);

  /**
   * Check if time is up
   * @returns {boolean} True if elapsed >= duration
   */
  const isTimeUp = () => elapsedSeconds >= durationSeconds;

  return {
    start,
    pause,
    resume,
    stop,
    isRunning,
    getElapsed,
    getRemaining,
    isTimeUp,
  };
}
