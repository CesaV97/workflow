import { getProjectCount, createProject, createTask, createComment, createSession } from './workflowApi';

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
  if (window.localStorage.getItem(migrationKey) === 'done') {
    return { migrated: false };
  }

  const remoteProjects = await getProjectCount(userId);
  if (remoteProjects > 0) {
    window.localStorage.setItem(migrationKey, 'done');
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
    window.localStorage.setItem(migrationKey, 'done');
    return { migrated: false };
  }

  const projectMap = new Map();
  const taskMap = new Map();

  for (const project of localProjects) {
    const created = await createProject(userId, {
      name: project.name ?? '',
      description: project.description ?? '',
      startDate: project.startDate ?? '',
      endDate: project.endDate ?? '',
      status: project.status ?? 'Active',
    });
    projectMap.set(project.id, created.id);
  }

  for (const task of localTasks) {
    const mappedProjectId = projectMap.get(task.projectId);
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
    taskMap.set(task.id, created.id);
  }

  for (const comment of localComments) {
    const mappedTaskId = taskMap.get(comment.taskId);
    if (!mappedTaskId || !comment.text?.trim()) {
      continue;
    }

    await createComment(userId, {
      taskId: mappedTaskId,
      text: comment.text,
      createdAt: comment.createdAt,
    });
  }

  for (const session of localSessions) {
    const mappedTaskId = taskMap.get(session.taskId);
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
  }

  window.localStorage.setItem(migrationKey, 'done');
  return { migrated: true };
}
