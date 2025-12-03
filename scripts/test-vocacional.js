// scripts/test-vocacional.js
// Lógica para los tests vocacionales (tradicional y aventura)

import { getDB, saveDB, showToast } from './utils.js';
import { getActiveUser, setActiveUser } from './utils.js';

// ============================================ 
// TEST TRADICIONAL
// ============================================ 

let currentBlockIndex = 0;
let questionsPerBlock = 5;
let totalBlocks = 0;
let questionsData = [];

/**
 * Inicializa el test vocacional tradicional
 * Carga las preguntas desde la base de datos y las renderiza
 */
export function initTradicionalTest() {
  const db = getDB();
  questionsData = db.vocational_tests.tradicional;
  const testForm = document.getElementById('testForm');

  if (!testForm) return;

  // Elementos del DOM
  const progressBar = document.querySelector('.progress-bar');
  const progressText = document.querySelector('.progress-text');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  // Limpiar el formulario
  const existingBlocks = testForm.querySelectorAll('.question-block');
  existingBlocks.forEach(block => block.remove());

  // Organizar preguntas en bloques
  const blocks = [];
  for (let i = 0; i < questionsData.length; i += questionsPerBlock) {
    blocks.push(questionsData.slice(i, i + questionsPerBlock));
  }
  totalBlocks = blocks.length;

  // Renderizar cada bloque
  blocks.forEach((blockQuestions, blockIndex) => {
    const blockElement = createQuestionBlock(blockQuestions, blockIndex);
    // Insertar antes de los botones de acción
    testForm.insertBefore(blockElement, testForm.querySelector('.form-actions'));
  });

  // Cargar progreso guardado y determinar el bloque inicial
  const startingBlock = loadTestProgress();
  navigateToBlock(startingBlock);

  // Event listeners para navegación
  btnNext.addEventListener('click', () => {
    if (currentBlockIndex < totalBlocks - 1) {
      // Validar el bloque actual antes de continuar
      if (isBlockValid(currentBlockIndex)) {
        navigateToBlock(currentBlockIndex + 1);
      } else {
        showToast('Por favor, responde todas las preguntas de este bloque.', 'error');
      }
    } else {
      // Último bloque, finalizar test
      handleTradicionalSubmit();
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentBlockIndex > 0) {
      navigateToBlock(currentBlockIndex - 1);
    }
  });

  // Manejar guardar progreso
  const saveButton = document.querySelector('.btn-modal-secondary');
  if (saveButton) {
    saveButton.onclick = (e) => {
      e.preventDefault();
      saveTestProgress();
    };
  }
}

/**
 * Navega a un bloque de preguntas específico
 * @param {number} index - El índice del bloque a mostrar
 */
function navigateToBlock(index) {
  currentBlockIndex = index;
  const testForm = document.getElementById('testForm');
  const questionBlocks = testForm.querySelectorAll('.question-block');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const progressBar = document.querySelector('.progress-bar');
  const progressText = document.querySelector('.progress-text');

  // Ocultar todos los bloques
  questionBlocks.forEach(block => block.classList.remove('active'));

  // Mostrar el bloque actual
  if (questionBlocks[index]) {
    questionBlocks[index].classList.add('active');
  }

  // Actualizar barra de progreso
  const progressPercentage = ((index + 1) / totalBlocks) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  progressText.textContent = `Bloque ${index + 1} de ${totalBlocks}`;

  // Actualizar estado de los botones
  btnPrev.disabled = index === 0;
  if (index === totalBlocks - 1) {
    btnNext.innerHTML = 'Finalizar Test <i data-lucide="check-circle"></i>';
    lucide.createIcons(); // Actualizar el nuevo ícono
  } else {
    btnNext.innerHTML = 'Siguiente <i data-lucide="arrow-right"></i>';
    lucide.createIcons();
  }
}

/**
 * Valida si todas las preguntas en un bloque específico han sido respondidas
 * @param {number} blockIndex - El índice del bloque a validar
 */
function isBlockValid(blockIndex) {
  const startQuestionIndex = blockIndex * questionsPerBlock;
  const endQuestionIndex = startQuestionIndex + questionsPerBlock;
  const testForm = document.getElementById('testForm');

  for (let i = startQuestionIndex; i < endQuestionIndex && i < questionsData.length; i++) {
    const questionId = questionsData[i].id;
    const questionName = `q${questionId}`;
    const selectedAnswer = testForm.querySelector(`input[name="${questionName}"]:checked`);
    if (!selectedAnswer) {
      return false; // Si alguna pregunta no está respondida, el bloque no es válido
    }
  }
  return true; // Todas las preguntas del bloque están respondidas
}


/**
 * Crea un bloque de preguntas para el test tradicional
 */
function createQuestionBlock(questions, blockIndex) {
  const block = document.createElement('div');
  block.className = 'question-block';
  block.dataset.blockIndex = blockIndex;

  const blockTitles = {
    0: 'Tus preferencias naturales',
    1: 'Tus habilidades',
    2: 'Tus intereses',
    3: 'Tu visión de futuro'
  };

  block.innerHTML = `
    <div class="block-header">
      <h2 class="block-title">Bloque ${blockIndex + 1}: ${blockTitles[blockIndex] || 'Tus respuestas'}</h2>
      <p class="block-description">
        Responde con sinceridad. No hay respuestas correctas o incorrectas. Elige la opción que mejor describa tu tendencia natural.
      </p>
    </div>
    <div class="questions-table">
      <div class="table-header">
        <div class="header-option">Pregunta</div>
        <div class="header-response">Sí</div>
        <div class="header-response">No</div>
        <div class="header-response">¿?</div>
      </div>
      ${questions.map(q => createQuestionRow(q)).join('')}
    </div>
  `;
  return block;
}

/**
 * Crea una fila de pregunta para el test tradicional
 */
function createQuestionRow(question) {
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
          <input type="radio" name="q${questionNumber}" value="no" data-area="${question.area}" data-weight="0" required>
          <span class="radio-custom"></span>
        </label>
        <label class="radio-option">
          <input type="radio" name="q${questionNumber}" value="duda" data-area="${question.area}" data-weight="${question.weight * 0.5}" required>
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
  const db = getDB();

  // Validar que todas las preguntas estén respondidas
  const totalQuestions = questionsData.length;
  let answeredQuestions = 0;
  const results = {};

  for (let i = 1; i <= totalQuestions; i++) {
    const answer = formData.get(`q${i}`);
    if (answer) {
      answeredQuestions++;
      const selectedInput = testForm.querySelector(`input[name="q${i}"]:checked`);
      const area = selectedInput.dataset.area;
      const weight = parseFloat(selectedInput.dataset.weight);
      if (!results[area]) {
        results[area] = 0;
      }
      results[area] += weight;
    }
  }

  if (answeredQuestions < totalQuestions) {
    showToast(`Por favor, responde todas las preguntas. Has respondido ${answeredQuestions} de ${totalQuestions}.`, 'error');
    // Navegar al primer bloque con preguntas sin responder
    const firstUnansweredBlock = findFirstUnansweredBlock();
    if (firstUnansweredBlock !== -1) {
        navigateToBlock(firstUnansweredBlock);
    }
    return;
  }

  // Calcular porcentajes
  const totalPoints = Object.values(results).reduce((sum, val) => sum + val, 0);
  
  // **FIX:** Inicializar los porcentajes con todas las áreas posibles para asegurar que existan
  const percentages = {};
  const allAreas = Object.keys(db.hero_profiles);
  allAreas.forEach(area => {
    percentages[area] = 0;
  });

  // Llenar con los resultados calculados
  for (const area in results) {
    if (percentages.hasOwnProperty(area)) {
      percentages[area] = totalPoints > 0 ? Math.round((results[area] / totalPoints) * 100) : 0;
    }
  }

  // Guardar resultado
  saveTestResult('tradicional', percentages);

  // Limpiar progreso guardado
  const user = getActiveUser();
  if (user) {
    localStorage.removeItem('testTradicionalProgress_' + user.id);
  }

  // Redirigir a resultados
  window.location.href = 'resultados-test.html';
}

/**
 * Guarda el progreso del test tradicional para el usuario actual
 */
function saveTestProgress() {
  const user = getActiveUser();
  if (!user) {
    showToast('Debes iniciar sesión para guardar tu progreso.', 'error');
    return;
  }

  const testForm = document.getElementById('testForm');
  const formData = new FormData(testForm);
  const progress = {};
  for (const [key, value] of formData.entries()) {
    progress[key] = value;
  }

  localStorage.setItem('testTradicionalProgress_' + user.id, JSON.stringify(progress));
  showToast('Progreso guardado exitosamente.', 'success');

  const modalCheckbox = document.getElementById('exitModalForm');
  if (modalCheckbox) {
    modalCheckbox.checked = false;
  }
}

/**
 * Carga el progreso guardado y devuelve el índice del bloque para continuar
 * @returns {number} El índice del bloque donde continuar
 */
function loadTestProgress() {
  const user = getActiveUser();
  if (!user) return 0;

  const savedProgress = localStorage.getItem('testTradicionalProgress_' + user.id);
  if (!savedProgress) return 0;

  const progress = JSON.parse(savedProgress);
  const testForm = document.getElementById('testForm');

  for (let [questionName, value] of Object.entries(progress)) {
    const input = testForm.querySelector(`input[name="${questionName}"][value="${value}"]`);
    if (input) {
      input.checked = true;
    }
  }

  showToast('Se ha cargado tu progreso anterior.');
  
  // Encontrar el primer bloque con una pregunta sin responder
  return findFirstUnansweredBlock();
}

/**
 * Encuentra el índice del primer bloque que contiene una pregunta sin responder
 * @returns {number} El índice del bloque, o el último bloque si todo está completo.
 */
function findFirstUnansweredBlock() {
    const testForm = document.getElementById('testForm');
    for (let i = 0; i < questionsData.length; i++) {
        const questionId = questionsData[i].id;
        const questionName = `q${questionId}`;
        const selectedAnswer = testForm.querySelector(`input[name="${questionName}"]:checked`);
        if (!selectedAnswer) {
            // Esta pregunta no está respondida, devuelve el índice de su bloque
            return Math.floor(i / questionsPerBlock);
        }
    }
    // Si todas las preguntas están respondidas, devuelve el último bloque
    return totalBlocks > 0 ? totalBlocks - 1 : 0;
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
      saveAventuraProgress(e);
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

  // Limpiar progreso guardado para el usuario actual
  const user = getActiveUser();
  if (user) {
    localStorage.removeItem('testAventuraProgress_' + user.id);
  }

  // Redirigir a resultados
  window.location.href = 'resultados-test.html';
}

/**
 * Guarda el progreso del test aventura
 */
function saveAventuraProgress(event) {
    const user = getActiveUser();
    if (!user) {
        showToast('Debes iniciar sesión para guardar tu progreso.', 'error');
        return;
    }

  const progress = {
    currentLevel,
    currentCardIndex,
    results: aventuraResults
  };

  localStorage.setItem('testAventuraProgress_' + user.id, JSON.stringify(progress));
  console.log('💾 Progreso guardado para usuario ' + user.id, progress);

  // Si se llamó desde el botón del modal, mostrar mensaje y cerrar modal
  const saveButton = document.querySelector('.btn-modal-secondary');
  if (saveButton && event && event.target === saveButton) {
    showToast('¡Progreso guardado exitosamente!', 'success');
    document.getElementById('exitModal').checked = false;
  }
}

/**
 * Carga el progreso guardado del test aventura
 */
function loadAventuraProgress() {
    const user = getActiveUser();
    if (!user) return;

  const savedProgress = localStorage.getItem('testAventuraProgress_' + user.id);

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
    showToast('Se ha cargado tu progreso anterior.');
  }, 500);
}

// ============================================ 
// FUNCIONES COMPARTIDAS
// ============================================ 

/**
 * Guarda el resultado de un test en el perfil del usuario y en localStorage temporal
 */
function saveTestResult(testType, percentages) {
  const user = getActiveUser();

  // Convert the percentages object to an array of objects
  const resultsArray = Object.entries(percentages).map(([area, score]) => ({ area, score }));

  // Create result object with the correct data structure
  const result = {
    id: Date.now(),
    type: testType,
    date: new Date().toISOString(),
    results: resultsArray, // Use the new array format
    topArea: Object.keys(percentages).reduce((a, b) => percentages[a] > percentages[b] ? a : b, 'N/A')
  };

  // If no user, save temporarily and exit
  if (!user) {
    console.warn('No hay usuario activo, guardando resultados en localStorage temporal');
    localStorage.setItem('latestTestResult', JSON.stringify(result));
    return;
  }

  // Update user in the database
  const db = getDB();
  const userIndex = db.users.findIndex(u => u.id === user.id);

  if (userIndex !== -1) {
    const userToUpdate = db.users[userIndex];
    
    if (!userToUpdate.testResults) {
      userToUpdate.testResults = [];
    }
    userToUpdate.testResults.push(result);

    if (!userToUpdate.activityLog) {
      userToUpdate.activityLog = [];
    }
    userToUpdate.activityLog.push({
      type: 'test_completed',
      timestamp: new Date().toISOString(),
      details: { testType: testType }
    });
    
    saveDB(db);
    setActiveUser(userToUpdate);
  }

  localStorage.setItem('latestTestResult', JSON.stringify(result));
}


// ============================================ 
// PÁGINA DE RESULTADOS
// ============================================ 

/**
 * Inicializa la página de resultados del test.
 * Carga los datos del resultado desde URL o localStorage y los renderiza.
 */
export function initResultsPage() {
  console.log('🚀 Inicializando página de resultados...');

  const urlParams = new URLSearchParams(window.location.search);
  const resultId = urlParams.get('resultId');
  const user = getActiveUser();
  let resultData = null;

  if (resultId && user) {
    // Cargar un resultado específico del historial del usuario
    const numericResultId = parseInt(resultId, 10);
    resultData = user.testResults?.find(r => r.id === numericResultId);
    console.log('📋 Cargando resultado del historial:', numericResultId);
  } else {
    // Cargar el último resultado guardado en localStorage
    const latestResultStr = localStorage.getItem('latestTestResult');
    if (latestResultStr) {
      resultData = JSON.parse(latestResultStr);
      console.log('📋 Cargando último resultado guardado');
    }
  }

  const mainContainer = document.querySelector('.results-content .container');
  if (!resultData || !resultData.results) {
    console.error('❌ No se encontraron datos de resultados');
    mainContainer.innerHTML = `
      <div class="empty-message" style="padding: 2rem; text-align: center;">
        <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">No se encontraron resultados</h3>
        <p>No pudimos cargar los resultados del test. Por favor, <a href="test-vocacional-seccion.html" style="color: var(--primary-600); font-weight: 600;">intenta realizar un test</a> o selecciona uno de tu <a href="historial-evaluaciones.html" style="color: var(--primary-600); font-weight: 600;">historial</a>.</p>
      </div>
    `;
    return;
  }

  console.log('📊 Datos de resultados cargados:', resultData);
  console.log('📊 Porcentajes por área:', resultData.results);

  const db = getDB();

  console.log('🗄️ Base de datos cargada');
  console.log('🗄️ mastery_badges disponibles:', db.mastery_badges ? 'Sí' : 'No');
  console.log('🗄️ inventory_items disponibles:', db.inventory_items ? 'Sí' : 'No');
  console.log('🗄️ missions disponibles:', db.missions ? 'Sí' : 'No');

  console.log('🎭 Renderizando tarjetas de héroes...');
  renderHeroCards(resultData.results, db);

  console.log('📊 Renderizando estadísticas...');
  renderStats(resultData.results, db);

  console.log('🏅 Renderizando insignias de maestría...');
  renderMasteryBadges(resultData.results, db);

  console.log('🎒 Renderizando inventario...');
  renderInventory(resultData.results, db);

  console.log('🎯 Renderizando misiones...');
  renderMissions(resultData.results, db);

  // --- PDF Download Logic ---
  const downloadBtn = document.querySelector('.btn-secondary-action');
  if (downloadBtn) {
      downloadBtn.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Check if html2pdf is loaded
          if (typeof html2pdf === 'undefined') {
              console.error('html2pdf library not found');
              alert('Error: La librería de PDF no está cargada.');
              return;
          }

          const element = document.querySelector('.results-content .container');
          const buttons = document.querySelector('.action-buttons');
          
          // Hide buttons for PDF
          if (buttons) buttons.style.display = 'none';

          const opt = {
              margin: [10, 10, 10, 10],
              filename: 'Mis-Resultados-Vocatio.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { 
                  scale: 2, 
                  useCORS: true,
                  scrollY: 0
              },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
              pagebreak: { mode: ['css', 'legacy'] }
          };

          html2pdf().from(element).set(opt).save().then(() => {
              // Show buttons again
               if (buttons) buttons.style.display = 'flex';
          }).catch(err => {
              console.error("PDF generation error:", err);
              if (buttons) buttons.style.display = 'flex';
          });
      });
  }

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  console.log('✅ Página de resultados inicializada correctamente');
}

/**
 * Renderiza las tarjetas de héroe basadas en los resultados.
 */
function renderHeroCards(results, db) {
  const container = document.getElementById('heroes-grid-container');
  if (!container) return;

  const sortedAreas = [...results].sort((a, b) => b.score - a.score).slice(0, 3);

  const heroProfiles = db.hero_profiles;
  let content = '';

  sortedAreas.forEach(({ area, score }, index) => {
    const profile = heroProfiles[area];
    if (!profile) return;

    content += `
      <div class="hero-card ${profile.color_class}">
        <div class="hero-rank">#${index + 1}</div>
        <div class="hero-image-container">
          <img src="${profile.image}" alt="${profile.name}" class="hero-image">
        </div>
        <div class="hero-compatibility-section">
          <div class="hero-compatibility">${score}%</div>
          <div class="hero-label">COMPATIBILIDAD</div>
        </div>
        <div class="hero-info">
          <h3 class="hero-name">${profile.name}</h3>
          <p class="hero-category">${area}</p>
          <div class="hero-skills">
            ${profile.related_careers.map(career => `
              <div class="skill-item">
                <span class="skill-icon">${career.icon}</span>
                <span class="skill-text">${career.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <a href="../ExplorarCarreras/explorar-carreras-seccion.html?area=${encodeURIComponent(area)}" class="btn-details">
          Ver Detalles <i data-lucide="arrow-right"></i>
        </a>
      </div>
    `;
  });

  container.innerHTML = content;
}

/**
 * Renderiza las barras de estadísticas.
 */
function renderStats(results, db) {
  const container = document.getElementById('stats-card-container');
  if (!container) return;

  const sortedAreas = [...results].sort((a, b) => b.score - a.score);
  const heroProfiles = db.hero_profiles;

  let content = '';
  sortedAreas.forEach(({ area, score }) => {
    const profile = heroProfiles[area];
    if (!profile) return;

    content += `
      <div class="stat-row">
        <div class="stat-label">
          <span class="stat-icon">${profile.related_careers[0].icon || '❓'}</span>
          <span class="stat-name">${area}</span>
        </div>
        <div class="stat-bar-container">
          <div class="stat-bar ${profile.color_class}" style="width: ${score}%"></div>
        </div>
        <span class="stat-value">${score}%</span>
      </div>
    `;
  });

  container.innerHTML = content;
}

/**
 * Renderiza las insignias de maestría.
 */
function renderMasteryBadges(results, db) {
  const container = document.getElementById('badges-grid-container');
  if (!container) {
    console.error('Container badges-grid-container no encontrado');
    return;
  }

  const masteryBadges = db.mastery_badges;

  if (!masteryBadges || Object.keys(masteryBadges).length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 2rem;">No hay insignias disponibles.</p>';
    console.warn('No se encontraron mastery_badges en la base de datos');
    return;
  }

  let content = '';

  for (const area in masteryBadges) {
    const badge = masteryBadges[area];
    const userResult = results.find(r => r.area === area);
    const userScore = userResult ? userResult.score : 0;
    const isUnlocked = userScore >= 75;

    content += `
      <div class="badge-item ${isUnlocked ? 'unlocked' : 'locked'}">
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
        <span class="badge-status">${isUnlocked ? 'Obtenida' : 'Bloqueada'}</span>
      </div>
    `;
  }

  container.innerHTML = content;
  console.log('✅ Insignias de maestría renderizadas:', Object.keys(masteryBadges).length);
}

/**
 * Renderiza el inventario del usuario.
 */
function renderInventory(results, db) {
  const container = document.getElementById('inventory-list-container');
  if (!container) {
    console.error('Container inventory-list-container no encontrado');
    return;
  }

  const inventoryItems = db.inventory_items;

  if (!inventoryItems || Object.keys(inventoryItems).length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 1rem;">No hay items disponibles.</p>';
    console.warn('No se encontraron inventory_items en la base de datos');
    return;
  }

  const sortedAreas = [...results].sort((a, b) => b.score - a.score);

  let content = '';
  // Tomar los 2 items del área principal y 1 del área secundaria
  const topArea = sortedAreas[0] ? sortedAreas[0].area : null;
  const secondArea = sortedAreas[1] ? sortedAreas[1].area : null;

  console.log('🎒 Inventario - Área principal:', topArea, 'Área secundaria:', secondArea);

  if (topArea && inventoryItems[topArea]) {
    inventoryItems[topArea].slice(0, 2).forEach(item => {
      content += `
        <div class="inventory-item">
          <div class="item-icon">${item.icon}</div>
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-level">${item.level}</div>
          </div>
        </div>
      `;
    });
  }
  if (secondArea && inventoryItems[secondArea]) {
    inventoryItems[secondArea].slice(0, 1).forEach(item => {
      content += `
        <div class="inventory-item">
          <div class="item-icon">${item.icon}</div>
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-level">${item.level}</div>
          </div>
        </div>
      `;
    });
  }

  if (content === '') {
    container.innerHTML = '<p style="text-align: center; padding: 1rem;">Completa un test para llenar tu inventario.</p>';
    console.warn('No se generó contenido para el inventario');
  } else {
    container.innerHTML = content;
    console.log('✅ Inventario renderizado con éxito');
  }
}

/**
 * Renderiza las misiones recomendadas.
 */
function renderMissions(results, db) {
  const container = document.getElementById('missions-list-container');
  if (!container) {
    console.error('Container missions-list-container no encontrado');
    return;
  }

  const missions = db.missions;

  if (!missions || Object.keys(missions).length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 1rem;">No hay misiones disponibles.</p>';
    console.warn('No se encontraron missions en la base de datos');
    return;
  }

  // Ordenar de menor a mayor para encontrar las áreas más débiles
  const sortedAreas = [...results].sort((a, b) => a.score - b.score);

  let content = '';
  // Tomar las 3 áreas más débiles
  const weakAreas = sortedAreas.slice(0, 3);

  console.log('🎯 Misiones - Áreas más débiles:', weakAreas.map(r => `${r.area}: ${r.score}%`));

  weakAreas.forEach(({ area }) => {
    const mission = missions[area];
    if (mission) {
      content += `
        <div class="mission-item">
          <div class="mission-icon">${mission.icon}</div>
          <div class="mission-details">
            <h4 class="mission-name">${mission.name}</h4>
            <div class="mission-reward">
              <span class="reward-badge">Media</span>
              <span class="reward-xp">${mission.reward}</span>
            </div>
          </div>
          <button class="btn-accept">Aceptar</button>
        </div>
      `;
    }
  });

  if (content === '') {
    container.innerHTML = '<p style="text-align: center; padding: 1rem;">¡Parece que eres bueno en todo! No hay misiones por ahora.</p>';
    console.warn('No se generó contenido para las misiones');
  } else {
    container.innerHTML = content;
    console.log('✅ Misiones renderizadas:', weakAreas.length);
  }
}



// ============================================ 
// AUTO-INICIALIZACIÓN
// ============================================ 
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('formulario-test.html')) {
        initTradicionalTest();
    } else if (path.includes('test-aventura.html')) {
        initAventuraTest();
    } else if (path.includes('resultados-test.html')) {
        initResultsPage();
    }
});