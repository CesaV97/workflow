import {
  createContext, useContext, useEffect, useRef, useState, useCallback
} from 'react';
import { usePomodoroSessions } from '../hooks/usePomodoroSessions';
import { useSettings } from './SettingsContext';
import { POMODORO_TYPES, POMODORO_STATUS, POMODORO_DEFAULTS } from '../constants/pomodoroConfig';
import { sendBrowserNotification, playBeep } from '../utils/pomodoroNotify';

const PomodoroContext = createContext(undefined);
const STORAGE_KEY       = 'wf_pomodoro';
const TASK_STATES_KEY   = 'wf_pomodoro_tasks';

function loadPersistedState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    let { remaining, running, savedAt, duration } = data;
    if (running && savedAt) {
      const elapsed = (Date.now() - Date.parse(savedAt)) / 1000;
      remaining = Math.max(0, remaining - elapsed);
      if (remaining === 0) running = false;
    }
    return { ...data, remaining, running };
  } catch { return null; }
}

function loadTaskStates() {
  try {
    const raw = localStorage.getItem(TASK_STATES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveTaskStates(states) {
  try {
    localStorage.setItem(TASK_STATES_KEY, JSON.stringify(states));
  } catch {}
}

export function PomodoroProvider({ children }) {
  const { addSession } = usePomodoroSessions();
  const { notif, sound, autoBreak } = useSettings();

  const init = useRef(loadPersistedState()).current;
  const taskStatesRef = useRef(loadTaskStates());

  const [taskId,      setTaskId]      = useState(init?.taskId      ?? null);
  const [duration,    setDurationRaw] = useState(init?.duration    ?? POMODORO_DEFAULTS.workDuration);
  const [sessionType, setSessionTypeRaw] = useState(init?.sessionType ?? POMODORO_TYPES.WORK);
  const [remaining,   setRemaining]   = useState(init?.remaining   ?? (POMODORO_DEFAULTS.workDuration * 60));
  const [running,     setRunning]     = useState(init?.running     ?? false);
  const [startedAt,   setStartedAt]   = useState(init?.startedAt   ?? null);
  const [saving,      setSaving]      = useState(false);
  const [toasts,      setToasts]      = useState([]);

  const completedRef = useRef(false);
  const intervalRef  = useRef(null);

  // Persist global timer state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      taskId, duration, sessionType, remaining, running, startedAt,
      savedAt: new Date().toISOString(),
    }));
  }, [taskId, duration, sessionType, remaining, running, startedAt]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const handleCompletion = useCallback(async () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setRunning(false);

    if (startedAt && taskId) {
      setSaving(true);
      try {
        await addSession({
          taskId, type: sessionType, duration,
          startTime: startedAt,
          endTime: new Date().toISOString(),
          status: POMODORO_STATUS.COMPLETED,
        });
      } finally { setSaving(false); }
    }
    setStartedAt(null);

    // Clear saved state for this task on completion
    if (taskId) {
      const next = { ...taskStatesRef.current };
      delete next[taskId];
      taskStatesRef.current = next;
      saveTaskStates(next);
    }

    const msg = sessionType === POMODORO_TYPES.WORK
      ? '¡Sesión de trabajo completada! Toma un descanso.'
      : '¡Descanso terminado! A trabajar.';
    addToast(msg, 'success');
    if (notif) sendBrowserNotification(sessionType);
    if (sound) playBeep();

    if (autoBreak && sessionType === POMODORO_TYPES.WORK) {
      // Auto-start rest after work
      setSessionTypeRaw(POMODORO_TYPES.REST);
      setDurationRaw(POMODORO_DEFAULTS.restDuration);
      setRemaining(POMODORO_DEFAULTS.restDuration * 60);
      setStartedAt(new Date().toISOString());
      setRunning(true);
      completedRef.current = false;
    } else if (sessionType === POMODORO_TYPES.REST) {
      // After rest: switch to work but pause (let user add comment or continue manually)
      setSessionTypeRaw(POMODORO_TYPES.WORK);
      setDurationRaw(POMODORO_DEFAULTS.workDuration);
      setRemaining(POMODORO_DEFAULTS.workDuration * 60);
      completedRef.current = false;
    } else {
      setRemaining(duration * 60);
      completedRef.current = false;
    }
  }, [addSession, addToast, autoBreak, duration, notif, sessionType, sound, startedAt, taskId]);

  useEffect(() => {
    if (!running || !startedAt) {
      clearInterval(intervalRef.current);
      return;
    }
    const capturedStart = startedAt;
    const fullSeconds   = duration * 60;
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - Date.parse(capturedStart)) / 1000;
      const next    = Math.max(0, fullSeconds - elapsed);
      setRemaining(next);
      if (next <= 0) {
        clearInterval(intervalRef.current);
        handleCompletion();
      }
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, [running, startedAt, duration, handleCompletion]);

  // Save current task state to the per-task map
  const saveCurrentTaskState = useCallback((curTaskId, curRemaining, curDuration, curSessionType) => {
    if (!curTaskId) return;
    const wasUsed = curRemaining < curDuration * 60;
    if (!wasUsed) return; // don't save pristine state
    const next = {
      ...taskStatesRef.current,
      [curTaskId]: { remaining: curRemaining, duration: curDuration, sessionType: curSessionType },
    };
    taskStatesRef.current = next;
    saveTaskStates(next);
  }, []);

  const attachTask = useCallback((id) => {
    if (running) return; // don't switch while active
    if (id === taskId) return; // same task

    // Save current task's paused state
    saveCurrentTaskState(taskId, remaining, duration, sessionType);

    // Restore new task's saved state or use defaults
    const saved = taskStatesRef.current[id];
    if (saved) {
      setDurationRaw(saved.duration);
      setSessionTypeRaw(saved.sessionType);
      setRemaining(saved.remaining);
    } else {
      setDurationRaw(POMODORO_DEFAULTS.workDuration);
      setSessionTypeRaw(POMODORO_TYPES.WORK);
      setRemaining(POMODORO_DEFAULTS.workDuration * 60);
    }

    setTaskId(id);
  }, [running, taskId, remaining, duration, sessionType, saveCurrentTaskState]);

  const setDuration = useCallback((d) => {
    if (running) return;
    const clamped = Math.max(POMODORO_DEFAULTS.minDuration, Math.min(120, d));
    setDurationRaw(clamped);
    setRemaining(clamped * 60);
  }, [running]);

  const setSessionType = useCallback((t) => {
    if (running) return;
    setSessionTypeRaw(t);
    const newDur = t === POMODORO_TYPES.REST
      ? POMODORO_DEFAULTS.restDuration
      : POMODORO_DEFAULTS.workDuration;
    setDurationRaw(newDur);
    setRemaining(newDur * 60);
  }, [running]);

  const handleStart = useCallback(() => {
    completedRef.current = false;
    const fullSeconds = duration * 60;
    const adjusted = new Date(Date.now() - (fullSeconds - remaining) * 1000);
    setStartedAt(adjusted.toISOString());
    setRunning(true);
  }, [duration, remaining]);

  const handlePause = useCallback(() => {
    setRunning(false);
    setStartedAt(null);
    // Persist paused state immediately
    saveCurrentTaskState(taskId, remaining, duration, sessionType);
  }, [taskId, remaining, duration, sessionType, saveCurrentTaskState]);

  const handleStop = useCallback(async () => {
    setRunning(false);
    const elapsed = duration * 60 - remaining;
    if (startedAt && elapsed > 0 && taskId) {
      setSaving(true);
      try {
        await addSession({
          taskId, type: sessionType, duration,
          startTime: startedAt,
          endTime: new Date().toISOString(),
          status: POMODORO_STATUS.ABANDONED,
        });
      } finally { setSaving(false); }
    }
    setStartedAt(null);
    setRemaining(duration * 60);
    completedRef.current = false;

    // Clear saved state for this task on stop
    if (taskId) {
      const next = { ...taskStatesRef.current };
      delete next[taskId];
      taskStatesRef.current = next;
      saveTaskStates(next);
    }
  }, [addSession, duration, remaining, sessionType, startedAt, taskId]);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const progress = 1 - remaining / (duration * 60);
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(Math.floor(remaining % 60)).padStart(2, '0');

  return (
    <PomodoroContext.Provider value={{
      taskId, duration, sessionType, remaining, running, startedAt, saving,
      progress, mm, ss,
      isActive: running && remaining > 0,
      toasts, dismissToast,
      attachTask, setDuration, setSessionType,
      handleStart, handlePause, handleStop,
    }}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error('usePomodoro must be used within PomodoroProvider');
  return ctx;
}
