-- ============================================================================
-- Universidades_Institutos · Habilitar lectura pública (RLS) + diagnóstico
--
-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- ============================================================================

-- 1) Diagnóstico: columnas reales de la tabla ------------------------------
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'Universidades_Institutos'
order by ordinal_position;

-- 2) Diagnóstico: cuántas filas hay (con la clave pública se ven 0 si el RLS
--    no tiene política de SELECT; este conteo se hace como owner, por eso ve todo)
select count(*) as total_filas from public."Universidades_Institutos";

-- 3) Seguridad: RLS habilitado + política de SOLO LECTURA (SELECT)
alter table public."Universidades_Institutos" enable row level security;

drop policy if exists "Permitir lectura publica" on public."Universidades_Institutos";
create policy "Permitir lectura publica"
  on public."Universidades_Institutos"
  for select
  using (true);

-- NOTA: no se crean políticas de INSERT/UPDATE/DELETE, así que la clave
-- pública (publishable key) NO puede modificar datos.

-- 4) Verificación: esto debe devolver filas
select *
from public."Universidades_Institutos"
limit 5;
