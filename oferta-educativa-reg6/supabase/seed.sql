-- ⚠ ARCHIVO GENERADO AUTOMÁTICAMENTE por scripts/build-data.mjs — no editar a mano.
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de supabase/schema.sql
-- Fuente: Universidad_Institutos.xlsx - Hoja1.csv (63 registros)
-- Tabla: public."Universidades_Institutos"  (cambiar con: SUPABASE_TABLE=... npm run data:build)

BEGIN;

INSERT INTO public."Universidades_Institutos"
  (id, municipio_nombre, municipio_id, objeto, nombre, longitud, latitud)
VALUES
  (1, 'José C. Paz', 6412, 'Universidad', 'Universidad Nacional de José Clemente Paz', -58.7452, -34.5207),
  (2, 'José C. Paz', 6412, 'Universidad', 'Universidad Empresarial Siglo 21 Centro de Aprendizaje Universitario José C. Paz', -58.7521, -34.522),
  (3, 'Malvinas Argentinas', 6515, 'Universidad', 'Universidad Católica de Salta Sede Tortuguitas', -58.7584, -34.4694),
  (4, 'Malvinas Argentinas', 6515, 'Universidad', 'Universidad Nacional de General Sarmiento', -58.7028, -34.5237),
  (5, 'San Fernando', 6749, 'Universidad', 'Universidad Nacional de las Artes Departamento de Artes Visuales Sede Xul Solar', -58.5615, -34.4409),
  (6, 'San Fernando', 6749, 'Universidad', 'Universidad de San Andrés Campus', -58.5299, -34.4461),
  (7, 'San Fernando', 6749, 'Universidad', 'Universidad Nacional de Luján Delegación San Fernando', -58.5496, -34.4438),
  (8, 'San Fernando', 6749, 'Universidad', 'Universidad Nacional del Delta', -58.558287, -34.4538),
  (9, 'San Fernando', 6749, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE N° 117 "J.G.ARTIGAS"', -58.5512839491923, -34.44603681),
  (10, 'San Fernando', 6749, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO ESCUELA DE ENFERMERIA Y ESPEC.PARAMEDICAS CRUZ ROJA', -58.5558548138808, -34.44281718),
  (11, 'San Fernando', 6749, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR DE FORMACIÓN TÉCNICA N° 217', -58.5534086520148, -34.44076436),
  (12, 'San Isidro', 6756, 'Universidad', 'Universidad Abierta Interamericana Sede San Isidro', -58.574, -34.5035),
  (13, 'San Isidro', 6756, 'Universidad', 'Universidad Kennedy Sede San Isidro Labrador', -58.5325, -34.5082),
  (14, 'San Isidro', 6756, 'Universidad', 'Universidad de Ciencias Empresariales y Sociales Sede San Isidro', -58.5172, -34.4654),
  (15, 'San Isidro', 6756, 'Universidad', 'Universidad de Buenos Aires Ciclo Básico Común 06 Centro Universitario Regional Norte San Isidro', -58.5254, -34.4981),
  (16, 'San Isidro', 6756, 'Universidad', 'Universidad de San Isidro Placido Marín Sede Central', -58.5186, -34.4612),
  (17, 'San Isidro', 6756, 'Universidad', 'Universidad Empresarial Siglo 21 Red Lincoln San Isidro', -58.5105, -34.4669),
  (19, 'San Isidro', 6756, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Nº 52 "MAESTRO FRANCISCO ISAURO ARANCIBIA"', -58.5128340003619, -34.47015473),
  (20, 'San Isidro', 6756, 'CONSERVATORIO DE MÚSICA', 'CONSERVATORIO DE MUSICA "JUAN JOSÉ CASTRO"', -58.5013776687839, -34.48751272),
  (21, 'San Isidro', 6756, 'ESCUELA DE ARTES VISUALES', 'INSTITUTO REGINA PACIS', -58.5096389368332, -34.46877857),
  (22, 'San Isidro', 6756, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR SANTA TRINIDAD', -58.524340587433, -34.4699996),
  (23, 'San Isidro', 6756, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'COLEGIO LEONARDO DA VINCI', -58.5740658650702, -34.50347984),
  (24, 'San Isidro', 6756, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'CENTRO DE ESTUDIOS SOCIALES Y TECNOLOGICOS', -58.5198114303674, -34.46950827),
  (25, 'San Isidro', 6756, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO COLEGIO OTT', -58.5040354213589, -34.4794703),
  (26, 'San Isidro', 6756, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'ESCUELA DE ENFERMERIA INSTITUTO CRUZ ROJA ARGENTINA', -58.514062207057, -34.46979189),
  (27, 'San Isidro', 6756, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'ESCUELA DE PSICOLOGIA SOCIAL SAN ISIDRO', -58.5109051467495, -34.4720009),
  (28, 'San Isidro', 6756, 'ESCUELA DE ARTES VISUALES', 'ESCUELA DE ARTES VISUALES - EXTENSIÓN I DE GENERAL SAN MARTÍN', -58.5216180018777, -34.49606211),
  (29, 'San Isidro', 6756, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE "RECONQUISTA"', -58.5556506899422, -34.51381455),
  (30, 'San Miguel', 6760, 'Universidad', 'Universidad de Buenos Aires Ciclo Básico Común Sede 29 Centro Universitario Regional San Miguel', -58.7155, -34.545),
  (31, 'San Miguel', 6760, 'Universidad', 'Universidad Católica de Salta Sede San Miguel', -58.7035, -34.5535),
  (32, 'San Miguel', 6760, 'Universidad', 'Universidad de Flores Anexo San Miguel', -58.6914, -34.5657),
  (18, 'San Miguel', 6760, 'Universidad', 'Universidad Nacional de Luján Centro Regional San Miguel', -58.5137, -34.4698),
  (33, 'San Miguel', 6760, 'Universidad', 'Universidad Empresarial Siglo 21 Centro de Aprendizaje Universitario Bella Vista', -58.6736, -34.5563),
  (34, 'San Miguel', 6760, 'Universidad', 'Universidad Empresarial Siglo 21 Centro de Aprendizaje Universitario San Miguel', -58.7158, -34.5451),
  (35, 'San Miguel', 6760, 'Universidad', 'Universidad Empresarial Siglo 21 Cau Educentro', -58.7108, -34.5429),
  (36, 'Tigre', 6805, 'Universidad', 'Universidad de Buenos Aires Ciclo Básico Común Sede 33 Centro Universitario Regional Tigre', -58.5677, -34.4268),
  (37, 'Tigre', 6805, 'Universidad', 'Universidad Abierta Interamericana Sede Centro Universitario de Tigre', -58.5674, -34.4268),
  (38, 'Tigre', 6805, 'Universidad', 'Universidad Católica de Salta Sede General Pacheco', -58.6285, -34.4564),
  (39, 'Tigre', 6805, 'Universidad', 'Universidad de Belgrano Sede Tigre', -58.5673, -34.4267),
  (40, 'Tigre', 6805, 'Universidad', 'Universidad de Morón Anexo Tigre', -58.5674, -34.4268),
  (41, 'Tigre', 6805, 'Universidad', 'Universidad Empresarial Siglo 21 Cenedudes', -58.6346, -34.4957),
  (42, 'Tigre', 6805, 'Universidad', 'Universidad Empresarial Siglo 21 Centro de Aprendizaje Universitario General Pacheco', -58.6288, -34.4573),
  (43, 'Tigre', 6805, 'Universidad', 'Universidad Empresarial Siglo 21 Asociación Civil Marcos Sastre', -58.5857, -34.4198),
  (44, 'Tigre', 6805, 'Universidad', 'Universidad Tecnológica Nacional Facultad Regional General Pacheco', -58.6263, -34.4562),
  (45, 'Tigre', 6805, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'SANTA ANA', -58.6444424361742, -34.45907159),
  (46, 'Tigre', 6805, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Nº 140 "MARIE CURIE"', -58.6226984970517, -34.45492097),
  (47, 'Tigre', 6805, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR DE FORMACIÓN TÉCNICA N° 199', -58.6458445650663, -34.46820029),
  (48, 'Tigre', 6805, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'I. S. F. D. Y T. ANDERSEN', -58.6372114367658, -34.44717093),
  (49, 'Tigre', 6805, 'CENTRO DE PRODUCCIÓN Y EDUCACIÓN ARTISTICO CULTURAL', 'CENTRO DE PRODUCCIÓN Y EDUCACIÓN ARTÍSTICO CULTURAL Nº 1', -58.639877718371, -34.46269505),
  (50, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE N° 39', -58.4781439956474, -34.53324067),
  (51, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE N° 77', -58.5187164972237, -34.52488871),
  (52, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO PEDRO POVEDA', -58.4775367931883, -34.51702825),
  (53, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO DE EDUCACION INTEGRAL DE MUNRO', -58.5259220923086, -34.52863306),
  (54, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'ESCUELA DE ENFERMERÍA DE LA CRUZ ROJA ARGENTINA', -58.4939733703746, -34.53000115),
  (55, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUP DE LA SALLE', -58.4993661163876, -34.52745905),
  (56, 'Vicente López', 6861, 'CONSERVATORIO DE MÚSICA', 'INSTITUTO MUNICIPAL JOSÉ HERNANDEZ', -58.4885922562262, -34.5097002),
  (57, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'I.S.F.T.E.A.', -58.4739019884912, -34.53367066),
  (58, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'ESCUELA DE GUARDAVIDAS M.V.L.', -58.5201396523723, -34.53180889),
  (59, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR DE FORMACIÓN TÉCNICA N° 220', -58.5372331672353, -34.53960509),
  (60, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO MUNICIPAL DE EDUCACIÓN SUPERIOR VICENTE LOPEZ', -58.519966316741, -34.53192905),
  (61, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'ISFDYT PINOS DE ANCHORENA VICENTE', -58.4814885610271, -34.53613093),
  (62, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR DE FORMACIÓN TÉCNICA Nº 199 - ANEXO', -58.5499388135668, -34.52916171),
  (63, 'Vicente López', 6861, 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE Y TÉCNICA', 'INSTITUTO SUPERIOR DE FORMACIÓN DOCENTE N° 229', -58.5373259722359, -34.53963486)
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- Verificación
SELECT COUNT(*) AS total FROM public."Universidades_Institutos";
