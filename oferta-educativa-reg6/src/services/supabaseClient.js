import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * La clave anónima es pública por diseño: la seguridad la garantiza
 * Row Level Security (RLS) con la política de solo lectura (SELECT).
 */
const PLACEHOLDERS = new Set(['', 'tu-proyecto.supabase.co', 'tu-anon-key']);

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !PLACEHOLDERS.has(String(supabaseUrl).replace(/^https?:\/\//, '').replace(/\/$/, '')) &&
    !PLACEHOLDERS.has(supabaseAnonKey) &&
    !String(supabaseUrl).includes('tu-proyecto'),
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Nombre de la tabla con los datos (se puede cambiar desde .env con
 * VITE_SUPABASE_TABLE sin modificar código).
 */
export const TABLA_INSTITUCIONES =
  (import.meta.env.VITE_SUPABASE_TABLE || 'instituciones').trim();
