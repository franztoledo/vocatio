// scripts/career-keyword-search.js
import { getDB } from './utils.js';

const DB = getDB();

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchKeyword');
    const resultsGrid = document.querySelector('.careers-results-grid');
    const resultsInfo = document.querySelector('.search-results-info');

    if (!searchForm) return;

    // Hide results info on initial load
    resultsInfo.style.display = 'none';

    // Show initial suggestions when page loads
    showInitialSuggestions();

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
            performSearch(searchTerm);
        }
    });

    // Allow clicking on suggested keywords
    resultsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggested-keyword-btn')) {
            const keyword = e.target.dataset.keyword;
            searchInput.value = keyword;
            performSearch(keyword);
        }
    });
});

function showInitialSuggestions() {
    const resultsGrid = document.querySelector('.careers-results-grid');

    resultsGrid.innerHTML = `
        <div class="initial-suggestions">
            <div class="suggestions-icon">
                <i data-lucide="lightbulb" style="width: 48px; height: 48px; color: var(--primary-500);"></i>
            </div>
            <h3 class="suggestions-title">💡 Palabras clave sugeridas</h3>
            <p class="suggestions-subtitle">Haz clic en cualquier palabra o combina varias para encontrar carreras relacionadas</p>

            <div class="suggested-keywords-grid">
                <button class="suggested-keyword-btn" data-keyword="creatividad">creatividad</button>
                <button class="suggested-keyword-btn" data-keyword="matemáticas">matemáticas</button>
                <button class="suggested-keyword-btn" data-keyword="ayudar personas">ayudar personas</button>
                <button class="suggested-keyword-btn" data-keyword="tecnología">tecnología</button>
                <button class="suggested-keyword-btn" data-keyword="comunicación">comunicación</button>
                <button class="suggested-keyword-btn" data-keyword="liderazgo">liderazgo</button>
                <button class="suggested-keyword-btn" data-keyword="análisis">análisis</button>
                <button class="suggested-keyword-btn" data-keyword="arte">arte</button>
                <button class="suggested-keyword-btn" data-keyword="ciencia">ciencia</button>
            </div>
        </div>
    `;

    lucide.createIcons();
}

function performSearch(term) {
    const lowerCaseTerm = term.toLowerCase();

    const foundCareers = DB.careers.filter(career => {
        const inTitle = career.title.toLowerCase().includes(lowerCaseTerm);
        const inDescription = career.description.toLowerCase().includes(lowerCaseTerm);
        const inKeywords = career.keywords.some(kw => kw.toLowerCase().includes(lowerCaseTerm));

        return inTitle || inDescription || inKeywords;
    });

    renderResults(foundCareers, term);
}

function renderResults(careers, term) {
    const resultsGrid = document.querySelector('.careers-results-grid');
    const resultsInfo = document.querySelector('.search-results-info');
    const resultsCountEl = resultsInfo.querySelector('.results-count');
    const resultsKeywordEl = resultsInfo.querySelector('.results-keyword strong');

    resultsGrid.innerHTML = '';
    resultsInfo.style.display = 'flex';
    resultsKeywordEl.textContent = `"${term}"`;

    if (careers.length > 0) {
        resultsCountEl.textContent = `Encontramos ${careers.length} carrera(s)`;

        careers.forEach(career => {
            const card = createCareerCard(career, term);
            resultsGrid.appendChild(card);
        });
    } else {
        resultsCountEl.textContent = 'No se encontraron resultados';
        resultsGrid.innerHTML = createNoResultsMessage(term);
    }

    lucide.createIcons();
}

function createCareerCard(career, searchTerm) {
    const card = document.createElement('div');
    card.className = 'career-card';

    // Simple match count for the badge
    const lowerCaseSearch = searchTerm.toLowerCase();
    let matches = 0;
    if (career.title.toLowerCase().includes(lowerCaseSearch)) matches++;
    if (career.description.toLowerCase().includes(lowerCaseSearch)) matches++;
    matches += career.keywords.filter(kw => kw.toLowerCase().includes(lowerCaseSearch)).length;

    card.innerHTML = `
        <div class="career-card-image">
            <img src="${career.imageUrl}" alt="${career.title}">
        </div>
        <div class="career-card-body">
            <div class="career-card-header">
                <h3 class="career-card-title">${career.title}</h3>
                <span class="career-match-badge">${matches} coincidencia(s)</span>
            </div>
            <div class="career-card-category">
                <span class="category-badge">${career.area}</span>
            </div>
            <div class="career-card-keywords">
                <p class="keywords-label">Palabras relacionadas:</p>
                <div class="keywords-container">
                    ${career.keywords.slice(0, 4).map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
                </div>
            </div>
            <a href="detalle-carrera.html?id=${career.id}" class="career-card-button">Ver Detalles <i data-lucide="arrow-right"></i></a>
        </div>
    `;
    return card;
}

function createNoResultsMessage(searchTerm) {
    const suggestedKeywords = ['creatividad', 'matemáticas', 'ayudar personas', 'tecnología', 'comunicación', 'liderazgo'];

    return `
        <div class="no-results-message">
            <div class="no-results-icon">
                <i data-lucide="search-x" style="width: 64px; height: 64px;"></i>
            </div>

            <h3 class="no-results-title">No encontramos carreras con "${searchTerm}"</h3>
            <p class="no-results-subtitle">Intenta con otras palabras clave o revisa las sugerencias</p>

            <div class="suggestions-box">
                <div class="suggestions-box-icon">
                    <i data-lucide="lightbulb"></i>
                </div>
                <div class="suggestions-box-content">
                    <p class="suggestions-box-title">Sugerencias:</p>
                    <ul class="suggestions-list">
                        <li>Usa términos más generales (ej: "creatividad" en vez de "diseño de logotipos")</li>
                        <li>Combina palabras clave (ej: "tecnología matemáticas")</li>
                        <li>Revisa las palabras sugeridas más abajo</li>
                    </ul>
                </div>
            </div>

            <div class="suggested-keywords-section">
                <p class="suggested-keywords-title">Prueba con estas palabras:</p>
                <div class="suggested-keywords-inline">
                    ${suggestedKeywords.map(kw => `
                        <button class="suggested-keyword-btn" data-keyword="${kw}">${kw}</button>
                    `).join('')}
                </div>
            </div>

            <div class="no-results-actions">
                <button class="btn-secondary" onclick="window.location.reload()">
                    <i data-lucide="rotate-ccw"></i>
                    Nueva Búsqueda
                </button>
                <button class="btn-primary" onclick="window.location.href='buscar-carreras.html'">
                    <i data-lucide="compass"></i>
                    Explorar Todas
                </button>
            </div>
        </div>
    `;
}
