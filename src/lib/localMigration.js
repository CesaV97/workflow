import { getProjectCount, createProject, createTask, createComment, createSession } from './workflowApi';

function readMigrationState(migrationKey) {
  const raw = window.localStorage.getItem(migrationKey);
  if (!raw) {
    return {
      status: 'pending',
      projectMap: {},
      taskMap: {},
      migratedCommentIds: [],
      migratedSessionIds: [],
    };
  }

  if (raw === 'done') {
    return { status: 'done' };
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid migration state');
    }

    return {
      status: parsed.status === 'done' ? 'done' : 'in_progress',
      projectMap: parsed.projectMap ?? {},
      taskMap: parsed.taskMap ?? {},
      migratedCommentIds: Array.isArray(parsed.migratedCommentIds) ? parsed.migratedCommentIds : [],
      migratedSessionIds: Array.isArray(parsed.migratedSessionIds) ? parsed.migratedSessionIds : [],
    };
  } catch {
    return {
      status: 'pending',
      projectMap: {},
      taskMap: {},
      migratedCommentIds: [],
      migratedSessionIds: [],
    };
  }
}

function persistMigrationState(migrationKey, state) {
  window.localStorage.setItem(migrationKey, JSON.stringify({
    status: state.status,
    projectMap: state.projectMap,
    taskMap: state.taskMap,
    migratedCommentIds: state.migratedCommentIds,
    migratedSessionIds: state.migratedSessionIds,
  }));
}

function readLocalArray(key) {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function migrateLocalDataToSupabase(userId) {
  if (typeof window === 'undefined' || !userId) {
    return { migrated: false };
  }

  const migrationKey = `workflow:supabaseMigration:${userId}`;
  const migrationState = readMigrationState(migrationKey);
  if (migrationState.status === 'done') {
    return { migrated: false };
  }

  const remoteProjects = await getProjectCount(userId);
  if (remoteProjects > 0 && Object.keys(migrationState.projectMap).length === 0) {
    return { migrated: false };
  }

  const localProjects = readLocalArray('projects');
  const localTasks = readLocalArray('tasks');
  const localComments = readLocalArray('comments');
  const localSessions = readLocalArray('pomodoroSessions');

  if (
    localProjects.length === 0 &&
    localTasks.length === 0 &&
    localComments.length === 0 &&
    localSessions.length === 0
  ) {
    return { migrated: false };
  }

  const state = {
    status: 'in_progress',
    projectMap: { ...migrationState.projectMap },
    taskMap: { ...migrationState.taskMap },
    migratedCommentIds: [...migrationState.migratedCommentIds],
    migratedSessionIds: [...migrationState.migratedSessionIds],
  };

  for (const project of localProjects) {
    if (state.projectMap[project.id]) {
      continue;
    }

    const created = await createProject(userId, {
      name: project.name ?? '',
      description: project.description ?? '',
      startDate: project.startDate ?? '',
      endDate: project.endDate ?? '',
      status: project.status ?? 'Active',
    });
    state.projectMap[project.id] = created.id;
    persistMigrationState(migrationKey, state);
  }

  for (const task of localTasks) {
    if (state.taskMap[task.id]) {
      continue;
    }

    const mappedProjectId = state.projectMap[task.projectId];
    if (!mappedProjectId) {
      continue;
    }

    const created = await createTask(userId, {
      projectId: mappedProjectId,
      name: task.name ?? '',
      description: task.description ?? '',
      startDate: task.startDate ?? '',
      endDate: task.endDate ?? '',
      status: task.status ?? 'To Do',
    });
    state.taskMap[task.id] = created.id;
    persistMigrationState(migrationKey, state);
  }

  for (const comment of localComments) {
    if (state.migratedCommentIds.includes(comment.id)) {
      continue;
    }

    const mappedTaskId = state.taskMap[comment.taskId];
    if (!mappedTaskId || !comment.text?.trim()) {
      continue;
    }

    await createComment(userId, {
      taskId: mappedTaskId,
      text: comment.text,
      createdAt: comment.createdAt,
    });
    state.migratedCommentIds.push(comment.id);
    persistMigrationState(migrationKey, state);
  }

  for (const session of localSessions) {
    if (state.migratedSessionIds.includes(session.id)) {
      continue;
    }

    const mappedTaskId = state.taskMap[session.taskId];
    if (!mappedTaskId) {
      continue;
    }

    await createSession(userId, {
      taskId: mappedTaskId,
      type: session.type ?? 'Work',
      duration: session.duration ?? 25,
      startTime: session.startTime ?? new Date().toISOString(),
      endTime: session.endTime ?? new Date().toISOString(),
      status: session.status ?? 'Completed',
    });
    state.migratedSessionIds.push(session.id);
    persistMigrationState(migrationKey, state);
  }

  window.localStorage.setItem(migrationKey, 'done');
  return { migrated: true };
}
