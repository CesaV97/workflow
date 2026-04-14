import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePomodoroTimer } from '../../src/hooks/usePomodoroTimer';

describe('usePomodoroTimer hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('should initialize with idle state', () => {
    const timer = usePomodoroTimer(25);
    expect(timer.isRunning()).toBe(false);
    expect(timer.getElapsed()).toBe(0);
  });

  it('should start the timer', () => {
    const timer = usePomodoroTimer(25);
    timer.start();
    expect(timer.isRunning()).toBe(true);
  });

  it('should track elapsed time', () => {
    const timer = usePomodoroTimer(25);
    timer.start();
    vi.advanceTimersByTime(5000); // 5 seconds
    expect(timer.getElapsed()).toBe(5);
  });

  it('should pause the timer', () => {
    const timer = usePomodoroTimer(25);
    timer.start();
    vi.advanceTimersByTime(5000);
    timer.pause();
    expect(timer.isRunning()).toBe(false);
    const elapsedBeforeAdvance = timer.getElapsed();
    vi.advanceTimersByTime(5000);
    expect(timer.getElapsed()).toBe(elapsedBeforeAdvance); // Elapsed should not increase
  });

  it('should resume from paused state', () => {
    const timer = usePomodoroTimer(25);
    timer.start();
    vi.advanceTimersByTime(5000);
    timer.pause();
    const elapsedAfterPause = timer.getElapsed();
    timer.resume();
    expect(timer.isRunning()).toBe(true);
    vi.advanceTimersByTime(3000);
    expect(timer.getElapsed()).toBe(elapsedAfterPause + 3);
  });

  it('should stop the timer and reset elapsed time', () => {
    const timer = usePomodoroTimer(25);
    timer.start();
    vi.advanceTimersByTime(10000);
    timer.stop();
    expect(timer.isRunning()).toBe(false);
    expect(timer.getElapsed()).toBe(0);
  });

  it('should return remaining time', () => {
    const timer = usePomodoroTimer(25);
    expect(timer.getRemaining()).toBe(25 * 60); // 25 minutes in seconds
    timer.start();
    vi.advanceTimersByTime(5000); // 5 seconds
    expect(timer.getRemaining()).toBe(25 * 60 - 5);
  });

  it('should indicate when time is up', () => {
    const timer = usePomodoroTimer(1); // 1 minute
    timer.start();
    expect(timer.isTimeUp()).toBe(false);
    vi.advanceTimersByTime(60000); // 60 seconds = 1 minute
    expect(timer.isTimeUp()).toBe(true);
  });

  it('should call callback when time is up', () => {
    const callback = vi.fn();
    const timer = usePomodoroTimer(1, callback);
    timer.start();
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(60000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not allow start if already running', () => {
    const timer = usePomodoroTimer(25);
    timer.start();
    expect(timer.isRunning()).toBe(true);
    timer.start(); // Try to start again
    expect(timer.isRunning()).toBe(true); // Should still be running
  });

  it('should reset timer via stop', () => {
    const timer = usePomodoroTimer(25);
    timer.start();
    vi.advanceTimersByTime(5000);
    expect(timer.getElapsed()).toBe(5);
    timer.stop();
    expect(timer.getElapsed()).toBe(0);
    expect(timer.isRunning()).toBe(false);
  });

  it('should handle pause on idle timer', () => {
    const timer = usePomodoroTimer(25);
    timer.pause(); // Pause when not running
    expect(timer.isRunning()).toBe(false);
    expect(timer.getElapsed()).toBe(0);
  });
});
