// scripts/auth.js
// Gestión de autenticación: registro, login y recuperación de contraseña
// Inspirado en patrones educativos

import { getDB, saveDB, setActiveUser, findUserByEmail, showToast } from './utils.js';

// ============================================
// FUNCIONES AUXILIARES REUTILIZABLES
// ============================================

/**
 * Crea un elemento de error debajo de un input
 * Patrón: Reutilizar en lugar de duplicar
 */
const crearElementoError = (input) => {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return null;

  let errorElement = formGroup.querySelector('.field-error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'field-error-message';
    errorElement.style.cssText = `
      display: none;
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 6px;
      padding-left: 4px;
    `;
    formGroup.appendChild(errorElement);
  }
  return errorElement;
};

/**
 * Muestra un error en un campo
 */
const mostrarError = (input, errorElement, mensaje) => {
  if (errorElement) {
    errorElement.textContent = mensaje;
    errorElement.style.display = 'block';
    input.style.borderColor = '#dc3545';
    input.style.backgroundColor = '#fff5f5';
  }
};

/**
 * Oculta un error de un campo
 */
const ocultarError = (errorElement) => {
  if (errorElement) {
    errorElement.style.display = 'none';
  }
};

/**
 * Limpia estilos de error de un input
 */
const limpiarEstilos = (input) => {
  input.style.borderColor = '';
  input.style.backgroundColor = '';
};

/**
 * Valida formato de email
 * Patrón simple del profesor
 */
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida fortaleza de contraseña
 * Requisitos: 8+ caracteres, 1 mayúscula, 1 número
 */
const validarPassword = (password) => {
  const errores = [];

  if (password.length < 8) {
    errores.push('debe tener al menos 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errores.push('debe contener al menos una letra mayúscula');
  }
  if (!/[0-9]/.test(password)) {
    errores.push('debe contener al menos un número');
  }

  if (errores.length > 0) {
    return {
      valido: false,
      mensaje: `La contraseña no cumple: ${errores.join(', ')}`
    };
  }

  return { valido: true, mensaje: '' };
};

// ============================================
// 1. REGISTRO DE USUARIO
// ============================================

/**
 * Inicializa el formulario de registro
 *
 * Flujo:
 * 1. Usuario llena el formulario
 * 2. Se validan todos los campos
 * 3. Se crea el usuario en la base de datos
 * 4. Se inicia sesión automáticamente
 * 5. Se redirige a completar perfil básico
 */
export function initRegister() {
  const form = document.querySelector('.form');
  if (!form) return;

  // Obtener campos del formulario
  const nameInput = form.querySelector('input[placeholder="Nombres"]');
  const nicknameInput = form.querySelector('input[placeholder="Nickname"]');
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[placeholder="Contraseña"]');
  const confirmPasswordInput = form.querySelector('input[placeholder="Confirmar Contraseña"]');
  const submitButton = form.querySelector('button[type="submit"]');

  // Crear elementos de error para cada campo
  const errores = {
    name: crearElementoError(nameInput),
    nickname: crearElementoError(nicknameInput),
    email: crearElementoError(emailInput),
    password: crearElementoError(passwordInput),
    confirmPassword: crearElementoError(confirmPasswordInput)
  };

  // Validación en tiempo real (mejora UX)
  emailInput?.addEventListener('blur', () => {
    if (emailInput.value && !validarEmail(emailInput.value)) {
      mostrarError(emailInput, errores.email, '❌ Formato de email inválido');
    } else if (emailInput.value) {
      limpiarEstilos(emailInput);
      ocultarError(errores.email);
    }
  });

  passwordInput?.addEventListener('input', () => {
    if (passwordInput.value) {
      const validacion = validarPassword(passwordInput.value);
      if (!validacion.valido) {
        mostrarError(passwordInput, errores.password, `❌ ${validacion.mensaje}`);
      } else {
        limpiarEstilos(passwordInput);
        ocultarError(errores.password);
      }
    }
  });

  confirmPasswordInput?.addEventListener('input', () => {
    if (confirmPasswordInput.value && passwordInput.value) {
      if (confirmPasswordInput.value !== passwordInput.value) {
        mostrarError(confirmPasswordInput, errores.confirmPassword, '❌ Las contraseñas no coinciden');
      } else {
        limpiarEstilos(confirmPasswordInput);
        ocultarError(errores.confirmPassword);
      }
    }
  });

  // Manejar envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores previos
    Object.values(errores).forEach(ocultarError);
    [nameInput, nicknameInput, emailInput, passwordInput, confirmPasswordInput].forEach(limpiarEstilos);

    // Obtener valores (limpiar espacios según corresponda)
    const name = nameInput?.value.trim(); // Mantener espacios internos
    const nickname = nicknameInput?.value.replace(/\s+/g, ''); // Sin espacios
    const email = emailInput?.value.replace(/\s+/g, ''); // Sin espacios
    const password = passwordInput?.value;
    const confirmPassword = confirmPasswordInput?.value;

    let hayErrores = false;

    // Validación 1: Campos vacíos
    if (!name) {
      mostrarError(nameInput, errores.name, '❌ El campo Nombres es obligatorio');
      hayErrores = true;
    }
    if (!nickname) {
      mostrarError(nicknameInput, errores.nickname, '❌ El campo Nickname es obligatorio');
      hayErrores = true;
    }
    if (!email) {
      mostrarError(emailInput, errores.email, '❌ El campo Email es obligatorio');
      hayErrores = true;
    }
    if (!password) {
      mostrarError(passwordInput, errores.password, '❌ El campo Contraseña es obligatorio');
      hayErrores = true;
    }
    if (!confirmPassword) {
      mostrarError(confirmPasswordInput, errores.confirmPassword, '❌ Debes confirmar tu contraseña');
      hayErrores = true;
    }

    if (hayErrores) return;

    // Validación 2: Formato de email
    if (!validarEmail(email)) {
      mostrarError(emailInput, errores.email, `❌ El email "${email}" no es válido`);
      return;
    }

    // Validación 3: Email ya existe
    const usuarioExistente = findUserByEmail(email);
    if (usuarioExistente) {
      mostrarError(emailInput, errores.email, `❌ El email "${email}" ya está registrado`);
      return;
    }

    // Validación 4: Fortaleza de contraseña
    const validacion = validarPassword(password);
    if (!validacion.valido) {
      mostrarError(passwordInput, errores.password, `❌ ${validacion.mensaje}`);
      return;
    }

    // Validación 5: Contraseñas coinciden
    if (password !== confirmPassword) {
      mostrarError(confirmPasswordInput, errores.confirmPassword, '❌ Las contraseñas no coinciden');
      return;
    }

    // Deshabilitar botón
    submitButton.disabled = true;
    submitButton.textContent = 'Registrando...';

    try {
      // Obtener base de datos
      const db = getDB();

      // Generar nuevo ID
      const nuevoId = db.users.length > 0
        ? Math.max(...db.users.map(u => u.id)) + 1
        : 1;

      // Crear nuevo usuario
      const nuevoUsuario = {
        id: nuevoId,
        name: name,
        nickname: nickname,
        email: email,
        password: password,
        profile: {
          age: null,
          level: '',
          interests: [],
          gender: '',
          city: ''
        },
        favoriteCareers: [],
        savedResources: [], // <-- Añadido para consistencia
        testResults: [],
        customLists: [],
        privacySettings: {
          profileVisibility: 'public',
          showEmail: false,
          showAge: true,
          showEducationLevel: true,
          showTestResults: false,
          showFavoriteCareers: true,
          allowMessages: true,
          showOnlineStatus: true
        }
      };

      // Guardar usuario en la DB
      db.users.push(nuevoUsuario);
      saveDB(db);

      // Iniciar sesión automáticamente
      setActiveUser(nuevoUsuario);

      // Redirigir a completar perfil
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 500);

    } catch (error) {
      console.error('Error al registrar:', error);
      showToast('Ocurrió un error al crear tu cuenta.', 'error');
      submitButton.disabled = false;
      submitButton.textContent = 'Confirmar';
    }
  });
}

// ============================================
// 2. INICIO DE SESIÓN
// ============================================

/**
 * Inicializa el formulario de login
 *
 * Flujo:
 * 1. Usuario ingresa email y contraseña
 * 2. Se busca en la base de datos
 * 3. Si existe y la contraseña es correcta, inicia sesión
 * 4. Redirige al dashboard
 */
export function initLogin() {
  const form = document.querySelector('.form');
  if (!form) return;

  // Obtener campos
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const submitButton = form.querySelector('button[type="submit"]');

  // Crear elementos de error
  const errores = {
    email: crearElementoError(emailInput),
    password: crearElementoError(passwordInput)
  };

  // Validación en tiempo real
  emailInput?.addEventListener('blur', () => {
    if (emailInput.value && !validarEmail(emailInput.value)) {
      mostrarError(emailInput, errores.email, '❌ Formato de email inválido');
    } else if (emailInput.value) {
      limpiarEstilos(emailInput);
      ocultarError(errores.email);
    }
  });

  // Manejar envío
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores
    Object.values(errores).forEach(ocultarError);
    [emailInput, passwordInput].forEach(limpiarEstilos);

    // Obtener valores
    const email = emailInput?.value.trim();
    const password = passwordInput?.value;

    let hayErrores = false;

    // Validación: Campos vacíos
    if (!email) {
      mostrarError(emailInput, errores.email, '❌ El campo Email es obligatorio');
      hayErrores = true;
    }
    if (!password) {
      mostrarError(passwordInput, errores.password, '❌ El campo Contraseña es obligatorio');
      hayErrores = true;
    }

    if (hayErrores) return;

    // Validación: Formato de email
    if (!validarEmail(email)) {
      mostrarError(emailInput, errores.email, '❌ El formato del email no es válido');
      return;
    }

    // Deshabilitar botón
    submitButton.disabled = true;
    submitButton.textContent = 'Iniciando sesión...';

    try {
      // Buscar usuario en la base de datos
      const usuario = findUserByEmail(email);

      // Validar que existe
      if (!usuario) {
        mostrarError(emailInput, errores.email, '❌ No existe una cuenta con este email');
        submitButton.disabled = false;
        submitButton.textContent = 'Confirmar';
        return;
      }

      // Validar contraseña
      if (usuario.password !== password) {
        mostrarError(passwordInput, errores.password, '❌ La contraseña es incorrecta');
        submitButton.disabled = false;
        submitButton.textContent = 'Confirmar';
        return;
      }

      // Login exitoso: guardar sesión
      setActiveUser(usuario);

      // Redirigir según si completó el perfil o no
      const perfilCompleto = usuario.profile && usuario.profile.age !== null;
      const destino = perfilCompleto
        ? '../Perfil/dashboard-personal.html'
        : 'profile.html';

      setTimeout(() => {
        window.location.href = destino;
      }, 500);

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      showToast('Ocurrió un error al iniciar sesión.', 'error');
      submitButton.disabled = false;
      submitButton.textContent = 'Confirmar';
    }
  });
}

// ============================================
// 3. RECUPERAR CONTRASEÑA
// ============================================

/**
 * Inicializa el formulario de recuperación de contraseña
 *
 * Flujo:
 * 1. Usuario ingresa su email
 * 2. Se verifica que exista en la DB
 * 3. Se "envía" el email de recuperación (simulado)
 * 4. Redirige a página de verificación
 */
export function initResetPassword() {
  const form = document.querySelector('.form');
  if (!form) return;

  // Obtener campo
  const emailInput = form.querySelector('input[type="email"]');
  const submitButton = form.querySelector('button[type="submit"]');

  // Crear elemento de error
  const emailError = crearElementoError(emailInput);

  // Validación en tiempo real
  emailInput?.addEventListener('blur', () => {
    if (emailInput.value && !validarEmail(emailInput.value)) {
      mostrarError(emailInput, emailError, '❌ Formato de email inválido');
    } else if (emailInput.value) {
      limpiarEstilos(emailInput);
      ocultarError(emailError);
    }
  });

  // Manejar envío
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores
    ocultarError(emailError);
    limpiarEstilos(emailInput);

    // Obtener valor
    const email = emailInput?.value.trim();

    // Validación: Campo vacío
    if (!email) {
      mostrarError(emailInput, emailError, '❌ El campo Email es obligatorio');
      return;
    }

    // Validación: Formato
    if (!validarEmail(email)) {
      mostrarError(emailInput, emailError, '❌ El formato del email no es válido');
      return;
    }

    // Deshabilitar botón
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {
      // Verificar que el email existe
      const usuario = findUserByEmail(email);

      if (!usuario) {
        mostrarError(emailInput, emailError, '❌ No existe una cuenta con este email');
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar';
        return;
      }

      // Simular envío: guardar email en localStorage
      localStorage.setItem('resetEmailSent', email);

      // Redirigir a confirmación
      window.location.href = 'verification-sent.html';

    } catch (error) {
      console.error('Error:', error);
      showToast('Ocurrió un error al procesar tu solicitud.', 'error');
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar';
    }
  });
}

// ============================================
// 4. VERIFICACIÓN ENVIADA
// ============================================

/**
 * Inicializa la página de verificación enviada
 *
 * Muestra el email al que se envió el enlace de recuperación
 */
export function initVerificationSent() {
  // Obtener el email del localStorage
  const email = localStorage.getItem('resetEmailSent');

  // Buscar el elemento de mensaje
  const messageText = document.querySelector('.message-text');

  if (messageText) {
    if (email) {
      // Mostrar email en el mensaje
      messageText.innerHTML = `Se te ha enviado el link para restablecer tu contraseña a <strong>${email}</strong>.`;

      // Limpiar después de 1 minuto
      setTimeout(() => {
        localStorage.removeItem('resetEmailSent');
      }, 60000);
    } else {
      // Mensaje genérico si no hay email
      messageText.textContent = 'Se te ha enviado el link para restablecer tu contraseña. Revisa tu correo.';
    }
  }

  // Manejar reenvío
  const resendLink = document.querySelector('.link-inline');
  if (resendLink) {
    resendLink.addEventListener('click', () => {
      localStorage.removeItem('resetEmailSent');
    });
  }
}

// ============================================
// AUTO-INICIALIZACIÓN
// ============================================

// Detectar qué página está cargada y ejecutar la función correspondiente
document.addEventListener('DOMContentLoaded', () => {
  const rutaActual = window.location.pathname;

  if (rutaActual.includes('register.html')) {
    initRegister();
  } else if (rutaActual.includes('login.html')) {
    initLogin();
  } else if (rutaActual.includes('reset-password.html')) {
    initResetPassword();
  } else if (rutaActual.includes('verification-sent.html')) {
    initVerificationSent();
  }
});
