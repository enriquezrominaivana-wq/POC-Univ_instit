# **Plan de Desarrollo: Oferta Educativa Superior (Región Educativa 6 y Alrededores)**

## **1\. Arquitectura y Requerimientos Generales**

### **1.1. Pila Tecnológica (Tech Stack)**

* **Frontend Framework:** React 18+ (con Vite)

* **Mapas & Geolocalización:** deck.gl \+ @deck.gl/react (integrado con maplibre-gl / Mapbox para las capas base de mapa vector)

* **Base de Datos & Backend:** Supabase (cliente @supabase/supabase-js)

* **Estilos & UI:** CSS Modules, Tailwind CSS o UI Components (ej. Lucide React para iconos, Recharts/Chart.js para gráficos opcionales)

### **1.2. Seguridad & Variables de Entorno (Premisa)**

Para cumplir con la premisa de no exponer las credenciales clave ni el token de servicio de Supabase:

* Se utilizará la **Clave Anónima Pública (anon key)** en el cliente, configurando las **Políticas de Seguridad a Nivel de Fila (RLS \- Row Level Security)** en Supabase solo con permisos de lectura (SELECT).

* Se creará un archivo .env local y .env.example para la plantilla:

* Fragmento de código

VITE\_SUPABASE\_URL=https\://tu-proyecto.supabase.co  
VITE\_SUPABASE\_ANON\_KEY=tu-anon-key

*   
* Se añadirá .env al archivo .gitignore para evitar filtraciones en el repositorio de código.

## **2\. Modelado de Datos y Lógica de Negocio**

A partir del análisis de la estructura del archivo Universidad\_Institutos.xlsx \- Hoja1.csv, las columnas de la tabla son:

| Columna | Tipo de Dato | Descripción |
| :---- | :---- | :---- |
| id | bigint / primary key | Identificador único de la institución |
| municipio\_nombre | text | Nombre del municipio (ej. Tigre, San Fernando, San Isidro, etc.) |
| municipio\_id | integer | Código/ID del municipio |
| objeto | text | Tipo de entidad (Universidad, INSTITUTO SUPERIOR..., etc.) |
| nombre | text | Nombre completo de la institución |
| longitud | double precision | Coordenada geográfica (Longitud) |
| latitud | double precision | Coordenada geográfica (Latitud) |

### **2.1. Reglas de Clasificación (Lógica de Negocio)**

* **Universidad Pública:** objeto \=== 'Universidad' **Y** nombre.startsWith('Universidad Nacional...').

* **Universidad Privada:** objeto \=== 'Universidad' **Y NO** cumple la condición de pública.

* **Instituto:** objeto \!== 'Universidad' (incluye Institutos Superiores de Formación Docente y Técnica, Conservatorios, Escuelas de Arte, etc.).

## **3\. Fases del Plan de Desarrollo**

\+-------------------------------------------------------------------------------+  
\|                        FASE 1: Configuración Inicial                          \|  
\|    \- Inicialización Vite \+ React                                             \|  
\|    \- Instalación de dependencias                                              \|  
\|    \- Configuración de Supabase (.env)                                        \|  
\+-------------------------------------------------------------------------------+  
                                        \|  
                                        v  
\+-------------------------------------------------------------------------------+  
\|                       FASE 2: Servicio de Datos & Estado                      \|  
\|    \- Cliente Supabase (\`supabaseClient.js\`)                                  \|  
\|    \- Funciones de Fetch y Transformación/Mapeo de métricas                   \|  
\+-------------------------------------------------------------------------------+  
                                        \|  
                                        v  
\+-------------------------------------------------------------------------------+  
\|                    FASE 3: Componente de Mapa & Geolocalización               \|  
\|    \- Integración de Deck.gl (\`IconLayer\` / \`ScatterplotLayer\`)               \|  
\|    \- Hook de geolocalización del navegador (\`useGeolocation\`)                \|  
\|    \- Marcador del usuario & marcadores educativos                             \|  
\+-------------------------------------------------------------------------------+  
                                        \|  
                                        v  
\+-------------------------------------------------------------------------------+  
\|                      FASE 4: Dashboard e Indicadores                          \|  
\|    \- Tarjetas de KPI (Totales, Públicas, Privadas, Institutos)               \|  
\|    \- Gráfico/Tabla por Municipio                                             \|  
\|    \- Filtros dinámicos (por tipo, municipio)                                  \|  
\+-------------------------------------------------------------------------------+  
                                        \|  
                                        v  
\+-------------------------------------------------------------------------------+  
\|                      FASE 5: Testing, Refinado & Deploy                       \|  
\|    \- Testing de responsividad y seguridad                                     \|  
\|    \- Build de producción y despliegue (Vercel / Netlify / Render)            \|  
\+-------------------------------------------------------------------------------+

### **Fase 1: Configuración del Proyecto e Infraestructura**

1. **Creación del proyecto React con Vite:**

2. Bash

npm create vite@latest oferta-educativa-reg6 \-- \--template react  
cd oferta-educativa-reg6  
npm install

3.   
4. **Instalación de dependencias principales:**

5. Bash

npm install @supabase/supabase-js @deck.gl/core @deck.gl/layers @deck.gl/react maplibre-gl lucide-react

6.   
7. **Configuración de variables de entorno y Supabase RLS:**

   * Crear la tabla instituciones en Supabase con las columnas del CSV.

   * Habilitar RLS en Supabase:

   * SQL

ALTER TABLE instituciones ENABLE ROW LEVEL SECURITY;  
CREATE POLICY "Permitir lectura publica" ON instituciones FOR SELECT USING (true);

* 

### **Fase 2: Cliente Supabase y Capa de Datos**

1. **Crear archivo de cliente Supabase (src/services/supabaseClient.js):**

2. JavaScript

import { createClient } from '@supabase/supabase-js';

const supabaseUrl \= import.meta.env.VITE\_SUPABASE\_URL;  
const supabaseAnonKey \= import.meta.env.VITE\_SUPABASE\_ANON\_KEY;

export const supabase \= createClient(supabaseUrl, supabaseAnonKey);

3.   
4. **Crear utilidades de cálculo de indicadores (src/utils/metrics.js):**

   * Función para procesar el listado plano de registros y calcular:

     * Cantidad total de universidades.

     * Cantidad de universidades públicas.

     * Cantidad de universidades privadas.

     * Cantidad total de institutos.

     * Desglose de institutos y/o universidades agrupados por municipio\_nombre.

### **Fase 3: Geolocalización y Mapa con Deck.gl**

1. **Custom Hook useUserLocation.js:**

   * Utilizar la API navigator.geolocation.getCurrentPosition para capturar la ubicación actual del usuario (latitud y longitud).

   * Manejar estados de carga, permisos denegados o errores de GPS.

2. **Componente de Mapa (src/components/Map.jsx):**

   * Configurar DeckGL con las capas:

     * **ScatterplotLayer / IconLayer (Instituciones):** Diferenciados por color según la categoría (ej. Azul: Universidad Pública, Verde: Universidad Privada, Naranja: Instituto).

     * **IconLayer / ScatterplotLayer (Usuario):** Un pulso/marcador de color destacado (rojo/púrpura) que muestre el punto actual del usuario.

   * Integrar controles de *zoom* y *tooltip* al pasar el cursor sobre las instituciones para desplegar nombre, tipo y municipio.

### **Fase 4: Dashboard e Indicadores**

1. **Componente de Métricas / KPI Cards (src/components/KpiCards.jsx):** Visualización clara de las métricas requeridas:

   * 🏛️ **Total de Universidades**

   * 🏫 **Total de Institutos**

   * 🎓 **Universidades Públicas** (donde nombre inicia con "Universidad Nacional..." y objeto \=== 'Universidad')

   * 🏢 **Universidades Privadas**

   * 📚 **Total General de Instituciones**

2. **Componente de Distribución Por Municipio (src/components/MunicipalitiesChart.jsx):**

   * Gráfico de barras o tabla interactiva que desglose la cantidad de Universidades e Institutos por cada partido/municipio (Tigre, San Fernando, San Isidro, Vicente López, José C. Paz, Malvinas Argentinas, etc.).

3. **Filtros Interactivos:**

   * Permitir al usuario filtrar en el mapa y en el dashboard por municipio específico o por tipo de institución.

### **Fase 5: UI, Estilos y Despliegue**

1. **Diseño de Interfaz:**

   * Layout dividido: panel lateral/superior con el Dashboard y panel central/derecho con el Mapa Interactivo.

   * Botón de "Mi Ubicación" para recentrar el mapa en la posición actual del usuario.

2. **Build y Validación de Seguridad:**

   * Verificar que la variable VITE\_SUPABASE\_ANON\_KEY solo tenga permisos de lectura.

   * Ejecutar pruebas de compilación:

   * Bash

npm run build

*   
3. **Despliegue:**

   * Configuración de variables de entorno en la plataforma de hosting elegida (Vercel, Netlify, Render, etc.).

## **4\. Estructura de Archivos Recomendada del Proyecto**

Plaintext  
oferta-educativa-reg6/  
├── public/  
│   └── icons/               \# Iconos para el mapa (universidad, instituto, usuario)  
├── src/  
│   ├── assets/  
│   ├── components/  
│   │   ├── Dashboard.jsx    \# Contenedor de KPI Cards y gráficos  
│   │   ├── KpiCard.jsx      \# Tarjeta individual de métrica  
│   │   ├── MapView.jsx      \# Mapa deck.gl con capas de usuario e instituciones  
│   │   ├── Sidebar.jsx      \# Menú de filtros laterales  
│   │   └── Tooltip.jsx      \# Tooltip informativo sobre marcadores  
│   ├── hooks/  
│   │   ├── useFetchData.js  \# Hook para consultar Supabase  
│   │   └── useUserLocation.js \# Hook para la geolocalización HTML5  
│   ├── services/  
│   │   └── supabaseClient.js \# Instancia pública de Supabase  
│   ├── utils/  
│   │   └── metrics.js       \# Lógica de agrupamiento y filtros  
│   ├── App.jsx              \# Componente principal con el layout  
│   └── main.jsx  
├── .env.example             \# Ejemplo de variables de entorno  
├── index.html  
├── package.json  
└── vite.config.js  
