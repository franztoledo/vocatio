// scripts/manage-lists.js

import { getCustomLists, deleteCustomList, findCareerById, showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const listsContainer = document.querySelector('.lists-container');
  const listsCountEl = document.querySelector('.lists-count');
  const newListBtn = document.querySelector('.btn-new-list');

  function renderLists() {
    const lists = getCustomLists();
    
    // Update count
    listsCountEl.textContent = `Mis Listas (${lists.length})`;
    
    // Clear container
    listsContainer.innerHTML = '';

    if (lists.length === 0) {
      listsContainer.innerHTML = `
        <div class="no-lists-message">
            <div class="no-lists-card">
                <div class="no-lists-icon">
                    <i data-lucide="folder-plus"></i>
                </div>
                <h3 class="no-lists-title">Aún no has creado ninguna lista</h3>
                <p class="no-lists-text">
                    Organiza tus carreras favoritas en listas personalizadas para compararlas y gestionarlas mejor.
                </p>
                <a href="crear-lista.html" class="no-lists-btn">Crear mi primera lista</a>
            </div>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    const listsHTML = lists.map(list => {
      const careers = list.careerIds.map(id => findCareerById(id)).filter(c => c); // Get full career objects
      
      const careerThumbsHTML = careers.slice(0, 5).map(c => `
        <div class="career-thumb">
          <img src="${c.imageUrl.replace('w=400', 'w=80')}" alt="${c.title}">
        </div>
      `).join('');

      const timeAgo = formatTimeAgo(list.createdAt);

      return `
        <div class="list-item">
          <div class="list-item-content">
            <h3 class="list-item-title">${list.name}</h3>
            <p class="list-item-meta">${careers.length} ${careers.length === 1 ? 'carrera' : 'carreras'} • Creada ${timeAgo}</p>
            <div class="list-item-preview">
              ${careerThumbsHTML}
              ${careers.length > 5 ? `<div class="career-thumb more">+${careers.length - 5}</div>` : ''}
            </div>
          </div>
          <div class="list-item-actions">
            <button class="list-action-btn edit" data-list-id="${list.id}">
              <span>Editar</span>
            </button>
            <button class="list-action-btn delete" data-list-id="${list.id}">
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    listsContainer.innerHTML = listsHTML;
    lucide.createIcons();
  }

  function handleListAction(event) {
    const target = event.target;
    const deleteBtn = target.closest('.delete');
    const editBtn = target.closest('.edit');

    if (deleteBtn) {
      const listId = parseInt(deleteBtn.dataset.listId, 10);
      if (confirm('¿Estás seguro de que quieres eliminar esta lista? Esta acción no se puede deshacer.')) {
        deleteCustomList(listId);
        showToast('Lista eliminada con éxito.', 'success');
        renderLists();
      }
    }

    if (editBtn) {
      const listId = parseInt(editBtn.dataset.listId, 10);
      // For now, we'll just show a toast. A real implementation would lead to an edit page.
      showToast(`La edición de la lista ${listId} aún no está implementada.`, 'info');
    }
  }

  // Helper function to format time since creation
  function formatTimeAgo(isoDate) {
    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const weeks = Math.round(days / 7);

    if (seconds < 60) return `hace ${seconds} segundos`;
    if (minutes < 60) return `hace ${minutes} minutos`;
    if (hours < 24) return `hace ${hours} horas`;
    if (days < 7) return `hace ${days} días`;
    return `hace ${weeks} semanas`;
  }

  // Event Listeners
  newListBtn.addEventListener('click', () => {
    window.location.href = 'crear-lista.html';
  });
  listsContainer.addEventListener('click', handleListAction);

  // Initial Render
  renderLists();
});
