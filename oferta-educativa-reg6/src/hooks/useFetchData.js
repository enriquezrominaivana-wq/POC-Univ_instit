import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, TABLA_INSTITUCIONES } from '../services/supabaseClient';
import { LOCAL_INSTITUCIONES } from '../data/instituciones';
import { prepararRegistros } from '../utils/metrics';

/**
 * Consulta la tabla `instituciones` en Supabase (RLS de solo lectura).
 * Si no hay credenciales o la consulta falla, usa el dataset local embebido
 * para que el dashboard y el mapa sigan siendo funcionales.
 */
export function useFetchData() {
  const [estado, setEstado] = useState({
    loading: true,
    registros: [],
    error: null,
    fuente: null, // 'supabase' | 'local'
  });

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from(TABLA_INSTITUCIONES)
            .select('*')
            .order('id', { ascending: true });

          if (error) throw error;
          if (cancelado) return;

          setEstado({
            loading: false,
            registros: prepararRegistros(data),
            error: null,
            fuente: 'supabase',
          });
          return;
        } catch (error) {
          if (cancelado) return;
          setEstado({
            loading: false,
            registros: prepararRegistros(LOCAL_INSTITUCIONES),
            error: `No se pudo consultar Supabase (${error.message}). Se muestran los datos locales.`,
            fuente: 'local',
          });
          return;
        }
      }

      if (cancelado) return;
      setEstado({
        loading: false,
        registros: prepararRegistros(LOCAL_INSTITUCIONES),
        error: null,
        fuente: 'local',
      });
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  return estado;
}
