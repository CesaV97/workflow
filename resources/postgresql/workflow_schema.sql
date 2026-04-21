create extension if not exists pgcrypto;

create schema if not exists workflow;

set search_path to workflow, public;

create or replace function workflow.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists workflow.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text not null default '',
  start_date date,
  end_date date,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_name_not_blank check (btrim(name) <> ''),
  constraint projects_status_valid check (status in ('Active', 'On Hold', 'Completed', 'Archived')),
  constraint projects_date_range_valid check (
    end_date is null or start_date is null or end_date >= start_date
  )
);

create table if not exists workflow.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid not null references workflow.projects (id) on delete cascade,
  name text not null,
  description text not null default '',
  start_date date,
  end_date date,
  status text not null default 'To Do',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_name_not_blank check (btrim(name) <> ''),
  constraint tasks_status_valid check (status in ('To Do', 'In Progress', 'Paused', 'Blocked', 'Done')),
  constraint tasks_date_range_valid check (
    end_date is null or start_date is null or end_date >= start_date
  )
);

create table if not exists workflow.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid not null references workflow.tasks (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now(),
  constraint comments_text_not_blank check (btrim(text) <> '')
);

create table if not exists workflow.pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid not null references workflow.tasks (id) on delete cascade,
  type text not null,
  duration integer not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null,
  constraint pomodoro_sessions_type_valid check (type in ('Work', 'Rest')),
  constraint pomodoro_sessions_status_valid check (status in ('Completed', 'Abandoned')),
  constraint pomodoro_sessions_duration_valid check (duration between 1 and 60),
  constraint pomodoro_sessions_time_range_valid check (end_time > start_time)
);

create index if not exists projects_user_id_created_at_idx
  on workflow.projects (user_id, created_at desc);

create index if not exists tasks_project_id_created_at_idx
  on workflow.tasks (project_id, created_at desc);

create index if not exists tasks_user_id_status_idx
  on workflow.tasks (user_id, status);

create index if not exists comments_task_id_created_at_idx
  on workflow.comments (task_id, created_at asc);

create index if not exists pomodoro_sessions_task_id_start_time_idx
  on workflow.pomodoro_sessions (task_id, start_time desc);

drop trigger if exists set_projects_updated_at on workflow.projects;
create trigger set_projects_updated_at
before update on workflow.projects
for each row
execute function workflow.set_updated_at();

drop trigger if exists set_tasks_updated_at on workflow.tasks;
create trigger set_tasks_updated_at
before update on workflow.tasks
for each row
execute function workflow.set_updated_at();

alter table workflow.projects enable row level security;
alter table workflow.tasks enable row level security;
alter table workflow.comments enable row level security;
alter table workflow.pomodoro_sessions enable row level security;

drop policy if exists projects_select_own on workflow.projects;
create policy projects_select_own
on workflow.projects
for select
using (user_id = auth.uid());

drop policy if exists projects_insert_own on workflow.projects;
create policy projects_insert_own
on workflow.projects
for insert
with check (user_id = auth.uid());

drop policy if exists projects_update_own on workflow.projects;
create policy projects_update_own
on workflow.projects
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists projects_delete_own on workflow.projects;
create policy projects_delete_own
on workflow.projects
for delete
using (user_id = auth.uid());

drop policy if exists tasks_select_own on workflow.tasks;
create policy tasks_select_own
on workflow.tasks
for select
using (user_id = auth.uid());

drop policy if exists tasks_insert_own on workflow.tasks;
create policy tasks_insert_own
on workflow.tasks
for insert
with check (user_id = auth.uid());

drop policy if exists tasks_update_own on workflow.tasks;
create policy tasks_update_own
on workflow.tasks
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists tasks_delete_own on workflow.tasks;
create policy tasks_delete_own
on workflow.tasks
for delete
using (user_id = auth.uid());

drop policy if exists comments_select_own on workflow.comments;
create policy comments_select_own
on workflow.comments
for select
using (user_id = auth.uid());

drop policy if exists comments_insert_own on workflow.comments;
create policy comments_insert_own
on workflow.comments
for insert
with check (user_id = auth.uid());

drop policy if exists comments_update_own on workflow.comments;
create policy comments_update_own
on workflow.comments
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists comments_delete_own on workflow.comments;
create policy comments_delete_own
on workflow.comments
for delete
using (user_id = auth.uid());

drop policy if exists pomodoro_sessions_select_own on workflow.pomodoro_sessions;
create policy pomodoro_sessions_select_own
on workflow.pomodoro_sessions
for select
using (user_id = auth.uid());

drop policy if exists pomodoro_sessions_insert_own on workflow.pomodoro_sessions;
create policy pomodoro_sessions_insert_own
on workflow.pomodoro_sessions
for insert
with check (user_id = auth.uid());

drop policy if exists pomodoro_sessions_update_own on workflow.pomodoro_sessions;
create policy pomodoro_sessions_update_own
on workflow.pomodoro_sessions
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists pomodoro_sessions_delete_own on workflow.pomodoro_sessions;
create policy pomodoro_sessions_delete_own
on workflow.pomodoro_sessions
for delete
using (user_id = auth.uid());
