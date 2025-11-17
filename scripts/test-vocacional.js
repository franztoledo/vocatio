// scripts/test-vocacional.js
// Lógica completa para Tests Vocacionales
// Incluye: Test Aventura (Swipe Cards), Test Tradicional y Formulario Test

import { getDB, saveDB } from './database.js';
import { getActiveUser, updateActiveUser } from './utils.js';

// ============================================
// CONFIGURACIÓN Y ESTADO GLOBAL
// ============================================

// Estado del test actual
let currentTestState = {
  testType: null, // 'aventura', 'tradicional', 'formulario'
  currentQuestion: 0,
  totalQuestions: 0,
  answers: [],
  areaScores: {},
  startTime: null,
  testId: null
};

// ============================================
// TEST AVENTURA - SWIPE CARDS (ESTILO TINDER)
// ============================================

/**
 * Inicializa el Test Aventura con swipe cards
 */
export function initTestAventura() {
  console.log('🚀 Iniciando Test Aventura...');

  const db = getDB();
  const questions = db.vocational_tests.aventura;

  if (!questions || questions.length === 0) {
    console.error('❌ No se encontraron preguntas para el test aventura');
    return;
  }

  // Inicializar estado
  currentTestState = {
    testType: 'aventura',
    currentQuestion: 0,
    totalQuestions: questions.length,
    answers: [],
    areaScores: {},
    startTime: new Date(),
    testId: `test_aventura_${Date.now()}`
  };

  // Cargar preguntas
  loadSwipeCards(questions);

  // Actualizar progreso inicial
  updateProgress();

  // Inicializar eventos de swipe
  initSwipeEvents();

  console.log(`✅ Test Aventura iniciado: ${questions.length} preguntas`);
}

/**
 * Carga las swipe cards dinámicamente
 */
function loadSwipeCards(questions) {
  const cardsContainer = document.querySelector('.cards-stack');
  if (!cardsContainer) return;

  // Limpiar cards existentes
  cardsContainer.innerHTML = '';

  // Crear solo las primeras 3 cards (actual + 2 de fondo)
  const cardsToShow = Math.min(3, questions.length);

  for (let i = 0; i < cardsToShow; i++) {
    const question = questions[i];
    const card = createSwipeCard(question, i);
    cardsContainer.appendChild(card);
  }
}

/**
 * Crea una swipe card individual
 */
function createSwipeCard(question, index) {
  const card = document.createElement('div');
  card.className = `swipe-card ${index === 0 ? 'active' : 'background'}`;
  card.dataset.questionId = question.id;
  card.dataset.index = index;

  // Determinar qué opción mostrar (alternamos entre left y right)
  const isShowingLeft = index % 2 === 0;
  const option = isShowingLeft ? question.leftOption : question.rightOption;
  const oppositeOption = isShowingLeft ? question.rightOption : question.leftOption;

  card.innerHTML = `
    <div class="card-image">
      <img src="${option.image}" alt="${option.text}" loading="lazy">
    </div>

    <div class="card-content">
      <h2 class="card-title">${question.question}</h2>
      <p class="card-description">${option.text}</p>

      <div class="card-actions">
        <button class="btn-action btn-no" data-direction="left" data-area="${oppositeOption.area}">
          <i data-lucide="x"></i>
          <span>No</span>
        </button>

        <button class="btn-action btn-si" data-direction="right" data-area="${option.area}">
          <i data-lucide="heart"></i>
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

  // Inicializar iconos de lucide
  if (window.lucide) {
    window.lucide.createIcons({ nameAttr: 'data-lucide' });
  }

  return card;
}

/**
 * Inicializa los eventos de swipe (mouse y touch)
 */
function initSwipeEvents() {
  const cardsContainer = document.querySelector('.cards-stack');
  if (!cardsContainer) return;

  // Variables para el swipe
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let isDragging = false;
  let activeCard = null;

  // Event listeners para mouse
  cardsContainer.addEventListener('mousedown', handleStart);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);

  // Event listeners para touch
  cardsContainer.addEventListener('touchstart', handleStart, { passive: false });
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('touchend', handleEnd);

  // Event listeners para botones
  cardsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-action');
    if (btn) {
      const direction = btn.dataset.direction;
      const area = btn.dataset.area;
      const card = btn.closest('.swipe-card.active');

      if (card) {
        handleSwipe(card, direction, area);
      }
    }
  });

  /**
   * Inicia el arrastre
   */
  function handleStart(e) {
    const card = e.target.closest('.swipe-card.active');
    if (!card) return;

    activeCard = card;
    isDragging = true;

    const point = e.type.includes('mouse') ? e : e.touches[0];
    startX = point.clientX;
    startY = point.clientY;

    card.style.transition = 'none';
    card.style.cursor = 'grabbing';
  }

  /**
   * Maneja el movimiento del arrastre
   */
  function handleMove(e) {
    if (!isDragging || !activeCard) return;

    e.preventDefault();

    const point = e.type.includes('mouse') ? e : e.touches[0];
    currentX = point.clientX - startX;
    currentY = point.clientY - startY;

    // Calcular rotación basada en el movimiento horizontal
    const rotation = currentX / 20;

    // Aplicar transformación
    activeCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;

    // Mostrar indicador visual
    if (Math.abs(currentX) > 50) {
      const opacity = Math.min(Math.abs(currentX) / 100, 1);
      if (currentX > 0) {
        showSwipeIndicator('right', opacity);
      } else {
        showSwipeIndicator('left', opacity);
      }
    } else {
      hideSwipeIndicator();
    }
  }

  /**
   * Finaliza el arrastre
   */
  function handleEnd(e) {
    if (!isDragging || !activeCard) return;

    isDragging = false;
    hideSwipeIndicator();

    const swipeThreshold = 100;

    // Determinar si el swipe fue suficiente
    if (Math.abs(currentX) > swipeThreshold) {
      const direction = currentX > 0 ? 'right' : 'left';

      // Obtener el área de la opción seleccionada
      const questionId = activeCard.dataset.questionId;
      const db = getDB();
      const question = db.vocational_tests.aventura.find(q => q.id == questionId);

      if (question) {
        const selectedArea = direction === 'right'
          ? question.rightOption.area
          : question.leftOption.area;

        handleSwipe(activeCard, direction, selectedArea);
      }
    } else {
      // Volver a la posición original
      activeCard.style.transition = 'transform 0.3s ease';
      activeCard.style.transform = '';
      activeCard.style.cursor = 'grab';

      setTimeout(() => {
        if (activeCard) {
          activeCard.style.transition = '';
        }
      }, 300);
    }

    currentX = 0;
    currentY = 0;
    activeCard = null;
  }
}

/**
 * Muestra indicador de swipe
 */
function showSwipeIndicator(direction, opacity) {
  const activeCard = document.querySelector('.swipe-card.active');
  if (!activeCard) return;

  // Añadir clases para los estilos CSS
  if (direction === 'right') {
    activeCard.classList.remove('swiping-left');
    activeCard.classList.add('swiping-right');
  } else {
    activeCard.classList.remove('swiping-right');
    activeCard.classList.add('swiping-left');
  }
}

/**
 * Oculta indicador de swipe
 */
function hideSwipeIndicator() {
  const activeCard = document.querySelector('.swipe-card.active');
  if (activeCard) {
    activeCard.classList.remove('swiping-left', 'swiping-right');
  }
}

/**
 * Maneja el swipe de una card
 */
function handleSwipe(card, direction, selectedArea) {
  console.log(`💫 Swipe ${direction} - Área: ${selectedArea}`);

  // Guardar respuesta
  saveAnswer(selectedArea);

  // Animar swipe
  card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  card.classList.add(`swipe-${direction}`);

  // Mostrar feedback
  showFeedback(direction === 'right');

  // Esperar a que termine la animación
  setTimeout(() => {
    // Avanzar a la siguiente pregunta
    nextQuestion();
  }, 500);
}

/**
 * Guarda la respuesta del usuario
 */
function saveAnswer(area) {
  currentTestState.answers.push({
    questionIndex: currentTestState.currentQuestion,
    area: area,
    timestamp: new Date()
  });

  // Actualizar scores por área
  if (!currentTestState.areaScores[area]) {
    currentTestState.areaScores[area] = 0;
  }
  currentTestState.areaScores[area]++;

  console.log('📊 Scores actuales:', currentTestState.areaScores);
}

/**
 * Muestra feedback visual
 */
function showFeedback(isPositive) {
  const feedbackOverlay = document.getElementById('feedbackOverlay');
  if (!feedbackOverlay) return;

  const feedbackCard = feedbackOverlay.querySelector('.feedback-card');
  const icon = feedbackCard.querySelector('i');
  const text = feedbackCard.querySelector('h3');

  if (isPositive) {
    icon.setAttribute('data-lucide', 'heart');
    text.textContent = '¡ME GUSTA!';
    feedbackCard.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
  } else {
    icon.setAttribute('data-lucide', 'x');
    text.textContent = 'NO ES LO MÍO';
    feedbackCard.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
  }

  if (window.lucide) {
    window.lucide.createIcons({ nameAttr: 'data-lucide' });
  }

  feedbackOverlay.classList.add('show');

  setTimeout(() => {
    feedbackOverlay.classList.remove('show');
  }, 800);
}

/**
 * Avanza a la siguiente pregunta
 */
function nextQuestion() {
  currentTestState.currentQuestion++;

  const db = getDB();
  const questions = db.vocational_tests.aventura;

  // Actualizar progreso
  updateProgress();

  // Verificar si terminó el test
  if (currentTestState.currentQuestion >= currentTestState.totalQuestions) {
    finishTest();
    return;
  }

  // Remover la card actual
  const cardsContainer = document.querySelector('.cards-stack');
  const currentCard = cardsContainer.querySelector('.swipe-card.active');
  if (currentCard) {
    currentCard.remove();
  }

  // Activar la siguiente card
  const nextCard = cardsContainer.querySelector('.swipe-card');
  if (nextCard) {
    nextCard.classList.remove('background');
    nextCard.classList.add('active');
  }

  // Agregar nueva card al final si hay más preguntas
  const nextQuestionIndex = currentTestState.currentQuestion + 2;
  if (nextQuestionIndex < questions.length) {
    const newCard = createSwipeCard(questions[nextQuestionIndex], 2);
    cardsContainer.appendChild(newCard);
  }

  // Verificar si es momento de mostrar nivel completado
  checkLevelComplete();
}

/**
 * Actualiza el progreso visual
 */
function updateProgress() {
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');

  if (progressFill && progressText) {
    const percentage = ((currentTestState.currentQuestion + 1) / currentTestState.totalQuestions) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${currentTestState.currentQuestion + 1}/${currentTestState.totalQuestions}`;
  }

  // Actualizar badge de nivel
  updateLevelBadge();
}

/**
 * Actualiza el badge de nivel
 */
function updateLevelBadge() {
  const levelBadge = document.querySelector('.level-badge span:last-child');
  if (!levelBadge) return;

  const progress = currentTestState.currentQuestion + 1;
  const total = currentTestState.totalQuestions;

  let level = 1;
  let levelName = 'Explorador Curioso';
  let emoji = '🔍';

  if (progress > total * 0.75) {
    level = 4;
    levelName = 'Casi Experto';
    emoji = '🎯';
  } else if (progress > total * 0.5) {
    level = 3;
    levelName = 'En Descubrimiento';
    emoji = '🎨';
  } else if (progress > total * 0.25) {
    level = 2;
    levelName = 'Conociendo Opciones';
    emoji = '🚀';
  }

  const emojiSpan = levelBadge.previousElementSibling;
  if (emojiSpan) {
    emojiSpan.textContent = emoji;
  }

  levelBadge.textContent = `Nivel ${level}: ${levelName}`;
}

/**
 * Verifica si se completó un nivel
 */
function checkLevelComplete() {
  const progress = currentTestState.currentQuestion;
  const total = currentTestState.totalQuestions;

  // Mostrar pantalla de nivel completo cada 25%
  if (progress === Math.floor(total * 0.25) ||
      progress === Math.floor(total * 0.5) ||
      progress === Math.floor(total * 0.75)) {
    showLevelComplete(progress, total);
  }
}

/**
 * Muestra pantalla de nivel completado
 */
function showLevelComplete(current, total) {
  const levelCompleteScreen = document.getElementById('levelCompleteScreen');
  if (!levelCompleteScreen) return;

  const percentage = (current / total) * 100;
  const level = Math.ceil(current / (total / 4));

  const levelNames = [
    'Explorador Curioso',
    'Conociendo Opciones',
    'En Descubrimiento',
    'Casi Experto'
  ];

  const title = levelCompleteScreen.querySelector('.complete-title');
  const badgeTitle = levelCompleteScreen.querySelector('.badge-content h3');
  const badgeText = levelCompleteScreen.querySelector('.badge-content p');
  const progressText = levelCompleteScreen.querySelector('.complete-progress p');
  const progressFill = levelCompleteScreen.querySelector('.complete-progress-fill');

  title.textContent = `¡Nivel ${level} Completado!`;
  badgeTitle.textContent = `"${levelNames[level - 1]}"`;
  badgeText.textContent = '¡Sigue descubriendo tus intereses!';
  progressText.textContent = `Progreso total: ${current}/${total} preguntas`;
  progressFill.style.width = `${percentage}%`;

  levelCompleteScreen.style.display = 'flex';

  // Botón continuar
  const btnContinue = levelCompleteScreen.querySelector('.btn-continue');
  btnContinue.onclick = () => {
    levelCompleteScreen.style.display = 'none';
  };
}

/**
 * Finaliza el test y muestra resultados
 */
function finishTest() {
  console.log('🎉 Test completado!');
  console.log('📊 Resultados:', currentTestState.areaScores);

  // Calcular área dominante
  const topArea = Object.entries(currentTestState.areaScores)
    .sort((a, b) => b[1] - a[1])[0];

  console.log('🏆 Área dominante:', topArea);

  // Guardar resultados en el usuario
  saveTestResults();

  // Redirigir a resultados
  setTimeout(() => {
    window.location.href = 'resultados-test.html';
  }, 1000);
}

/**
 * Guarda los resultados del test en la base de datos
 */
function saveTestResults() {
  const user = getActiveUser();
  if (!user) {
    console.warn('⚠️ No hay usuario activo, guardando en localStorage temporal');
    localStorage.setItem('lastTestResult', JSON.stringify(currentTestState));
    return;
  }

  const testResult = {
    id: currentTestState.testId,
    type: currentTestState.testType,
    date: new Date().toISOString(),
    scores: currentTestState.areaScores,
    topArea: Object.entries(currentTestState.areaScores)
      .sort((a, b) => b[1] - a[1])[0][0],
    duration: (new Date() - currentTestState.startTime) / 1000, // segundos
    totalQuestions: currentTestState.totalQuestions,
    answeredQuestions: currentTestState.answers.length
  };

  // Agregar resultado al historial del usuario
  if (!user.testResults) {
    user.testResults = [];
  }
  user.testResults.push(testResult);

  // Actualizar usuario
  updateActiveUser(user);

  // También guardar en localStorage temporal
  localStorage.setItem('lastTestResult', JSON.stringify(currentTestState));

  console.log('💾 Resultados guardados:', testResult);
}

// ============================================
// TEST TRADICIONAL - PREGUNTAS CON ESCALA
// ============================================

/**
 * Inicializa el Test Tradicional
 */
export function initTestTradicional() {
  console.log('🚀 Iniciando Test Tradicional...');

  const db = getDB();
  const questions = db.vocational_tests.tradicional;

  if (!questions || questions.length === 0) {
    console.error('❌ No se encontraron preguntas para el test tradicional');
    return;
  }

  currentTestState = {
    testType: 'tradicional',
    currentQuestion: 0,
    totalQuestions: questions.length,
    answers: [],
    areaScores: {},
    startTime: new Date(),
    testId: `test_tradicional_${Date.now()}`
  };

  console.log(`✅ Test Tradicional iniciado: ${questions.length} preguntas`);
}

// ============================================
// FORMULARIO TEST - PREGUNTAS POR BLOQUES
// ============================================

/**
 * Inicializa el Formulario Test
 */
export function initFormularioTest() {
  console.log('🚀 Iniciando Formulario Test...');

  const db = getDB();
  const questions = db.vocational_tests.tradicional;

  if (!questions || questions.length === 0) {
    console.error('❌ No se encontraron preguntas');
    return;
  }

  currentTestState = {
    testType: 'formulario',
    currentQuestion: 0,
    totalQuestions: questions.length,
    answers: [],
    areaScores: {},
    startTime: new Date(),
    testId: `test_formulario_${Date.now()}`
  };

  loadFormularioQuestions(questions);

  console.log(`✅ Formulario Test iniciado: ${questions.length} preguntas`);
}

/**
 * Carga las preguntas del formulario dinámicamente
 */
function loadFormularioQuestions(questions) {
  const questionsTable = document.querySelector('.questions-table');
  if (!questionsTable) return;

  // Limpiar preguntas existentes (mantener header)
  const questionRows = questionsTable.querySelectorAll('.question-row');
  questionRows.forEach(row => row.remove());

  // Crear preguntas dinámicamente
  questions.forEach((question, index) => {
    const row = createQuestionRow(question, index);
    questionsTable.appendChild(row);
  });
}

/**
 * Crea una fila de pregunta para el formulario
 */
function createQuestionRow(question, index) {
  const row = document.createElement('div');
  row.className = 'question-row';

  row.innerHTML = `
    <div class="question-text">
      <span class="question-number">${index + 1}.</span>
      <span>${question.text}</span>
    </div>
    <div class="question-options">
      <label class="radio-option">
        <input type="radio" name="q${question.id}" value="si" data-area="${question.area}" data-weight="${question.weight}" required>
        <span class="radio-custom"></span>
      </label>
      <label class="radio-option">
        <input type="radio" name="q${question.id}" value="no" data-area="${question.area}" data-weight="0">
        <span class="radio-custom"></span>
      </label>
      <label class="radio-option">
        <input type="radio" name="q${question.id}" value="duda" data-area="${question.area}" data-weight="${question.weight * 0.5}">
        <span class="radio-custom"></span>
      </label>
    </div>
  `;

  return row;
}

/**
 * Procesa las respuestas del formulario
 */
export function processFormularioAnswers() {
  const form = document.getElementById('testForm');
  if (!form) return;

  const formData = new FormData(form);
  const areaScores = {};

  // Procesar cada respuesta
  for (const [name, value] of formData.entries()) {
    const radio = form.querySelector(`input[name="${name}"][value="${value}"]`);
    if (!radio) continue;

    const area = radio.dataset.area;
    const weight = parseFloat(radio.dataset.weight);

    if (!areaScores[area]) {
      areaScores[area] = 0;
    }
    areaScores[area] += weight;
  }

  currentTestState.areaScores = areaScores;
  saveTestResults();

  window.location.href = 'resultados-test.html';
}

// ============================================
// UTILIDADES GENERALES
// ============================================

/**
 * Guarda el progreso del test
 */
export function saveProgress() {
  localStorage.setItem('testProgress', JSON.stringify(currentTestState));
  console.log('💾 Progreso guardado');
}

/**
 * Carga el progreso guardado
 */
export function loadProgress() {
  const saved = localStorage.getItem('testProgress');
  if (saved) {
    currentTestState = JSON.parse(saved);
    console.log('📥 Progreso cargado:', currentTestState);
    return true;
  }
  return false;
}

/**
 * Limpia el progreso guardado
 */
export function clearProgress() {
  localStorage.removeItem('testProgress');
  console.log('🗑️ Progreso eliminado');
}

/**
 * Obtiene el estado actual del test
 */
export function getCurrentTestState() {
  return currentTestState;
}

// ============================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================

// Detectar qué página estamos y auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('test-aventura.html')) {
    initTestAventura();
  } else if (path.includes('formulario-test.html')) {
    initFormularioTest();

    // Event listener para el botón siguiente
    const btnSiguiente = document.querySelector('.btn-siguiente');
    if (btnSiguiente) {
      btnSiguiente.addEventListener('click', (e) => {
        e.preventDefault();

        const form = document.getElementById('testForm');
        if (form.checkValidity()) {
          processFormularioAnswers();
        } else {
          alert('Por favor, responde todas las preguntas antes de continuar.');
        }
      });
    }
  } else if (path.includes('test-vocacional-tradicional.html')) {
    initTestTradicional();
  }
});

console.log('✅ test-vocacional.js cargado correctamente');
