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

/**
 * Inicializa la configuración completa del perfil (todos los tabs)
 */
export function initConfigProfile() {
  // Verificar que hay un usuario activo
  const user = getActiveUser();
  if (!user) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = '../Login/login.html';
    return;
  }

  // Actualizar el título con el nombre del usuario
  const exploreTitle = document.querySelector('.explore-title');
  if (exploreTitle) {
    exploreTitle.textContent = `Hola, ${user.name.split(' ')[0]}`;
  }

  // Actualizar el subtítulo
  const exploreSubtitle = document.querySelector('.explore-subtitle');
  if (exploreSubtitle) {
    exploreSubtitle.textContent = 'Personaliza tu información personal, educativa y preferencias vocacionales';
  }

  // Cargar datos en todos los tabs
  loadPersonalInfo(user);
  loadEducationalInfo(user);
  loadVocationalPreferences(user);
  initPrivacySettings();

  // Inicializar funcionalidad de guardado para cada tab
  setupPersonalInfoSave();
  setupEducationalInfoSave();
  setupVocationalPreferencesSave();

  // Inicializar interacciones adicionales
  setupAchievementsInteraction();
  setupSkillsInteraction();
}

/**
 * Carga la información personal del usuario
 */
function loadPersonalInfo(user) {
  // Iniciales para la foto de perfil
  const currentPhoto = document.querySelector('.current-photo');
  if (currentPhoto && user.name) {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    currentPhoto.textContent = initials;
  }

  // Información básica
  const nombreInput = document.getElementById('nombre');
  if (nombreInput) nombreInput.value = `${user.name} ${user.profile?.lastName || ''}`.trim();

  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.value = user.email || '';
    emailInput.readOnly = true;
  }

  const telefonoInput = document.getElementById('telefono');
  if (telefonoInput) telefonoInput.value = user.profile?.phone || '';

  const fechaNacimientoInput = document.getElementById('fecha-nacimiento');
  if (fechaNacimientoInput) fechaNacimientoInput.value = user.profile?.birthDate || '';

  const generoSelect = document.getElementById('genero');
  if (generoSelect) generoSelect.value = user.profile?.gender || '';

  const ubicacionInput = document.getElementById('ubicacion');
  if (ubicacionInput) ubicacionInput.value = user.profile?.city || '';

  const bioTextarea = document.getElementById('bio');
  if (bioTextarea) bioTextarea.value = user.profile?.bio || '';
}

/**
 * Carga la información educativa del usuario
 */
function loadEducationalInfo(user) {
  const nivelEducativoSelect = document.getElementById('nivel-educativo');
  if (nivelEducativoSelect && user.profile?.level) {
    const levelMap = {
      'Educación Secundaria': 'secundaria',
      'Educación Técnica': 'tecnico',
      'Educación Universitaria (En curso)': 'universitario',
      'Educación Universitaria (Completa)': 'universitario',
      'Posgrado/Maestría': 'postgrado',
      'Doctorado': 'postgrado'
    };
    nivelEducativoSelect.value = levelMap[user.profile.level] || '';
  }

  const gradoActualSelect = document.getElementById('grado-actual');
  if (gradoActualSelect) gradoActualSelect.value = user.profile?.currentGrade || '';

  const institucionInput = document.getElementById('institucion');
  if (institucionInput) institucionInput.value = user.profile?.institution || '';

  const promedioInput = document.getElementById('promedio');
  if (promedioInput) promedioInput.value = user.profile?.gpa || '';

  const anoGraduacionInput = document.getElementById('ano-graduacion');
  if (anoGraduacionInput) {
    const currentYear = new Date().getFullYear();
    anoGraduacionInput.value = user.profile?.graduationYear || currentYear;
  }

  // Cargar intereses académicos guardados
  if (user.profile?.interests && user.profile.interests.length > 0) {
    const interestCheckboxes = document.querySelectorAll('.interest-checkbox');
    interestCheckboxes.forEach(checkbox => {
      const label = checkbox.querySelector('.interest-label');
      const input = checkbox.querySelector('input[type="checkbox"]');
      if (label && input) {
        const interestName = label.textContent.trim();
        if (user.profile.interests.includes(interestName)) {
          input.checked = true;
        }
      }
    });
  }
}

/**
 * Carga las preferencias vocacionales del usuario
 */
function loadVocationalPreferences(user) {
  const modalidadEstudioSelect = document.getElementById('modalidad-estudio');
  if (modalidadEstudioSelect) modalidadEstudioSelect.value = user.profile?.studyModality || '';

  const duracionPreferidaSelect = document.getElementById('duracion-preferida');
  if (duracionPreferidaSelect) duracionPreferidaSelect.value = user.profile?.studyDuration || '';

  const presupuestoSelect = document.getElementById('presupuesto');
  if (presupuestoSelect) presupuestoSelect.value = user.profile?.budget || '';

  if (user.profile?.workEnvironment) {
    const ambienteRadios = document.querySelectorAll('input[name="ambiente"]');
    ambienteRadios.forEach(radio => {
      if (radio.value === user.profile.workEnvironment) {
        radio.checked = true;
      }
    });
  }

  // Cargar habilidades guardadas
  if (user.profile?.desiredSkills && user.profile.desiredSkills.length > 0) {
    const skillCheckboxes = document.querySelectorAll('.skill-tag');
    skillCheckboxes.forEach(skillTag => {
      const input = skillTag.querySelector('input[type="checkbox"]');
      const span = skillTag.querySelector('span');
      if (input && span) {
        const skillName = span.textContent.trim();
        if (user.profile.desiredSkills.includes(skillName)) {
          input.checked = true;
        }
      }
    });
  }
}

/**
 * Configura el guardado de información personal
 */
function setupPersonalInfoSave() {
  const personalTab = document.querySelector('[data-tab="personal"]');
  if (!personalTab) return;

  const form = personalTab.querySelector('.config-form');
  if (!form) return;

  // Función para crear elementos de error
  const createFieldError = (input) => {
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

  const showFieldError = (input, message) => {
    const errorElement = createFieldError(input);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      input.style.borderColor = '#dc3545';
      input.style.backgroundColor = '#fff5f5';
    }
  };

  const hideFieldError = (input) => {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup?.querySelector('.field-error-message');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
    input.style.borderColor = '';
    input.style.backgroundColor = '';
  };

  const hideAllErrors = () => {
    form.querySelectorAll('.field-error-message').forEach(el => el.style.display = 'none');
    form.querySelectorAll('.form-input, .form-select').forEach(input => {
      input.style.borderColor = '';
      input.style.backgroundColor = '';
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores previos
    hideAllErrors();

    // Obtener valores del formulario
    const nombreInput = document.getElementById('nombre');
    const nombreCompleto = nombreInput?.value.trim();
    const telefono = document.getElementById('telefono')?.value.trim();
    const fechaNacimiento = document.getElementById('fecha-nacimiento')?.value;
    const genero = document.getElementById('genero')?.value;
    const ubicacion = document.getElementById('ubicacion')?.value.trim();
    const bio = document.getElementById('bio')?.value.trim();

    let hasErrors = false;

    // Validación: Nombre completo es obligatorio
    if (!nombreCompleto) {
      showFieldError(nombreInput, '❌ El nombre completo es obligatorio');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Separar nombre completo en nombre y apellido
    const nombreParts = nombreCompleto.split(' ');
    const nombre = nombreParts[0];
    const apellido = nombreParts.slice(1).join('').replace(/\s+/g, '');

    // Obtener usuario y base de datos
    const user = getActiveUser();
    const db = getDB();

    // Actualizar usuario
    user.name = nombre;
    user.profile = user.profile || {};
    user.profile.lastName = apellido;
    user.profile.phone = telefono;
    user.profile.birthDate = fechaNacimiento;
    user.profile.gender = genero;
    user.profile.city = ubicacion;
    user.profile.bio = bio;

    // Recalcular edad si cambió la fecha de nacimiento
    if (fechaNacimiento) {
      user.profile.age = calculateAge(fechaNacimiento);
    }

    // Guardar en base de datos
    const userIndex = db.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      db.users[userIndex] = user;
      saveDB(db);
      setActiveUser(user);
    }

    // Mostrar mensaje de éxito
    showSaveSuccess('Información personal actualizada correctamente');
  });

  // Botón cancelar
  const cancelButton = form.querySelector('.btn-secondary');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      hideAllErrors();
      loadPersonalInfo(getActiveUser());
    });
  }
}

/**
 * Configura el guardado de información educativa
 */
function setupEducationalInfoSave() {
  const educativaTab = document.querySelector('[data-tab="educativa"]');
  if (!educativaTab) return;

  const form = educativaTab.querySelector('.config-form');
  if (!form) return;

  // Función para crear elementos de error
  const createFieldError = (input) => {
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

  const showFieldError = (input, message) => {
    const errorElement = createFieldError(input);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      input.style.borderColor = '#dc3545';
      input.style.backgroundColor = '#fff5f5';
    }
  };

  const hideAllErrors = () => {
    form.querySelectorAll('.field-error-message').forEach(el => el.style.display = 'none');
    form.querySelectorAll('.form-input, .form-select').forEach(input => {
      input.style.borderColor = '';
      input.style.backgroundColor = '';
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores previos
    hideAllErrors();

    // Obtener valores del formulario
    const nivelEducativoInput = document.getElementById('nivel-educativo');
    const nivelEducativo = nivelEducativoInput?.value;
    const gradoActual = document.getElementById('grado-actual')?.value;
    const institucionInput = document.getElementById('institucion');
    const institucion = institucionInput?.value.trim();
    const promedio = document.getElementById('promedio')?.value.trim();
    const anoGraduacion = document.getElementById('ano-graduacion')?.value;

    let hasErrors = false;

    // Validación: Nivel educativo es obligatorio
    if (!nivelEducativo) {
      showFieldError(nivelEducativoInput, '❌ Debes seleccionar tu nivel educativo');
      hasErrors = true;
    }

    // Validación: Institución es obligatoria
    if (!institucion) {
      showFieldError(institucionInput, '❌ La institución educativa es obligatoria');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Mapear nivel educativo de vuelta al formato completo
    const levelReverseMap = {
      'secundaria': 'Educación Secundaria',
      'tecnico': 'Educación Técnica',
      'universitario': 'Educación Universitaria (En curso)',
      'postgrado': 'Posgrado/Maestría'
    };

    // Obtener intereses seleccionados
    const interests = [];
    const interestCheckboxes = educativaTab.querySelectorAll('.interest-checkbox input[type="checkbox"]:checked');
    interestCheckboxes.forEach(checkbox => {
      const label = checkbox.closest('.interest-checkbox')?.querySelector('.interest-label');
      if (label) {
        interests.push(label.textContent.trim());
      }
    });

    // Obtener logros del usuario (guardados en el DOM)
    const achievements = [];
    const achievementItems = educativaTab.querySelectorAll('.achievement-item');
    achievementItems.forEach(item => {
      const text = item.querySelector('span')?.textContent.trim();
      if (text) {
        achievements.push(text);
      }
    });

    // Obtener usuario y base de datos
    const user = getActiveUser();
    const db = getDB();

    // Actualizar usuario
    user.profile = user.profile || {};
    user.profile.level = levelReverseMap[nivelEducativo] || nivelEducativo;
    user.profile.currentGrade = gradoActual;
    user.profile.institution = institucion;
    user.profile.gpa = promedio;
    user.profile.graduationYear = anoGraduacion;
    user.profile.interests = interests;
    user.profile.achievements = achievements;

    // Guardar en base de datos
    const userIndex = db.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      db.users[userIndex] = user;
      saveDB(db);
      setActiveUser(user);
    }

    // Mostrar mensaje de éxito
    showSaveSuccess('Información educativa actualizada correctamente');
  });

  // Botón cancelar
  const cancelButton = form.querySelector('.btn-secondary');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      hideAllErrors();
      loadEducationalInfo(getActiveUser());
    });
  }
}

/**
 * Configura el guardado de preferencias vocacionales
 */
function setupVocationalPreferencesSave() {
  const preferenciasTab = document.querySelector('[data-tab="preferencias"]');
  if (!preferenciasTab) return;

  const form = preferenciasTab.querySelector('.config-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const modalidadEstudio = document.getElementById('modalidad-estudio')?.value;
    const duracionPreferida = document.getElementById('duracion-preferida')?.value;
    const presupuesto = document.getElementById('presupuesto')?.value;

    // Obtener ambiente de trabajo seleccionado
    const ambienteRadio = preferenciasTab.querySelector('input[name="ambiente"]:checked');
    const ambiente = ambienteRadio?.value || '';

    // Obtener habilidades seleccionadas (tanto las predefinidas como las personalizadas)
    const skills = [];
    const skillCheckboxes = preferenciasTab.querySelectorAll('.skill-tag input[type="checkbox"]:checked');
    skillCheckboxes.forEach(checkbox => {
      const span = checkbox.nextElementSibling;
      if (span) {
        skills.push(span.textContent.trim());
      }
    });

    // Obtener usuario y base de datos
    const user = getActiveUser();
    const db = getDB();

    // Actualizar usuario
    user.profile = user.profile || {};
    user.profile.studyModality = modalidadEstudio;
    user.profile.studyDuration = duracionPreferida;
    user.profile.budget = presupuesto;
    user.profile.workEnvironment = ambiente;
    user.profile.desiredSkills = skills;

    // Guardar en base de datos
    const userIndex = db.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      db.users[userIndex] = user;
      saveDB(db);
      setActiveUser(user);
    }

    // Mostrar mensaje de éxito
    showSaveSuccess('Preferencias vocacionales actualizadas correctamente');
  });

  // Botón cancelar
  const cancelButton = form.querySelector('.btn-secondary');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      loadVocationalPreferences(getActiveUser());
    });
  }
}

/**
 * Configura la interacción para agregar/eliminar logros y certificaciones
 */
function setupAchievementsInteraction() {
  const educativaTab = document.querySelector('[data-tab="educativa"]');
  if (!educativaTab) return;

  const achievementList = educativaTab.querySelector('.achievement-list');
  const addButton = educativaTab.querySelector('.btn-add');

  if (!achievementList || !addButton) return;

  // Limpiar los items de ejemplo siempre
  achievementList.innerHTML = '';

  // Cargar logros guardados del usuario si existen
  const user = getActiveUser();
  if (user.profile?.achievements && user.profile.achievements.length > 0) {
    // Agregar los logros guardados
    user.profile.achievements.forEach(achievement => {
      addAchievementItem(achievement, achievementList);
    });
  }

  // Función para crear un item de logro
  function addAchievementItem(text, container) {
    const item = document.createElement('div');
    item.className = 'achievement-item';
    item.innerHTML = `
      <i data-lucide="award"></i>
      <span>${text}</span>
      <button type="button" class="btn-icon-remove">
        <i data-lucide="x"></i>
      </button>
    `;

    container.appendChild(item);

    // Reinicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Agregar evento de eliminar
    const removeBtn = item.querySelector('.btn-icon-remove');
    removeBtn.addEventListener('click', () => {
      item.remove();
    });
  }

  // Evento para agregar nuevo logro con modal
  addButton.addEventListener('click', () => {
    showAchievementModal(achievementList, addAchievementItem);
  });
}

/**
 * Muestra el modal para agregar un logro o certificación
 */
function showAchievementModal(achievementList, addAchievementItem) {
  // Crear el modal
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">
          <i data-lucide="award"></i>
          Agregar Logro o Certificación
        </h3>
        <button type="button" class="modal-close">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-description">
          Ingresa el nombre de tu logro, premio o certificación obtenida.
        </p>
        <div class="modal-form-group">
          <label class="modal-label" for="achievement-input">Nombre del logro *</label>
          <input
            type="text"
            id="achievement-input"
            class="modal-input"
            placeholder="Ej: Certificación en Programación Python"
            maxlength="100"
          >
          <div class="modal-error" id="achievement-error">
            Por favor ingresa un nombre válido
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="modal-btn modal-btn-cancel">Cancelar</button>
        <button type="button" class="modal-btn modal-btn-primary">Agregar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Inicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Mostrar modal con animación
  setTimeout(() => modal.classList.add('active'), 10);

  // Referencias a elementos
  const input = modal.querySelector('#achievement-input');
  const error = modal.querySelector('#achievement-error');
  const closeBtn = modal.querySelector('.modal-close');
  const cancelBtn = modal.querySelector('.modal-btn-cancel');
  const addBtn = modal.querySelector('.modal-btn-primary');

  // Función para cerrar modal
  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  };

  // Función para validar
  const validate = () => {
    const value = input.value.trim();
    if (!value) {
      input.classList.add('error');
      error.classList.add('show');
      return false;
    }
    input.classList.remove('error');
    error.classList.remove('show');
    return true;
  };

  // Focus automático
  input.focus();

  // Eventos de cierre
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Limpiar error al escribir
  input.addEventListener('input', () => {
    if (input.value.trim()) {
      input.classList.remove('error');
      error.classList.remove('show');
    }
  });

  // Enter para agregar
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addBtn.click();
    }
  });

  // Agregar logro
  addBtn.addEventListener('click', () => {
    if (validate()) {
      const achievementText = input.value.trim();
      addAchievementItem(achievementText, achievementList);
      closeModal();
    }
  });
}

/**
 * Configura la interacción para agregar habilidades personalizadas
 */
function setupSkillsInteraction() {
  const preferenciasTab = document.querySelector('[data-tab="preferencias"]');
  if (!preferenciasTab) return;

  const skillsContainer = preferenciasTab.querySelector('.skills-tags');
  const addButton = preferenciasTab.querySelector('.btn-add');

  if (!skillsContainer || !addButton) return;

  // Cargar habilidades personalizadas guardadas del usuario
  const user = getActiveUser();
  if (user.profile?.customSkills && user.profile.customSkills.length > 0) {
    user.profile.customSkills.forEach(skill => {
      addCustomSkillTag(skill, skillsContainer);
    });
  }

  // Función para crear un tag de habilidad personalizada
  function addCustomSkillTag(skillName, container) {
    const tag = document.createElement('label');
    tag.className = 'skill-tag custom-skill';
    tag.innerHTML = `
      <input type="checkbox" checked>
      <span>${skillName}</span>
      <button type="button" class="btn-remove-skill" style="margin-left: 8px; background: none; border: none; color: #dc3545; cursor: pointer; padding: 2px 6px; border-radius: 4px; font-size: 14px;">×</button>
    `;

    container.appendChild(tag);

    // Evento para eliminar habilidad personalizada
    const removeBtn = tag.querySelector('.btn-remove-skill');
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      tag.remove();

      // Actualizar el usuario
      const currentUser = getActiveUser();
      if (currentUser.profile?.customSkills) {
        currentUser.profile.customSkills = currentUser.profile.customSkills.filter(s => s !== skillName);
        const db = getDB();
        const userIndex = db.users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          db.users[userIndex] = currentUser;
          saveDB(db);
          setActiveUser(currentUser);
        }
      }
    });
  }

  // Evento para agregar nueva habilidad personalizada con modal
  addButton.addEventListener('click', () => {
    showSkillModal(skillsContainer, addCustomSkillTag);
  });
}

/**
 * Muestra el modal para agregar una habilidad personalizada
 */
function showSkillModal(skillsContainer, addCustomSkillTag) {
  // Crear el modal
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">
          <i data-lucide="sparkles"></i>
          Agregar Habilidad Personalizada
        </h3>
        <button type="button" class="modal-close">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-description">
          Ingresa el nombre de una habilidad que te gustaría desarrollar.
        </p>
        <div class="modal-form-group">
          <label class="modal-label" for="skill-input">Nombre de la habilidad *</label>
          <input
            type="text"
            id="skill-input"
            class="modal-input"
            placeholder="Ej: Diseño UX/UI, Fotografía, etc."
            maxlength="50"
          >
          <div class="modal-error" id="skill-error">
            Por favor ingresa un nombre válido
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="modal-btn modal-btn-cancel">Cancelar</button>
        <button type="button" class="modal-btn modal-btn-primary">Agregar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Inicializar iconos
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Mostrar modal con animación
  setTimeout(() => modal.classList.add('active'), 10);

  // Referencias a elementos
  const input = modal.querySelector('#skill-input');
  const error = modal.querySelector('#skill-error');
  const closeBtn = modal.querySelector('.modal-close');
  const cancelBtn = modal.querySelector('.modal-btn-cancel');
  const addBtn = modal.querySelector('.modal-btn-primary');

  // Función para cerrar modal
  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  };

  // Función para validar
  const validate = () => {
    const value = input.value.trim();
    if (!value) {
      input.classList.add('error');
      error.textContent = 'Por favor ingresa un nombre válido';
      error.classList.add('show');
      return false;
    }

    // Verificar que no exista ya
    const existingSkills = Array.from(skillsContainer.querySelectorAll('.skill-tag span')).map(s => s.textContent.trim());
    if (existingSkills.includes(value)) {
      input.classList.add('error');
      error.textContent = 'Esta habilidad ya existe en la lista';
      error.classList.add('show');
      return false;
    }

    input.classList.remove('error');
    error.classList.remove('show');
    return true;
  };

  // Focus automático
  input.focus();

  // Eventos de cierre
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Limpiar error al escribir
  input.addEventListener('input', () => {
    if (input.value.trim()) {
      input.classList.remove('error');
      error.classList.remove('show');
    }
  });

  // Enter para agregar
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addBtn.click();
    }
  });

  // Agregar habilidad
  addBtn.addEventListener('click', () => {
    if (validate()) {
      const skillName = input.value.trim();
      addCustomSkillTag(skillName, skillsContainer);

      // Guardar en el usuario
      const currentUser = getActiveUser();
      currentUser.profile = currentUser.profile || {};
      currentUser.profile.customSkills = currentUser.profile.customSkills || [];
      currentUser.profile.customSkills.push(skillName);

      const db = getDB();
      const userIndex = db.users.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        db.users[userIndex] = currentUser;
        saveDB(db);
        setActiveUser(currentUser);
      }

      closeModal();
    }
  });
}

/**
 * Función auxiliar para calcular edad desde fecha de nacimiento
 */
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Muestra un mensaje de éxito temporal
 */
function showSaveSuccess(message) {
  // Crear notificación si no existe
  let notification = document.querySelector('.save-success-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'save-success-notification';
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 30px;
      background-color: #28a745;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-size: 0.95rem;
      font-weight: 500;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 12px;
    `;
    document.body.appendChild(notification);
  }

  notification.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  notification.style.display = 'flex';
  notification.style.animation = 'slideInFromRight 0.3s ease-out';

  // Ocultar después de 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutToRight 0.3s ease-out';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 300);
  }, 3000);

  // Agregar estilos de animación si no existen
  if (!document.getElementById('save-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'save-notification-styles';
    style.textContent = `
      @keyframes slideInFromRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutToRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Inicializa la configuración de privacidad del perfil
 */
export function initPrivacySettings() {
  // Verificar que hay un usuario activo
  const user = getActiveUser();
  if (!user) {
    return; // Ya se verificó en initConfigProfile
  }

  // Asegurarse de que el usuario tenga privacySettings (migración para usuarios existentes)
  if (!user.privacySettings) {
    user.privacySettings = {
      profileVisibility: 'public',
      showEmail: false,
      showAge: true,
      showEducationLevel: true,
      showTestResults: false,
      showFavoriteCareers: true,
      allowMessages: true,
      showOnlineStatus: true
    };
    updateActiveUser(user);
  }

  // Obtener todos los toggles de privacidad
  const privacyToggles = document.querySelectorAll('.privacy-item .toggle-switch input[type="checkbox"]');

  // Mapeo de índices de toggle a claves de privacySettings
  // Según el orden en el HTML:
  // 0: Perfil público (profileVisibility)
  // 1: Mostrar carreras favoritas (showFavoriteCareers)
  // 2: Mostrar resultados de tests (showTestResults)
  // 3: Permitir mensajes directos (allowMessages)
  const toggleMapping = [
    { key: 'profileVisibility', type: 'boolean', label: 'Perfil público' },
    { key: 'showFavoriteCareers', type: 'boolean', label: 'Carreras favoritas' },
    { key: 'showTestResults', type: 'boolean', label: 'Resultados de tests' },
    { key: 'allowMessages', type: 'boolean', label: 'Mensajes directos' }
  ];

  // Función para convertir profileVisibility a booleano para el toggle
  const isProfilePublic = (visibility) => {
    return visibility === 'public';
  };

  // Función para convertir booleano del toggle a profileVisibility
  const getVisibilityFromBoolean = (isPublic) => {
    return isPublic ? 'public' : 'private';
  };

  // Cargar las configuraciones actuales en los toggles
  privacyToggles.forEach((toggle, index) => {
    const mapping = toggleMapping[index];
    if (!mapping) return;

    // Cargar el valor actual
    if (mapping.key === 'profileVisibility') {
      toggle.checked = isProfilePublic(user.privacySettings.profileVisibility);
    } else {
      toggle.checked = user.privacySettings[mapping.key];
    }
  });

  // Crear elemento de notificación toast
  let toastNotification = document.querySelector('.privacy-toast-notification');
  if (!toastNotification) {
    toastNotification = document.createElement('div');
    toastNotification.className = 'privacy-toast-notification';
    toastNotification.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background-color: #28a745;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-size: 0.95rem;
      font-weight: 500;
      display: none;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      max-width: 350px;
    `;
    document.body.appendChild(toastNotification);

    // Añadir animación CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Función para mostrar la notificación toast
  const showToast = (message, settingName) => {
    toastNotification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <div>
          <div style="font-weight: 600; margin-bottom: 2px;">${message}</div>
          <div style="font-size: 0.85rem; opacity: 0.9;">${settingName}</div>
        </div>
      </div>
    `;
    toastNotification.style.display = 'block';
    toastNotification.style.animation = 'slideIn 0.3s ease-out';

    // Ocultar después de 3 segundos
    setTimeout(() => {
      toastNotification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        toastNotification.style.display = 'none';
      }, 300);
    }, 3000);
  };

  // Añadir event listeners a cada toggle
  privacyToggles.forEach((toggle, index) => {
    const mapping = toggleMapping[index];
    if (!mapping) return;

    toggle.addEventListener('change', () => {
      // Obtener base de datos y usuario actualizado
      const db = getDB();
      const currentUser = getActiveUser();

      // Actualizar la configuración específica
      if (mapping.key === 'profileVisibility') {
        currentUser.privacySettings.profileVisibility = getVisibilityFromBoolean(toggle.checked);
      } else {
        currentUser.privacySettings[mapping.key] = toggle.checked;
      }

      // Guardar en la base de datos
      const userIndex = db.users.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        db.users[userIndex] = currentUser;
        saveDB(db);
        setActiveUser(currentUser);
      }

      // Mostrar notificación de guardado
      const status = toggle.checked ? 'activada' : 'desactivada';
      showToast(`Configuración guardada`, `${mapping.label} ${status}`);

      // Añadir efecto visual al toggle modificado
      const toggleSlider = toggle.nextElementSibling;
      if (toggleSlider) {
        toggleSlider.style.transition = 'all 0.3s ease';
        toggleSlider.style.transform = 'scale(1.05)';
        setTimeout(() => {
          toggleSlider.style.transform = 'scale(1)';
        }, 300);
      }
    });
  });

  // Manejar cambio de contraseña con validación mejorada
  const privacyTabContent = document.querySelector('[data-tab="privacidad"]');
  if (privacyTabContent) {
    const passwordForm = privacyTabContent.querySelector('.config-form');
    const currentPasswordInput = document.getElementById('password-actual');
    const newPasswordInput = document.getElementById('password-nueva');
    const confirmPasswordInput = document.getElementById('password-confirmar');

    // Función para crear elementos de error para contraseñas
    const createPasswordError = (input) => {
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

    const showPasswordError = (input, message) => {
      const errorElement = createPasswordError(input);
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.style.borderColor = '#dc3545';
        input.style.backgroundColor = '#fff5f5';
      }
    };

    const hidePasswordError = (input) => {
      const formGroup = input.closest('.form-group');
      const errorElement = formGroup?.querySelector('.field-error-message');
      if (errorElement) {
        errorElement.style.display = 'none';
      }
      input.style.borderColor = '';
      input.style.backgroundColor = '';
    };

    const hideAllPasswordErrors = () => {
      [currentPasswordInput, newPasswordInput, confirmPasswordInput].forEach(input => {
        if (input) hidePasswordError(input);
      });
    };

    // Solo interceptar el submit si estamos en la pestaña de privacidad
    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => {
        const privacyTab = document.getElementById('tab-privacidad');
        if (!privacyTab || !privacyTab.checked) {
          return; // No interceptar si no estamos en la pestaña de privacidad
        }

        e.preventDefault();

        // Limpiar errores previos
        hideAllPasswordErrors();

        const currentPassword = currentPasswordInput?.value;
        const newPassword = newPasswordInput?.value;
        const confirmPassword = confirmPasswordInput?.value;

        // Si no hay valores, no hacer nada
        if (!currentPassword && !newPassword && !confirmPassword) {
          showToast('Sin cambios en la contraseña', 'No se realizaron modificaciones');
          return;
        }

        let hasErrors = false;

        // Validación 1: Si hay algún valor, todos deben estar llenos
        if (currentPassword || newPassword || confirmPassword) {
          if (!currentPassword) {
            showPasswordError(currentPasswordInput, '❌ Debes ingresar tu contraseña actual');
            hasErrors = true;
          }
          if (!newPassword) {
            showPasswordError(newPasswordInput, '❌ Debes ingresar una nueva contraseña');
            hasErrors = true;
          }
          if (!confirmPassword) {
            showPasswordError(confirmPasswordInput, '❌ Debes confirmar la nueva contraseña');
            hasErrors = true;
          }
        }

        if (hasErrors) {
          return;
        }

        // Validación 2: Verificar contraseña actual ANTES de continuar
        const currentUser = getActiveUser();
        if (currentPassword && currentUser.password !== currentPassword) {
          showPasswordError(currentPasswordInput, '❌ La contraseña actual es incorrecta');
          return;
        }

        // Validación 3: Las contraseñas nuevas deben coincidir
        if (newPassword !== confirmPassword) {
          showPasswordError(confirmPasswordInput, '❌ Las contraseñas nuevas no coinciden');
          return;
        }

        // Validación 4: Fortaleza de la nueva contraseña
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
          showPasswordError(newPasswordInput, `❌ ${passwordValidation.message}`);
          return;
        }

        // Actualizar contraseña
        const db = getDB();
        currentUser.password = newPassword;
        const userIndex = db.users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          db.users[userIndex] = currentUser;
          saveDB(db);
          setActiveUser(currentUser);
        }

        // Limpiar campos
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';

        showToast('Contraseña actualizada', 'Tu contraseña se cambió exitosamente');
      });
    }
  }

  // Manejar botón de descargar datos
  const downloadButton = document.querySelector('.btn-danger-secondary');
  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
      const currentUser = getActiveUser();
      const userData = {
        name: currentUser.name,
        email: currentUser.email,
        profile: currentUser.profile,
        privacySettings: currentUser.privacySettings,
        favoriteCareers: currentUser.favoriteCareers,
        testResults: currentUser.testResults,
        customLists: currentUser.customLists
      };

      // Crear archivo JSON para descargar
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vocatio-datos-${currentUser.id}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      showToast('Datos descargados', 'Tu información se ha exportado exitosamente');
    });
  }

  // Manejar botón de eliminar cuenta
  const deleteButton = document.querySelector('.btn-danger');
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      const confirmDelete = confirm(
        '¿Estás seguro de que deseas eliminar tu cuenta?\n\n' +
        'Esta acción es PERMANENTE e IRREVERSIBLE.\n' +
        'Se eliminarán todos tus datos, incluidos:\n' +
        '- Perfil personal\n' +
        '- Resultados de tests vocacionales\n' +
        '- Carreras favoritas\n' +
        '- Historial de actividad\n\n' +
        'Haz clic en "Aceptar" para confirmar la eliminación.'
      );

      if (!confirmDelete) return;

      const doubleConfirm = confirm(
        '¡ÚLTIMA CONFIRMACIÓN!\n\n' +
        'Tu cuenta será eliminada de forma permanente.\n' +
        '¿Estás completamente seguro?'
      );

      if (!doubleConfirm) return;

      // Eliminar usuario de la base de datos
      const currentUser = getActiveUser();
      const db = getDB();
      db.users = db.users.filter(u => u.id !== currentUser.id);
      saveDB(db);

      // Cerrar sesión y redirigir
      localStorage.removeItem('activeUser');
      alert('Tu cuenta ha sido eliminada exitosamente. Lamentamos verte partir.');
      window.location.href = '../../index.html';
    });
  }
}

/**
 * Valida la fortaleza de una contraseña
 * @param {string} password - La contraseña a validar
 * @returns {Object} Objeto con isValid y mensaje de error si aplica
 */
function validatePassword(password) {
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
 * Inicializa la página de perfil principal (perfil-seccion.html)
 */
export function initProfileSection() {
  // Verificar que hay un usuario activo
  const user = getActiveUser();
  if (!user) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = '../Login/login.html';
    return;
  }

  // Actualizar avatar con iniciales
  const profileAvatar = document.querySelector('.profile-avatar');
  if (profileAvatar && user.name) {
    const nameParts = user.name.split(' ');
    const lastName = user.profile?.lastName || '';
    let initials = nameParts[0][0].toUpperCase();
    if (lastName) {
      initials += lastName[0].toUpperCase();
    } else if (nameParts.length > 1) {
      initials += nameParts[1][0].toUpperCase();
    }
    profileAvatar.textContent = initials;
  }

  // Actualizar nombre de bienvenida
  const profileName = document.querySelector('.profile-name');
  if (profileName && user.name) {
    const fullName = user.profile?.lastName
      ? `${user.name} ${user.profile.lastName}`
      : user.name;
    profileName.textContent = `Bienvenid@, ${fullName}`;
  }

  // Calcular y mostrar porcentaje de perfil completado
  const profileCompletion = calculateProfileCompletion(user);
  const profileStatValue = document.querySelector('.profile-stat-value');
  if (profileStatValue) {
    profileStatValue.textContent = `${profileCompletion}%`;
  }

  // Actualizar estadísticas adicionales
  updateProfileStats(user);
}

/**
 * Calcula el porcentaje de completitud del perfil
 * @param {Object} user - El usuario
 * @returns {number} Porcentaje de 0 a 100
 */
function calculateProfileCompletion(user) {
  let completed = 0;
  let total = 0;

  // Campos obligatorios básicos (siempre completados en registro)
  // Nombre - 10%
  if (user.name) {
    completed += 10;
  }
  total += 10;

  // Email - 10%
  if (user.email) {
    completed += 10;
  }
  total += 10;

  // Perfil básico completado - 20%
  if (user.profile?.lastName) completed += 5;
  total += 5;

  if (user.profile?.birthDate) completed += 5;
  total += 5;

  if (user.profile?.level) completed += 10;
  total += 10;

  // Información personal adicional - 15%
  if (user.profile?.phone) completed += 5;
  total += 5;

  if (user.profile?.gender) completed += 5;
  total += 5;

  if (user.profile?.city) completed += 5;
  total += 5;

  // Biografía - 5%
  if (user.profile?.bio) completed += 5;
  total += 5;

  // Información educativa - 20%
  if (user.profile?.institution) completed += 5;
  total += 5;

  if (user.profile?.currentGrade) completed += 3;
  total += 3;

  if (user.profile?.gpa) completed += 3;
  total += 3;

  if (user.profile?.graduationYear) completed += 3;
  total += 3;

  if (user.profile?.interests && user.profile.interests.length > 0) completed += 6;
  total += 6;

  // Preferencias vocacionales - 20%
  if (user.profile?.studyModality) completed += 5;
  total += 5;

  if (user.profile?.studyDuration) completed += 5;
  total += 5;

  if (user.profile?.workEnvironment) completed += 5;
  total += 5;

  if (user.profile?.desiredSkills && user.profile.desiredSkills.length > 0) completed += 5;
  total += 5;

  // Calcular porcentaje
  const percentage = Math.round((completed / total) * 100);
  return percentage;
}

/**
 * Actualiza las estadísticas del perfil
 * @param {Object} user - El usuario
 */
function updateProfileStats(user) {
  // Tests realizados
  const testsCount = user.testResults?.length || 0;
  const testsStatValue = document.querySelectorAll('.profile-stat-value')[1];
  if (testsStatValue) {
    testsStatValue.textContent = testsCount;
  }

  // Carreras exploradas (favoritas + listas personalizadas)
  const favoritesCount = user.favoriteCareers?.length || 0;
  const customListsCount = user.customLists?.reduce((acc, list) => acc + (list.careers?.length || 0), 0) || 0;
  const totalCareers = favoritesCount + customListsCount;

  const careersStatValue = document.querySelectorAll('.profile-stat-value')[2];
  if (careersStatValue) {
    careersStatValue.textContent = totalCareers;
  }
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Detectar qué página está cargada y ejecutar la función correspondiente
  const currentPage = window.location.pathname;

  if (currentPage.includes('profile.html') && !currentPage.includes('configuracion')) {
    initCompleteProfile();
  } else if (currentPage.includes('success.html')) {
    initProfileSuccess();
  } else if (currentPage.includes('configuracion-perfil.html')) {
    initConfigProfile();
  } else if (currentPage.includes('perfil-seccion.html')) {
    initProfileSection();
  }
});
