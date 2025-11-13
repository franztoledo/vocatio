// scripts/auth.js
// Gestión de autenticación de usuarios (registro, login, recuperación de contraseña)

import { getDB, saveDB, setActiveUser, findUserByEmail } from './utils.js';

/**
 * Inicializa el manejo del formulario de registro
 */
export function initRegister() {
  const form = document.querySelector('.form');

  if (!form) {
    console.error('No se encontró el formulario de registro');
    return;
  }

  // Obtener los campos del formulario
  const nameInput = form.querySelector('input[placeholder="Nombres"]');
  const nicknameInput = form.querySelector('input[placeholder="Nickname"]');
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[placeholder="Contraseña"]');
  const confirmPasswordInput = form.querySelector('input[placeholder="Confirmar Contraseña"]');
  const submitButton = form.querySelector('button[type="submit"]');

  // Función para crear un mensaje de error debajo de un input
  const createErrorElement = (input) => {
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

  // Crear elementos de error para cada input
  const nameError = createErrorElement(nameInput);
  const nicknameError = createErrorElement(nicknameInput);
  const emailError = createErrorElement(emailInput);
  const passwordError = createErrorElement(passwordInput);
  const confirmPasswordError = createErrorElement(confirmPasswordInput);

  // Crear contenedor para mensajes de éxito si no existe
  let successContainer = form.querySelector('.success-message-container');
  if (!successContainer) {
    successContainer = document.createElement('div');
    successContainer.className = 'success-message-container';
    successContainer.style.cssText = `
      display: none;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 20px;
      color: #155724;
      font-size: 0.95rem;
    `;
    // Insertar antes de los form-links
    const formLinks = form.querySelector('.form-links');
    form.insertBefore(successContainer, formLinks);
  }

  // Funciones de ayuda para mostrar mensajes
  const showFieldError = (input, errorElement, message) => {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      markFieldAsInvalid(input);
    }
  };

  const hideFieldError = (errorElement) => {
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  };

  const showSuccess = (message) => {
    successContainer.textContent = message;
    successContainer.style.display = 'block';

    // Scroll al mensaje para que sea visible
    successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const hideAllErrors = () => {
    hideFieldError(nameError);
    hideFieldError(nicknameError);
    hideFieldError(emailError);
    hideFieldError(passwordError);
    hideFieldError(confirmPasswordError);
    successContainer.style.display = 'none';
  };

  // Añadir indicadores visuales de error en campos
  const markFieldAsInvalid = (input) => {
    input.style.borderColor = '#c33';
    input.style.backgroundColor = '#fff5f5';
  };

  const markFieldAsValid = (input) => {
    input.style.borderColor = '';
    input.style.backgroundColor = '';
  };

  const clearFieldStyles = () => {
    [nameInput, nicknameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
      if (input) markFieldAsValid(input);
    });
  };

  // Validación en tiempo real (opcional - mejora UX)
  emailInput?.addEventListener('blur', () => {
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      showFieldError(emailInput, emailError, '❌ Formato de email inválido');
    } else if (emailInput.value) {
      markFieldAsValid(emailInput);
      hideFieldError(emailError);
    }
  });

  passwordInput?.addEventListener('input', () => {
    if (passwordInput.value) {
      const validation = validatePassword(passwordInput.value);
      if (!validation.isValid) {
        showFieldError(passwordInput, passwordError, `❌ ${validation.message}`);
      } else {
        markFieldAsValid(passwordInput);
        hideFieldError(passwordError);
      }
    }
  });

  confirmPasswordInput?.addEventListener('input', () => {
    if (confirmPasswordInput.value && passwordInput.value) {
      if (confirmPasswordInput.value !== passwordInput.value) {
        showFieldError(confirmPasswordInput, confirmPasswordError, '❌ Las contraseñas no coinciden');
      } else {
        markFieldAsValid(confirmPasswordInput);
        hideFieldError(confirmPasswordError);
      }
    }
  });

  // Manejar el envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpiar mensajes y estilos previos
    hideAllErrors();
    clearFieldStyles();

    // Obtener valores del formulario
    const name = nameInput?.value.trim(); // Mantener espacios internos, solo trimear extremos
    const nickname = nicknameInput?.value.replace(/\s+/g, ''); // Quitar todos los espacios
    const email = emailInput?.value.replace(/\s+/g, ''); // Quitar todos los espacios
    const password = passwordInput?.value;
    const confirmPassword = confirmPasswordInput?.value;

    let hasErrors = false;

    // Validación 1: Campos vacíos
    if (!name) {
      showFieldError(nameInput, nameError, '❌ El campo Nombres es obligatorio');
      hasErrors = true;
    }

    if (!nickname) {
      showFieldError(nicknameInput, nicknameError, '❌ El campo Nickname es obligatorio');
      hasErrors = true;
    }

    if (!email) {
      showFieldError(emailInput, emailError, '❌ El campo Email es obligatorio');
      hasErrors = true;
    }

    if (!password) {
      showFieldError(passwordInput, passwordError, '❌ El campo Contraseña es obligatorio');
      hasErrors = true;
    }

    if (!confirmPassword) {
      showFieldError(confirmPasswordInput, confirmPasswordError, '❌ Debes confirmar tu contraseña');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Validación 2: Formato de email
    if (!isValidEmail(email)) {
      showFieldError(emailInput, emailError, `❌ El email "${email}" no tiene un formato válido (ejemplo: usuario@dominio.com)`);
      return;
    }

    // Validación 3: Email ya existe
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      showFieldError(emailInput, emailError, `❌ El email "${email}" ya está registrado. Usa otro email o inicia sesión.`);
      return;
    }

    // Validación 4: Fortaleza de contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      showFieldError(passwordInput, passwordError, `❌ ${passwordValidation.message}`);
      return;
    }

    // Validación 5: Coincidencia de contraseñas
    if (password !== confirmPassword) {
      showFieldError(confirmPasswordInput, confirmPasswordError, '❌ Las contraseñas no coinciden. Verifica que sean iguales.');
      return;
    }

    // Deshabilitar botón para evitar doble envío
    submitButton.disabled = true;
    submitButton.textContent = 'Registrando...';

    try {
      // Obtener base de datos
      const db = getDB();

      // Generar nuevo ID (último ID + 1)
      const newId = db.users.length > 0
        ? Math.max(...db.users.map(u => u.id)) + 1
        : 1;

      // Crear nuevo usuario
      const newUser = {
        id: newId,
        name: name,
        nickname: nickname,
        email: email,
        password: password, // En producción, esto debería estar hasheado
        profile: {
          age: null,
          level: '',
          interests: [],
          gender: '',
          city: ''
        },
        favoriteCareers: [],
        testResults: [],
        customLists: []
      };

      // Añadir usuario a la base de datos
      db.users.push(newUser);
      saveDB(db);

      // Establecer el usuario como activo para que pueda completar su perfil
      setActiveUser(newUser);

      // Mostrar mensaje de éxito
      showSuccess('¡Cuenta creada exitosamente! Redirigiendo al perfil...');

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 1500);

    } catch (error) {
      console.error('Error al crear la cuenta:', error);

      // Crear un mensaje de error general en la parte superior si no existe
      let generalErrorContainer = form.querySelector('.general-error-container');
      if (!generalErrorContainer) {
        generalErrorContainer = document.createElement('div');
        generalErrorContainer.className = 'general-error-container';
        generalErrorContainer.style.cssText = `
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
          color: #721c24;
          font-size: 0.95rem;
        `;
        const formLinks = form.querySelector('.form-links');
        form.insertBefore(generalErrorContainer, formLinks);
      }

      generalErrorContainer.textContent = '❌ Ocurrió un error inesperado al crear tu cuenta. Por favor, verifica tu conexión e intenta nuevamente.';
      generalErrorContainer.style.display = 'block';

      // Rehabilitar botón
      submitButton.disabled = false;
      submitButton.textContent = 'Confirmar';
    }
  });
}

/**
 * Valida el formato de un email usando expresión regular
 * @param {string} email - El email a validar
 * @returns {boolean} true si el email es válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida la fortaleza de una contraseña
 * Requisitos: mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número
 * @param {string} password - La contraseña a validar
 * @returns {Object} Objeto con isValid y mensaje de error si aplica
 */
function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push('debe tener al menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('debe contener al menos una letra mayúscula (A-Z)');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('debe contener al menos una letra minúscula (a-z)');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('debe contener al menos un número (0-9)');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      message: `La contraseña no cumple con los requisitos: ${errors.join(', ')}`
    };
  }

  return { isValid: true, message: '' };
}

/**
 * Inicializa el manejo del formulario de recuperación de contraseña
 */
export function initResetPassword() {
  const form = document.querySelector('.form');

  if (!form) {
    console.error('No se encontró el formulario de recuperación de contraseña');
    return;
  }

  // Obtener el campo del formulario
  const emailInput = form.querySelector('input[type="email"]');
  const submitButton = form.querySelector('button[type="submit"]');

  // Función para crear un mensaje de error debajo de un input
  const createErrorElement = (input) => {
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

  // Crear elemento de error para el input
  const emailError = createErrorElement(emailInput);

  // Funciones de ayuda para mostrar mensajes
  const showFieldError = (input, errorElement, message) => {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      markFieldAsInvalid(input);
    }
  };

  const hideFieldError = (errorElement) => {
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  };

  const hideAllErrors = () => {
    hideFieldError(emailError);
  };

  // Añadir indicadores visuales de error en campos
  const markFieldAsInvalid = (input) => {
    input.style.borderColor = '#c33';
    input.style.backgroundColor = '#fff5f5';
  };

  const markFieldAsValid = (input) => {
    input.style.borderColor = '';
    input.style.backgroundColor = '';
  };

  const clearFieldStyles = () => {
    if (emailInput) markFieldAsValid(emailInput);
  };

  // Validación en tiempo real (opcional - mejora UX)
  emailInput?.addEventListener('blur', () => {
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      showFieldError(emailInput, emailError, '❌ El formato del email no es válido');
    } else if (emailInput.value) {
      markFieldAsValid(emailInput);
      hideFieldError(emailError);
    }
  });

  // Manejar el envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpiar mensajes y estilos previos
    hideAllErrors();
    clearFieldStyles();

    // Obtener valor del formulario
    const email = emailInput?.value.trim();

    let hasErrors = false;

    // Validación 1: Campo vacío
    if (!email) {
      showFieldError(emailInput, emailError, '❌ El campo Email es obligatorio');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Validación 2: Formato de email
    if (!isValidEmail(email)) {
      showFieldError(emailInput, emailError, '❌ El formato del email no es válido');
      return;
    }

    // Deshabilitar botón para evitar doble envío
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {
      // Validación 3: Verificar que el email existe en la base de datos
      const user = findUserByEmail(email);

      if (!user) {
        showFieldError(emailInput, emailError, '❌ No existe una cuenta con este email. Verifica el email o regístrate.');
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar';
        return;
      }

      // Simular envío de correo: guardar el email en localStorage
      localStorage.setItem('resetEmailSent', email);

      // Redirigir a la página de confirmación
      window.location.href = 'verification-sent.html';

    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña:', error);

      // Crear un mensaje de error general si no existe
      let generalErrorContainer = form.querySelector('.general-error-container');
      if (!generalErrorContainer) {
        generalErrorContainer = document.createElement('div');
        generalErrorContainer.className = 'general-error-container';
        generalErrorContainer.style.cssText = `
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
          color: #721c24;
          font-size: 0.95rem;
        `;
        const formActions = form.querySelector('.form-actions');
        form.insertBefore(generalErrorContainer, formActions);
      }

      generalErrorContainer.textContent = '❌ Ocurrió un error inesperado. Por favor, verifica tu conexión e intenta nuevamente.';
      generalErrorContainer.style.display = 'block';

      // Rehabilitar botón
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar';
    }
  });
}

/**
 * Inicializa la página de verificación enviada
 */
export function initVerificationSent() {
  // Obtener el email del localStorage
  const resetEmail = localStorage.getItem('resetEmailSent');

  // Buscar el elemento de texto del mensaje
  const messageText = document.querySelector('.message-text');

  if (messageText) {
    if (resetEmail) {
      // Mostrar el email en el mensaje
      messageText.innerHTML = `Se te ha enviado el link para restablecer tu contraseña a <strong>${resetEmail}</strong>.`;

      // Limpiar el indicador de localStorage después de un tiempo
      // (opcional, puedes eliminarlo inmediatamente si prefieres)
      setTimeout(() => {
        localStorage.removeItem('resetEmailSent');
      }, 60000); // Limpiar después de 1 minuto
    } else {
      // Si no hay email en localStorage, mostrar mensaje genérico
      messageText.textContent = 'Se te ha enviado el link para restablecer tu contraseña. Por favor, revisa tu correo.';
    }
  }

  // Opcional: Manejar el enlace "Volver a enviar link"
  const resendLink = document.querySelector('.link-inline');
  if (resendLink) {
    resendLink.addEventListener('click', (e) => {
      // Limpiar el localStorage para permitir un nuevo envío
      localStorage.removeItem('resetEmailSent');
    });
  }
}

/**
 * Inicializa el manejo del formulario de inicio de sesión
 */
export function initLogin() {
  const form = document.querySelector('.form');

  if (!form) {
    console.error('No se encontró el formulario de inicio de sesión');
    return;
  }

  // Obtener los campos del formulario
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const submitButton = form.querySelector('button[type="submit"]');

  // Función para crear un mensaje de error debajo de un input
  const createErrorElement = (input) => {
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

  // Crear elementos de error para cada input
  const emailError = createErrorElement(emailInput);
  const passwordError = createErrorElement(passwordInput);

  // Crear contenedor para mensajes de éxito si no existe
  let successContainer = form.querySelector('.success-message-container');
  if (!successContainer) {
    successContainer = document.createElement('div');
    successContainer.className = 'success-message-container';
    successContainer.style.cssText = `
      display: none;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 20px;
      color: #155724;
      font-size: 0.95rem;
    `;
    // Insertar antes de los form-links
    const formLinks = form.querySelector('.form-links');
    form.insertBefore(successContainer, formLinks);
  }

  // Funciones de ayuda para mostrar mensajes
  const showFieldError = (input, errorElement, message) => {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      markFieldAsInvalid(input);
    }
  };

  const hideFieldError = (errorElement) => {
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  };

  const showSuccess = (message) => {
    successContainer.textContent = message;
    successContainer.style.display = 'block';

    // Scroll al mensaje para que sea visible
    successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const hideAllErrors = () => {
    hideFieldError(emailError);
    hideFieldError(passwordError);
    successContainer.style.display = 'none';
  };

  // Añadir indicadores visuales de error en campos
  const markFieldAsInvalid = (input) => {
    input.style.borderColor = '#c33';
    input.style.backgroundColor = '#fff5f5';
  };

  const markFieldAsValid = (input) => {
    input.style.borderColor = '';
    input.style.backgroundColor = '';
  };

  const clearFieldStyles = () => {
    [emailInput, passwordInput].forEach(input => {
      if (input) markFieldAsValid(input);
    });
  };

  // Validación en tiempo real (opcional - mejora UX)
  emailInput?.addEventListener('blur', () => {
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      showFieldError(emailInput, emailError, '❌ El formato del email no es válido');
    } else if (emailInput.value) {
      markFieldAsValid(emailInput);
      hideFieldError(emailError);
    }
  });

  // Manejar el envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpiar mensajes y estilos previos
    hideAllErrors();
    clearFieldStyles();

    // Obtener valores del formulario
    const email = emailInput?.value.trim();
    const password = passwordInput?.value;

    let hasErrors = false;

    // Validación 1: Campos vacíos
    if (!email) {
      showFieldError(emailInput, emailError, '❌ El campo Email es obligatorio');
      hasErrors = true;
    }

    if (!password) {
      showFieldError(passwordInput, passwordError, '❌ El campo Contraseña es obligatorio');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Validación 2: Formato de email
    if (!isValidEmail(email)) {
      showFieldError(emailInput, emailError, '❌ El formato del email no es válido');
      return;
    }

    // Deshabilitar botón para evitar doble envío
    submitButton.disabled = true;
    submitButton.textContent = 'Iniciando sesión...';

    try {
      // Validación 3: Buscar usuario en la base de datos
      const user = findUserByEmail(email);

      if (!user) {
        showFieldError(emailInput, emailError, '❌ No existe una cuenta con este email. ¿Deseas registrarte?');
        submitButton.disabled = false;
        submitButton.textContent = 'Confirmar';
        return;
      }

      // Validación 4: Verificar contraseña
      if (user.password !== password) {
        showFieldError(passwordInput, passwordError, '❌ La contraseña es incorrecta. ¿Olvidaste tu contraseña?');
        submitButton.disabled = false;
        submitButton.textContent = 'Confirmar';
        return;
      }

      // Login exitoso: guardar usuario activo
      setActiveUser(user);

      // Mostrar mensaje de éxito con el nombre del usuario
      showSuccess(`✅ ¡Inicio de sesión exitoso! Bienvenido/a ${user.name || user.nickname}`);

      // Determinar a dónde redirigir
      const hasCompletedProfile = user.profile && user.profile.age !== null;
      const redirectUrl = hasCompletedProfile
        ? '../Perfil/dashboard-personal.html'
        : 'profile.html';

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);

    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      // Crear un mensaje de error general en la parte superior si no existe
      let generalErrorContainer = form.querySelector('.general-error-container');
      if (!generalErrorContainer) {
        generalErrorContainer = document.createElement('div');
        generalErrorContainer.className = 'general-error-container';
        generalErrorContainer.style.cssText = `
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
          color: #721c24;
          font-size: 0.95rem;
        `;
        const formLinks = form.querySelector('.form-links');
        form.insertBefore(generalErrorContainer, formLinks);
      }

      generalErrorContainer.textContent = '❌ Ocurrió un error inesperado al iniciar sesión. Por favor, verifica tu conexión e intenta nuevamente.';
      generalErrorContainer.style.display = 'block';

      // Rehabilitar botón
      submitButton.disabled = false;
      submitButton.textContent = 'Confirmar';
    }
  });
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Detectar qué página está cargada y ejecutar la función correspondiente
  const currentPage = window.location.pathname;

  if (currentPage.includes('register.html')) {
    initRegister();
  } else if (currentPage.includes('login.html')) {
    initLogin();
  } else if (currentPage.includes('reset-password.html')) {
    initResetPassword();
  } else if (currentPage.includes('verification-sent.html')) {
    initVerificationSent();
  }
});
