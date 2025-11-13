// scripts/utils.js
// Funciones de utilidad reutilizables para toda la aplicación

/**
 * Obtiene la base de datos completa desde localStorage
 * @returns {Object} La base de datos completa
 */
export function getDB() {
  return JSON.parse(localStorage.getItem('db'));
}

/**
 * Guarda la base de datos en localStorage
 * @param {Object} db - La base de datos a guardar
 */
export function saveDB(db) {
  localStorage.setItem('db', JSON.stringify(db));
}

/**
 * Obtiene el usuario actualmente autenticado
 * @returns {Object|null} El usuario activo o null si no hay sesión
 */
export function getActiveUser() {
  const userStr = localStorage.getItem('activeUser');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Establece el usuario activo en la sesión
 * @param {Object} user - El usuario a establecer como activo
 */
export function setActiveUser(user) {
  localStorage.setItem('activeUser', JSON.stringify(user));
}

/**
 * Cierra la sesión del usuario actual y redirige al inicio
 */
export function logout() {
  localStorage.removeItem('activeUser');
  window.location.href = '/index.html';
}

/**
 * Busca un usuario por email en la base de datos
 * @param {string} email - El email del usuario a buscar
 * @returns {Object|null} El usuario encontrado o null
 */
export function findUserByEmail(email) {
  const db = getDB();
  return db.users.find(user => user.email === email) || null;
}

/**
 * Busca una carrera por ID en la base de datos
 * @param {number} id - El ID de la carrera a buscar
 * @returns {Object|null} La carrera encontrada o null
 */
export function findCareerById(id) {
  const db = getDB();
  return db.careers.find(career => career.id === id) || null;
}

/**
 * Busca una universidad por ID en la base de datos
 * @param {number} id - El ID de la universidad a buscar
 * @returns {Object|null} La universidad encontrada o null
 */
export function findUniversityById(id) {
  const db = getDB();
  return db.universities.find(uni => uni.id === id) || null;
}

/**
 * Obtiene todas las carreras de la base de datos
 * @returns {Array} Array de carreras
 */
export function getAllCareers() {
  const db = getDB();
  return db.careers || [];
}

/**
 * Obtiene todas las universidades de la base de datos
 * @returns {Array} Array de universidades
 */
export function getAllUniversities() {
  const db = getDB();
  return db.universities || [];
}

/**
 * Filtra carreras por área
 * @param {string} area - El área para filtrar
 * @returns {Array} Array de carreras filtradas
 */
export function filterCareersByArea(area) {
  const db = getDB();
  return db.careers.filter(career => career.area === area);
}

/**
 * Actualiza los datos del usuario activo en la base de datos
 * @param {Object} updatedUser - Los datos actualizados del usuario
 */
export function updateActiveUser(updatedUser) {
  const db = getDB();
  const index = db.users.findIndex(user => user.id === updatedUser.id);

  if (index !== -1) {
    db.users[index] = updatedUser;
    saveDB(db);
    setActiveUser(updatedUser);
  }
}

/**
 * Valida el formato de un email
 * @param {string} email - El email a validar
 * @returns {boolean} true si el email es válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida la fortaleza de una contraseña
 * @param {string} password - La contraseña a validar
 * @returns {Object} Objeto con isValid y mensaje de error si aplica
 */
export function validatePassword(password) {
  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una mayúscula' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos un número' };
  }

  return { isValid: true, message: '' };
}

/**
 * Muestra un mensaje de error en un elemento del DOM
 * @param {string} elementId - El ID del elemento donde mostrar el error
 * @param {string} message - El mensaje de error a mostrar
 */
export function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
  }
}

/**
 * Oculta un mensaje de error
 * @param {string} elementId - El ID del elemento del error a ocultar
 */
export function hideError(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = '';
    element.style.display = 'none';
  }
}

/**
 * Formatea un número como moneda en soles peruanos
 * @param {number} amount - La cantidad a formatear
 * @returns {string} La cantidad formateada
 */
export function formatCurrency(amount) {
  return `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Obtiene el path relativo correcto hacia la raíz según la ubicación del archivo
 * @param {number} levels - Número de niveles hacia arriba (1 = ../, 2 = ../../)
 * @returns {string} El path relativo
 */
export function getRootPath(levels = 0) {
  return '../'.repeat(levels);
}
