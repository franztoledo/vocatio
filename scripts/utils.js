// scripts/utils.js
// Funciones de utilidad reutilizables - Inspirado en patrones educativos

// ============================================
// FUNCIONES DE BASE DE DATOS (localStorage)
// ============================================

// Obtiene toda la base de datos
export const getDB = () => {
  return JSON.parse(localStorage.getItem('db'));
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
