// scripts/utils.js
// Funciones de utilidad reutilizables - Inspirado en patrones educativos

import { initDB } from './database.js';

// ============================================
// FUNCIONES DE BASE DE DATOS (localStorage)
// ============================================

// Obtiene toda la base de datos
export const getDB = () => {
  return JSON.parse(localStorage.getItem('db')) || initDB();
};

// Guarda la base de datos
export const saveDB = (db) => {
  localStorage.setItem('db', JSON.stringify(db));
};

// ============================================
// FUNCIONES DE SESIÓN (Usuario Activo)
// ============================================

// Obtiene el usuario que tiene sesión activa
export const getActiveUser = () => {
  const userStr = localStorage.getItem('activeUser');
  return userStr ? JSON.parse(userStr) : null;
};

// Guarda el usuario activo (inicia sesión)
export const setActiveUser = (user) => {
  localStorage.setItem('activeUser', JSON.stringify(user));
};

// Actualiza los datos del usuario activo en la DB y en la sesión
export const updateActiveUser = (updatedUser) => {
  const db = getDB();
  const userIndex = db.users.findIndex(u => u.id === updatedUser.id);

  if (userIndex !== -1) {
    db.users[userIndex] = updatedUser;
    saveDB(db);
    setActiveUser(updatedUser);
  }
};

// Cierra sesión y redirige al inicio
export const logout = () => {
  localStorage.removeItem('activeUser');
  window.location.href = '/index.html';
};

// ============================================
// FUNCIONES DE BÚSQUEDA EN LA BASE DE DATOS
// ============================================

// Busca un usuario por email
export const findUserByEmail = (email) => {
  const db = getDB();
  return db.users.find(u => u.email === email) || null;
};

// Busca una carrera por ID
export const findCareerById = (id) => {
  const db = getDB();
  return db.careers.find(c => c.id === id) || null;
};

// Busca una universidad por ID
export const findUniversityById = (id) => {
  const db = getDB();
  return db.universities.find(u => u.id === id) || null;
};

// Obtiene todas las carreras
export const getAllCareers = () => {
  const db = getDB();
  return db.careers || [];
};

// Obtiene todas las universidades
export const getAllUniversities = () => {
  const db = getDB();
  return db.universities || [];
};

// Filtra carreras por área específica
export const filterCareersByArea = (area) => {
  const db = getDB();
  return db.careers.filter(c => c.area === area);
};

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

// Valida formato de email (ejemplo: usuario@dominio.com)
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Valida fortaleza de contraseña
// Requisitos: mínimo 8 caracteres, 1 mayúscula, 1 número
export const validarPassword = (password) => {
  // Menos de 8 caracteres
  if (password.length < 8) {
    return { valido: false, mensaje: 'La contraseña debe tener al menos 8 caracteres' };
  }

  // Sin mayúscula
  if (!/[A-Z]/.test(password)) {
    return { valido: false, mensaje: 'La contraseña debe contener al menos una mayúscula' };
  }

  // Sin número
  if (!/[0-9]/.test(password)) {
    return { valido: false, mensaje: 'La contraseña debe contener al menos un número' };
  }

  return { valido: true, mensaje: '' };
};

// ============================================
// FUNCIONES DE UTILIDAD PARA EL DOM
// ============================================

// Muestra un mensaje de error en un elemento
export const mostrarError = (elementId, mensaje) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = mensaje;
    element.style.display = 'block';
  }
};

// Oculta un mensaje de error
export const ocultarError = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = '';
    element.style.display = 'none';
  }
};

// Formatea un número como moneda peruana
export const formatearMoneda = (monto) => {
  return `S/ ${monto.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Muestra una notificación toast en la pantalla.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} [type='info'] - El tipo de toast ('success', 'error', 'info').
 * @param {number} [duration=3000] - La duración en milisegundos.
 */
export function showToast(message, type = 'info', duration = 3000) {
  let toastContainer = document.getElementById('toast-container');

  // Si el contenedor no existe, crearlo
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // Crear el elemento toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconName = {
    success: 'check-circle',
    error: 'x-circle',
    info: 'info'
  }[type];

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;

  // Añadir al contenedor
  toastContainer.appendChild(toast);

  // Actualizar iconos de lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // Eliminar el toast después de la duración especificada
  setTimeout(() => {
    toast.classList.add('hiding');
    // Esperar a que la animación de salida termine para remover el elemento
    toast.addEventListener('animationend', () => {
      toast.remove();
      // Si el contenedor está vacío, también se puede remover
      if (toastContainer.children.length === 0) {
        toastContainer.remove();
      }
    });
  }, duration);
}

// ============================================
// FUNCIONES DE GESTIÓN DE FAVORITOS
// ============================================

/**
 * Checks if a career is marked as favorite by the current user.
 * @param {number} careerId - The ID of the career to check.
 * @returns {boolean} - True if the career is a favorite, false otherwise.
 */
export function isFavorite(careerId) {
  const db = getDB();
  const currentUser = db.users[0];
  if (!currentUser) return false;
  return currentUser.favoriteCareers.includes(careerId);
}

/**
 * Toggles the favorite status of a career for the current user.
 * @param {number} careerId - The ID of the career to toggle.
 * @returns {boolean} - The new favorite status (true if it is now a favorite, false otherwise).
 */
export function toggleFavorite(careerId) {
  const db = getDB();
  const activeUser = getActiveUser();

  if (!activeUser) {
    console.error('No active user found to toggle favorite status.');
    showToast('Debes iniciar sesión para guardar favoritos.', 'error');
    return false;
  }
  
  const userIndex = db.users.findIndex(u => u.id === activeUser.id);
  if (userIndex === -1) {
    console.error('Active user not found in DB.');
    return false;
  }
  
  const userToUpdate = db.users[userIndex];
  const index = userToUpdate.favoriteCareers.indexOf(careerId);
  let isNowFavorite;

  if (index > -1) {
    userToUpdate.favoriteCareers.splice(index, 1);
    isNowFavorite = false;
  } else {
    userToUpdate.favoriteCareers.push(careerId);
    isNowFavorite = true;
    
    // Add to activity log
    if (!userToUpdate.activityLog) {
      userToUpdate.activityLog = [];
    }
    const career = findCareerById(careerId);
    userToUpdate.activityLog.push({
      type: 'career_favorited',
      timestamp: new Date().toISOString(),
      details: { 
        careerId: careerId,
        careerName: career ? career.title : 'Desconocida'
      }
    });
  }
  
  saveDB(db);
  // Also update the user in the current session
  setActiveUser(userToUpdate);
  return isNowFavorite;
}

/**
 * Gets the list of favorite career IDs for the current user.
 * @returns {number[]} - An array of favorite career IDs.
 */
export function getFavoriteCareerIds() {
  const db = getDB();
  const currentUser = db.users[0];
  return currentUser ? currentUser.favoriteCareers : [];
}

/**
 * Gets the full career objects for the current user's favorite careers.
 * @returns {Object[]} - An array of favorite career objects.
 */
export function getFavoriteCareers() {
  const db = getDB();
  const currentUser = db.users[0];
  if (!currentUser || !currentUser.favoriteCareers) {
    return [];
  }
  return db.careers.filter(career => currentUser.favoriteCareers.includes(career.id));
}

// ============================================
// FUNCIONES DE GESTIÓN DE LISTAS
// ============================================

/**
 * Gets all custom lists for the current user.
 * @returns {Object[]} - An array of custom list objects.
 */
export function getCustomLists() {
  const db = getDB();
  const currentUser = db.users[0];
  return currentUser ? currentUser.customLists : [];
}

/**
 * Creates a new custom list for the user.
 * @param {string} name - The name of the list.
 * @param {string} description - The description of the list.
 * @param {number[]} careerIds - An array of career IDs to include in the list.
 */
export function createCustomList(name, description, careerIds) {
  const db = getDB();
  const currentUser = db.users[0];

  if (!currentUser) {
    console.error('No current user found to create a list.');
    return;
  }

  const newList = {
    id: Date.now(), // Simple unique ID
    name,
    description,
    careerIds,
    createdAt: new Date().toISOString(),
  };

  currentUser.customLists.push(newList);
  saveDB(db);
}

/**
 * Deletes a custom list for the user.
 * @param {number} listId - The ID of the list to delete.
 */
export function deleteCustomList(listId) {
  const db = getDB();
  const currentUser = db.users[0];

  if (!currentUser) {
    console.error('No current user found to delete a list.');
    return;
  }

  const listIndex = currentUser.customLists.findIndex(list => list.id === listId);

  if (listIndex > -1) {
    currentUser.customLists.splice(listIndex, 1);
    saveDB(db);
  } else {
    console.error(`List with id ${listId} not found.`);
  }
}

/**
 * Calculates the completion percentage of a user's profile.
 * @param {object} user - The user object.
 * @returns {number} - The completion percentage (0-100).
 */
export function calculateProfileCompletion(user) {
  let completado = 0;
  const total = 100;

  // Campos obligatorios básicos (20%)
  if (user.name) completado += 10;
  if (user.email) completado += 10;

  // Perfil básico (20%)
  if (user.profile?.lastName) completado += 5;
  if (user.profile?.birthDate) completado += 5;
  if (user.profile?.level) completado += 10;

  // Información personal adicional (15%)
  if (user.profile?.phone) completado += 5;
  if (user.profile?.gender) completado += 5;
  if (user.profile?.city) completado += 5;

  // Biografía (5%)
  if (user.profile?.bio) completado += 5;

  // Información educativa (20%)
  if (user.profile?.institution) completado += 5;
  if (user.profile?.currentGrade) completado += 3;
  if (user.profile?.gpa) completado += 3;
  if (user.profile?.graduationYear) completado += 3;
  if (user.profile?.interests?.length > 0) completado += 6;

  // Preferencias vocacionales (20%)
  if (user.profile?.studyModality) completado += 5;
  if (user.profile?.studyDuration) completado += 5;
  if (user.profile?.workEnvironment) completado += 5;
  if (user.profile?.desiredSkills?.length > 0) completado += 5;

  return Math.round((completado / total) * 100);
}
