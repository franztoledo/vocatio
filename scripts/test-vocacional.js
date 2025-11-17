// scripts/test-vocacional.js
// Lógica para los tests vocacionales (tradicional y aventura)

import { getDB, saveDB } from './utils.js';
import { getActiveUser, setActiveUser } from './utils.js';

// ============================================
// TEST TRADICIONAL
// ============================================

/**
 * Inicializa el test vocacional tradicional
 * Carga las preguntas desde la base de datos y las renderiza
 */
export function initTradicionalTest() {
  const db = getDB();
  const questions = db.vocational_tests.tradicional;
  const testForm = document.getElementById('testForm');

  if (!testForm) return;

  // Limpiar el formulario actual (eliminar las preguntas hardcodeadas)
  const existingBlocks = testForm.querySelectorAll('.question-block');
  existingBlocks.forEach(block => block.remove());

  // Organizar preguntas en bloques de 5
  const questionsPerBlock = 5;
  const blocks = [];

  for (let i = 0; i < questions.length; i += questionsPerBlock) {
    blocks.push(questions.slice(i, i + questionsPerBlock));
  }

  // Renderizar cada bloque
  blocks.forEach((blockQuestions, blockIndex) => {
    const blockElement = createQuestionBlock(blockQuestions, blockIndex + 1);
    testForm.insertBefore(blockElement, testForm.querySelector('.form-actions'));
  });

  // Manejar envío del formulario
  const nextButton = testForm.querySelector('.btn-siguiente');
  if (nextButton) {
    nextButton.onclick = (e) => {
      e.preventDefault();
      handleTradicionalSubmit();
    };
  }

  // Manejar guardar progreso
  const saveButton = testForm.querySelector('.btn-modal-secondary');
  if (saveButton) {
    saveButton.onclick = (e) => {
      e.preventDefault();
      saveTestProgress();
    };
  }

  // Cargar progreso guardado si existe
  loadTestProgress();
}

/**
 * Crea un bloque de preguntas para el test tradicional
 */
function createQuestionBlock(questions, blockNumber) {
  const block = document.createElement('div');
  block.className = 'question-block';

  const blockTitles = {
    1: 'Tus preferencias naturales',
    2: 'Tus habilidades',
    3: 'Tus intereses',
    4: 'Tu visión de futuro'
  };

  block.innerHTML = `
    <div class="block-header">
      <h2 class="block-title">Bloque ${blockNumber}: ${blockTitles[blockNumber] || 'Tus respuestas'}</h2>
      <p class="block-description">
        Responde con sinceridad. No hay respuestas correctas o incorrectas. Elige la opción que mejor describa tu tendencia natural.
      </p>
    </div>

    <div class="questions-table">
      <div class="table-header">
        <div class="header-option">Opciones</div>
        <div class="header-response">Sí</div>
        <div class="header-response">No</div>
        <div class="header-response">¿?</div>
      </div>

      ${questions.map((q, index) => createQuestionRow(q, index)).join('')}
    </div>
  `;

  return block;
}

/**
 * Crea una fila de pregunta para el test tradicional
 */
function createQuestionRow(question, index) {
  const questionNumber = question.id;

  return `
    <div class="question-row">
      <div class="question-text">
        <span class="question-number">${questionNumber}.</span>
        <span>${question.text}</span>
      </div>
      <div class="question-options">
        <label class="radio-option">
          <input type="radio" name="q${questionNumber}" value="si" data-area="${question.area}" data-weight="${question.weight}" required>
          <span class="radio-custom"></span>
        </label>
        <label class="radio-option">
          <input type="radio" name="q${questionNumber}" value="no" data-area="${question.area}" data-weight="0">
          <span class="radio-custom"></span>
        </label>
        <label class="radio-option">
          <input type="radio" name="q${questionNumber}" value="duda" data-area="${question.area}" data-weight="${question.weight * 0.5}">
          <span class="radio-custom"></span>
        </label>
      </div>
    </div>
  `;
}

/**
 * Maneja el envío del test tradicional
 */
function handleTradicionalSubmit() {
  const testForm = document.getElementById('testForm');
  const formData = new FormData(testForm);

  // Validar que todas las preguntas estén respondidas
  const db = getDB();
  const totalQuestions = db.vocational_tests.tradicional.length;
  let answeredQuestions = 0;

  const results = {};

  for (let i = 1; i <= totalQuestions; i++) {
    const answer = formData.get(`q${i}`);
    if (answer) {
      answeredQuestions++;

      // Obtener el área y peso del input seleccionado
      const selectedInput = testForm.querySelector(`input[name="q${i}"]:checked`);
      const area = selectedInput.dataset.area;
      const weight = parseFloat(selectedInput.dataset.weight);

      // Acumular puntos por área
      if (!results[area]) {
        results[area] = 0;
      }
      results[area] += weight;
    }
  }

  // Validar que todas las preguntas fueron respondidas
  if (answeredQuestions < totalQuestions) {
    alert(`Por favor, responde todas las preguntas. Has respondido ${answeredQuestions} de ${totalQuestions}.`);
    return;
  }

  // Calcular porcentajes
  const totalPoints = Object.values(results).reduce((sum, val) => sum + val, 0);
  const percentages = {};

  for (const area in results) {
    percentages[area] = Math.round((results[area] / totalPoints) * 100);
  }

  // Guardar resultado
  saveTestResult('tradicional', percentages);

  // Limpiar progreso guardado
  localStorage.removeItem('testTradicionalProgress');

  // Redirigir a resultados
  window.location.href = 'resultados-test.html';
}

/**
 * Guarda el progreso del test tradicional
 */
function saveTestProgress() {
  const testForm = document.getElementById('testForm');
  const formData = new FormData(testForm);

  const progress = {};
  for (const [key, value] of formData.entries()) {
    progress[key] = value;
  }

  localStorage.setItem('testTradicionalProgress', JSON.stringify(progress));
  alert('Progreso guardado exitosamente. Puedes continuar más tarde.');

  // Cerrar modal
  document.getElementById('exitModalForm').checked = false;
}

/**
 * Carga el progreso guardado del test tradicional
 */
function loadTestProgress() {
  const savedProgress = localStorage.getItem('testTradicionalProgress');

  if (!savedProgress) return;

  const progress = JSON.parse(savedProgress);
  const testForm = document.getElementById('testForm');

  for (const [questionName, value] of Object.entries(progress)) {
    const input = testForm.querySelector(`input[name="${questionName}"][value="${value}"]`);
    if (input) {
      input.checked = true;
    }
  }

  alert('Se ha cargado tu progreso anterior. Puedes continuar donde lo dejaste.');
}

// ============================================
// TEST AVENTURA
// ============================================

let currentLevel = 0;
let currentCardIndex = 0;
let aventuraResults = {
  'Tecnología': 0,
  'Salud': 0,
  'Arte y Diseño': 0,
  'Negocios': 0,
  'Ciencias Sociales': 0
};

/**
 * Inicializa el test de aventura
 */
export function initAventuraTest() {
  console.log('🚀 Iniciando Test Aventura...');

  const db = getDB();

  if (!db) {
    console.error('❌ No se pudo cargar la base de datos');
    return;
  }

  const aventuraData = db.vocational_tests.aventura;

  if (!aventuraData || !aventuraData.levels) {
    console.error('❌ No se encontraron datos del test aventura');
    console.log('Estructura de DB:', db.vocational_tests);
    return;
  }

  console.log(`✅ Test aventura cargado con ${aventuraData.levels.length} niveles`);

  // Cargar progreso guardado o iniciar desde el principio
  loadAventuraProgress();

  // Renderizar el nivel actual
  renderCurrentLevel();

  // Setup event listeners
  setupAventuraEventListeners();

  console.log('✅ Test aventura inicializado correctamente');
}

/**
 * Renderiza el nivel actual del test aventura
 */
function renderCurrentLevel() {
  const db = getDB();
  const levels = db.vocational_tests.aventura.levels;

  if (currentLevel >= levels.length) {
    // Test completado
    finishAventuraTest();
    return;
  }

  const level = levels[currentLevel];
  const totalCards = getAllCards().length;
  const currentCardNumber = getCurrentCardNumber();

  // Actualizar información del nivel
  updateLevelInfo(level, currentCardNumber, totalCards);

  // Renderizar las tarjetas
  renderCards(level.cards);
}

/**
 * Obtiene todas las cartas de todos los niveles
 */
function getAllCards() {
  const db = getDB();
  const levels = db.vocational_tests.aventura.levels;
  let allCards = [];

  levels.forEach(level => {
    allCards = allCards.concat(level.cards);
  });

  return allCards;
}

/**
 * Obtiene el número de carta actual global
 */
function getCurrentCardNumber() {
  const db = getDB();
  const levels = db.vocational_tests.aventura.levels;
  let cardNumber = 0;

  for (let i = 0; i < currentLevel; i++) {
    cardNumber += levels[i].cards.length;
  }

  cardNumber += currentCardIndex + 1;

  return cardNumber;
}

/**
 * Actualiza la información del nivel (badge y progress bar)
 */
function updateLevelInfo(level, currentCardNumber, totalCards) {
  const levelBadge = document.querySelector('.level-badge');
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');

  if (levelBadge) {
    levelBadge.innerHTML = `
      <span style="font-size: 20px;">${level.icon}</span>
      <span>Nivel ${level.id}: ${level.title}</span>
    `;
  }

  if (progressFill && progressText) {
    const percentage = Math.round((currentCardNumber / totalCards) * 100);
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${currentCardNumber}/${totalCards}`;
  }
}

/**
 * Renderiza las tarjetas del nivel actual
 */
function renderCards(cards) {
  const cardsStack = document.querySelector('.cards-stack');

  if (!cardsStack) {
    console.error('❌ No se encontró el contenedor .cards-stack');
    return;
  }

  // Limpiar tarjetas existentes
  cardsStack.innerHTML = '';

  // Si ya no hay más cartas en este nivel, pasar al siguiente
  if (currentCardIndex >= cards.length) {
    console.log('📊 Nivel completado, mostrando pantalla de logro');
    showLevelComplete();
    return;
  }

  console.log(`🎴 Renderizando tarjetas: ${currentCardIndex + 1} de ${cards.length}`);

  // Renderizar máximo 3 cartas (actual + 2 siguientes en background)
  for (let i = currentCardIndex; i < Math.min(currentCardIndex + 3, cards.length); i++) {
    const card = cards[i];
    const cardElement = createCardElement(card, i === currentCardIndex);
    cardsStack.appendChild(cardElement);
  }

  console.log(`✅ Tarjetas renderizadas: ${cardsStack.children.length}`);

  // Actualizar iconos de lucide
  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * Crea el elemento HTML de una tarjeta
 */
function createCardElement(card, isActive) {
  const cardDiv = document.createElement('div');
  cardDiv.className = `swipe-card ${isActive ? 'active' : 'background'}`;
  cardDiv.dataset.cardId = card.id;
  cardDiv.dataset.likeArea = card.likeArea;
  cardDiv.dataset.dislikeArea = card.dislikeArea || '';
  cardDiv.dataset.confirmationLike = card.confirmationLike;
  cardDiv.dataset.confirmationDislike = card.confirmationDislike;

  cardDiv.innerHTML = `
    <div class="card-image">
      <img src="${card.imageUrl}" alt="${card.title}">
    </div>

    <div class="card-content">
      <h2 class="card-title">${card.title}</h2>
      <p class="card-description">${card.description}</p>

      <div class="card-actions">
        <button class="btn-action btn-no" data-action="dislike">
          <i data-lucide="thumbs-down"></i>
          <span>No</span>
        </button>

        <button class="btn-action btn-si" data-action="like">
          <i data-lucide="thumbs-up"></i>
          <span>Sí</span>
        </button>
      </div>

      <button class="btn-swipe">
        <span>👈</span>
        <span>Desliza</span>
        <span>👉</span>
      </button>
    </div>
  `;

  return cardDiv;
}

/**
 * Configura los event listeners para el test aventura
 */
function setupAventuraEventListeners() {
  // Variables para drag & drop
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let draggedCard = null;

  // Delegación de eventos para los botones de like/dislike
  document.addEventListener('click', (e) => {
    const actionButton = e.target.closest('.btn-action');

    if (actionButton && !isDragging) {
      const action = actionButton.dataset.action;
      const activeCard = document.querySelector('.swipe-card.active');

      if (activeCard) {
        // Animar salida con el botón
        const direction = action === 'like' ? 1 : -1;
        activeCard.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        activeCard.style.transform = `translateX(${direction * 120}%) rotate(${direction * 15}deg)`;
        activeCard.style.opacity = '0';
        
        handleCardAction(activeCard, action);

        activeCard.addEventListener('transitionend', () => {
          nextCard();
        }, { once: true });
      }
    }
  });

  const handleDragStart = (e, card) => {
    if (!card || e.target.closest('.btn-action')) return;

    isDragging = true;
    draggedCard = card;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    startY = e.touches ? e.touches[0].clientY : e.clientY;

    card.style.transition = 'none';
    card.style.cursor = 'grabbing';
  };

  const handleDragMove = (e) => {
    if (!isDragging || !draggedCard) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    currentX = clientX - startX;
    currentY = clientY - startY;

    const rotation = currentX * 0.1;
    draggedCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;

    updateDragFeedback(draggedCard, currentX);
  };

  const handleDragEnd = () => {
    if (!isDragging || !draggedCard) return;

    const swipeThreshold = 100;

    if (Math.abs(currentX) > swipeThreshold) {
      // Swipe detectado
      const action = currentX > 0 ? 'like' : 'dislike';
      handleCardAction(draggedCard, action);

      // Animar hacia afuera en la dirección del swipe
      const flyOutDirection = currentX > 0 ? 1 : -1;
      const endX = flyOutDirection * (window.innerWidth * 0.8);
      const endY = currentY * 1.5;
      const rotation = currentX * 0.1;

      draggedCard.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
      draggedCard.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg)`;
      draggedCard.style.opacity = '0';

      // Esperar a que la animación termine para pasar a la siguiente
      draggedCard.addEventListener('transitionend', () => {
        nextCard();
      }, { once: true });

    } else {
      // Regresar a la posición original
      draggedCard.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      draggedCard.style.transform = 'translate(0, 0) rotate(0deg)';
      removeDragFeedback(draggedCard);
    }

    isDragging = false;
    if (draggedCard) {
      draggedCard.style.cursor = 'grab';
    }
    draggedCard = null;
    currentX = 0;
    currentY = 0;
  };

  // ==========================================
  // MOUSE DRAG & DROP
  // ==========================================
  document.addEventListener('mousedown', (e) => {
    const card = e.target.closest('.swipe-card.active');
    handleDragStart(e, card);
  });
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', handleDragEnd);
  document.addEventListener('mouseleave', handleDragEnd); // Terminar si el mouse sale de la ventana

  // ==========================================
  // TOUCH DRAG & DROP (MÓVIL)
  // ==========================================
  document.addEventListener('touchstart', (e) => {
    const card = e.target.closest('.swipe-card.active');
    handleDragStart(e, card);
  }, { passive: true });
  document.addEventListener('touchmove', handleDragMove, { passive: true });
  document.addEventListener('touchend', handleDragEnd);

  // Botón continuar en level complete
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-continue')) {
      currentLevel++;
      currentCardIndex = 0;
      renderCurrentLevel();
      hideLevelComplete();
    }
  });

  // Botón continuar en inspiration screen
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-inspiration')) {
      hideInspirationScreen();
    }
  });

  // Manejar guardar progreso
  const saveButton = document.querySelector('.btn-modal-secondary');
  if (saveButton) {
    saveButton.onclick = (e) => {
      e.preventDefault();
      saveAventuraProgress();
    };
  }
}

/**
 * Actualiza el feedback visual mientras se arrastra la tarjeta
 */
function updateDragFeedback(card, translateX) {
  let likeOverlay = card.querySelector('.drag-feedback-like');
  let nopeOverlay = card.querySelector('.drag-feedback-nope');

  if (!likeOverlay) {
    likeOverlay = document.createElement('div');
    likeOverlay.className = 'drag-feedback-like';
    likeOverlay.innerHTML = '<span>SÍ</span>';
    card.querySelector('.card-image').appendChild(likeOverlay);
  }

  if (!nopeOverlay) {
    nopeOverlay = document.createElement('div');
    nopeOverlay.className = 'drag-feedback-nope';
    nopeOverlay.innerHTML = '<span>NO</span>';
    card.querySelector('.card-image').appendChild(nopeOverlay);
  }

  const intensity = Math.min(Math.abs(translateX) / 100, 1);

  if (translateX > 10) {
    likeOverlay.style.opacity = intensity;
    nopeOverlay.style.opacity = 0;
  } else if (translateX < -10) {
    nopeOverlay.style.opacity = intensity;
    likeOverlay.style.opacity = 0;
  } else {
    likeOverlay.style.opacity = 0;
    nopeOverlay.style.opacity = 0;
  }
}

/**
 * Remueve el feedback visual de drag
 */
function removeDragFeedback(card) {
  const likeOverlay = card.querySelector('.drag-feedback-like');
  const nopeOverlay = card.querySelector('.drag-feedback-nope');

  if (likeOverlay) likeOverlay.style.opacity = 0;
  if (nopeOverlay) nopeOverlay.style.opacity = 0;
}

/**
 * Maneja la acción (like/dislike) en una tarjeta
 */
function handleCardAction(card, action) {
  const likeArea = card.dataset.likeArea;
  const dislikeArea = card.dataset.dislikeArea;
  const confirmationLike = card.dataset.confirmationLike;
  const confirmationDislike = card.dataset.confirmationDislike;

  // Actualizar resultados
  if (action === 'like') {
    if (aventuraResults[likeArea] !== undefined) aventuraResults[likeArea]++;
    showFeedback(confirmationLike, 'like');
  } else {
    if (dislikeArea && dislikeArea !== 'null' && aventuraResults[dislikeArea] !== undefined) {
      aventuraResults[dislikeArea]++;
    }
    showFeedback(confirmationDislike, 'dislike');
  }
}

/**
 * Muestra el feedback de confirmación
 */
function showFeedback(message, type) {
  const feedbackOverlay = document.getElementById('feedbackOverlay');

  if (!feedbackOverlay) {
    console.error('No se encontró el elemento feedbackOverlay');
    return;
  }

  const feedbackCard = feedbackOverlay.querySelector('.feedback-card');

  if (type === 'like') {
    feedbackCard.innerHTML = `
      <i data-lucide="check-circle"></i>
      <h3>${message}</h3>
    `;
    feedbackCard.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  } else {
    feedbackCard.innerHTML = `
      <i data-lucide="info"></i>
      <h3>${message}</h3>
    `;
    feedbackCard.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  }

  feedbackOverlay.style.display = 'flex';
  feedbackOverlay.style.opacity = '1';

  // Actualizar iconos
  if (window.lucide) {
    lucide.createIcons();
  }

  setTimeout(() => {
    feedbackOverlay.style.opacity = '0';
    setTimeout(() => {
      feedbackOverlay.style.display = 'none';
    }, 300);
  }, 800);
}

/**
 * Avanza a la siguiente carta
 */
function nextCard() {
  const db = getDB();
  const currentLevelData = db.vocational_tests.aventura.levels[currentLevel];

  currentCardIndex++;

  // Verificar si completamos el nivel
  if (currentCardIndex >= currentLevelData.cards.length) {
    showLevelComplete();
  } else {
    renderCurrentLevel();
  }

  // Guardar progreso automáticamente
  saveAventuraProgress();
}

/**
 * Muestra la pantalla de nivel completado
 */
function showLevelComplete() {
  const db = getDB();
  const level = db.vocational_tests.aventura.levels[currentLevel];
  const levelCompleteScreen = document.getElementById('levelCompleteScreen');
  const totalCards = getAllCards().length;
  const completedCards = getCurrentCardNumber() - 1; // -1 porque ya avanzamos

  if (levelCompleteScreen) {
    const completeContent = levelCompleteScreen.querySelector('.complete-content');
    const progressPercentage = Math.round((completedCards / totalCards) * 100);

    completeContent.innerHTML = `
      <div class="complete-icon">
        <i data-lucide="award"></i>
      </div>

      <h2 class="complete-title">¡Nivel ${level.id} Completado!</h2>

      <div class="complete-badge">
        <i data-lucide="trophy"></i>
        <div class="badge-content">
          <h3>"${level.badge}"</h3>
          <p>${level.description}</p>
        </div>
      </div>

      <div class="complete-progress">
        <p>Progreso total: ${completedCards}/${totalCards} preguntas</p>
        <div class="complete-progress-bar">
          <div class="complete-progress-fill" style="width: ${progressPercentage}%;"></div>
        </div>
      </div>

      <button class="btn-continue">
        Continuar al Siguiente Nivel ✨
      </button>
    `;

    levelCompleteScreen.style.display = 'flex';

    // Actualizar iconos
    if (window.lucide) {
      lucide.createIcons();
    }

    // Mostrar fun fact después de 2 segundos
    setTimeout(() => {
      showInspirationScreen(level.funFact);
    }, 2000);
  }
}

/**
 * Oculta la pantalla de nivel completado
 */
function hideLevelComplete() {
  const levelCompleteScreen = document.getElementById('levelCompleteScreen');
  if (levelCompleteScreen) {
    levelCompleteScreen.style.display = 'none';
  }
}

/**
 * Muestra la pantalla de inspiración con fun facts
 */
function showInspirationScreen(funFact) {
  const inspirationScreen = document.getElementById('inspirationScreen');

  if (inspirationScreen) {
    const lines = funFact.split('\n');
    const title = lines[0] || '¡Momento de Inspiración!';
    const text = lines.slice(1).join(' ') || '¿Sabías que muchas carreras exitosas comenzaron con pequeños pasos?';

    const inspirationContent = inspirationScreen.querySelector('.inspiration-content');
    inspirationContent.innerHTML = `
      <div class="inspiration-star">⭐</div>
      <h2 class="inspiration-title">${title}</h2>
      <p class="inspiration-text">${text}</p>
      <button class="btn-inspiration">Toca para continuar 👆</button>
    `;

    inspirationScreen.style.display = 'flex';
  }
}

/**
 * Oculta la pantalla de inspiración
 */
function hideInspirationScreen() {
  const inspirationScreen = document.getElementById('inspirationScreen');
  if (inspirationScreen) {
    inspirationScreen.style.display = 'none';
  }
}

/**
 * Finaliza el test de aventura
 */
function finishAventuraTest() {
  // Calcular porcentajes
  const totalPoints = Object.values(aventuraResults).reduce((sum, val) => sum + val, 0);
  const percentages = {};

  for (const area in aventuraResults) {
    if (totalPoints > 0) {
      percentages[area] = Math.round((aventuraResults[area] / totalPoints) * 100);
    } else {
      percentages[area] = 0;
    }
  }

  // Guardar resultado
  saveTestResult('aventura', percentages);

  // Limpiar progreso guardado
  localStorage.removeItem('testAventuraProgress');

  // Redirigir a resultados
  window.location.href = 'resultados-test.html';
}

/**
 * Guarda el progreso del test aventura
 */
function saveAventuraProgress() {
  const progress = {
    currentLevel,
    currentCardIndex,
    results: aventuraResults
  };

  localStorage.setItem('testAventuraProgress', JSON.stringify(progress));
  console.log('💾 Progreso guardado:', progress);

  // Si se llamó desde el botón del modal, mostrar mensaje y cerrar modal
  const saveButton = document.querySelector('.btn-modal-secondary');
  if (saveButton && event && event.target === saveButton) {
    alert('¡Progreso guardado exitosamente! Puedes continuar más tarde.');
    document.getElementById('exitModal').checked = false;
  }
}

/**
 * Carga el progreso guardado del test aventura
 */
function loadAventuraProgress() {
  const savedProgress = localStorage.getItem('testAventuraProgress');

  if (!savedProgress) return;

  const progress = JSON.parse(savedProgress);
  currentLevel = progress.currentLevel || 0;
  currentCardIndex = progress.currentCardIndex || 0;
  aventuraResults = progress.results || {
    'Tecnología': 0,
    'Salud': 0,
    'Arte y Diseño': 0,
    'Negocios': 0,
    'Ciencias Sociales': 0
  };

  // Mostrar mensaje de carga
  setTimeout(() => {
    alert('Se ha cargado tu progreso anterior. ¡Continúa tu aventura de descubrimiento!');
  }, 500);
}

// ============================================
// FUNCIONES COMPARTIDAS
// ============================================

/**
 * Guarda el resultado de un test en el perfil del usuario
 */
function saveTestResult(testType, percentages) {
  const user = getActiveUser();

  if (!user) {
    console.warn('No hay usuario activo, guardando resultados en localStorage temporal');
    localStorage.setItem('pendingTestResult', JSON.stringify({ testType, percentages, date: new Date().toISOString() }));
    return;
  }

  // Crear objeto de resultado
  const result = {
    id: Date.now(),
    type: testType,
    date: new Date().toISOString(),
    results: percentages,
    topArea: Object.keys(percentages).reduce((a, b) => percentages[a] > percentages[b] ? a : b)
  };

  // Actualizar usuario en la base de datos
  const db = getDB();
  const userIndex = db.users.findIndex(u => u.id === user.id);

  if (userIndex !== -1) {
    db.users[userIndex].testResults.push(result);
    saveDB(db);

    // Actualizar usuario activo
    setActiveUser(db.users[userIndex]);
  }

  // También guardar en localStorage temporal para la página de resultados
  localStorage.setItem('latestTestResult', JSON.stringify(result));
}
