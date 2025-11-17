// scripts/profile.js
// Gestión del perfil de usuario - Inspirado en patrones educativos
// Incluye: completar perfil básico, configuración completa, privacidad

import { getDB, saveDB, setActiveUser, getActiveUser, updateActiveUser } from './utils.js';

// ============================================
// FUNCIONES AUXILIARES REUTILIZABLES
// ============================================

/**
 * Crea un elemento de error debajo de un input
 * REUTILIZABLE en todos los formularios de perfil
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
 * Calcula la edad a partir de una fecha de nacimiento
 * Patrón simple y reutilizable
 */
const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesDif = hoy.getMonth() - nacimiento.getMonth();

  if (mesDif < 0 || (mesDif === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
};

/**
 * Valida fortaleza de contraseña
 * Requisitos: 8+ caracteres, 1 mayúscula, 1 número
 */
const validarPassword = (password) => {
  if (password.length < 8) {
    return { valido: false, mensaje: 'La contraseña debe tener al menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valido: false, mensaje: 'La contraseña debe contener al menos una mayúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { valido: false, mensaje: 'La contraseña debe contener al menos un número' };
  }
  return { valido: true, mensaje: '' };
};

/**
 * Muestra una notificación toast de éxito
 * Usada para confirmar que se guardaron cambios
 */
const mostrarToast = (titulo, subtitulo) => {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
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
      display: none;
      animation: slideInRight 0.3s ease-out;
    `;
    document.body.appendChild(toast);

    // Añadir estilos de animación
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(400px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  toast.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <div style="margin-left: 12px;">
      <div style="font-weight: 600;">${titulo}</div>
      <div style="font-size: 0.85rem; opacity: 0.9;">${subtitulo}</div>
    </div>
  `;

  toast.style.display = 'flex';
  toast.style.alignItems = 'center';

  // Ocultar después de 3 segundos
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, 3000);
};

/**
 * Crea un modal genérico reutilizable
 * Usado para agregar logros, habilidades, etc.
 */
const crearModal = (titulo, icono, descripcion, placeholder, maxLength) => {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">
          <i data-lucide="${icono}"></i>
          ${titulo}
        </h3>
        <button type="button" class="modal-close">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-description">${descripcion}</p>
        <div class="modal-form-group">
          <input
            type="text"
            class="modal-input"
            placeholder="${placeholder}"
            maxlength="${maxLength}"
          >
          <div class="modal-error">Por favor ingresa un valor válido</div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="modal-btn modal-btn-cancel">Cancelar</button>
        <button type="button" class="modal-btn modal-btn-primary">Agregar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Inicializar iconos de Lucide si está disponible
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Mostrar con animación
  setTimeout(() => modal.classList.add('active'), 10);

  return modal;
};

// ============================================
// 1. COMPLETAR PERFIL BÁSICO
// ============================================

/**
 * Inicializa el formulario de completar perfil básico
 *
 * Flujo:
 * 1. Verificar que hay usuario activo
 * 2. Cargar datos existentes en el formulario
 * 3. Validar al enviar
 * 4. Guardar perfil básico en la DB
 * 5. Redirigir a success.html
 */
export function initCompleteProfile() {
  const form = document.querySelector('.form');
  if (!form) return;

  // Verificar autenticación
  const usuario = getActiveUser();
  if (!usuario) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = 'login.html';
    return;
  }

  // Obtener campos del formulario
  const nameInput = form.querySelector('input[placeholder="Nombre completo"]');
  const lastNameInput = form.querySelector('input[placeholder="Apellidos"]');
  const birthDateInput = form.querySelector('input[type="date"]');
  const levelInput = form.querySelector('select[name="nivel-estudios"]');
  const emailInput = form.querySelector('input[type="email"]');
  const submitButton = form.querySelector('button[type="submit"]');

  // Cargar datos existentes
  if (usuario.name) nameInput.value = usuario.name;
  if (usuario.profile?.lastName) lastNameInput.value = usuario.profile.lastName;
  if (usuario.profile?.birthDate) birthDateInput.value = usuario.profile.birthDate;
  if (usuario.profile?.level) levelInput.value = usuario.profile.level;
  if (usuario.email) emailInput.value = usuario.email;

  // Crear elementos de error
  const errores = {
    name: crearElementoError(nameInput),
    lastName: crearElementoError(lastNameInput),
    birthDate: crearElementoError(birthDateInput),
    level: crearElementoError(levelInput)
  };

  // Validación en tiempo real - edad
  birthDateInput?.addEventListener('blur', () => {
    if (birthDateInput.value) {
      const edad = calcularEdad(birthDateInput.value);
      if (edad < 13 || edad > 100) {
        mostrarError(birthDateInput, errores.birthDate, '❌ La edad debe estar entre 13 y 100 años');
      } else {
        limpiarEstilos(birthDateInput);
        ocultarError(errores.birthDate);
      }
    }
  });

  // Manejar envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores previos
    Object.values(errores).forEach(ocultarError);
    [nameInput, lastNameInput, birthDateInput, levelInput].forEach(limpiarEstilos);

    // Obtener valores
    const name = nameInput?.value.trim();
    const lastName = lastNameInput?.value.replace(/\s+/g, '');
    const birthDate = birthDateInput?.value;
    const level = levelInput?.value;

    let hayErrores = false;

    // Validaciones
    if (!name) {
      mostrarError(nameInput, errores.name, '❌ El nombre completo es obligatorio');
      hayErrores = true;
    }
    if (!lastName) {
      mostrarError(lastNameInput, errores.lastName, '❌ Los apellidos son obligatorios');
      hayErrores = true;
    }
    if (!birthDate) {
      mostrarError(birthDateInput, errores.birthDate, '❌ La fecha de nacimiento es obligatoria');
      hayErrores = true;
    }
    if (!level) {
      mostrarError(levelInput, errores.level, '❌ Debes seleccionar tu nivel educativo');
      hayErrores = true;
    }

    if (hayErrores) return;

    // Validar edad
    const edad = calcularEdad(birthDate);
    if (edad < 13 || edad > 100) {
      mostrarError(birthDateInput, errores.birthDate, '❌ La edad debe estar entre 13 y 100 años');
      return;
    }

    // Deshabilitar botón
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    try {
      const db = getDB();
      const userIndex = db.users.findIndex(u => u.id === usuario.id);

      if (userIndex === -1) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar perfil
      const usuarioActualizado = {
        ...usuario,
        name: name,
        profile: {
          ...usuario.profile,
          lastName: lastName,
          birthDate: birthDate,
          age: edad,
          level: level
        }
      };

      // Guardar en DB
      db.users[userIndex] = usuarioActualizado;
      saveDB(db);
      setActiveUser(usuarioActualizado);

      // Redirigir
      setTimeout(() => {
        window.location.href = 'success.html';
      }, 500);

    } catch (error) {
      console.error('Error al guardar:', error);
      alert('❌ Ocurrió un error al guardar tu perfil. Intenta nuevamente.');
      submitButton.disabled = false;
      submitButton.textContent = 'Confirmar';
    }
  });
}

// ============================================
// 2. PÁGINA DE ÉXITO
// ============================================

/**
 * Inicializa la página de éxito después de completar el perfil
 *
 * Muestra resumen del perfil y botones de navegación
 */
export function initProfileSuccess() {
  const usuario = getActiveUser();

  if (!usuario) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = 'login.html';
    return;
  }

  // Personalizar título
  const formTitle = document.querySelector('.form-title');
  if (formTitle) {
    formTitle.textContent = `¡Bienvenido/a ${usuario.name}!`;
  }

  // Crear resumen del perfil
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
    <h3 style="margin-bottom: 12px; font-size: 1.1rem; color: #333; text-align: center;">
      Resumen de tu perfil:
    </h3>
    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.95rem; text-align: center;">
      <li style="padding: 6px 0; color: #555;">
        <strong>Nombre:</strong> ${usuario.name} ${usuario.profile?.lastName || ''}
      </li>
      <li style="padding: 6px 0; color: #555;">
        <strong>Edad:</strong> ${usuario.profile?.age || 'No especificada'} años
      </li>
      <li style="padding: 6px 0; color: #555;">
        <strong>Nivel educativo:</strong> ${usuario.profile?.level || 'No especificado'}
      </li>
      <li style="padding: 6px 0; color: #555;">
        <strong>Email:</strong> ${usuario.email}
      </li>
    </ul>
  `;

  // Insertar resumen
  const formCard = document.querySelector('.form-card');
  const buttonContainer = document.querySelector('.form-actions');
  if (formCard && buttonContainer) {
    formCard.insertBefore(summaryContainer, buttonContainer);

    // Actualizar botones
    buttonContainer.innerHTML = `
      <a href="../Perfil/dashboard-personal.html" class="btn btn-primary">Ir al Dashboard</a>
      <a href="../inicio.html" class="btn btn-secondary">Explorar la plataforma</a>
    `;
    buttonContainer.style.cssText = 'display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;';
  }
}

// ============================================
// 3. CONFIGURACIÓN COMPLETA DEL PERFIL
// ============================================

/**
 * Inicializa la configuración completa del perfil (todos los tabs)
 *
 * Incluye: Personal, Educativa, Preferencias, Privacidad
 */
export function initConfigProfile() {
  const usuario = getActiveUser();
  if (!usuario) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = '../Login/login.html';
    return;
  }

  // Actualizar título de bienvenida
  const exploreTitle = document.querySelector('.explore-title');
  if (exploreTitle) {
    exploreTitle.textContent = `Hola, ${usuario.name.split(' ')[0]}`;
  }

  // Cargar datos en todos los tabs
  cargarInformacionPersonal(usuario);
  cargarInformacionEducativa(usuario);
  cargarPreferenciasVocacionales(usuario);
  configurarPrivacidad(usuario);

  // Configurar guardado para cada tab
  configurarGuardadoPersonal();
  configurarGuardadoEducativo();
  configurarGuardadoPreferencias();

  // Configurar interacciones especiales
  configurarLogros();
  configurarHabilidades();
}

/**
 * Carga información personal del usuario en el formulario
 */
function cargarInformacionPersonal(usuario) {
  // Avatar con iniciales
  const currentPhoto = document.querySelector('.current-photo');
  if (currentPhoto && usuario.name) {
    const iniciales = usuario.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    currentPhoto.textContent = iniciales;
  }

  // Campos del formulario
  const campos = {
    nombre: `${usuario.name} ${usuario.profile?.lastName || ''}`.trim(),
    email: usuario.email || '',
    telefono: usuario.profile?.phone || '',
    'fecha-nacimiento': usuario.profile?.birthDate || '',
    genero: usuario.profile?.gender || '',
    ubicacion: usuario.profile?.city || '',
    bio: usuario.profile?.bio || ''
  };

  Object.entries(campos).forEach(([id, valor]) => {
    const input = document.getElementById(id);
    if (input) {
      input.value = valor;
      if (id === 'email') input.readOnly = true;
    }
  });
}

/**
 * Carga información educativa del usuario
 */
function cargarInformacionEducativa(usuario) {
  // Mapeo de niveles educativos
  const levelMap = {
    'Educación Secundaria': 'secundaria',
    'Educación Técnica': 'tecnico',
    'Educación Universitaria (En curso)': 'universitario',
    'Educación Universitaria (Completa)': 'universitario',
    'Posgrado/Maestría': 'postgrado',
    'Doctorado': 'postgrado'
  };

  const campos = {
    'nivel-educativo': levelMap[usuario.profile?.level] || '',
    'grado-actual': usuario.profile?.currentGrade || '',
    institucion: usuario.profile?.institution || '',
    promedio: usuario.profile?.gpa || '',
    'ano-graduacion': usuario.profile?.graduationYear || new Date().getFullYear()
  };

  Object.entries(campos).forEach(([id, valor]) => {
    const input = document.getElementById(id);
    if (input) input.value = valor;
  });

  // Cargar intereses
  if (usuario.profile?.interests?.length > 0) {
    document.querySelectorAll('.interest-checkbox').forEach(checkbox => {
      const label = checkbox.querySelector('.interest-label');
      const input = checkbox.querySelector('input[type="checkbox"]');
      if (label && input && usuario.profile.interests.includes(label.textContent.trim())) {
        input.checked = true;
      }
    });
  }

  // Cargar logros guardados
  const achievementList = document.querySelector('.achievement-list');
  if (achievementList) {
    achievementList.innerHTML = '';
    if (usuario.profile?.achievements?.length > 0) {
      usuario.profile.achievements.forEach(logro => {
        agregarLogroAlDOM(logro, achievementList);
      });
    }
  }
}

/**
 * Carga preferencias vocacionales del usuario
 */
function cargarPreferenciasVocacionales(usuario) {
  const campos = {
    'modalidad-estudio': usuario.profile?.studyModality || '',
    'duracion-preferida': usuario.profile?.studyDuration || '',
    presupuesto: usuario.profile?.budget || ''
  };

  Object.entries(campos).forEach(([id, valor]) => {
    const input = document.getElementById(id);
    if (input) input.value = valor;
  });

  // Ambiente de trabajo
  if (usuario.profile?.workEnvironment) {
    const radio = document.querySelector(`input[name="ambiente"][value="${usuario.profile.workEnvironment}"]`);
    if (radio) radio.checked = true;
  }

  // Habilidades predefinidas
  if (usuario.profile?.desiredSkills?.length > 0) {
    document.querySelectorAll('.skill-tag').forEach(skillTag => {
      const input = skillTag.querySelector('input[type="checkbox"]');
      const span = skillTag.querySelector('span');
      if (input && span && usuario.profile.desiredSkills.includes(span.textContent.trim())) {
        input.checked = true;
      }
    });
  }

  // Habilidades personalizadas
  const skillsContainer = document.querySelector('.skills-tags');
  if (skillsContainer && usuario.profile?.customSkills?.length > 0) {
    usuario.profile.customSkills.forEach(habilidad => {
      agregarHabilidadAlDOM(habilidad, skillsContainer);
    });
  }
}

/**
 * Configura el guardado de información personal
 */
function configurarGuardadoPersonal() {
  const personalTab = document.querySelector('[data-tab="personal"]');
  if (!personalTab) return;

  const form = personalTab.querySelector('.config-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombreInput = document.getElementById('nombre');
    const nombreCompleto = nombreInput?.value.trim();

    if (!nombreCompleto) {
      const errorElement = crearElementoError(nombreInput);
      mostrarError(nombreInput, errorElement, '❌ El nombre completo es obligatorio');
      return;
    }

    // Separar nombre y apellido
    const nombreParts = nombreCompleto.split(' ');
    const nombre = nombreParts[0];
    const apellido = nombreParts.slice(1).join('').replace(/\s+/g, '');

    // Obtener otros campos
    const telefono = document.getElementById('telefono')?.value.trim();
    const fechaNacimiento = document.getElementById('fecha-nacimiento')?.value;
    const genero = document.getElementById('genero')?.value;
    const ubicacion = document.getElementById('ubicacion')?.value.trim();
    const bio = document.getElementById('bio')?.value.trim();

    // Actualizar usuario
    const usuario = getActiveUser();
    usuario.name = nombre;
    usuario.profile = usuario.profile || {};
    usuario.profile.lastName = apellido;
    usuario.profile.phone = telefono;
    usuario.profile.birthDate = fechaNacimiento;
    usuario.profile.gender = genero;
    usuario.profile.city = ubicacion;
    usuario.profile.bio = bio;

    if (fechaNacimiento) {
      usuario.profile.age = calcularEdad(fechaNacimiento);
    }

    // Guardar
    updateActiveUser(usuario);
    mostrarToast('Cambios guardados', 'Información personal actualizada');
  });
}

/**
 * Configura el guardado de información educativa
 */
function configurarGuardadoEducativo() {
  const educativaTab = document.querySelector('[data-tab="educativa"]');
  if (!educativaTab) return;

  const form = educativaTab.querySelector('.config-form');
  if (!form) return;

  // Obtener campos
  const nivelEducativoInput = document.getElementById('nivel-educativo');
  const institucionInput = document.getElementById('institucion');

  // Crear elementos de error
  const errores = {
    nivel: crearElementoError(nivelEducativoInput),
    institucion: crearElementoError(institucionInput)
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores previos
    Object.values(errores).forEach(ocultarError);
    [nivelEducativoInput, institucionInput].forEach(limpiarEstilos);

    const nivelEducativo = nivelEducativoInput?.value;
    const institucion = institucionInput?.value.trim();

    let hayErrores = false;

    // Validación 1: Nivel educativo
    if (!nivelEducativo) {
      mostrarError(nivelEducativoInput, errores.nivel, '❌ Debes seleccionar tu nivel educativo');
      hayErrores = true;
    }

    // Validación 2: Institución
    if (!institucion) {
      mostrarError(institucionInput, errores.institucion, '❌ La institución educativa es obligatoria');
      hayErrores = true;
    }

    if (hayErrores) return;

    // Mapeo inverso de niveles
    const levelReverseMap = {
      'secundaria': 'Educación Secundaria',
      'tecnico': 'Educación Técnica',
      'universitario': 'Educación Universitaria (En curso)',
      'postgrado': 'Posgrado/Maestría'
    };

    // Obtener intereses seleccionados
    const intereses = [];
    educativaTab.querySelectorAll('.interest-checkbox input:checked').forEach(checkbox => {
      const label = checkbox.closest('.interest-checkbox')?.querySelector('.interest-label');
      if (label) intereses.push(label.textContent.trim());
    });

    // Obtener logros
    const logros = [];
    educativaTab.querySelectorAll('.achievement-item span').forEach(span => {
      logros.push(span.textContent.trim());
    });

    // Actualizar usuario
    const usuario = getActiveUser();
    usuario.profile = usuario.profile || {};
    usuario.profile.level = levelReverseMap[nivelEducativo] || nivelEducativo;
    usuario.profile.currentGrade = document.getElementById('grado-actual')?.value;
    usuario.profile.institution = institucion;
    usuario.profile.gpa = document.getElementById('promedio')?.value.trim();
    usuario.profile.graduationYear = document.getElementById('ano-graduacion')?.value;
    usuario.profile.interests = intereses;
    usuario.profile.achievements = logros;

    // Guardar
    updateActiveUser(usuario);
    mostrarToast('Cambios guardados', 'Información educativa actualizada');
  });
}

/**
 * Configura el guardado de preferencias vocacionales
 */
function configurarGuardadoPreferencias() {
  const preferenciasTab = document.querySelector('[data-tab="preferencias"]');
  if (!preferenciasTab) return;

  const form = preferenciasTab.querySelector('.config-form');
  if (!form) return;

  // Obtener campos
  const modalidadInput = document.getElementById('modalidad-estudio');
  const duracionInput = document.getElementById('duracion-preferida');
  const presupuestoInput = document.getElementById('presupuesto');

  // Crear elementos de error
  const errores = {
    modalidad: crearElementoError(modalidadInput),
    duracion: crearElementoError(duracionInput),
    presupuesto: crearElementoError(presupuestoInput)
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores previos
    Object.values(errores).forEach(ocultarError);
    [modalidadInput, duracionInput, presupuestoInput].forEach(limpiarEstilos);

    // Obtener valores
    const modalidad = modalidadInput?.value;
    const duracion = duracionInput?.value;
    const presupuesto = presupuestoInput?.value;
    const ambiente = preferenciasTab.querySelector('input[name="ambiente"]:checked')?.value || '';

    let hayErrores = false;

    // Validaciones opcionales pero con mensajes útiles
    if (!modalidad) {
      mostrarError(modalidadInput, errores.modalidad, '❌ Selecciona una modalidad de estudio');
      hayErrores = true;
    }

    if (!duracion) {
      mostrarError(duracionInput, errores.duracion, '❌ Selecciona la duración preferida');
      hayErrores = true;
    }

    if (!presupuesto) {
      mostrarError(presupuestoInput, errores.presupuesto, '❌ Selecciona un rango de presupuesto');
      hayErrores = true;
    }

    if (hayErrores) return;

    // Obtener habilidades (predefinidas y personalizadas)
    const habilidades = [];
    preferenciasTab.querySelectorAll('.skill-tag input:checked').forEach(checkbox => {
      const span = checkbox.nextElementSibling;
      if (span) habilidades.push(span.textContent.trim());
    });

    // Actualizar usuario
    const usuario = getActiveUser();
    usuario.profile = usuario.profile || {};
    usuario.profile.studyModality = modalidad;
    usuario.profile.studyDuration = duracion;
    usuario.profile.budget = presupuesto;
    usuario.profile.workEnvironment = ambiente;
    usuario.profile.desiredSkills = habilidades;

    // Guardar
    updateActiveUser(usuario);
    mostrarToast('Cambios guardados', 'Preferencias actualizadas');
  });
}

/**
 * Configura la funcionalidad de agregar/eliminar logros
 */
function configurarLogros() {
  const educativaTab = document.querySelector('[data-tab="educativa"]');
  if (!educativaTab) return;

  const achievementList = educativaTab.querySelector('.achievement-list');
  const addButton = educativaTab.querySelector('.btn-add');

  if (!achievementList || !addButton) return;

  addButton.addEventListener('click', () => {
    const modal = crearModal(
      'Agregar Logro o Certificación',
      'award',
      'Ingresa el nombre de tu logro, premio o certificación obtenida.',
      'Ej: Certificación en Programación Python',
      100
    );

    const input = modal.querySelector('.modal-input');
    const error = modal.querySelector('.modal-error');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-btn-cancel');
    const addBtn = modal.querySelector('.modal-btn-primary');

    const cerrarModal = () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    };

    const validar = () => {
      const valor = input.value.trim();
      if (!valor) {
        input.classList.add('error');
        error.classList.add('show');
        return false;
      }
      input.classList.remove('error');
      error.classList.remove('show');
      return true;
    };

    input.focus();
    closeBtn.addEventListener('click', cerrarModal);
    cancelBtn.addEventListener('click', cerrarModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) cerrarModal();
    });

    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.classList.remove('error');
        error.classList.remove('show');
      }
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addBtn.click();
    });

    addBtn.addEventListener('click', () => {
      if (validar()) {
        agregarLogroAlDOM(input.value.trim(), achievementList);
        cerrarModal();
      }
    });
  });
}

/**
 * Agrega un logro al DOM
 */
function agregarLogroAlDOM(texto, container) {
  const item = document.createElement('div');
  item.className = 'achievement-item';
  item.innerHTML = `
    <i data-lucide="award"></i>
    <span>${texto}</span>
    <button type="button" class="btn-icon-remove">
      <i data-lucide="x"></i>
    </button>
  `;

  container.appendChild(item);

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  item.querySelector('.btn-icon-remove').addEventListener('click', () => {
    item.remove();
  });
}

/**
 * Configura la funcionalidad de agregar/eliminar habilidades personalizadas
 */
function configurarHabilidades() {
  const preferenciasTab = document.querySelector('[data-tab="preferencias"]');
  if (!preferenciasTab) return;

  const skillsContainer = preferenciasTab.querySelector('.skills-tags');
  const addButton = preferenciasTab.querySelector('.btn-add');

  if (!skillsContainer || !addButton) return;

  addButton.addEventListener('click', () => {
    const modal = crearModal(
      'Agregar Habilidad Personalizada',
      'sparkles',
      'Ingresa el nombre de una habilidad que te gustaría desarrollar.',
      'Ej: Diseño UX/UI, Fotografía',
      50
    );

    const input = modal.querySelector('.modal-input');
    const error = modal.querySelector('.modal-error');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-btn-cancel');
    const addBtn = modal.querySelector('.modal-btn-primary');

    const cerrarModal = () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    };

    const validar = () => {
      const valor = input.value.trim();
      if (!valor) {
        input.classList.add('error');
        error.textContent = 'Por favor ingresa un nombre válido';
        error.classList.add('show');
        return false;
      }

      // Verificar duplicados
      const habilidadesExistentes = Array.from(skillsContainer.querySelectorAll('.skill-tag span'))
        .map(s => s.textContent.trim());
      if (habilidadesExistentes.includes(valor)) {
        input.classList.add('error');
        error.textContent = 'Esta habilidad ya existe en la lista';
        error.classList.add('show');
        return false;
      }

      input.classList.remove('error');
      error.classList.remove('show');
      return true;
    };

    input.focus();
    closeBtn.addEventListener('click', cerrarModal);
    cancelBtn.addEventListener('click', cerrarModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) cerrarModal();
    });

    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.classList.remove('error');
        error.classList.remove('show');
      }
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addBtn.click();
    });

    addBtn.addEventListener('click', () => {
      if (validar()) {
        const habilidad = input.value.trim();
        agregarHabilidadAlDOM(habilidad, skillsContainer);

        // Guardar en usuario
        const usuario = getActiveUser();
        usuario.profile = usuario.profile || {};
        usuario.profile.customSkills = usuario.profile.customSkills || [];
        usuario.profile.customSkills.push(habilidad);
        updateActiveUser(usuario);

        cerrarModal();
      }
    });
  });
}

/**
 * Agrega una habilidad personalizada al DOM
 */
function agregarHabilidadAlDOM(habilidad, container) {
  const tag = document.createElement('label');
  tag.className = 'skill-tag custom-skill';
  tag.innerHTML = `
    <input type="checkbox" checked>
    <span>${habilidad}</span>
    <button type="button" class="btn-remove-skill" style="
      margin-left: 8px;
      background: none;
      border: none;
      color: #dc3545;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 14px;
    ">×</button>
  `;

  container.appendChild(tag);

  tag.querySelector('.btn-remove-skill').addEventListener('click', (e) => {
    e.preventDefault();
    tag.remove();

    // Actualizar usuario
    const usuario = getActiveUser();
    if (usuario.profile?.customSkills) {
      usuario.profile.customSkills = usuario.profile.customSkills.filter(h => h !== habilidad);
      updateActiveUser(usuario);
    }
  });
}

/**
 * Configura privacidad y cuenta
 */
function configurarPrivacidad(usuario) {
  // Asegurar que existen privacySettings
  if (!usuario.privacySettings) {
    usuario.privacySettings = {
      profileVisibility: 'public',
      showEmail: false,
      showAge: true,
      showEducationLevel: true,
      showTestResults: false,
      showFavoriteCareers: true,
      allowMessages: true,
      showOnlineStatus: true
    };
    updateActiveUser(usuario);
  }

  // Configurar toggles de privacidad
  const toggles = document.querySelectorAll('.privacy-item .toggle-switch input[type="checkbox"]');
  const toggleMapping = [
    { key: 'profileVisibility', type: 'boolean' },
    { key: 'showFavoriteCareers', type: 'boolean' },
    { key: 'showTestResults', type: 'boolean' },
    { key: 'allowMessages', type: 'boolean' }
  ];

  // Cargar valores actuales
  toggles.forEach((toggle, index) => {
    const mapping = toggleMapping[index];
    if (!mapping) return;

    if (mapping.key === 'profileVisibility') {
      toggle.checked = usuario.privacySettings.profileVisibility === 'public';
    } else {
      toggle.checked = usuario.privacySettings[mapping.key];
    }

    // Auto-guardado al cambiar
    toggle.addEventListener('change', () => {
      const usuarioActual = getActiveUser();

      if (mapping.key === 'profileVisibility') {
        usuarioActual.privacySettings.profileVisibility = toggle.checked ? 'public' : 'private';
      } else {
        usuarioActual.privacySettings[mapping.key] = toggle.checked;
      }

      updateActiveUser(usuarioActual);
      const estado = toggle.checked ? 'activada' : 'desactivada';
      mostrarToast('Configuración guardada', `${mapping.key} ${estado}`);
    });
  });

  // Cambio de contraseña
  const privacyTab = document.querySelector('[data-tab="privacidad"]');
  if (privacyTab) {
    const passwordForm = privacyTab.querySelector('.config-form');
    const currentPasswordInput = document.getElementById('password-actual');
    const newPasswordInput = document.getElementById('password-nueva');
    const confirmPasswordInput = document.getElementById('password-confirmar');

    if (passwordForm) {
      // Crear elementos de error para cambio de contraseña
      const erroresPassword = {
        current: crearElementoError(currentPasswordInput),
        new: crearElementoError(newPasswordInput),
        confirm: crearElementoError(confirmPasswordInput)
      };

      // Validación en tiempo real - nueva contraseña
      newPasswordInput?.addEventListener('input', () => {
        if (newPasswordInput.value) {
          const validacion = validarPassword(newPasswordInput.value);
          if (!validacion.valido) {
            mostrarError(newPasswordInput, erroresPassword.new, `❌ ${validacion.mensaje}`);
          } else {
            limpiarEstilos(newPasswordInput);
            ocultarError(erroresPassword.new);
          }
        }
      });

      // Validación en tiempo real - confirmar contraseña
      confirmPasswordInput?.addEventListener('input', () => {
        if (confirmPasswordInput.value && newPasswordInput.value) {
          if (confirmPasswordInput.value !== newPasswordInput.value) {
            mostrarError(confirmPasswordInput, erroresPassword.confirm, '❌ Las contraseñas no coinciden');
          } else {
            limpiarEstilos(confirmPasswordInput);
            ocultarError(erroresPassword.confirm);
          }
        }
      });

      passwordForm.addEventListener('submit', (e) => {
        const privacyTabInput = document.getElementById('tab-privacidad');
        if (!privacyTabInput || !privacyTabInput.checked) return;

        e.preventDefault();

        // Limpiar errores previos
        Object.values(erroresPassword).forEach(ocultarError);
        [currentPasswordInput, newPasswordInput, confirmPasswordInput].forEach(limpiarEstilos);

        const currentPassword = currentPasswordInput?.value;
        const newPassword = newPasswordInput?.value;
        const confirmPassword = confirmPasswordInput?.value;

        // Si no hay valores, salir sin error
        if (!currentPassword && !newPassword && !confirmPassword) {
          mostrarToast('Sin cambios', 'No se modificó la contraseña');
          return;
        }

        let hayErrores = false;

        // Validación 1: Campos llenos
        if (!currentPassword) {
          mostrarError(currentPasswordInput, erroresPassword.current, '❌ Ingresa tu contraseña actual');
          hayErrores = true;
        }
        if (!newPassword) {
          mostrarError(newPasswordInput, erroresPassword.new, '❌ Ingresa una nueva contraseña');
          hayErrores = true;
        }
        if (!confirmPassword) {
          mostrarError(confirmPasswordInput, erroresPassword.confirm, '❌ Confirma tu nueva contraseña');
          hayErrores = true;
        }

        if (hayErrores) return;

        // Validación 2: Verificar contraseña actual
        const usuarioActual = getActiveUser();
        if (usuarioActual.password !== currentPassword) {
          mostrarError(currentPasswordInput, erroresPassword.current, '❌ La contraseña actual es incorrecta');
          return;
        }

        // Validación 3: Verificar que coincidan
        if (newPassword !== confirmPassword) {
          mostrarError(confirmPasswordInput, erroresPassword.confirm, '❌ Las contraseñas nuevas no coinciden');
          return;
        }

        // Validación 4: Fortaleza de contraseña
        const validacion = validarPassword(newPassword);
        if (!validacion.valido) {
          mostrarError(newPasswordInput, erroresPassword.new, `❌ ${validacion.mensaje}`);
          return;
        }

        // Actualizar contraseña
        usuarioActual.password = newPassword;
        updateActiveUser(usuarioActual);

        // Limpiar campos
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';

        mostrarToast('Contraseña actualizada', 'Tu contraseña se cambió exitosamente');
      });
    }
  }

  // Descargar datos
  const downloadButton = document.querySelector('.btn-danger-secondary');
  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
      const usuarioActual = getActiveUser();
      const userData = {
        name: usuarioActual.name,
        email: usuarioActual.email,
        profile: usuarioActual.profile,
        privacySettings: usuarioActual.privacySettings,
        favoriteCareers: usuarioActual.favoriteCareers,
        testResults: usuarioActual.testResults,
        customLists: usuarioActual.customLists
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vocatio-datos-${usuarioActual.id}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      mostrarToast('Datos descargados', 'Tu información se exportó exitosamente');
    });
  }

  // Eliminar cuenta
  const deleteButton = document.querySelector('.btn-danger');
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      const confirmDelete = confirm(
        '¿Estás seguro de que deseas eliminar tu cuenta?\n\n' +
        'Esta acción es PERMANENTE e IRREVERSIBLE.\n' +
        'Se eliminarán todos tus datos.'
      );

      if (!confirmDelete) return;

      const doubleConfirm = confirm('¡ÚLTIMA CONFIRMACIÓN!\n\n¿Estás completamente seguro?');

      if (!doubleConfirm) return;

      const usuarioActual = getActiveUser();
      const db = getDB();
      db.users = db.users.filter(u => u.id !== usuarioActual.id);
      saveDB(db);

      localStorage.removeItem('activeUser');
      alert('Tu cuenta ha sido eliminada exitosamente.');
      window.location.href = '../../index.html';
    });
  }
}

// ============================================
// 4. PÁGINA PRINCIPAL DE PERFIL
// ============================================

/**
 * Inicializa la página principal de perfil (perfil-seccion.html)
 *
 * Muestra avatar, nombre, porcentaje de completitud y estadísticas
 */
export function initProfileSection() {
  const usuario = getActiveUser();
  if (!usuario) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = '../Login/login.html';
    return;
  }

  // Avatar con iniciales
  const profileAvatar = document.querySelector('.profile-avatar');
  if (profileAvatar && usuario.name) {
    const nameParts = usuario.name.split(' ');
    const lastName = usuario.profile?.lastName || '';
    let iniciales = nameParts[0][0].toUpperCase();
    if (lastName) {
      iniciales += lastName[0].toUpperCase();
    } else if (nameParts.length > 1) {
      iniciales += nameParts[1][0].toUpperCase();
    }
    profileAvatar.textContent = iniciales;
  }

  // Nombre de bienvenida
  const profileName = document.querySelector('.profile-name');
  if (profileName) {
    const fullName = usuario.profile?.lastName
      ? `${usuario.name} ${usuario.profile.lastName}`
      : usuario.name;
    profileName.textContent = `Bienvenid@, ${fullName}`;
  }

  // Porcentaje de perfil completado
  const porcentaje = calcularCompletitudPerfil(usuario);
  const profileStatValue = document.querySelector('.profile-stat-value');
  if (profileStatValue) {
    profileStatValue.textContent = `${porcentaje}%`;
  }

  // Estadísticas
  actualizarEstadisticas(usuario);
}

/**
 * Calcula el porcentaje de completitud del perfil
 * Basado en los campos completados vs totales
 */
function calcularCompletitudPerfil(usuario) {
  let completado = 0;
  const total = 100;

  // Campos obligatorios básicos (20%)
  if (usuario.name) completado += 10;
  if (usuario.email) completado += 10;

  // Perfil básico (20%)
  if (usuario.profile?.lastName) completado += 5;
  if (usuario.profile?.birthDate) completado += 5;
  if (usuario.profile?.level) completado += 10;

  // Información personal adicional (15%)
  if (usuario.profile?.phone) completado += 5;
  if (usuario.profile?.gender) completado += 5;
  if (usuario.profile?.city) completado += 5;

  // Biografía (5%)
  if (usuario.profile?.bio) completado += 5;

  // Información educativa (20%)
  if (usuario.profile?.institution) completado += 5;
  if (usuario.profile?.currentGrade) completado += 3;
  if (usuario.profile?.gpa) completado += 3;
  if (usuario.profile?.graduationYear) completado += 3;
  if (usuario.profile?.interests?.length > 0) completado += 6;

  // Preferencias vocacionales (20%)
  if (usuario.profile?.studyModality) completado += 5;
  if (usuario.profile?.studyDuration) completado += 5;
  if (usuario.profile?.workEnvironment) completado += 5;
  if (usuario.profile?.desiredSkills?.length > 0) completado += 5;

  return Math.round((completado / total) * 100);
}

/**
 * Actualiza las estadísticas del perfil
 */
function actualizarEstadisticas(usuario) {
  // Tests realizados
  const testsCount = usuario.testResults?.length || 0;
  const testsStatValue = document.querySelectorAll('.profile-stat-value')[1];
  if (testsStatValue) {
    testsStatValue.textContent = testsCount;
  }

  // Carreras exploradas
  const favoritesCount = usuario.favoriteCareers?.length || 0;
  const customListsCount = usuario.customLists?.reduce((acc, list) =>
    acc + (list.careers?.length || 0), 0) || 0;
  const totalCareers = favoritesCount + customListsCount;

  const careersStatValue = document.querySelectorAll('.profile-stat-value')[2];
  if (careersStatValue) {
    careersStatValue.textContent = totalCareers;
  }
}

// ============================================
// AUTO-INICIALIZACIÓN
// ============================================

// Detectar qué página está cargada y ejecutar la función correspondiente
document.addEventListener('DOMContentLoaded', () => {
  const rutaActual = window.location.pathname;

  if (rutaActual.includes('profile.html') && !rutaActual.includes('configuracion')) {
    initCompleteProfile();
  } else if (rutaActual.includes('success.html')) {
    initProfileSuccess();
  } else if (rutaActual.includes('configuracion-perfil.html')) {
    initConfigProfile();
  } else if (rutaActual.includes('perfil-seccion.html')) {
    initProfileSection();
  }
});
