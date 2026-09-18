-- Run once in the Supabase SQL Editor. Re-running is safe for this schema.
begin;
create table if not exists public.appointment_requests (
  id uuid primary key,
  name text not null check (char_length(btrim(name)) between 2 and 60),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  service text not null check (service in ('Clínica geral', 'Ortodontia', 'Estética dental', 'Implantodontia', 'Quero uma avaliação geral')),
  consent boolean not null check (consent is true),
  created_at timestamptz not null default now()
);
alter table public.appointment_requests enable row level security;
revoke all on public.appointment_requests from public, anon, authenticated;

-- Public callers can only submit through this function, never list requests.
create or replace function public.submit_appointment(p_id uuid, p_name text, p_email text, p_service text, p_consent boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_id is null or p_name is null or char_length(btrim(p_name)) not between 2 and 60
     or p_email is null or char_length(p_email) > 254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
     or p_service is null or p_service not in ('Clínica geral', 'Ortodontia', 'Estética dental', 'Implantodontia', 'Quero uma avaliação geral')
     or p_consent is distinct from true then
    raise exception 'Invalid appointment request' using errcode = '22023';
  end if;
  insert into public.appointment_requests(id, name, email, service, consent)
  values (p_id, btrim(p_name), lower(btrim(p_email)), p_service, true)
  on conflict (id) do nothing;
end;
$$;
revoke all on function public.submit_appointment(uuid, text, text, text, boolean) from public, anon, authenticated;
grant usage on schema public to anon;
grant execute on function public.submit_appointment(uuid, text, text, text, boolean) to anon;
commit;