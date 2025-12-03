
// scripts/explorar-carreras-seccion.js
import { getActiveUser, getDB } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = getActiveUser();
    const db = getDB();
    updateCompatibility(user, db);
});

function updateCompatibility(user, db) {
    const compatibilityGrid = document.querySelector('.compatibility-grid');
    if (!compatibilityGrid) return;

    if (!user || !user.testResults || user.testResults.length === 0) {
        compatibilityGrid.innerHTML = '<p class="section-subtitle-main">Realiza un test vocacional para ver tus compatibilidades.</p>';
        return;
    }

    const latestTest = user.testResults[user.testResults.length - 1];
    if (!latestTest.results || latestTest.results.length === 0) {
        compatibilityGrid.innerHTML = '<p class="section-subtitle-main">Tus últimos resultados de test están vacíos.</p>';
        return;
    }

    const sortedResults = [...latestTest.results].sort((a, b) => b.score - a.score).slice(0, 3);
    
    compatibilityGrid.innerHTML = sortedResults.map((result, index) => {
        const heroProfile = db.hero_profiles[result.area];
        const careerName = heroProfile ? heroProfile.related_careers[0].name : result.area;
        const emoji = heroProfile ? heroProfile.related_careers[0].icon : '✨';
        
        return `
            <a href="buscar-carreras.html?area=${encodeURIComponent(result.area)}" class="compatibility-card-link">
                <div class="compatibility-card">
                  <div class="compatibility-badge">#${index + 1} Mejor opción</div>
                  <div class="compatibility-emoji">${emoji}</div>
                  <h3 class="compatibility-name">${result.area}</h3>
                  <div class="compatibility-percentage">
                    <span class="percentage-number">${result.score}%</span>
                    <i data-lucide="arrow-right"></i>
                  </div>
                </div>
            </a>
        `;
    }).join('');

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
