import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext(undefined);
const STORAGE_KEY = 'wf_settings';
const DEFAULTS = { notif: true, sound: false, autoBreak: true };

function getInitialSettings() {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const p = JSON.parse(raw);
    return {
      notif:     typeof p.notif     === 'boolean' ? p.notif     : DEFAULTS.notif,
      sound:     typeof p.sound     === 'boolean' ? p.sound     : DEFAULTS.sound,
      autoBreak: typeof p.autoBreak === 'boolean' ? p.autoBreak : DEFAULTS.autoBreak,
    };
  } catch { return DEFAULTS; }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(getInitialSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setNotif     = (v) => setSettings(s => ({ ...s, notif: v }));
  const setSound     = (v) => setSettings(s => ({ ...s, sound: v }));
  const setAutoBreak = (v) => setSettings(s => ({ ...s, autoBreak: v }));

  return (
    <SettingsContext.Provider value={{ ...settings, setNotif, setSound, setAutoBreak }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
