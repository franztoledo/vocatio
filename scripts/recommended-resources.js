import { getDB, getActiveUser, saveDB } from './utils.js';

let recommendedResourcesCache = [];
let currentUserCache = null;

const categoryMap = {
    'Tecnología': 'tech',
    'Salud': 'health',
    'Ciencias de la Salud': 'health',
    'Arte y Diseño': 'art',
    'Negocios': 'business',
    'Ciencias Sociales': 'social'
};

// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.resources-grid');
    if (!grid) return;

    const user = getActiveUser();
    if (!user) {
        displayLoginMessage(grid);
        return;
    }

    initializePage(user.id);
});

function initializePage(userId) {
    const db = getDB();
    currentUserCache = db.users.find(u => u.id === userId);
    const allResources = db.resources;
    
    const userInterests = getUserInterests(currentUserCache);

    if (userInterests.length === 0) {
        displayTakeTestMessage();
        return;
    }

    recommendedResourcesCache = allResources.map(resource => {
        const interest = userInterests.find(i => i.area === resource.area);
        const match = interest ? interest.score : 0;
        return { ...resource, match };
    }).sort((a, b) => b.match - a.match);

    updateHeaderStats(recommendedResourcesCache, currentUserCache, userInterests);
    updateFilterCounts(recommendedResourcesCache);
    renderResources(recommendedResourcesCache, currentUserCache);
    renderSavedResources(currentUserCache);
    
    setupEventListeners(currentUserCache);
}

// --- Data & State Management ---
function getUserInterests(user) {
    if (!user || !user.testResults || user.testResults.length === 0) return [];
    const latestTest = user.testResults[user.testResults.length - 1];
    
    // Safeguard: Ensure the results property is an array before returning
    if (latestTest && Array.isArray(latestTest.results)) {
        return latestTest.results;
    }
    
    return [];
}

function toggleBookmark(resourceId, userId) {
    const db = getDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) return;

    let isNowSaved;
    const resourceIndex = user.savedResources.indexOf(resourceId);
    if (resourceIndex > -1) {
        user.savedResources.splice(resourceIndex, 1);
        isNowSaved = false;
    } else {
        user.savedResources.push(resourceId);
        isNowSaved = true;

        // Add to activity log
        if (!user.activityLog) {
            user.activityLog = [];
        }
        const resource = db.resources.find(r => r.id === resourceId);
        user.activityLog.push({
            type: 'resource_saved',
            timestamp: new Date().toISOString(),
            details: {
                resourceId: resourceId,
                resourceTitle: resource ? resource.title : 'Desconocido'
            }
        });
    }
    saveDB(db);
    currentUserCache = user; // Update cache
    return isNowSaved;
}

// --- UI Rendering ---
function displayLoginMessage(grid) {
    grid.innerHTML = `<div class="no-results-message"><h3>Inicia sesión para ver tus recursos recomendados</h3><p>Tus recursos personalizados aparecerán aquí una vez que inicies sesión y completes un test vocacional.</p><a href="../Login/login.html" class="btn-primary" style="margin-top: 1rem;">Iniciar Sesión</a></div>`;
}

function displayTakeTestMessage() {
    const grid = document.querySelector('.resources-grid');
    grid.innerHTML = `<div class="no-results-message"><h3>Completa un test para obtener recomendaciones</h3><p>Aún no has completado un test vocacional. ¡Realiza uno para descubrir recursos hechos a tu medida!</p><a href="../TestVocacional/test-vocacional-seccion.html" class="btn-primary" style="margin-top: 1rem;">Hacer un Test</a></div>`;
}

function updateHeaderStats(resources, user, interests) {
    const stats = document.querySelectorAll('.explore-stat-number');
    if (stats.length < 4) return;

    stats[0].textContent = resources.length;
    stats[1].textContent = user.savedResources.length;
    const topInterest = interests.reduce((max, current) => (current.score > max.score) ? current : max, { score: 0 });
    stats[2].textContent = `${topInterest.score}%`;
    
    const uniqueCategories = [...new Set(resources.map(r => r.area))];
    stats[3].textContent = uniqueCategories.length;

    const messageBox = document.querySelector('.recommended-message .message-content');
    if (messageBox && topInterest.area) {
        messageBox.innerHTML = `
            <strong>Recomendados para ti</strong>
            <p>Basado en tu compatibilidad con ${topInterest.area} (${topInterest.score}%), hemos seleccionado estos recursos.</p>
        `;
    }
}

function updateFilterCounts(resources) {
    const filters = document.querySelectorAll('.filter-btn');
    const categoryCounts = resources.reduce((acc, resource) => {
        const categoryKey = categoryMap[resource.area] || 'other';
        acc[categoryKey] = (acc[categoryKey] || 0) + 1;
        return acc;
    }, {});

    filters.forEach(label => {
        const categoryId = label.getAttribute('for');
        const categoryName = categoryId.replace('cat-', ''); // e.g., 'tech', 'health'
        let count = 0;
        if (categoryName === 'all') {
            count = resources.length;
        } else {
            count = categoryCounts[categoryName] || 0;
        }
        // Keep the original text before the parenthesis
        const originalText = label.textContent.split('(')[0].trim();
        label.textContent = `${originalText} (${count})`;
    });
}

function renderResources(resources, user) {
    const grid = document.querySelector('.resources-grid');
    grid.innerHTML = '';
    if (resources.length === 0) {
        grid.innerHTML = `<div class="no-results-message"><h3>No hay recursos disponibles</h3><p>Estamos trabajando para añadir más contenido. ¡Vuelve pronto!</p></div>`;
        return;
    }
    resources.forEach(resource => {
        const isSaved = user.savedResources.includes(resource.id);
        const card = createResourceCard(resource, isSaved);
        grid.appendChild(card);
    });
    lucide.createIcons();
}

function createResourceCard(resource, isSaved) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.dataset.category = categoryMap[resource.area] || 'other';

    const typeInfo = {
        video: { icon: 'play-circle', class: 'video' },
        articulo: { icon: 'book-open', class: 'article' },
        pdf: { icon: 'file-text', class: 'pdf' },
        curso: { icon: 'award', class: 'course' },
        podcast: { icon: 'mic', class: 'podcast' }
    };
    const currentType = typeInfo[resource.type] || typeInfo.article;

    let matchClass = 'warning';
    if (resource.match > 85) matchClass = 'success';
    if (resource.match < 70) matchClass = 'danger';

    card.innerHTML = `
        <div class="resource-header">
            <div class="resource-type ${currentType.class}">
                <i data-lucide="${currentType.icon}"></i>
                <span>${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
            </div>
            <div class="resource-meta">
                ${resource.match > 0 ? `<span class="resource-match ${matchClass}">${resource.match}% Match</span>` : ''}
                <button class="btn-bookmark ${isSaved ? 'active' : ''}" aria-label="${isSaved ? 'Guardado' : 'Guardar'}" data-id="${resource.id}">
                    <i data-lucide="bookmark"></i>
                </button>
            </div>
        </div>
        <div class="resource-duration">
            <i data-lucide="clock"></i>
            <span>${resource.duration}</span>
        </div>
        <h3 class="resource-title">${resource.title}</h3>
        <p class="resource-desc">${resource.description}</p>
        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="btn-resource">Ver Recurso <i data-lucide="arrow-right"></i></a>
    `;
    return card;
}

function renderSavedResources(user) {
    const savedGrid = document.querySelector('.saved-grid');
    const savedTitle = document.querySelector('.saved-title');
    if (!savedGrid || !savedTitle) return;

    savedGrid.innerHTML = '';
    const allResources = getDB().resources;
    const savedResources = allResources.filter(r => user.savedResources.includes(r.id));

    savedTitle.innerHTML = `<i data-lucide="bookmark"></i> Mis Recursos Guardados (${savedResources.length})`;

    if (savedResources.length > 0) {
        savedResources.forEach(resource => {
            const card = createSavedResourceCard(resource);
            savedGrid.appendChild(card);
        });
    } else {
        savedGrid.innerHTML = '<p class="no-saved-message">Aún no has guardado ningún recurso. ¡Usa el ícono de marcador para guardar los que te interesen!</p>';
    }
    lucide.createIcons();
}

function createSavedResourceCard(resource) {
    const card = document.createElement('div');
    card.className = 'saved-card';

    const typeInfo = {
        video: { icon: 'play-circle', class: 'video' },
        articulo: { icon: 'book-open', class: 'article' },
        pdf: { icon: 'file-text', class: 'pdf' },
        curso: { icon: 'award', class: 'course' },
        podcast: { icon: 'mic', class: 'podcast' }
    };
    const currentType = typeInfo[resource.type] || typeInfo.article;

    card.innerHTML = `
        <button class="btn-remove-saved" aria-label="Eliminar de guardados" data-id="${resource.id}">
            <i data-lucide="x"></i>
        </button>
        <div class="saved-icon ${currentType.class}">
            <i data-lucide="${currentType.icon}"></i>
        </div>
        <div class="saved-info">
            <span class="saved-type">${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} • ${resource.duration}</span>
            <h4 class="saved-card-title">${resource.title}</h4>
        </div>
    `;
    return card;
}

function updateDynamicUI(userId, resourceId, isNowSaved) {
    const mainBookmarkBtn = document.querySelector(`.btn-bookmark[data-id="${resourceId}"]`);
    if (mainBookmarkBtn) {
        mainBookmarkBtn.classList.toggle('active', isNowSaved);
        mainBookmarkBtn.setAttribute('aria-label', isNowSaved ? 'Guardado' : 'Guardar');
    }

    const user = getDB().users.find(u => u.id === userId);
    const userInterests = getUserInterests(user);

    renderSavedResources(user);
    updateHeaderStats(recommendedResourcesCache, user, userInterests);
}


// --- Event Listeners ---
function setupEventListeners(user) {
    // Use a static object to prevent re-cloning nodes if not necessary
    if (setupEventListeners.initialized) {
        return;
    }

    // Category filter logic is now handled purely by CSS.
    // The JavaScript no longer needs to manually handle display styles.

    const resourcesGrid = document.querySelector('.resources-grid');
    resourcesGrid.addEventListener('click', (e) => {
        const bookmarkBtn = e.target.closest('.btn-bookmark');
        if (bookmarkBtn) {
            const resourceId = parseInt(bookmarkBtn.dataset.id, 10);
            const isNowSaved = toggleBookmark(resourceId, user.id);
            updateDynamicUI(user.id, resourceId, isNowSaved);
        }
    });

    const savedGrid = document.querySelector('.saved-grid');
    savedGrid.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.btn-remove-saved');
        if (removeBtn) {
            const resourceId = parseInt(removeBtn.dataset.id, 10);
            const isNowSaved = toggleBookmark(resourceId, user.id);
            updateDynamicUI(user.id, resourceId, isNowSaved);
        }
    });

    setupEventListeners.initialized = true;
}