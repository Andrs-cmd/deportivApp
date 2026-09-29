-- Plan Fitness: una fila por usuario con todo su estado (rutina, registros, metas, comida, mercado).
-- Pegar completo en Supabase → SQL Editor → Run.

create table if not exists public.perfiles (
  id uuid primary key references auth.users on delete cascade,
  estado jsonb not null default '{}'::jsonb,
  actualizado timestamptz not null default now()
);

alter table public.perfiles enable row level security;

-- Cada persona solo ve y cambia su propia fila
drop policy if exists "leer propio" on public.perfiles;
drop policy if exists "crear propio" on public.perfiles;
drop policy if exists "editar propio" on public.perfiles;
create policy "leer propio" on public.perfiles for select to authenticated using ((select auth.uid()) = id);
create policy "crear propio" on public.perfiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "editar propio" on public.perfiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
