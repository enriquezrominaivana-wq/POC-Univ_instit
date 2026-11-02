-- ============================================================================
-- Oferta Educativa Superior · Región Educativa 6
-- Enriquecimiento de instituciones: sitio web, dirección y teléfono
--
-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- (se puede pegar y ejecutar tal cual; es idempotente)
--
-- Fuentes de los datos:
--   · OpenStreetMap vía Nominatim  (scripts/enrich-osm.mjs → enriquecimiento.json)
--   · Carga manual verificada      (src/data/enriquecimiento-curado.json)
-- Los datos se fusionan en la app (src/utils/metrics.js → datosExtra());
-- una vez corrido este script podés editarlos/eliminar el merge de JSONs.
-- ============================================================================

BEGIN;

-- 1) Columnas nuevas (si ya existen, no hacen nada)
alter table public.instituciones
  add column if not exists sitio_web text,
  add column if not exists direccion text,
  add column if not exists telefono text;

-- 2) Datos enriquecidos por id de institución
UPDATE public.instituciones SET sitio_web = 'https://www.unpaz.edu.ar/', direccion = 'Leandro N. Alem 4731' WHERE id = 1;  -- Universidad Nacional de José Clemente Paz
UPDATE public.instituciones SET sitio_web = 'https://21.edu.ar/' WHERE id = 2;  -- Universidad Empresarial Siglo 21 Centro de Aprendizaje Universitario José C. Paz
UPDATE public.instituciones SET sitio_web = 'https://www.ucasal.edu.ar/' WHERE id = 3;  -- Universidad Católica de Salta Sede Tortuguitas
UPDATE public.instituciones SET direccion = 'Juan María Gutiérrez 1150' WHERE id = 4;  -- Universidad Nacional de General Sarmiento
UPDATE public.instituciones SET sitio_web = 'https://www.una.edu.ar/' WHERE id = 5;  -- Universidad Nacional de las Artes Departamento de Artes Visuales Sede Xul Solar
UPDATE public.instituciones SET sitio_web = 'https://udesa.edu.ar/', direccion = 'Vito Dumas 234' WHERE id = 6;  -- Universidad de San Andrés Campus
UPDATE public.instituciones SET sitio_web = 'https://www.sanfernando.unlu.edu.ar/', direccion = 'Avenida del Libertador 1700', telefono = '+54 11 4744-4584' WHERE id = 7;  -- Universidad Nacional de Luján Delegación San Fernando
UPDATE public.instituciones SET sitio_web = 'https://undelta.edu.ar/', direccion = 'Av. Avellaneda 2270' WHERE id = 8;  -- Universidad Nacional del Delta
UPDATE public.instituciones SET sitio_web = 'https://www.ees6artigas.org/', direccion = '3 de Febrero 1810', telefono = '+54 11 4744-6381' WHERE id = 9;  -- INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE N° 117 "J.G.ARTIGAS"
UPDATE public.instituciones SET direccion = '3 de Febrero 1275', telefono = '+54 11 4744-5959' WHERE id = 10;  -- INSTITUTO ESCUELA DE ENFERMERIA Y ESPEC.PARAMEDICAS CRUZ ROJA
UPDATE public.instituciones SET sitio_web = 'https://uai.edu.ar/', direccion = 'Bernardo de Irigoyen 696' WHERE id = 12;  -- Universidad Abierta Interamericana Sede San Isidro
UPDATE public.instituciones SET sitio_web = 'https://www.kennedy.edu.ar/' WHERE id = 13;  -- Universidad Kennedy Sede San Isidro Labrador
UPDATE public.instituciones SET sitio_web = 'https://www.uces.edu.ar/' WHERE id = 14;  -- Universidad de Ciencias Empresariales y Sociales Sede San Isidro
UPDATE public.instituciones SET sitio_web = 'https://www.cbc.uba.ar/' WHERE id = 15;  -- Universidad de Buenos Aires Ciclo Básico Común 06 Centro Universitario Regional Norte San Isidro
UPDATE public.instituciones SET sitio_web = 'https://usi.edu.ar/' WHERE id = 16;  -- Universidad de San Isidro Placido Marín Sede Central
UPDATE public.instituciones SET sitio_web = 'https://21.edu.ar/' WHERE id = 17;  -- Universidad Empresarial Siglo 21 Red Lincoln San Isidro
UPDATE public.instituciones SET sitio_web = 'https://www.unlu.edu.ar/' WHERE id = 18;  -- Universidad Nacional de Luján Centro Regional San Miguel
UPDATE public.instituciones SET direccion = 'Avenida Santa Fe 1740', telefono = '+54 11 4792-8899' WHERE id = 20;  -- CONSERVATORIO DE MUSICA "JUAN JOSÉ CASTRO"
UPDATE public.instituciones SET direccion = 'Avenida 25 de Mayo 327', telefono = '+54 11 4575-4224' WHERE id = 21;  -- INSTITUTO REGINA PACIS
UPDATE public.instituciones SET direccion = 'Nicolás Avellaneda 450', telefono = '+54 11 4732 0734; +54 11 4732 0735' WHERE id = 22;  -- INSTITUTO SUPERIOR SANTA TRINIDAD
UPDATE public.instituciones SET sitio_web = 'https://vaneduc.edu.ar/ldv/', direccion = 'Bernardo de Irigoyen 696', telefono = '+54 11 4737-5313' WHERE id = 23;  -- COLEGIO LEONARDO DA VINCI
UPDATE public.instituciones SET sitio_web = 'https://www.cesyt.edu.ar/', direccion = 'Don Bosco 159', telefono = '+54 11 4747-5177' WHERE id = 24;  -- CENTRO DE ESTUDIOS SOCIALES Y TECNOLOGICOS
UPDATE public.instituciones SET direccion = 'Eduardo Costa 848', telefono = '+54 11 4792-1958' WHERE id = 25;  -- INSTITUTO COLEGIO OTT
UPDATE public.instituciones SET direccion = 'Rivadavia 454', telefono = '+54 11 4743-7487' WHERE id = 26;  -- ESCUELA DE ENFERMERIA INSTITUTO CRUZ ROJA ARGENTINA
UPDATE public.instituciones SET direccion = 'Leandro N. Alem 226', telefono = '+54 11 4747-4479' WHERE id = 27;  -- ESCUELA DE PSICOLOGIA SOCIAL SAN ISIDRO
UPDATE public.instituciones SET sitio_web = 'https://www.cbc.uba.ar/' WHERE id = 30;  -- Universidad de Buenos Aires Ciclo Básico Común Sede 29 Centro Universitario Regional San Miguel
UPDATE public.instituciones SET sitio_web = 'https://www.ucasal.edu.ar/' WHERE id = 31;  -- Universidad Católica de Salta Sede San Miguel
UPDATE public.instituciones SET sitio_web = 'https://www.uflores.edu.ar/' WHERE id = 32;  -- Universidad de Flores Anexo San Miguel
UPDATE public.instituciones SET sitio_web = 'https://21.edu.ar/' WHERE id = 33;  -- Universidad Empresarial Siglo 21 Centro de Aprendizaje Universitario Bella Vista
UPDATE public.instituciones SET sitio_web = 'https://21.edu.ar/' WHERE id = 34;  -- Universidad Empresarial Siglo 21 Centro de Aprendizaje Universitario San Miguel
UPDATE public.instituciones SET sitio_web = 'https://21.edu.ar/' WHERE id = 35;  -- Universidad Empresarial Siglo 21 Cau Educentro
UPDATE public.instituciones SET sitio_web = 'https://www.cbc.uba.ar/' WHERE id = 36;  -- Universidad de Buenos Aires Ciclo Básico Común Sede 33 Centro Universitario Regional Tigre
UPDATE public.instituciones SET sitio_web = 'https://uai.edu.ar/' WHERE id = 37;  -- Universidad Abierta Interamericana Sede Centro Universitario de Tigre
UPDATE public.instituciones SET sitio_web = 'https://www.ucasal.edu.ar/' WHERE id = 38;  -- Universidad Católica de Salta Sede General Pacheco
UPDATE public.instituciones SET sitio_web = 'https://www.ub.edu.ar/' WHERE id = 39;  -- Universidad de Belgrano Sede Tigre
UPDATE public.instituciones SET sitio_web = 'https://www.unimoron.edu.ar/' WHERE id = 40;  -- Universidad de Morón Anexo Tigre
UPDATE public.instituciones SET sitio_web = 'https://21.edu.ar/' WHERE id = 41;  -- Universidad Empresarial Siglo 21 Cenedudes
UPDATE public.instituciones SET sitio_web = 'https://21.edu.ar/' WHERE id = 42;  -- Universidad Empresarial Siglo 21 Centro de Aprendizaje Universitario General Pacheco
UPDATE public.instituciones SET sitio_web = 'https://21.edu.ar/' WHERE id = 43;  -- Universidad Empresarial Siglo 21 Asociación Civil Marcos Sastre
UPDATE public.instituciones SET sitio_web = 'https://www.frgp.utn.edu.ar/', direccion = 'Av. Hipólito Yrigoyen 288' WHERE id = 44;  -- Universidad Tecnológica Nacional Facultad Regional General Pacheco
UPDATE public.instituciones SET direccion = 'Presidente Hipólito Yrigoyen 725', telefono = '+54 11 4795-1507' WHERE id = 52;  -- INSTITUTO PEDRO POVEDA

COMMIT;

-- 3) Verificación
select
  count(*) filter (where sitio_web is not null) as con_sitio_web,
  count(*) filter (where direccion is not null)  as con_direccion,
  count(*) filter (where telefono is not null)   as con_telefono,
  count(*)                                       as total
from public.instituciones;

