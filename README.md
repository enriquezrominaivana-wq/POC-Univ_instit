# 🎓 Oferta Educativa Superior · Región Educativa 6

Dashboard interactivo + mapa con la oferta educativa superior (universidades e institutos) de la
Región Educativa 6 y alrededores: Tigre, San Fernando, San Isidro, Vicente López, San Miguel,
Malvinas Argentinas y José C. Paz.

**Stack:** React 18 + Vite · deck.gl + maplibre-gl (mapa vectorial) · Supabase (RLS de solo lectura) · CSS + Lucide icons.

---

## 1. Requisitos

- Node.js 20+ (probado con Node 24) y npm
- (Opcional) Un proyecto en [Supabase](https://supabase.com) para usar la base en la nube

## 2. Puesta en marcha

```bash
npm install
npm run dev          # http://localhost:5173
```

Build de producción y vista previa:

```bash
npm run build        # genera dist/
npm run preview      # sirve dist/ en http://localhost:4173
```

## 3. Supabase (base de datos y backend)

**Estado actual: conectado.** La app consulta la tabla `public."Universidades_Institutos"`
(63 registros) con la clave pública (`sb_publishable_…`) y la política RLS de solo lectura.

La app funciona **sin credenciales** como fallback: si faltan las variables de entorno o la
consulta falla, usa el dataset local (`src/data/instituciones.js`) y el sidebar indica
*"Dataset local (fallback)"*.

### Variables de entorno (`.env`)

```env
VITE_SUPABASE_URL=https://xyrwmeioqlrybxgmnxdf.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_SUPABASE_TABLE=Universidades_Institutos
```

Verificación rápida de la conexión:

```bash
npm run check:supabase
```

Esperado: `63` instituciones · `30` universidades (`6` públicas / `24` privadas) · `33` institutos · 7 municipios.

### Si la tabla no estuviera visible (RLS)

El script `supabase/acceso-lectura.sql` habilita RLS y crea la política `FOR SELECT USING (true)`
sobre `public."Universidades_Institutos"`, además de mostrar columnas y conteo de filas.
`supabase/schema.sql` + `supabase/seed.sql` crean y cargan la tabla desde cero (el seed apunta a
la misma tabla y se regenera con `SUPABASE_TABLE=... npm run data:build`).

> 📌 **Seguridad:** se usa únicamente la clave pública (`anon key`) con RLS habilitado y una
> política `FOR SELECT USING (true)`. No hay políticas de INSERT/UPDATE/DELETE, así que esa
> clave **no puede modificar datos**. `.env` está en `.gitignore` y nunca se sube al repositorio.

### Reglas de clasificación (reglas de negocio)

| Categoría | Condición |
| --- | --- |
| Universidad Pública | `objeto === 'Universidad'` **y** `nombre.startsWith('Universidad Nacional...')` |
| Universidad Privada | `objeto === 'Universidad'` y **no** cumple la condición anterior |
| Instituto | `objeto !== 'Universidad'` (ISFD, institutos técnicos, conservatorios, escuelas de arte, …) |

## 4. Funcionalidades

- **KPI cards:** total de instituciones, universidades, públicas, privadas e institutos
- **Distribución por municipio:** barras apiladas (públicas / privadas / institutos); el clic filtra el mapa y los indicadores
- **Mapa interactivo (deck.gl + maplibre):** marcadores coloreados por categoría, tooltip con nombre/tipo/municipio, controles de zoom, vista general y botón **"Mi Ubicación"**
- **Filtros dinámicos:** por municipio y por tipo de institución (sidebar)
- **Geolocalización HTML5:** con manejo de permisos denegados, tiempo de espera y errores
- **Responsivo:** sidebar + dashboard + mapa en desktop; bloqueado en mobile

## 5. Estructura del proyecto

```
oferta-educativa-reg6/
├── public/icons/                # Iconos (favicon y leyenda)
├── scripts/
│   ├── build-data.mjs           # CSV → src/data/instituciones.js + supabase/seed.sql
│   ├── check-page.mjs           # Chequeo de runtime (CDP): DOM + errores de consola
│   ├── check-supabase.mjs       # Chequeo de conexión, RLS y conteos
│   └── check-interactions.mjs   # Chequeo de filtros/KPIs con Chrome headless
├── supabase/
│   ├── schema.sql               # Tabla + índices + RLS solo lectura (desde cero)
│   ├── acceso-lectura.sql       # Habilita RLS + política SELECT sobre la tabla existente
│   └── seed.sql                 # INSERTs generados desde el CSV
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx        # KPI cards + gráfico
│   │   ├── KpiCard.jsx          # Tarjeta individual de métrica
│   │   ├── MunicipalitiesChart.jsx
│   │   ├── MapView.jsx          # deck.gl + maplibre (carga diferida)
│   │   ├── Sidebar.jsx          # Filtros, leyenda, "Mi Ubicación"
│   │   └── Tooltip.jsx          # Tooltip sobre los marcadores
│   ├── data/instituciones.js    # Dataset local (fallback) — generado
│   ├── hooks/
│   │   ├── useFetchData.js      # Consulta Supabase + fallback
│   │   └── useUserLocation.js   # Geolocalización HTML5
│   ├── services/
│   │   ├── supabaseClient.js    # Cliente con clave anónima
│   │   └── maplibreWorker.js    # URL del worker de maplibre (Vite)
│   ├── utils/metrics.js         # Clasificación, KPIs, agrupamiento y filtros
│   ├── App.jsx                  # Layout y estado global
│   ├── main.jsx
│   └── index.css
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## 6. Scripts npm

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción |
| `npm run data:build` | Regenera el dataset local y `seed.sql` desde el CSV |
| `npm run check:supabase` | Valida conexión, tabla, RLS y conteos por categoría |
| `npm run check` | Verifica render, canvas y errores de consola (Chrome headless) |
| `npm run check:interactions` | Verifica filtros, KPIs y manejo de permisos de ubicación |

> `check` / `check:interactions` requieren la dev server corriendo (y Chrome instalado; se puede
> apuntar a otro navegador con `CHROME_PATH`).

## 7. Despliegue

Compatible con **Vercel, Netlify o Render** (sitio estático):

1. Build command: `npm run build`
2. Output directory: `dist`
3. Configurar las variables de entorno `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `VITE_SUPABASE_TABLE` en el panel del proveedor
4. Verificar que en el sidebar aparezca *"Supabase (lectura pública)"*

## 8. Datos de origen

`Universidad_Institutos.xlsx - Hoja1.csv` (63 instituciones, coordenadas geográficas). Si el CSV
cambia, regenerar con `npm run data:build` (acepta una ruta como argumento:
`node scripts/build-data.mjs "../ruta/al/archivo.csv"`).
