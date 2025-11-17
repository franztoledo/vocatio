// scripts/main.js
// Lógica global que se ejecuta en TODAS las páginas

import { initDB } from './database.js';
import { getActiveUser, logout, showToast } from './utils.js';

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

/**
 * Función principal que se ejecuta cuando carga cualquier página
 *
 * Pasos:
 * 1. Inicializar la base de datos
 * 2. Obtener el usuario activo
 * 3. Proteger rutas que requieren login
 * 4. Actualizar la interfaz según el estado de sesión
 */
function iniciarApp() {
  // Paso 1: Asegurar que la base de datos esté inicializada
  initDB();

  // Paso 2: Obtener el usuario que tiene sesión activa
  const usuarioActivo = getActiveUser();

  // Paso 3: Proteger rutas que requieren autenticación
  protegerRutas(usuarioActivo);

  // Paso 4: Actualizar la UI (botones, nombres, etc.)
  actualizarInterfazDeAutenticacion(usuarioActivo);

  // Paso 5: Configurar botón de logout
  configurarBotonCerrarSesion();
}

// ============================================
// PROTECCIÓN DE RUTAS
// ============================================

/**
 * Protege páginas que solo pueden ver usuarios autenticados
 *
 * Si el usuario NO tiene sesión y está en una página protegida:
 * - Lo redirige al login
 * - Guarda la página de origen para volver después
 */
function protegerRutas(usuarioActivo) {
  const rutaActual = window.location.pathname;

  // Lista de rutas que requieren login
  const rutasProtegidas = [
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

  // Verificar si la ruta actual está protegida
  const esRutaProtegida = rutasProtegidas.some(ruta => rutaActual.includes(ruta));

  // Si es ruta protegida y NO hay usuario, redirigir
  if (esRutaProtegida && !usuarioActivo) {
    showToast('Debes iniciar sesión para acceder a esta página.', 'error');
    // Guardar página de origen para volver después del login
    const urlRetorno = encodeURIComponent(rutaActual);
    setTimeout(() => {
        window.location.href = `/pages/Login/login.html?return=${urlRetorno}`;
    }, 2000);
  }
}

// ============================================
// ACTUALIZACIÓN DE LA INTERFAZ
// ============================================

/**
 * Actualiza la interfaz según si hay usuario autenticado o no
 *
 * Si HAY usuario:
 * - Muestra "Cerrar Sesión"
 * - Muestra el nombre del usuario
 *
 * Si NO hay usuario:
 * - Muestra "Iniciar Sesión"
 */
function actualizarInterfazDeAutenticacion(usuarioActivo) {
  // Buscar el botón de login/logout en el navbar
  const botonLogin = document.querySelector('.btn-primary-nav');
  const nombreUsuario = document.querySelector('.user-name');

  // Si no existe el botón, salir (no todas las páginas lo tienen)
  if (!botonLogin) return;

  if (usuarioActivo) {
    // HAY USUARIO AUTENTICADO
    botonLogin.textContent = 'Cerrar Sesión';
    botonLogin.href = '#';
    botonLogin.classList.add('logout-btn');

    // Mostrar nombre del usuario si existe el elemento
    if (nombreUsuario) {
      nombreUsuario.textContent = usuarioActivo.name;
    }

    // Configurar evento para cerrar sesión
    botonLogin.addEventListener('click', (e) => {
      e.preventDefault();
      const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
      if (confirmar) {
        logout();
      }
    });
  } else {
    // NO HAY USUARIO
    botonLogin.textContent = 'Iniciar Sesión';
    botonLogin.href = '/pages/Login/login.html';
    botonLogin.classList.remove('logout-btn');

    // Ocultar nombre de usuario
    if (nombreUsuario) {
      nombreUsuario.textContent = '';
    }
  }
}

/**
 * Configura todos los botones de logout que existan en la página
 */
function configurarBotonCerrarSesion() {
  const botonesCerrarSesion = document.querySelectorAll('.logout-button, [data-logout]');

  botonesCerrarSesion.forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.preventDefault();
      const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
      if (confirmar) {
        logout();
      }
    });
  });
}

// ============================================
// FUNCIONES AUXILIARES EXPORTADAS
// ============================================

/**
 * Obtiene la URL de retorno de los parámetros
 * Útil para redirigir al usuario a donde estaba después del login
 */
export function obtenerUrlRetorno() {
  const params = new URLSearchParams(window.location.search);
  return params.get('return');
}

/**
 * Redirige al usuario después del login
 * Si hay URL de retorno, va ahí; si no, al dashboard
 */
export function redirigirDespuesDeLogin() {
  const urlRetorno = obtenerUrlRetorno();

  if (urlRetorno) {
    window.location.href = decodeURIComponent(urlRetorno);
  } else {
    window.location.href = '/pages/inicio.html';
  }
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si hay sesión activa
 */
export function estaAutenticado() {
  return getActiveUser() !== null;
}

/**
 * Requiere autenticación para acceder a la página
 * Si no hay sesión, redirige al login
 */
export function requiereAutenticacion() {
  if (!estaAutenticado()) {
    const urlRetorno = encodeURIComponent(window.location.pathname);
    window.location.href = `/pages/Login/login.html?return=${urlRetorno}`;
    return false;
  }
  return true;
}

// ============================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================

// Cuando el DOM esté listo, iniciar la app
document.addEventListener('DOMContentLoaded', iniciarApp);

// Exportar funciones útiles
export { getActiveUser, logout };
