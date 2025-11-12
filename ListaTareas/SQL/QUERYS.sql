--select * from usuario.usuario;
--SELECT * from agenda.estado;
--SELECT * from agenda.etiqueta;
--SELECT * FROM agenda.nota
--Consultas SQL:
--Obtener todas las tareas de un usuario específico.
--================================
--Obtener todas las tareas de un usuario por nombre
--================================
SELECT 
    n.*, 
    u.id, 
    u.nombre, 
    u.apellido 
FROM agenda.nota n
INNER JOIN usuario.usuario u ON n.id_usuario = u.id
WHERE u.nombre like '%Carlos%' and u.apellido like '%Lopez%';

--================================
--Obtener todas las tareas de un usuario por id usuario
--================================

SELECT 
    n.*, 
    u.id, 
    u.nombre, 
    u.apellido 
FROM agenda.nota n
INNER JOIN usuario.usuario u ON n.id_usuario = u.id
WHERE u.id = 3;

--Filtrar tareas por estado o prioridad.

--===================================
--Filtrar tareas por etiqueta.
--Se debe tener en cuenta la tabla intermedia para la relación
--===================================
SELECT 
    e.nombre AS etiqueta,
    STRING_AGG(n.titulo, ', ') AS notas
FROM agenda.nota_etiqueta ne
INNER JOIN agenda.etiqueta e ON ne.id_etiqueta = e.id
INNER JOIN agenda.nota n ON ne.id_nota = n.id
GROUP BY e.nombre
ORDER BY e.nombre;
--Listar las tareas que pertenecen a una categoría específica.
--===================================
--Listar las tareas que pertenecen a una etiqueta
--===================================
SELECT 
    n.*, 
    e.id, 
    e.nombre 
FROM agenda.nota_etiqueta ne
INNER JOIN agenda.etiqueta e ON ne.id_etiqueta = e.id
INNER JOIN agenda.nota n ON ne.id_nota = n.id
WHERE e.nombre like '%Trabajo%';
--Contar cuántas tareas están "completadas" por cada usuario.
SELECT 
    u.id AS id_usuario,
    u.nombre AS usuario,
    COUNT(n.id) AS total_completadas
FROM agenda.nota n
INNER JOIN usuario.usuario u ON n.id_usuario = u.id
WHERE n.id_estado = 3
GROUP BY u.id, u.nombre
ORDER BY total_completadas DESC;
