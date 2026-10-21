-- Execute este script no SQL Editor do Supabase.
create extension if not exists pgcrypto;

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  respondent_name text,
  area text not null check (area in (
    'Massas','Estoque/Logística','Manutenção Massas','Manutenção Moinho',
    'Moinho','CQ','Área Adm (RH, Comercial, Jurídico etc.)','Outros'
  )),
  cargo text not null,
  idade text not null,
  tempo_empresa text not null,
  answers jsonb not null,
  constraint answers_is_object check (jsonb_typeof(answers) = 'object')
);

-- A lista de administradores é controlada por UUID de usuário do Supabase Auth.
create table if not exists public.survey_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.survey_responses enable row level security;
alter table public.survey_admins enable row level security;

-- Permite envio público de novas respostas; não permite ler/alterar respostas sem autorização.
drop policy if exists "Anyone can submit a survey response" on public.survey_responses;
create policy "Anyone can submit a survey response"
on public.survey_responses for insert to anon, authenticated
with check (
  respondent_name is null or length(respondent_name) <= 80
);

-- Só usuários cadastrados como administradores podem ler respostas.
drop policy if exists "Admins can read survey responses" on public.survey_responses;
create policy "Admins can read survey responses"
on public.survey_responses for select to authenticated
using (exists (select 1 from public.survey_admins a where a.user_id = auth.uid()));

-- A tabela de administradores não deve ser consultável por usuários comuns.
drop policy if exists "Admins can read their own admin record" on public.survey_admins;
create policy "Admins can read their own admin record"
on public.survey_admins for select to authenticated
using (user_id = auth.uid());

grant insert on public.survey_responses to anon, authenticated;
grant select on public.survey_responses to authenticated;
grant select on public.survey_admins to authenticated;

-- Depois de criar o usuário administrador em Authentication > Users,
-- copie o UUID dele e execute:
-- insert into public.survey_admins (user_id) values ('UUID-DO-USUARIO-ADMIN');
