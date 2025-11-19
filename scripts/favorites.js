// scripts/favorites.js

import { getFavoriteCareers, toggleFavorite } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const favoritesGrid = document.querySelector('.favorites-grid');
  const favoritesCount = document.querySelector('.favorites-count');

  function renderFavorites() {
    const favoriteCareers = getFavoriteCareers();

    // Update count
    if (favoritesCount) {
      favoritesCount.textContent = `${favoriteCareers.length} ${favoriteCareers.length === 1 ? 'carrera favorita' : 'carreras favoritas'}`;
    }

    // Clear existing grid
    favoritesGrid.innerHTML = '';

    if (favoriteCareers.length === 0) {
      favoritesGrid.innerHTML = `
        <div class="no-favorites-message">
            <div class="no-favorites-card">
                <div class="no-favorites-icon">
                    <i data-lucide="folder-heart"></i>
                </div>
                <h3 class="no-favorites-title">No has guardado ninguna carrera</h3>
                <p class="no-favorites-text">
                    Parece que tu lista de favoritos está vacía. ¡No te preocupes! 
                    Explora las carreras y guárdalas para verlas aquí.
                </p>
                <a href="buscar-carreras.html" class="no-favorites-btn">Explorar Carreras</a>
            </div>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    const favoritesHTML = favoriteCareers.map(career => `
      <div class="favorite-card">
        <div class="favorite-card-image">
          <img src="${career.imageUrl.replace('w=400', 'w=300')}" alt="${career.title}">
        </div>
        <div class="favorite-card-content">
          <h3 class="favorite-card-title">${career.title}</h3>
          <p class="favorite-card-category">${career.area}</p>
          <div class="favorite-card-meta">
            <span class="meta-item">
              <i data-lucide="check"></i>
              Compatibilidad: <strong>${career.compatibility}%</strong>
            </span>
          </div>
          <div class="favorite-card-actions">
            <a href="detalle-carrera.html?id=${career.id}" class="btn-favorite primary">Ver Detalles</a>
            <button class="btn-favorite secondary remove-favorite" data-career-id="${career.id}" title="Quitar de favoritos">
              <i data-lucide="x"></i>
              <span>Quitar</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    favoritesGrid.innerHTML = favoritesHTML;
    lucide.createIcons();
  }

  // Event listener for removing favorites
  favoritesGrid.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-favorite');
    if (removeBtn) {
      const careerId = parseInt(removeBtn.dataset.careerId, 10);
      if (careerId) {
        toggleFavorite(careerId); // This will remove it from favorites
        renderFavorites(); // Re-render the list
      }
    }
  });

  // Initial render
  renderFavorites();
});
