// scripts/profile.js
// Gestión del perfil de usuario (completar perfil básico, configuración)

import { getDB, saveDB, setActiveUser, getActiveUser, updateActiveUser } from './utils.js';

/**
 * Inicializa el manejo del formulario de completar perfil básico
 */
export function initCompleteProfile() {
  const form = document.querySelector('.form');

  if (!form) {
    console.error('No se encontró el formulario de perfil');
    return;
  }

  // Verificar que hay un usuario activo
  const user = getActiveUser();
  if (!user) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = 'login.html';
    return;
  }

  // Obtener los campos del formulario
  const nameInput = form.querySelector('input[placeholder="Nombre completo"]');
  const lastNameInput = form.querySelector('input[placeholder="Apellidos"]');
  const birthDateInput = form.querySelector('input[type="date"]');
  const levelInput = form.querySelector('select[name="nivel-estudios"]');
  const emailInput = form.querySelector('input[type="email"]');
  const photoInput = form.querySelector('input[type="file"]');
  const submitButton = form.querySelector('button[type="submit"]');

  // Cargar datos existentes del usuario en el formulario
  if (user.name) {
    nameInput.value = user.name;
  }

  if (user.profile) {
    if (user.profile.lastName) {
      lastNameInput.value = user.profile.lastName;
    }
    if (user.profile.birthDate) {
      birthDateInput.value = user.profile.birthDate;
    }
    if (user.profile.level) {
      levelInput.value = user.profile.level;
    }
  }

  if (user.email) {
    emailInput.value = user.email;
  }

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
  const lastNameError = createErrorElement(lastNameInput);
  const birthDateError = createErrorElement(birthDateInput);
  const levelError = createErrorElement(levelInput);

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
    // Insertar antes de los form-actions
    const formActions = form.querySelector('.form-actions');
    form.insertBefore(successContainer, formActions);
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
    hideFieldError(lastNameError);
    hideFieldError(birthDateError);
    hideFieldError(levelError);
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
    [nameInput, lastNameInput, birthDateInput, levelInput].forEach(input => {
      if (input) markFieldAsValid(input);
    });
  };

  /**
   * Calcula la edad a partir de una fecha de nacimiento
   * @param {string} birthDate - Fecha en formato YYYY-MM-DD
   * @returns {number} La edad en años
   */
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // Validación en tiempo real (opcional - mejora UX)
  birthDateInput?.addEventListener('blur', () => {
    if (birthDateInput.value) {
      const age = calculateAge(birthDateInput.value);
      if (age < 13 || age > 100) {
        showFieldError(birthDateInput, birthDateError, '❌ La edad debe ser un número entre 13 y 100 años');
      } else {
        markFieldAsValid(birthDateInput);
        hideFieldError(birthDateError);
      }
    }
  });

  levelInput?.addEventListener('blur', () => {
    if (levelInput.value) {
      markFieldAsValid(levelInput);
      hideFieldError(levelError);
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
    const lastName = lastNameInput?.value.replace(/\s+/g, ''); // Quitar todos los espacios
    const birthDate = birthDateInput?.value;
    const level = levelInput?.value; // Los valores del select ya no tienen espacios extras

    let hasErrors = false;

    // Validación 1: Campos vacíos obligatorios
    if (!name) {
      showFieldError(nameInput, nameError, '❌ El campo Nombre completo es obligatorio');
      hasErrors = true;
    }

    if (!lastName) {
      showFieldError(lastNameInput, lastNameError, '❌ El campo Apellidos es obligatorio');
      hasErrors = true;
    }

    if (!birthDate) {
      showFieldError(birthDateInput, birthDateError, '❌ El campo Fecha de nacimiento es obligatorio');
      hasErrors = true;
    }

    if (!level) {
      showFieldError(levelInput, levelError, '❌ Debes seleccionar tu nivel educativo');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Validación 2: Validar edad
    const age = calculateAge(birthDate);
    if (age < 13 || age > 100) {
      showFieldError(birthDateInput, birthDateError, '❌ La edad debe ser un número entre 13 y 100 años');
      return;
    }

    // Deshabilitar botón para evitar doble envío
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    try {
      // Obtener base de datos
      const db = getDB();

      // Buscar el usuario en la base de datos
      const userIndex = db.users.findIndex(u => u.id === user.id);

      if (userIndex === -1) {
        throw new Error('Usuario no encontrado en la base de datos');
      }

      // Actualizar el perfil del usuario
      const updatedUser = {
        ...user,
        name: name, // Actualizar el nombre completo
        profile: {
          ...user.profile,
          lastName: lastName,
          birthDate: birthDate,
          age: age,
          level: level
        }
      };

      // Guardar en la base de datos
      db.users[userIndex] = updatedUser;
      saveDB(db);

      // Actualizar el usuario activo en localStorage
      setActiveUser(updatedUser);

      // Mostrar mensaje de éxito
      showSuccess('✅ ¡Perfil completado exitosamente!');

      // Redirigir a success.html después de 1.5 segundos
      setTimeout(() => {
        window.location.href = 'success.html';
      }, 1500);

    } catch (error) {
      console.error('Error al guardar el perfil:', error);

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
        const formActions = form.querySelector('.form-actions');
        form.insertBefore(generalErrorContainer, formActions);
      }

      generalErrorContainer.textContent = '❌ Ocurrió un error inesperado al guardar tu perfil. Por favor, verifica tu conexión e intenta nuevamente.';
      generalErrorContainer.style.display = 'block';

      // Rehabilitar botón
      submitButton.disabled = false;
      submitButton.textContent = 'Confirmar';
    }
  });
}

/**
 * Inicializa la página de éxito después de completar el perfil
 */
export function initProfileSuccess() {
  const user = getActiveUser();

  // Si no hay usuario activo, redirigir a login
  if (!user) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = 'login.html';
    return;
  }

  // Buscar el título de la página para personalizarlo
  const formTitle = document.querySelector('.form-title');
  const successIcon = document.querySelector('.success-icon');

  if (formTitle) {
    // Personalizar el mensaje de éxito con el nombre del usuario
    formTitle.textContent = `¡Bienvenido/a ${user.name}!`;
  }

  // Modificar el texto del subtítulo si existe
  const currentText = formTitle?.textContent || '';
  if (!currentText.includes('Bienvenido')) {
    // Si ya tiene un mensaje, añadir información adicional
    const messageContainer = document.createElement('p');
    messageContainer.style.cssText = `
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 1rem;
      line-height: 1.6;
    `;
    messageContainer.innerHTML = `
      ¡Tu perfil se ha completado exitosamente!<br>
      Ya puedes explorar carreras, hacer tests vocacionales y mucho más.
    `;

    const formCard = document.querySelector('.form-card');
    if (formCard && formTitle) {
      formTitle.insertAdjacentElement('afterend', messageContainer);
    }
  }

  // Cambiar el botón para ir al dashboard
  const buttonContainer = document.querySelector('.form-actions');
  if (buttonContainer) {
    buttonContainer.innerHTML = `
      <a href="../Perfil/dashboard-personal.html" class="btn btn-primary">Ir al Dashboard</a>
      <a href="../inicio.html" class="btn btn-secondary">Explorar la plataforma</a>
    `;
    buttonContainer.style.cssText = 'display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;';
  }

  // Opcional: Mostrar un resumen básico del perfil
  const summaryContainer = document.createElement('div');
  summaryContainer.className = 'profile-summary';
  summaryContainer.style.cssText = `
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin: 20px 0;
    text-align: left;
  `;
  
  summaryContainer.innerHTML = `
    
    <h3 style="margin-bottom: 12px; font-size: 1.1rem; color: #333; text-align: center;">Resumen de tu perfil:</h3>
    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.95rem; text-align: center;">
      <li style="padding: 6px 0; color: #555;"><strong>Nombre:</strong> ${user.name} ${user.profile?.lastName || ''}</li>
      <li style="padding: 6px 0; color: #555;"><strong>Edad:</strong> ${user.profile?.age || 'No especificada'} años</li>
      <li style="padding: 6px 0; color: #555;"><strong>Nivel educativo:</strong> ${user.profile?.level || 'No especificado'}</li>
      <li style="padding: 6px 0; color: #555;"><strong>Email:</strong> ${user.email}</li>
    </ul>
  `;

  const formCard = document.querySelector('.form-card');
  if (formCard && buttonContainer) {
    formCard.insertBefore(summaryContainer, buttonContainer);
  }
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Detectar qué página está cargada y ejecutar la función correspondiente
  const currentPage = window.location.pathname;

  if (currentPage.includes('profile.html')) {
    initCompleteProfile();
  } else if (currentPage.includes('success.html')) {
    initProfileSuccess();
  }
});
