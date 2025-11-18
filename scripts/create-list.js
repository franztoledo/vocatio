// scripts/create-list.js

import { getFavoriteCareers, createCustomList, showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const careersListContainer = document.querySelector('.careers-list');
  const createListForm = document.querySelector('.create-list-form');
  const listNameInput = createListForm.querySelector('input[type="text"]');
  const listDescriptionInput = createListForm.querySelector('textarea');
  const cancelButton = createListForm.querySelector('.btn-cancel');

  function renderFavoriteCareers() {
    const favoriteCareers = getFavoriteCareers();
    careersListContainer.innerHTML = ''; // Clear static content

    if (favoriteCareers.length === 0) {
      careersListContainer.innerHTML = `
        <div class="no-favorites-info">
          <i data-lucide="info"></i>
          <p>No tienes carreras favoritas para agregar a una lista.</p>
          <a href="buscar-carreras.html">Explora y agrega algunas</a>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    const careersHTML = favoriteCareers.map(career => `
      <label class="career-item">
        <input type="checkbox" class="career-checkbox" value="${career.id}">
        <div class="career-item-content">
          <img src="${career.imageUrl.replace('w=400', 'w=80')}" alt="${career.title}" class="career-item-image">
          <div class="career-item-info">
            <span class="career-item-title">${career.title}</span>
            <span class="career-item-meta">${career.area} • ${career.compatibility}% compatibilidad</span>
          </div>
        </div>
      </label>
    `).join('');

    careersListContainer.innerHTML = careersHTML;
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const listName = listNameInput.value.trim();
    const listDescription = listDescriptionInput.value.trim();
    
    const selectedCheckboxes = careersListContainer.querySelectorAll('.career-checkbox:checked');
    const selectedCareerIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value, 10));

    // Validation
    if (!listName) {
      showToast('Por favor, dale un nombre a tu lista.', 'error');
      listNameInput.focus();
      return;
    }
    if (selectedCareerIds.length === 0) {
      showToast('Debes seleccionar al menos una carrera.', 'error');
      return;
    }

    // Create the list
    createCustomList(listName, listDescription, selectedCareerIds);

    // Show success and redirect
    showToast('¡Lista creada con éxito!', 'success');
    setTimeout(() => {
      window.location.href = 'gestionar-listas.html';
    }, 1500); // Redirect after toast is visible
  }

  // Event Listeners
  createListForm.addEventListener('submit', handleFormSubmit);
  cancelButton.addEventListener('click', () => {
    window.history.back();
  });

  // Initial Render
  renderFavoriteCareers();
  lucide.createIcons();
});
