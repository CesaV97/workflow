export function projectFromDb(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function projectToDb(project, userId) {
  return {
    user_id: userId,
    name: project.name.trim(),
    description: project.description?.trim() ?? '',
    start_date: project.startDate || null,
    end_date: project.endDate || null,
    status: project.status,
  };
}

export function taskFromDb(row) {
  return {
    id: row.id,
    userId: row.user_id,
    projectId: row.project_id,
    projectName: row.projects?.name ?? row.project_name ?? '',
    name: row.name,
    description: row.description,
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function taskToDb(task, userId) {
  return {
    user_id: userId,
    project_id: task.projectId,
    name: task.name.trim(),
    description: task.description?.trim() ?? '',
    start_date: task.startDate || null,
    end_date: task.endDate || null,
    status: task.status,
  };
}

export function commentFromDb(row) {
  return {
    id: row.id,
    userId: row.user_id,
    taskId: row.task_id,
    text: row.text,
    createdAt: row.created_at,
  };
}

export function commentToDb(comment, userId) {
  return {
    user_id: userId,
    task_id: comment.taskId,
    text: comment.text.trim(),
    created_at: comment.createdAt ?? undefined,
  };
}

export function sessionFromDb(row) {
  return {
    id: row.id,
    userId: row.user_id,
    taskId: row.task_id,
    type: row.type,
    duration: row.duration,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status,
  };
}

export function sessionToDb(session, userId) {
  return {
    user_id: userId,
    task_id: session.taskId,
    type: session.type,
    duration: session.duration,
    start_time: session.startTime,
    end_time: session.endTime,
    status: session.status,
  };
}
