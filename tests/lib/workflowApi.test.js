import { beforeEach, describe, expect, it, vi } from 'vitest';

const operations = [];

function createQuery(result = { data: [], error: null, count: 0 }) {
  return {
    eq(column, value) {
      operations.push({ type: 'eq', column, value });
      return this;
    },
    order(column, options) {
      operations.push({ type: 'order', column, options });
      return this;
    },
    select(columns, options) {
      operations.push({ type: 'select', columns, options });
      return this;
    },
    single() {
      operations.push({ type: 'single' });
      return this;
    },
    then(resolve, reject) {
      return Promise.resolve(result).then(resolve, reject);
    },
  };
}

const mockClient = {
  from(table) {
    operations.push({ type: 'from', table });
    return {
      select(columns, options) {
        operations.push({ type: 'select', columns, options });
        return createQuery();
      },
      update(payload) {
        operations.push({ type: 'update', payload });
        return createQuery({ data: { id: 'row-1' }, error: null, count: null });
      },
      delete() {
        operations.push({ type: 'delete' });
        return createQuery({ data: null, error: null, count: null });
      },
    };
  },
};

vi.mock('../../src/lib/supabase', () => ({
  getSupabaseClient: () => mockClient,
}));

vi.mock('../../src/lib/workflowMappers', () => ({
  commentFromDb: (row) => row,
  commentToDb: (row) => row,
  projectFromDb: (row) => row,
  projectToDb: (row) => row,
  sessionFromDb: (row) => row,
  sessionToDb: (row) => row,
  taskFromDb: (row) => row,
  taskToDb: (row) => row,
}));

describe('workflowApi user scoping', () => {
  beforeEach(() => {
    operations.length = 0;
  });

  it('scopes list queries by authenticated user', async () => {
    const { listProjects, listTasks, listComments, listSessions } = await import('../../src/lib/workflowApi');

    await listProjects('user-1');
    await listTasks('user-1');
    await listComments('user-1');
    await listSessions('user-1');

    const userFilters = operations.filter((entry) => entry.type === 'eq' && entry.column === 'user_id');
    expect(userFilters).toHaveLength(4);
    expect(userFilters.every((entry) => entry.value === 'user-1')).toBe(true);
  });

  it('scopes update and delete mutations by row id and authenticated user', async () => {
    const {
      updateProject,
      deleteProject,
      updateTask,
      deleteTask,
      updateComment,
      deleteComment,
      updateSession,
      deleteSession,
    } = await import('../../src/lib/workflowApi');

    await updateProject('user-1', 'project-1', { name: 'A' });
    await deleteProject('user-1', 'project-1');
    await updateTask('user-1', 'task-1', { name: 'A' });
    await deleteTask('user-1', 'task-1');
    await updateComment('user-1', 'comment-1', { text: 'A' });
    await deleteComment('user-1', 'comment-1');
    await updateSession('user-1', 'session-1', { duration: 25 });
    await deleteSession('user-1', 'session-1');

    const idFilters = operations.filter((entry) => entry.type === 'eq' && entry.column === 'id');
    const userFilters = operations.filter((entry) => entry.type === 'eq' && entry.column === 'user_id');

    expect(idFilters).toHaveLength(8);
    expect(userFilters).toHaveLength(8);
    expect(userFilters.every((entry) => entry.value === 'user-1')).toBe(true);
  });
});
