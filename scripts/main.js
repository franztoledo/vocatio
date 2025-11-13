// scripts/main.js
// Lógica global que se ejecuta en todas las páginas

import { initDB } from './database.js';
import { getActiveUser, logout } from './utils.js';

/**
 * Inicializa la aplicación
 */
function initApp() {
  // Asegurar que la base de datos esté inicializada
  initDB();

  // Obtener el usuario activo
  const user = getActiveUser();

  // Proteger rutas que requieren autenticación
  protectRoutes(user);

  // Actualizar la UI según el estado de sesión
  updateAuthUI(user);

  // Agregar listener al botón de logout si existe
  setupLogoutButton();
}

/**
 * Protege las rutas que requieren autenticación
 * @param {Object|null} user - El usuario activo
 */
function protectRoutes(user) {
  const currentPath = window.location.pathname;

  // Lista de rutas protegidas que requieren autenticación
  const protectedPaths = [
    '/pages/Perfil/',
    '/pages/Login/profile.html',
    '/pages/Login/success.html',
    '/pages/ExplorarCarreras/carreras-favoritas.html',
    '/pages/ExplorarCarreras/crear-lista.html',
    '/pages/ExplorarCarreras/gestionar-listas.html',
    '/pages/TestVocacional/historial-evaluaciones.html',
    '/pages/Perfil/dashboard-personal.html',
    '/pages/Perfil/configuracion-perfil.html',
    '/pages/Perfil/recursos-recomendados.html',
    '/pages/Perfil/generar-reporte.html',
    '/pages/Perfil/vista-previa-reporte.html',
    '/pages/Perfil/opcion-descarga.html'
  ];

  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedPaths.some(path => currentPath.includes(path));

  if (isProtectedRoute && !user) {
    alert('Debes iniciar sesión para acceder a esta página.');
    // Redirigir a login guardando la página de origen
    const returnUrl = encodeURIComponent(currentPath);
    window.location.href = `/pages/Login/login.html?return=${returnUrl}`;
  }
}

/**
 * Actualiza la interfaz de usuario según el estado de autenticación
 * @param {Object|null} user - El usuario activo
 */
function updateAuthUI(user) {
  // Buscar el botón de login/logout en el navbar
  const loginButton = document.querySelector('.btn-primary-nav');
  const userNameElement = document.querySelector('.user-name');

  if (!loginButton) return;

  if (user) {
    // Usuario autenticado
    loginButton.textContent = 'Cerrar Sesión';
    loginButton.href = '#';
    loginButton.classList.add('logout-btn');

    // Mostrar nombre del usuario si existe el elemento
    if (userNameElement) {
      userNameElement.textContent = user.name;
    }

    // Agregar evento de logout
    loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        logout();
      }
    });
  } else {
    // Usuario no autenticado
    loginButton.textContent = 'Iniciar Sesión';
    loginButton.href = '/pages/Login/login.html';
    loginButton.classList.remove('logout-btn');

    // Ocultar nombre de usuario si existe el elemento
    if (userNameElement) {
      userNameElement.textContent = '';
    }
  }
}

/**
 * Configura el botón de logout si existe
 */
function setupLogoutButton() {
  const logoutButtons = document.querySelectorAll('.logout-button, [data-logout]');

  logoutButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        logout();
      }
    });
  });
}

/**
 * Obtiene el parámetro de retorno de la URL si existe
 * @returns {string|null} La URL de retorno o null
 */
export function getReturnUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('return');
}

/**
 * Redirige al usuario a la página de retorno o al dashboard
 */
export function redirectAfterLogin() {
  const returnUrl = getReturnUrl();

  if (returnUrl) {
    window.location.href = decodeURIComponent(returnUrl);
  } else {
    window.location.href = '/pages/inicio.html';
  }
}

/**
 * Muestra un mensaje de bienvenida al usuario
 */
export function showWelcomeMessage() {
  const user = getActiveUser();

  if (user) {
    const welcomeElement = document.querySelector('.welcome-message');
    if (welcomeElement) {
      welcomeElement.textContent = `Bienvenido, ${user.name}`;
    }
  }
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si el usuario está autenticado
 */
export function isAuthenticated() {
  return getActiveUser() !== null;
}

/**
 * Redirige a la página de login si el usuario no está autenticado
 */
export function requireAuth() {
  if (!isAuthenticated()) {
    const returnUrl = encodeURIComponent(window.location.pathname);
    window.location.href = `/pages/Login/login.html?return=${returnUrl}`;
    return false;
  }
  return true;
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);

// Exportar funciones útiles para otros módulos
export { getActiveUser, logout };
