-- ========================================================
-- Insertar datos de tablas sin dependencias
-- =========================================================
-- Insertar datos de prueba en la tabla Usuario
-- =========================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM usuario.usuario) THEN
    INSERT INTO usuario.usuario (nombre, apellido, email, contrasena) VALUES
      ('Juan',   'Perez',      'juan@ejemplo.com',   'pass1'),
      ('Maria',  'Gomez',      'maria@ejemplo.com',  'pass2'),
      ('Carlos', 'Lopez',      'carlos@ejemplo.com', 'pass3'),
      ('Ana',    'Martinez',   'ana@ejemplo.com',    'pass4'),
      ('Pedro',  'Garcia',     'pedro@ejemplo.com',  'pass5'),
      ('Laura',  'Rodriguez',  'laura@ejemplo.com',  'pass6'),
      ('Jorge',  'Fernandez',  'jorge@ejemplo.com',  'pass7'),
      ('Sofia',  'Diaz',       'sofia@ejemplo.com',  'pass8'),
      ('Miguel', 'Sanchez',    'miguel@ejemplo.com', 'pass9'),
      ('Elena',  'Torres',     'elena@ejemplo.com',  'pass10');
  END IF;
  -- =========================================================
  -- Insertar datos de prueba en la tabla Categoria
  -- =========================================================
  IF NOT EXISTS (SELECT 1 FROM agenda.etiqueta)  THEN
    INSERT INTO agenda.etiqueta (Nombre) VALUES
      ('Trabajo'),
      ('Personal'),
      ('Estudios'),
      ('Salud'),
      ('Viajes'); 
  END IF;

  IF NOT EXISTS (SELECT * FROM agenda.estado)  THEN
    INSERT INTO agenda.estado (Nombre) VALUES
      ('Pendiente'),
      ('En Progreso'),
      ('Completado'),
      ('Archivado');
  END IF;

-- =========================================================
-- Insertar datos tabla dependentes de otras tablas
-- =========================================================
-- Insertar datos de prueba en la tabla Notas
-- =========================================================
  IF NOT EXISTS (SELECT * FROM agenda.nota)  THEN
    INSERT INTO agenda.nota (Id_usuario, Titulo, Descripcion, fecha_alerta, id_estado) VALUES
      (1, 'Comprar comestibles', 'Comprar leche, pan y huevos', '2025-12-01 10:00:00',1),
      (2, 'Reunión de trabajo', 'Reunión con el equipo de desarrollo a las 10 AM', '2025-12-02 09:00:00',1),
      (3, 'Cita médica', 'Cita con el dentista el lunes a las 3 PM', '2025-12-03 15:00:00',2),
      (4, 'Pagar facturas', 'Pagar la factura de electricidad y agua', '2025-12-04 12:00:00',3),
      (5, 'Llamar a mamá', 'Llamar a mamá para su cumpleaños', '2025-12-05 18:00:00',4),
      (1, 'Hacer ejercicio', 'Ir al gimnasio por la tarde', '2025-12-06 17:00:00',1),
      (2, 'Estudiar para el examen', 'Repasar los apuntes para el examen de matemáticas', '2025-12-07 14:00:00',2),
      (3, 'Organizar la casa', 'Limpiar y organizar la sala de estar', '2025-12-08 11:00:00',3),
      (4, 'Planificar vacaciones', 'Investigar destinos para las vacaciones de verano', '2025-12-09 16:00:00',4),
      (5, 'Leer un libro', 'Terminar de leer el libro de ficción', '2025-12-10 20:00:00',1),
      (1, 'Cocinar cena', 'Preparar una cena saludable', '2025-12-11 19:00:00',2),
      (2, 'Visitar a un amigo', 'Ir a casa de un amigo el fin de semana', '2025-12-12 13:00:00',3),
      (3, 'Asistir a un taller', 'Participar en un taller de fotografía', '2025-12-13 10:00:00',4),
      (4, 'Hacer jardinería', 'Plantar flores en el jardín', '2025-12-14 09:00:00',1),
      (5, 'Actualizar currículum', 'Agregar experiencia reciente al currículum', '2025-12-15 15:00:00',2);
  END IF;
-- =========================================================
-- Insertar datos de prueba en la tabla Nota_Etiqueta
-- =========================================================
  IF NOT EXISTS (SELECT * FROM agenda.nota_etiqueta)  THEN
    INSERT INTO agenda.nota_etiqueta (Id_nota, Id_etiqueta) VALUES
      (1, 2),
      (2, 1),
      (3, 4),
      (4, 2),
      (5, 3),
      (6, 5),
      (7, 3),
      (8, 2),
      (9, 5),
      (10, 4),
      (11, 1),
      (12, 2),
      (13, 3),
      (14, 5),
      (15, 4);
  END IF;
END
$$;