begin;

create table public.todo_tasks (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id uuid not null,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index todo_tasks_user_created_idx on public.todo_tasks (user_id, created_at, id);

alter table public.todo_tasks enable row level security;

revoke all on public.todo_tasks from public, anon, authenticated;
grant select, insert, delete on public.todo_tasks to authenticated;
grant update (completed) on public.todo_tasks to authenticated;

create policy "Users manage their own tasks"
on public.todo_tasks
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

commit;
