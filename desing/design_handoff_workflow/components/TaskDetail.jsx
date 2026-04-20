const { useState: useStateTD, useEffect: useEffectTD, useRef: useRefTD } = React;

function Pomodoro({ taskId, onSessionComplete }) {
  const Icon = window.Icon;
  const [duration, setDuration] = useStateTD(25);
  const [sessionType, setSessionType] = useStateTD('Work');
  const [running, setRunning] = useStateTD(false);
  const [remaining, setRemaining] = useStateTD(25*60);
  const intervalRef = useRefTD(null);

  useEffectTD(()=>{ if (!running) setRemaining(duration*60); }, [duration, sessionType]);

  useEffectTD(()=>{
    if (running) {
      intervalRef.current = setInterval(()=>{
        setRemaining(prev => {
          if (prev <= 1) { clearInterval(intervalRef.current); setRunning(false); onSessionComplete?.(); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const mm = String(Math.floor(remaining/60)).padStart(2,'0');
  const ss = String(remaining%60).padStart(2,'0');
  const progress = 1 - (remaining / (duration*60));
  const r = 74, C = 2*Math.PI*r;

  return (
    <div className="pomodoro-timer">
      <div className="timer-display">
        <div className={`timer-ring ${sessionType==='Rest'?'rest':''}`}>
          <svg viewBox="0 0 168 168">
            <circle cx="84" cy="84" r={r} fill="none" strokeWidth="6" className="timer-ring-track"/>
            <circle cx="84" cy="84" r={r} fill="none" strokeWidth="6"
                    className="timer-ring-fill"
                    strokeDasharray={C}
                    strokeDashoffset={C*(1-progress)}
                    strokeLinecap="round"/>
          </svg>
          <div className="timer-inner">
            <div className="timer-time">{mm}:{ss}</div>
            <div className="timer-type">{sessionType}</div>
          </div>
        </div>
      </div>
      <div className="timer-controls">
        <button className="btn btn-primary" onClick={()=>setRunning(!running)}>
          <Icon name={running?'pause':'play'} size={12}/> {running?'Pause':'Start'}
        </button>
        <button className="btn btn-secondary" onClick={()=>{setRunning(false); setRemaining(duration*60);}}>
          <Icon name="stop" size={12}/> Stop
        </button>
      </div>
      <div className="timer-meta">
        <span>Duración: <span className="meta-num">{duration} min</span></span>
        <span>Tipo: <span className="meta-num">{sessionType}</span></span>
      </div>
      <div style={{display:'flex', gap:6}}>
        {[15, 25, 50].map(d => (
          <button key={d}
                  className={`filter-chip ${duration===d?'active':''}`}
                  onClick={()=>{ if(!running){ setDuration(d); }}}
                  style={{flex:1}}>
            {d} min
          </button>
        ))}
        <button className={`filter-chip ${sessionType==='Work'?'active':''}`}
                onClick={()=>{if(!running) setSessionType('Work')}} style={{flex:1}}>Work</button>
        <button className={`filter-chip ${sessionType==='Rest'?'active':''}`}
                onClick={()=>{if(!running) setSessionType('Rest')}} style={{flex:1}}>Rest</button>
      </div>
    </div>
  );
}

function TaskDetailPanel({ task, comments, onClose }) {
  const Icon = window.Icon;
  const [text, setText] = useStateTD('');
  const [localComments, setLocalComments] = useStateTD(comments || []);

  useEffectTD(()=>{ setLocalComments(comments||[]); setText(''); }, [task?.id]);

  if (!task) return null;

  const statusColorMap = {
    'To Do': '#8b949e', 'In Progress': '#58a6ff',
    'Paused': '#9e6a03', 'Blocked': '#da3633', 'Done': '#238636',
  };

  const addComment = () => {
    if (!text.trim()) return;
    setLocalComments([...localComments, { id: 'local'+Date.now(), text: text, createdAt: new Date().toISOString() }]);
    setText('');
  };

  return (
    <aside className="task-detail-panel" data-screen-label="04 Task Detail">
      <div className="panel-header">
        <h3 className="panel-header-title">Detalles de tarea</h3>
        <button className="panel-close" onClick={onClose} aria-label="Cerrar">×</button>
      </div>
      <div className="panel-body">
        <div className="panel-section">
          <h2 className="task-detail-title">{task.name}</h2>
          <div className="task-detail-project">{task.projectName}</div>
        </div>

        <div className="panel-row">
          <label className="panel-label">Estado</label>
          <span className="task-detail-status" style={{ background: statusColorMap[task.status] || '#8b949e' }}>{task.status}</span>
        </div>

        <div className="panel-section">
          <label className="panel-label">Fechas</label>
          <div className="panel-dates">
            <div className="date-item">
              <div className="date-label">Inicio</div>
              <div className="date-value">{window.formatDateLong(task.startDate)}</div>
            </div>
            <div className="date-item">
              <div className="date-label">Vencimiento</div>
              <div className="date-value">{window.formatDateLong(task.endDate)}</div>
            </div>
          </div>
        </div>

        {task.description && (
          <div className="panel-section">
            <label className="panel-label">Descripción</label>
            <div className="task-detail-description">{task.description}</div>
          </div>
        )}

        <div className="panel-section">
          <label className="panel-label">Pomodoro · {task.pomodoroCount} sesiones registradas</label>
          <Pomodoro taskId={task.id}/>
        </div>

        <div className="panel-section">
          <label className="panel-label">Comentarios ({localComments.length})</label>
          {localComments.length > 0 && (
            <div className="comments-list">
              {localComments.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="comment-meta">
                    <span className="comment-author"><span className="avatar-sm">CV</span> Tú</span>
                    <span className="comment-date">{new Date(c.createdAt).toLocaleString('es-MX',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
              ))}
            </div>
          )}
          <div className="comment-input-box">
            <textarea className="comment-textarea" rows={2} placeholder="Agregar comentario..."
                      value={text} onChange={e=>setText(e.target.value)}/>
            <div className="comment-submit-row">
              <button className="btn btn-primary" disabled={!text.trim()} onClick={addComment}>
                <Icon name="plus" size={12}/> Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

window.TaskDetailPanel = TaskDetailPanel;
