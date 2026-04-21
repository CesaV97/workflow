import { getSupabaseClient } from './supabase';
import {
  commentFromDb,
  commentToDb,
  projectFromDb,
  projectToDb,
  sessionFromDb,
  sessionToDb,
  taskFromDb,
  taskToDb,
} from './workflowMappers';

function ensureUserId(userId) {
  if (!userId) {
    throw new Error('No authenticated user found.');
  }
}

function scopeToUser(query, userId) {
  return query.eq('user_id', userId);
}

function scopeByIdAndUser(query, id, userId) {
  return scopeToUser(query.eq('id', id), userId);
}

async function unwrap(query) {
  const { data, error, count } = await query;
  if (error) {
    throw error;
  }

  return { data, count };
}

export async function getProjectCount(userId) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { count } = await unwrap(
    scopeToUser(client.from('projects').select('id', { count: 'exact', head: true }), userId)
  );
  return count ?? 0;
}

export async function listProjects(userId) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    scopeToUser(client.from('projects').select('*'), userId).order('created_at', { ascending: false })
  );
  return (data ?? []).map(projectFromDb);
}

export async function createProject(userId, payload) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    client.from('projects').insert(projectToDb(payload, userId)).select('*').single()
  );
  return projectFromDb(data);
}

export async function updateProject(userId, id, updates) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    scopeByIdAndUser(client.from('projects').update(projectToDb(updates, userId)), id, userId)
      .select('*')
      .single()
  );
  return projectFromDb(data);
}

export async function deleteProject(userId, id) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  await unwrap(scopeByIdAndUser(client.from('projects').delete(), id, userId));
  return true;
}

export async function listTasks(userId) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    scopeToUser(client.from('tasks').select('*, projects(name)'), userId)
      .order('created_at', { ascending: false })
  );
  return (data ?? []).map(taskFromDb);
}

export async function createTask(userId, payload) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    client.from('tasks').insert(taskToDb(payload, userId)).select('*, projects(name)').single()
  );
  return taskFromDb(data);
}

export async function updateTask(userId, id, updates) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    scopeByIdAndUser(client.from('tasks').update(taskToDb(updates, userId)), id, userId)
      .select('*, projects(name)')
      .single()
  );
  return taskFromDb(data);
}

export async function deleteTask(userId, id) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  await unwrap(scopeByIdAndUser(client.from('tasks').delete(), id, userId));
  return true;
}

export async function listComments(userId) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    scopeToUser(client.from('comments').select('*'), userId).order('created_at', { ascending: true })
  );
  return (data ?? []).map(commentFromDb);
}

export async function createComment(userId, payload) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    client.from('comments').insert(commentToDb(payload, userId)).select('*').single()
  );
  return commentFromDb(data);
}

export async function updateComment(userId, id, updates) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    scopeByIdAndUser(client.from('comments').update({ text: updates.text?.trim() ?? '' }), id, userId)
      .select('*')
      .single()
  );
  return commentFromDb(data);
}

export async function deleteComment(userId, id) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  await unwrap(scopeByIdAndUser(client.from('comments').delete(), id, userId));
  return true;
}

export async function listSessions(userId) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    scopeToUser(client.from('pomodoro_sessions').select('*'), userId).order('start_time', { ascending: false })
  );
  return (data ?? []).map(sessionFromDb);
}

export async function createSession(userId, payload) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    client.from('pomodoro_sessions').insert(sessionToDb(payload, userId)).select('*').single()
  );
  return sessionFromDb(data);
}

export async function updateSession(userId, id, updates) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  const { data } = await unwrap(
    scopeByIdAndUser(client.from('pomodoro_sessions').update(sessionToDb(updates, userId)), id, userId)
      .select('*')
      .single()
  );
  return sessionFromDb(data);
}

export async function deleteSession(userId, id) {
  ensureUserId(userId);
  const client = getSupabaseClient();
  await unwrap(scopeByIdAndUser(client.from('pomodoro_sessions').delete(), id, userId));
  return true;
}
