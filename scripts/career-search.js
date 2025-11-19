// scripts/career-search.js

import { getDB } from './database.js';
import { isFavorite, toggleFavorite } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize database and get career data
  const db = getDB();
  const allCareers = db.careers;

  // Get DOM elements
  const careerResultsContainer = document.querySelector('.career-results');
  const searchInput = document.querySelector('.filter-input[placeholder="Medicina"]');
  const areaInput = document.querySelector('.filter-input[placeholder="Ciencias de la Salud"]');
  const durationSelect = document.querySelectorAll('.filter-select')[0];
  const modalitySelect = document.querySelectorAll('.filter-select')[1];
  const difficultySelect = document.querySelectorAll('.filter-select')[2];
  const demandSelect = document.querySelectorAll('.filter-select')[3];
  const clearFiltersButton = document.querySelector('.filters-clear');

  /**
   * Renders the career cards to the page
   * @param {Array} careers - An array of career objects
   */
  function renderCareers(careers) {
    // Find the results header and clear only the cards
    const resultsHeader = careerResultsContainer.querySelector('.results-header');
    const resultsTitle = resultsHeader.querySelector('.results-title');

    // Clear existing cards, but keep the header
    const existingCards = careerResultsContainer.querySelectorAll('.career-card, .no-results-message');
    existingCards.forEach(card => card.remove());

    // Update the results count in the header
    resultsTitle.textContent = `${careers.length} carreras encontradas`;

    if (careers.length === 0) {
      const noResultsHTML = `
        <div class="no-results-message">
          <div class="no-results-card">
            <div class="no-results-icon">
              <i data-lucide="search-x"></i>
            </div>
            <h3 class="no-results-title">No se encontraron resultados</h3>
            <p class="no-results-text">
              No hemos encontrado carreras que coincidan con tus filtros.
              ¡Pero no te preocupes! Estamos trabajando para añadir más opciones pronto.
            </p>
            <button class="no-results-btn">Limpiar Filtros</button>
          </div>
        </div>
      `;
      careerResultsContainer.insertAdjacentHTML('beforeend', noResultsHTML);
      lucide.createIcons();
      
      // Add event listener for the new button
      const clearFiltersBtn = careerResultsContainer.querySelector('.no-results-btn');
      if(clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
      }
      return;
    }

    const careersHTML = careers.map(career => {
      const isFav = isFavorite(career.id);
      return `
      <div class="career-card">
        <div class="career-card-image">
          <img src="${career.imageUrl}" alt="${career.title}">
          <div class="career-card-overlay"></div>
          <div class="career-card-badges">
            <span class="career-badge compatibility">${career.compatibility}% Compatible</span>
          </div>
          <button class="career-favorite-btn ${isFav ? 'active' : ''}" data-career-id="${career.id}" title="Agregar a favoritos">
            <i data-lucide="heart"></i>
          </button>
        </div>
        <div class="career-card-content">
          <span class="career-card-category">${career.area}</span>
          <h3 class="career-card-title">${career.title}</h3>
          <div class="career-card-meta">
            <div class="career-meta-item">
              <i data-lucide="clock"></i>
              <span>${career.duration}</span>
            </div>
            <div class="career-meta-item">
              <i data-lucide="users"></i>
              <span>${career.modality}</span>
            </div>
            <div class="career-meta-item">
              <i data-lucide="trending-up"></i>
              <span>Demanda ${career.demanda_laboral}</span>
            </div>
            <div class="career-meta-item">
              <i data-lucide="building"></i>
              <span>${career.universidades_count} universidades</span>
            </div>
          </div>
          <div class="career-card-actions">
            <a href="detalle-carrera.html?id=${career.id}" class="career-card-btn primary">Ver Detalles</a>
            <a href="#" class="career-card-btn secondary">Comparar</a>
          </div>
        </div>
      </div>
    `}).join('');

    // Append the new cards after the header
    careerResultsContainer.insertAdjacentHTML('beforeend', careersHTML);
    lucide.createIcons();
  }

  /**
   * Filters the careers based on the selected criteria
   */
  function filterCareers() {
    let filteredCareers = [...allCareers];

    // Filter by search input
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filteredCareers = filteredCareers.filter(career =>
        career.title.toLowerCase().includes(searchTerm) ||
        career.keywords.some(k => k.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by area
    const areaTerm = areaInput.value.toLowerCase();
    if (areaTerm) {
      filteredCareers = filteredCareers.filter(career =>
        career.area.toLowerCase().includes(areaTerm)
      );
    }

    // Filter by duration
    const durationValue = durationSelect.value;
    if (durationValue !== 'Cualquier duración') {
      filteredCareers = filteredCareers.filter(career => career.duration === durationValue);
    }

    // Filter by modality
    const modalityValue = modalitySelect.value;
    if (modalityValue !== 'Cualquier modalidad') {
        filteredCareers = filteredCareers.filter(career => career.modality === modalityValue);
    }

    // Filter by difficulty
    const difficultyValue = difficultySelect.value;
    if (difficultyValue !== 'Cualquier nivel') {
        filteredCareers = filteredCareers.filter(career => career.dificultad === difficultyValue);
    }

    // Filter by demand
    const demandValue = demandSelect.value;
    if (demandValue !== 'Cualquier demanda') {
        filteredCareers = filteredCareers.filter(career => career.demanda_laboral === demandValue);
    }

    renderCareers(filteredCareers);
  }

  /**
   * Clears all filters and re-renders all careers
   */
  function clearFilters() {
    searchInput.value = '';
    areaInput.value = '';
    durationSelect.selectedIndex = 0;
    modalitySelect.selectedIndex = 0;
    difficultySelect.selectedIndex = 0;
    demandSelect.selectedIndex = 0;
    filterCareers();
  }

  // --- Event Listeners ---

  // Filters
  searchInput.addEventListener('input', filterCareers);
  areaInput.addEventListener('input', filterCareers);
  durationSelect.addEventListener('change', filterCareers);
  modalitySelect.addEventListener('change', filterCareers);
  difficultySelect.addEventListener('change', filterCareers);
  demandSelect.addEventListener('change', filterCareers);
  clearFiltersButton.addEventListener('click', (e) => {
    e.preventDefault();
    clearFilters();
  });

  // Event delegation for favorite buttons
  careerResultsContainer.addEventListener('click', (e) => {
    const favoriteBtn = e.target.closest('.career-favorite-btn');
    if (favoriteBtn) {
      const careerId = parseInt(favoriteBtn.dataset.careerId, 10);
      if (careerId) {
        const isNowFavorite = toggleFavorite(careerId);
        favoriteBtn.classList.toggle('active', isNowFavorite);
      }
    }
  });

  // Initial render of all careers
  // Remove static cards from HTML before initial render
  const staticCards = document.querySelectorAll('.career-results .career-card');
  staticCards.forEach(card => card.remove());
  renderCareers(allCareers);
});
