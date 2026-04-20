// Seed data — shaped to mirror src/data/entities in the repo.
const TODAY = new Date(2026, 3, 19); // April 19, 2026 (month is 0-indexed)
const iso = (d) => d.toISOString().slice(0,10);
const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate()+n); return d; };

window.SEED_PROJECTS = [
  {
    id: 'p1', name: 'WorkFlow MVP', status: 'Active',
    description: 'Aplicación personal de productividad para controlar proyectos, tareas y tiempos de trabajo con Pomodoro.',
    startDate: iso(addDays(TODAY, -22)), endDate: iso(addDays(TODAY, 18)),
    progress: 62, taskCount: 14, doneCount: 9,
    createdAt: addDays(TODAY,-22).toISOString(),
    tags: ['React', 'Vite', 'Supabase'],
    members: ['CV','AM','LR'],
  },
  {
    id: 'p2', name: 'Vega Producciones', status: 'Active',
    description: 'Página web para negocio local con catálogo de servicios y contacto directo por WhatsApp.',
    startDate: iso(addDays(TODAY,-10)), endDate: iso(addDays(TODAY,30)),
    progress: 34, taskCount: 9, doneCount: 3,
    createdAt: addDays(TODAY,-10).toISOString(),
    tags: ['Landing', 'SEO'],
    members: ['CV'],
  },
  {
    id: 'p3', name: 'NosVemos MX', status: 'On Hold',
    description: 'Creador de invitaciones digitales con editor drag-and-drop y plantillas prediseñadas.',
    startDate: iso(addDays(TODAY,-60)), endDate: iso(addDays(TODAY,-5)),
    progress: 80, taskCount: 22, doneCount: 18,
    createdAt: addDays(TODAY,-60).toISOString(),
    tags: ['React','Canvas'],
    members: ['CV','AM'],
  },
  {
    id: 'p4', name: 'Curso Backend Node', status: 'Active',
    description: 'Estudio personal de Node.js + PostgreSQL con ejercicios prácticos cada semana.',
    startDate: iso(addDays(TODAY,-30)), endDate: iso(addDays(TODAY,60)),
    progress: 45, taskCount: 18, doneCount: 8,
    createdAt: addDays(TODAY,-30).toISOString(),
    tags: ['Aprendizaje'],
    members: ['CV'],
  },
  {
    id: 'p5', name: 'STROC Send Mail', status: 'Completed',
    description: 'Servicio interno para envío de notificaciones por correo con plantillas dinámicas.',
    startDate: iso(addDays(TODAY,-120)), endDate: iso(addDays(TODAY,-40)),
    progress: 100, taskCount: 12, doneCount: 12,
    createdAt: addDays(TODAY,-120).toISOString(),
    tags: ['Node','SMTP'],
    members: ['CV','LR'],
  },
  {
    id: 'p6', name: 'MttoApp', status: 'Archived',
    description: 'Prototipo de app de mantenimiento industrial — pausado tras Fase 1.',
    startDate: iso(addDays(TODAY,-200)), endDate: iso(addDays(TODAY,-150)),
    progress: 30, taskCount: 8, doneCount: 2,
    createdAt: addDays(TODAY,-200).toISOString(),
    tags: ['Prototipo'],
    members: ['CV'],
  },
];

window.SEED_TASKS = [
  { id: 't1', projectId: 'p1', projectName: 'WorkFlow MVP', name: 'Implementar panel de detalle de tarea',
    description: 'Crear el panel lateral derecho con información de la tarea, fechas, descripción, Pomodoro timer y comentarios.',
    status: 'In Progress', startDate: iso(addDays(TODAY,-3)), endDate: iso(TODAY),
    pomodoroCount: 4, commentCount: 3 },
  { id: 't2', projectId: 'p1', projectName: 'WorkFlow MVP', name: 'Conectar Supabase Auth',
    description: 'Configurar autenticación con email + password y migrar datos locales a la BD al iniciar sesión.',
    status: 'Blocked', startDate: iso(addDays(TODAY,-5)), endDate: iso(TODAY),
    pomodoroCount: 2, commentCount: 2 },
  { id: 't3', projectId: 'p1', projectName: 'WorkFlow MVP', name: 'Diseñar vista de Reportes',
    description: 'Distribución trabajo/descanso, historial de sesiones y resumen de minutos totales.',
    status: 'To Do', startDate: iso(TODAY), endDate: iso(addDays(TODAY,1)),
    pomodoroCount: 0, commentCount: 0 },
  { id: 't4', projectId: 'p1', projectName: 'WorkFlow MVP', name: 'Pulir tema dark mode',
    description: 'Revisar tokens de color y espaciado en todos los componentes.',
    status: 'Done', startDate: iso(addDays(TODAY,-4)), endDate: iso(addDays(TODAY,-2)),
    pomodoroCount: 3, commentCount: 1 },
  { id: 't5', projectId: 'p1', projectName: 'WorkFlow MVP', name: 'Modal de nuevo proyecto',
    description: 'Formulario con nombre, descripción, fechas y estatus. Validación con mensajes en español.',
    status: 'Paused', startDate: iso(addDays(TODAY,-2)), endDate: iso(addDays(TODAY,2)),
    pomodoroCount: 2, commentCount: 1 },
  { id: 't6', projectId: 'p2', projectName: 'Vega Producciones', name: 'Sección de servicios',
    description: 'Grid con tarjetas de servicios + imágenes de portada. Responsive a partir de 720px.',
    status: 'In Progress', startDate: iso(addDays(TODAY,-2)), endDate: iso(addDays(TODAY,1)),
    pomodoroCount: 1, commentCount: 0 },
  { id: 't7', projectId: 'p2', projectName: 'Vega Producciones', name: 'Botón flotante de WhatsApp',
    description: '',
    status: 'To Do', startDate: iso(TODAY), endDate: iso(addDays(TODAY,2)),
    pomodoroCount: 0, commentCount: 0 },
  { id: 't8', projectId: 'p4', projectName: 'Curso Backend Node', name: 'Práctica: REST API con Express',
    description: 'CRUD completo con middleware de validación y manejo de errores.',
    status: 'In Progress', startDate: iso(addDays(TODAY,-1)), endDate: iso(addDays(TODAY,3)),
    pomodoroCount: 2, commentCount: 1 },
  { id: 't9', projectId: 'p4', projectName: 'Curso Backend Node', name: 'Módulo 5: Autenticación con JWT',
    description: '',
    status: 'To Do', startDate: iso(addDays(TODAY,4)), endDate: iso(addDays(TODAY,6)),
    pomodoroCount: 0, commentCount: 0 },
  { id: 't10', projectId: 'p3', projectName: 'NosVemos MX', name: 'Editor de invitaciones — arrastrar imagen',
    description: 'Permitir soltar imágenes en el canvas y reposicionarlas con drag.',
    status: 'Paused', startDate: iso(addDays(TODAY,-8)), endDate: iso(addDays(TODAY,5)),
    pomodoroCount: 5, commentCount: 4 },
];

window.SEED_COMMENTS = {
  t1: [
    { id: 'c1', text: 'Dejo el scaffold del panel listo. Falta el Pomodoro y la lista de comentarios.', createdAt: addDays(TODAY,-2).toISOString() },
    { id: 'c2', text: 'Usé flexbox para el layout del header y funcionó mejor que grid en esta densidad.', createdAt: addDays(TODAY,-1).toISOString() },
    { id: 'c3', text: 'Ya integré el timer. La animación del ring circular quedó muy suave con stroke-dashoffset.', createdAt: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), 9, 15).toISOString() },
  ],
  t2: [
    { id: 'c4', text: 'Bloqueado: necesito decidir si guardo el user.id como FK o uso Row-Level-Security.', createdAt: addDays(TODAY,-1).toISOString() },
    { id: 'c5', text: 'Revisé docs de Supabase — RLS es el camino correcto para multi-tenant.', createdAt: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), 11, 32).toISOString() },
  ],
};

// Pomodoro sessions across last ~14 days — used for Reports & dashboard sparks.
function genSessions() {
  const out = [];
  let id = 1;
  for (let i = 13; i >= 0; i--) {
    const day = addDays(TODAY, -i);
    // 0-5 work sessions per day
    const n = Math.max(0, Math.round(Math.sin(i*0.7)*2 + 3 + (i%3===0?-2:0)));
    for (let k = 0; k < n; k++) {
      const startHour = 9 + k * 2 + (k%2);
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), startHour, (k*17)%60);
      out.push({
        id: 'ps'+(id++),
        taskId: ['t1','t2','t3','t6','t8','t10'][(i+k)%6],
        type: 'Work',
        duration: [25, 25, 25, 50, 25][k%5],
        startTime: start.toISOString(),
        endTime: new Date(start.getTime()+25*60000).toISOString(),
        status: 'Completed',
      });
      if (k % 2 === 0) {
        const rstart = new Date(start.getTime()+26*60000);
        out.push({
          id: 'ps'+(id++),
          taskId: ['t1','t2','t3','t6','t8','t10'][(i+k)%6],
          type: 'Rest',
          duration: 5,
          startTime: rstart.toISOString(),
          endTime: new Date(rstart.getTime()+5*60000).toISOString(),
          status: 'Completed',
        });
      }
    }
  }
  return out;
}
window.SEED_SESSIONS = genSessions();

window.formatDate = (dstr) => {
  if (!dstr) return '';
  const d = new Date(dstr);
  return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
};
window.formatDateLong = (dstr) => {
  if (!dstr) return '';
  const d = new Date(dstr);
  return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' });
};
window.TODAY_DATE = TODAY;
