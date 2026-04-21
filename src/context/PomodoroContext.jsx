import {
  createContext, useContext, useEffect, useRef, useState, useCallback
} from 'react';
import { usePomodoroSessions } from '../hooks/usePomodoroSessions';
import { useSettings } from './SettingsContext';
import { POMODORO_TYPES, POMODORO_STATUS, POMODORO_DEFAULTS } from '../constants/pomodoroConfig';
import { sendBrowserNotification, playBeep } from '../utils/pomodoroNotify';

const PomodoroContext = createContext(undefined);
const STORAGE_KEY = 'wf_pomodoro';

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

export function PomodoroProvider({ children }) {
  const { addSession } = usePomodoroSessions();
  const { notif, sound, autoBreak } = useSettings();

  const init = useRef(loadPersistedState()).current;

  const [taskId,         setTaskId]         = useState(init?.taskId      ?? null);
  const [duration,       setDurationRaw]    = useState(init?.duration    ?? POMODORO_DEFAULTS.workDuration);
  const [sessionType,    setSessionTypeRaw] = useState(init?.sessionType ?? POMODORO_TYPES.WORK);
  const [remaining,      setRemaining]      = useState(init?.remaining   ?? (POMODORO_DEFAULTS.workDuration * 60));
  const [running,        setRunning]        = useState(init?.running     ?? false);
  const [startedAt,      setStartedAt]      = useState(init?.startedAt   ?? null);
  const [saving,         setSaving]         = useState(false);
  const [toasts,         setToasts]         = useState([]);

  const completedRef = useRef(false);
  const intervalRef  = useRef(null);

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

    const msg = sessionType === POMODORO_TYPES.WORK
      ? '¡Sesión de trabajo completada! Toma un descanso.'
      : '¡Descanso terminado! A trabajar.';
    addToast(msg, 'success');
    if (notif) sendBrowserNotification(sessionType);
    if (sound) playBeep();

    if (autoBreak) {
      const nextType = sessionType === POMODORO_TYPES.WORK ? POMODORO_TYPES.REST : POMODORO_TYPES.WORK;
      const nextDur  = nextType === POMODORO_TYPES.WORK
        ? POMODORO_DEFAULTS.workDuration
        : POMODORO_DEFAULTS.restDuration;
      setSessionTypeRaw(nextType);
      setDurationRaw(nextDur);
      setRemaining(nextDur * 60);
      setStartedAt(new Date().toISOString());
      setRunning(true);
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

  const attachTask = useCallback((id) => {
    if (!running) setTaskId(id);
  }, [running]);

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
    // Adjust startedAt so interval math yields correct remaining on both
    // fresh start (remaining = fullSeconds → startedAt = now) and
    // resume after pause (remaining < fullSeconds → startedAt = now - elapsed)
    const fullSeconds = duration * 60;
    const adjusted = new Date(Date.now() - (fullSeconds - remaining) * 1000);
    setStartedAt(adjusted.toISOString());
    setRunning(true);
  }, [duration, remaining]);

  const handlePause = useCallback(() => {
    setRunning(false);
    setStartedAt(null);
  }, []);

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
