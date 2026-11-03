import { useEffect } from 'react';
import { Globe, MapPin, Navigation, Phone, X } from 'lucide-react';
import { CATEGORIA_META } from '../utils/metrics';
import { urlComoLlegar, urlVerEnGoogleMaps } from '../utils/googleMaps';
import { pushEvento } from '../utils/analytics';

/**
 * Ficha emergente al hacer click en un punto del mapa:
 * datos básicos de la institución + accesos directos a Google Maps y, si
 * existen en los datos, sitio web y teléfono.
 */
export default function PopupInstitucion({ registro, x, y, onCerrar }) {
  useEffect(() => {
    const alPresionarTecla = (evento) => {
      if (evento.key === 'Escape') onCerrar?.();
    };
    window.addEventListener('keydown', alPresionarTecla);
    return () => window.removeEventListener('keydown', alPresionarTecla);
  }, [onCerrar]);

  // Evento de apertura: se dispara al montar la ficha.
  useEffect(() => {
    if (!registro) return;
    pushEvento('popup_institucion', {
      institucion_id: registro.id,
      nombre: registro.nombre,
      municipio: registro.municipio_nombre,
      categoria: registro.categoria,
      tiene_sitio_web: Boolean(registro.sitio_web),
      tiene_telefono: Boolean(registro.telefono),
      tiene_direccion: Boolean(registro.direccion),
    });
  }, [registro]);

  if (!registro) return null;

  const meta = CATEGORIA_META[registro.categoria];
  // Si el punto queda cerca del borde superior, el popup se ancla debajo.
  const abajo = y < 170;

  const alClickEnlace = (tipo, url = null) => () => {
    pushEvento('click_enlace_externo', {
      tipo,
      institucion: registro.nombre,
      institucion_id: registro.id,
      url,
    });
  };

  return (
    <div
      className={`popup-mapa${abajo ? ' popup-mapa--abajo' : ''}`}
      style={{ left: x, top: y }}
      role="dialog"
      aria-label={`Información de ${registro.nombre}`}
    >
      <button
        type="button"
        className="popup-mapa__cerrar"
        onClick={onCerrar}
        aria-label="Cerrar"
        title="Cerrar"
      >
        <X size={14} />
      </button>

      <div className="popup-mapa__cabecera">
        <span className="popup-mapa__punto" style={{ background: meta?.color }} aria-hidden="true" />
        <span className="popup-mapa__tipo">{meta?.singular || registro.objeto}</span>
      </div>

      <p className="popup-mapa__nombre">{registro.nombre}</p>
      <p className="popup-mapa__municipio">{registro.municipio_nombre}</p>

      {registro.direccion && (
        <p className="popup-mapa__dato">
          <MapPin size={13} aria-hidden="true" />
          <span>{registro.direccion}</span>
        </p>
      )}
      {registro.telefono && (
        <p className="popup-mapa__dato">
          <Phone size={13} aria-hidden="true" />
          <a
            href={`tel:${String(registro.telefono).replace(/\s+/g, '')}`}
            onClick={alClickEnlace('telefono', `tel:${String(registro.telefono).replace(/\s+/g, '')}`)}
          >
            {registro.telefono}
          </a>
        </p>
      )}

      <div className="popup-mapa__acciones">
        <a
          className="popup-mapa__boton popup-mapa__boton--principal"
          href={urlComoLlegar(registro)}
          target="_blank"
          rel="noreferrer"
          onClick={alClickEnlace('como_llegar', urlComoLlegar(registro))}
        >
          <Navigation size={13} aria-hidden="true" />
          Cómo llegar
        </a>
        <a
          className="popup-mapa__boton"
          href={urlVerEnGoogleMaps(registro)}
          target="_blank"
          rel="noreferrer"
          onClick={alClickEnlace('google_maps', urlVerEnGoogleMaps(registro))}
        >
          <MapPin size={13} aria-hidden="true" />
          Google Maps
        </a>
        {registro.sitio_web && (
          <a
            className="popup-mapa__boton"
            href={registro.sitio_web}
            target="_blank"
            rel="noreferrer"
            onClick={alClickEnlace('sitio_web', registro.sitio_web)}
          >
            <Globe size={13} aria-hidden="true" />
            Sitio web
          </a>
        )}
      </div>
    </div>
  );
}
