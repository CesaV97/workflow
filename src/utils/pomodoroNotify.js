export async function sendBrowserNotification(sessionType) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'denied') return;
  if (Notification.permission === 'default') {
    const result = await Notification.requestPermission();
    if (result !== 'granted') return;
  }
  new Notification('Pomodoro completado', {
    body: sessionType === 'Work'
      ? '¡Sesión de trabajo terminada! Toma un descanso.'
      : '¡Descanso terminado! A trabajar.',
    icon: '/favicon.ico',
    tag: 'pomodoro-complete',
  });
}

export function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
    osc.onended = () => ctx.close();
  } catch { /* AudioContext blocked before user gesture — fail silently */ }
}
