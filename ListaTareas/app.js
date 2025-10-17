// =============================================
// DEFINICIÓN DE LA CLASE TASK (MODELO DE DATOS)
// =============================================

/**
 * Clase Task - Representa una tarea individual en la aplicación
 *
 * Propiedades:
 * - id: Identificador único de la tarea (número)
 * - name: Nombre/descripción de la tarea (string)
 * - completed: Estado de completado (boolean: true/false)
 * - dueDate: Fecha de vencimiento de la tarea (string en formato YYYY-MM-DD)
 */
class Task {
  /**
   * Constructor - Se ejecuta cuando creamos una nueva tarea con "new Task()"
   * @param {number} id - ID único de la tarea
   * @param {string} name - Nombre de la tarea
   * @param {string} dueDate - Fecha de vencimiento (formato YYYY-MM-DD)
   */
  constructor(id, name, dueDate = null) {
    this.id = id;                 // Asigna el ID a la tarea
    this.name = name;             // Asigna el nombre a la tarea
    this.completed = false;       // Por defecto, las tareas nuevas no están completadas
    this.dueDate = dueDate;       // Fecha de vencimiento (puede ser null si no se especifica)
  }

  /**
   * Método para alternar el estado de completado de la tarea
   * Si está completada (true) la marca como no completada (false) y viceversa
   */
  toggleCompleted() {
    this.completed = !this.completed;  // Operador ! invierte el valor boolean
  }

  /**
   * Verifica si la tarea vence hoy
   * @returns {boolean} - true si la tarea vence hoy, false en caso contrario
   */
  isDueToday() {
    if (!this.dueDate) return false;  // Si no tiene fecha, no vence hoy

    // Obtener la fecha actual sin hora (solo año, mes, día)
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Establece hora a medianoche

    // Convertir la fecha de vencimiento a objeto Date
    const due = new Date(this.dueDate + 'T00:00:00');  // Agrega hora para evitar zona horaria

    // Comparar las fechas (getTime() convierte a milisegundos)
    return today.getTime() === due.getTime();
  }

  /**
   * Verifica si la tarea está vencida (fecha pasada)
   * @returns {boolean} - true si la tarea está vencida, false en caso contrario
   */
  isOverdue() {
    if (!this.dueDate || this.completed) return false;  // Si no tiene fecha o está completada, no está vencida

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(this.dueDate + 'T00:00:00');

    // Retorna true si la fecha de vencimiento es menor (anterior) a hoy
    return due.getTime() < today.getTime();
  }
}

// =============================================
// VARIABLES GLOBALES (ESTADO DE LA APLICACIÓN)
// =============================================

/**
 * Array que almacena todas las tareas de la aplicación
 * Se usa let porque este array puede ser reasignado (especialmente al filtrar)
 * @type {Task[]}
 */
let tasks = [];

/**
 * Contador para generar IDs únicos para cada tarea nueva
 * Se incrementa cada vez que se crea una tarea (nextId++)
 * @type {number}
 */
let nextId = 1;

/**
 * Filtro actual seleccionado por el usuario
 * Valores posibles: 'all' (todas), 'completed' (completadas), 'pending' (pendientes)
 * @type {string}
 */
let currentFilter = 'all';

// =============================================
// FUNCIONES DE GESTIÓN DE TAREAS (CRUD)
// =============================================

/**
 * Agrega una nueva tarea al array de tareas
 *
 * @param {string} taskName - Nombre de la tarea a crear
 * @param {string} dueDate - Fecha de vencimiento (formato YYYY-MM-DD), opcional
 * @returns {Task} - Retorna la tarea recién creada
 *
 * Proceso:
 * 1. Crea una nueva instancia de Task con ID único, nombre y fecha
 * 2. Incrementa nextId para la próxima tarea (operador ++)
 * 3. Agrega la tarea al array tasks usando push()
 * 4. Retorna la nueva tarea
 */
function agregarTarea(taskName, dueDate = null) {
  const newTask = new Task(nextId++, taskName, dueDate);  // nextId++ usa el valor actual y luego lo incrementa
  tasks.push(newTask);                                    // push() agrega al final del array
  return newTask;
}

/**
 * Elimina una tarea del array basándose en su ID
 *
 * @param {number} taskId - ID de la tarea a eliminar
 *
 * Proceso:
 * 1. filter() crea un nuevo array con todas las tareas EXCEPTO la que tiene el taskId
 * 2. Reasigna el array tasks con el resultado (sin la tarea eliminada)
 *
 * Nota: filter() no modifica el array original, crea uno nuevo
 */
function eliminarTarea(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);  // !== significa "diferente de"
}

/**
 * Filtra las tareas según su estado de completado
 *
 * @param {boolean|null} completadas - Estado a filtrar:
 *   - true: retorna solo tareas completadas
 *   - false: retorna solo tareas pendientes
 *   - null: retorna todas las tareas
 * @returns {Task[]} - Array de tareas filtradas
 *
 * Proceso:
 * 1. Si completadas es null, retorna todas las tareas sin filtrar
 * 2. Si no, usa filter() para obtener solo las tareas que coincidan con el estado
 */
function filtrarTareas(completadas) {
  if (completadas === null) {    // === significa "igual a" (comparación estricta)
    return tasks;                 // Retorna todas las tareas
  }
  // filter() crea un nuevo array solo con tareas que cumplen la condición
  return tasks.filter(task => task.completed === completadas);
}

/**
 * Busca y retorna una tarea específica por su ID
 *
 * @param {number} taskId - ID de la tarea a buscar
 * @returns {Task|undefined} - La tarea encontrada o undefined si no existe
 *
 * Nota: find() retorna el PRIMER elemento que cumple la condición
 *       Si no encuentra nada, retorna undefined
 */
function obtenerTarea(taskId) {
  return tasks.find(task => task.id === taskId);  // find() busca en el array
}

// =============================================
// FUNCIONES DE RENDERIZADO (MANIPULACIÓN DEL DOM)
// =============================================

/**
 * Función principal que renderiza (dibuja) las tareas en la pantalla
 * Se ejecuta cada vez que hay cambios en las tareas
 *
 * Proceso:
 * 1. Determina qué tareas mostrar según el filtro actual
 * 2. Obtiene referencias a los elementos del DOM
 * 3. Limpia la lista actual
 * 4. Si hay tareas, las crea y las muestra; si no, muestra mensaje vacío
 * 5. Actualiza las estadísticas
 */
function mostrarTareas() {
  // Paso 1: Convertir el filtro de texto a valor boolean o null
  let filterValue = null;  // null = mostrar todas

  if (currentFilter === 'completed') {
    filterValue = true;    // true = solo completadas
  } else if (currentFilter === 'pending') {
    filterValue = false;   // false = solo pendientes
  }

  // Paso 2: Obtener las tareas filtradas
  const tasksToDisplay = filtrarTareas(filterValue);

  // Paso 3: Obtener referencias a elementos del DOM
  // getElementById() busca un elemento HTML por su atributo id=""
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');

  // Paso 4: Limpiar el contenido actual de la lista
  // innerHTML = '' vacía todo el contenido HTML del elemento
  taskList.innerHTML = '';

  // Paso 5: Decidir qué mostrar según si hay tareas o no
  if (tasksToDisplay.length === 0) {
    // No hay tareas: mostrar mensaje de estado vacío
    emptyState.classList.add('show');      // Agrega clase CSS para mostrar
    taskList.style.display = 'none';       // Oculta la lista
  } else {
    // Hay tareas: ocultar mensaje vacío y mostrar lista
    emptyState.classList.remove('show');   // Quita clase CSS para ocultar
    taskList.style.display = 'flex';       // Muestra la lista con flexbox

    // Paso 6: Crear y agregar cada tarea al DOM
    // forEach() ejecuta una función por cada elemento del array
    tasksToDisplay.forEach(task => {
      const taskItem = crearElementoTarea(task);  // Crea el elemento HTML
      taskList.appendChild(taskItem);             // appendChild() agrega el elemento al final
    });
  }

  // Paso 7: Actualizar los contadores de estadísticas
  actualizarEstadisticas();
}

/**
 * Crea el elemento HTML completo para una tarea individual
 *
 * @param {Task} task - Objeto tarea a renderizar
 * @returns {HTMLElement} - Elemento <li> con toda la estructura de la tarea
 *
 * Estructura creada:
 * <li class="task-item">
 *   <input type="checkbox" /> (checkbox para marcar completada)
 *   <label>Nombre de la tarea</label> (texto de la tarea)
 *   <button>🗑️</button> (botón para eliminar)
 * </li>
 */
function crearElementoTarea(task) {
  // ========== CREAR CONTENEDOR PRINCIPAL (LI) ==========

  // createElement() crea un nuevo elemento HTML
  const li = document.createElement('li');

  // Asignar clases CSS dinámicamente según el estado de la tarea
  let itemClasses = 'task-item';
  if (task.isDueToday() && !task.completed) {
    itemClasses += ' task-due-today';  // Clase especial para tareas que vencen hoy
  }
  if (task.isOverdue()) {
    itemClasses += ' task-overdue';    // Clase especial para tareas vencidas
  }

  li.className = itemClasses;                  // Asigna clase CSS
  li.setAttribute('role', 'listitem');         // Atributo para accesibilidad

  // ========== CREAR CHECKBOX ==========

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';                  // Define que es un checkbox
  checkbox.className = 'task-checkbox';        // Clase CSS para estilos
  checkbox.checked = task.completed;           // Marca el checkbox si la tarea está completada

  // setAttribute() agrega atributos HTML al elemento
  checkbox.setAttribute('id', `task-${task.id}`);  // ID único: "task-1", "task-2", etc.
  checkbox.setAttribute('aria-label', `Marcar tarea "${task.name}" como completada`);  // Accesibilidad

  // addEventListener() escucha eventos (change = cuando cambia el checkbox)
  checkbox.addEventListener('change', () => {
    // Esta función se ejecuta cuando el usuario hace click en el checkbox
    const taskToToggle = obtenerTarea(task.id);  // Busca la tarea por ID
    if (taskToToggle) {                          // Verifica que existe
      taskToToggle.toggleCompleted();            // Cambia su estado (completado/pendiente)
      mostrarTareas();                           // Re-renderiza la lista con los cambios
    }
  });

  // ========== CREAR CONTENEDOR DE INFORMACIÓN DE LA TAREA ==========

  // Div contenedor para agrupar texto y fecha
  const taskInfo = document.createElement('div');
  taskInfo.className = 'task-info';

  // ========== CREAR LABEL (TEXTO DE LA TAREA) ==========

  const label = document.createElement('label');
  label.setAttribute('for', `task-${task.id}`);  // Asocia el label con el checkbox

  // Operador ternario: condición ? valorSiTrue : valorSiFalse
  // Si la tarea está completada, agrega clase 'completed', si no, cadena vacía
  label.className = `task-text ${task.completed ? 'completed' : ''}`;

  label.textContent = task.name;               // Establece el texto visible

  // Agregar label al contenedor de información
  taskInfo.appendChild(label);

  // ========== CREAR ELEMENTO DE FECHA (SI EXISTE) ==========

  if (task.dueDate) {
    const dateSpan = document.createElement('span');
    dateSpan.className = 'task-date';

    // Formatear la fecha para mostrarla de forma legible
    const date = new Date(task.dueDate + 'T00:00:00');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('es-ES', options);

    // Agregar texto indicador según el estado
    let dateText = `📅 ${formattedDate}`;
    if (task.isDueToday() && !task.completed) {
      dateText += ' (¡Hoy!)';
    } else if (task.isOverdue()) {
      dateText += ' (Vencida)';
    }

    dateSpan.textContent = dateText;
    taskInfo.appendChild(dateSpan);  // Agregar fecha al contenedor
  }

  // ========== CREAR BOTÓN DE ELIMINAR ==========

  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn-delete';
  deleteButton.setAttribute('aria-label', `Eliminar tarea "${task.name}"`);  // Accesibilidad

  // innerHTML establece contenido HTML (incluye el SVG del icono de basura)
  deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  `;

  // Evento click: se ejecuta cuando el usuario hace click en el botón
  deleteButton.addEventListener('click', () => {
    eliminarTarea(task.id);                    // Elimina la tarea del array
    mostrarTareas();                           // Re-renderiza la lista
  });

  // ========== ENSAMBLAR TODOS LOS ELEMENTOS ==========

  // appendChild() agrega cada elemento como hijo del <li>
  li.appendChild(checkbox);     // Agrega checkbox primero
  li.appendChild(taskInfo);     // Agrega contenedor de información (texto + fecha)
  li.appendChild(deleteButton); // Agrega botón al final

  return li;  // Retorna el elemento completo
}

/**
 * Actualiza los contadores de estadísticas en la interfaz
 *
 * Proceso:
 * 1. Obtiene referencias a los elementos span donde se muestran los números
 * 2. Calcula el total de tareas, completadas y pendientes
 * 3. Actualiza el contenido de texto de cada elemento
 */
function actualizarEstadisticas() {
  // Obtener referencias a los elementos del DOM
  const totalCount = document.getElementById('totalCount');
  const completedCount = document.getElementById('completedCount');
  const pendingCount = document.getElementById('pendingCount');

  // Calcular estadísticas
  const total = tasks.length;  // length es la cantidad de elementos en el array

  // filter() + length cuenta cuántas tareas están completadas
  const completed = tasks.filter(task => task.completed).length;

  // Pendientes = total menos completadas
  const pending = total - completed;

  // Actualizar el texto visible
  // textContent modifica solo el texto (no HTML)
  totalCount.textContent = total;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
}

// =============================================
// EVENT LISTENERS (MANEJADORES DE EVENTOS)
// =============================================

/**
 * EVENTO: Envío del formulario para agregar nueva tarea
 *
 * Proceso:
 * 1. Previene el comportamiento por defecto (recargar la página)
 * 2. Obtiene el valor del input de texto y fecha
 * 3. Valida que el nombre no esté vacío
 * 4. Agrega la tarea con nombre y fecha, limpia los inputs y re-renderiza
 */
document.getElementById('taskForm').addEventListener('submit', (e) => {
  // e.preventDefault() evita que el formulario recargue la página (comportamiento por defecto)
  e.preventDefault();

  const taskInput = document.getElementById('taskInput');    // Obtiene referencia al input de texto
  const dateInput = document.getElementById('taskDate');     // Obtiene referencia al input de fecha
  const taskName = taskInput.value.trim();  // trim() elimina espacios al inicio y final
  const taskDate = dateInput.value || null; // Obtiene la fecha o null si está vacío

  // Validación: si el nombre está vacío, no hace nada
  if (taskName === '') return;  // return termina la ejecución de la función

  // Si llegamos aquí, el nombre es válido
  agregarTarea(taskName, taskDate);  // Agrega la nueva tarea con nombre y fecha
  taskInput.value = '';              // Limpia el input de texto (lo deja vacío)
  dateInput.value = '';              // Limpia el input de fecha (lo deja vacío)
  mostrarTareas();                   // Re-renderiza la lista con la nueva tarea
});

/**
 * EVENTO: Click en botones de filtro (Todas / Completadas / Pendientes)
 *
 * Proceso:
 * 1. Selecciona todos los botones de filtro
 * 2. Por cada botón, agrega un event listener de click
 * 3. Cuando se hace click: desactiva todos los botones y activa el clickeado
 * 4. Actualiza el filtro actual y re-renderiza
 */
// querySelectorAll() selecciona TODOS los elementos que coincidan con el selector CSS
document.querySelectorAll('.filter-btn').forEach(button => {
  // Por cada botón encontrado, agrega un listener de evento 'click'
  button.addEventListener('click', () => {
    // Paso 1: Desactivar todos los botones
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');                   // Quita clase 'active'
      btn.setAttribute('aria-pressed', 'false');        // Actualiza atributo de accesibilidad
    });

    // Paso 2: Activar solo el botón clickeado
    button.classList.add('active');                     // Agrega clase 'active'
    button.setAttribute('aria-pressed', 'true');        // Actualiza atributo de accesibilidad

    // Paso 3: Actualizar el filtro actual
    // dataset.filter accede al atributo data-filter del botón HTML
    currentFilter = button.dataset.filter;

    // Paso 4: Re-renderizar con el nuevo filtro
    mostrarTareas();
  });
});

// =============================================
// SISTEMA DE NOTIFICACIONES
// =============================================

/**
 * Solicita permiso al usuario para mostrar notificaciones del navegador
 *
 * Proceso:
 * 1. Verifica si el navegador soporta notificaciones
 * 2. Si el permiso no ha sido otorgado, lo solicita
 * 3. Retorna una promesa con el resultado
 */
function solicitarPermisoNotificaciones() {
  // Verifica si el navegador soporta la API de Notificaciones
  if (!('Notification' in window)) {
    console.log('Este navegador no soporta notificaciones de escritorio');
    return Promise.resolve('denied');  // Retorna una promesa rechazada
  }

  // Si el permiso no ha sido otorgado ni denegado, solicitarlo
  if (Notification.permission === 'default') {
    return Notification.requestPermission();  // Muestra diálogo de permiso al usuario
  }

  // Si ya hay una decisión (granted o denied), retornarla
  return Promise.resolve(Notification.permission);
}

/**
 * Muestra una notificación del navegador
 *
 * @param {string} title - Título de la notificación
 * @param {string} body - Cuerpo del mensaje
 * @param {string} icon - URL del icono (opcional)
 */
function mostrarNotificacion(title, body, icon = null) {
    debugger;
  // Verificar si tenemos permiso para mostrar notificaciones
  if (Notification.permission === 'granted') {
    // Crear objeto de opciones para la notificación
    const options = {
      body: body,              // Texto del mensaje
      icon: icon,              // Icono (puede ser null)
      badge: icon,             // Badge para dispositivos móviles
      tag: 'task-notification', // Tag único para agrupar notificaciones
      requireInteraction: false, // No requiere interacción del usuario
      silent: false            // Puede emitir sonido
    };

    // Crear y mostrar la notificación
    const notification = new Notification(title, options);

    // Cerrar automáticamente después de 5 segundos
    setTimeout(() => {
      notification.close();
    }, 5000);
  }
}

/**
 * Verifica si hay tareas que vencen hoy y muestra notificaciones
 *
 * Proceso:
 * 1. Filtra las tareas que vencen hoy y no están completadas
 * 2. Si hay tareas, muestra una notificación con la cantidad
 */
function verificarTareasHoy() {
  // Filtrar tareas que vencen hoy y no están completadas
  const tareasHoy = tasks.filter(task => task.isDueToday() && !task.completed);

  // Si hay tareas para hoy, mostrar notificación
  if (tareasHoy.length > 0) {
    debugger;
    const title = '📋 Tareas pendientes para hoy';
    let body = '';

    if (tareasHoy.length === 1) {
      body = `Tienes 1 tarea pendiente: ${tareasHoy[0].name}`;
    } else {
      body = `Tienes ${tareasHoy.length} tareas pendientes para hoy`;
    }

    mostrarNotificacion(title, body);
  }
}

/**
 * EVENTO: DOMContentLoaded - Se ejecuta cuando el HTML ha sido completamente cargado
 *
 * Este es el punto de entrada de la aplicación
 * Renderiza las tareas iniciales (vacías al inicio)
 * Solicita permisos de notificación y verifica tareas de hoy
 */
document.addEventListener('DOMContentLoaded', () => {
  mostrarTareas();  // Renderiza la vista inicial
  debugger;
  // Solicitar permiso para notificaciones
  solicitarPermisoNotificaciones().then(permission => {
    if (permission === 'granted') {
      // Si se otorgó el permiso, verificar tareas de hoy
      verificarTareasHoy();
    }
  });
});
