// scripts/test-vocacional-seccion.js
import { getActiveUser } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = getActiveUser();
    updateStats(user);
});

function updateStats(user) {
    const statsGrid = document.querySelector('.stats-grid-test');
    if (!statsGrid) return;

    // Default values
    let maxCompatibility = { value: '0%', area: 'Completa un test' };
    let testsCompleted = { count: 0, last: 'Nunca' };
    let consistency = { value: '0%', trend: 'neutral' };

    if (user && user.testResults && user.testResults.length > 0) {
        const tests = user.testResults;
        
        // 1. Max Compatibility
        const latestTest = tests[tests.length - 1];
        if (latestTest && latestTest.results && latestTest.results.length > 0) {
            const topResult = latestTest.results.reduce((max, current) => (current.score > max.score) ? current : max, { score: 0, area: 'N/A' });
            maxCompatibility.value = `${topResult.score}%`;
            maxCompatibility.area = topResult.area;
        }

        // 2. Tests Completed
        testsCompleted.count = tests.length;
        const lastTestDate = new Date(latestTest.date);
        const now = new Date();
        const diffDays = Math.round((now - lastTestDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) testsCompleted.last = 'Hoy';
        else if (diffDays === 1) testsCompleted.last = 'Ayer';
        else testsCompleted.last = `Hace ${diffDays} días`;

        // 3. Consistency Improvement
        if (tests.length > 1) {
            const firstTestTopScore = tests[0].results.reduce((max, current) => (current.score > max.score) ? current : max).score;
            const lastTestTopScore = tests[tests.length - 1].results.reduce((max, current) => (current.score > max.score) ? current : max).score;
            const diff = lastTestTopScore - firstTestTopScore;
            consistency.value = `${Math.abs(diff)}%`;
            if (diff > 0) consistency.trend = 'success';
            else if (diff < 0) consistency.trend = 'danger';
        }
    }

    statsGrid.innerHTML = `
        <div class="stat-box">
          <div class="stat-big-number">${maxCompatibility.value}</div>
          <div class="stat-label-main">Tu compatibilidad máxima</div>
          <div class="stat-label-sub">${maxCompatibility.area}</div>
        </div>

        <div class="stat-box">
          <div class="stat-big-number">${testsCompleted.count}</div>
          <div class="stat-label-main">Tests completados</div>
          <div class="stat-label-sub">Último: ${testsCompleted.last}</div>
        </div>

        <div class="stat-box">
          <div class="stat-big-number ${consistency.trend}">${consistency.trend === 'success' ? '+' : ''}${consistency.value}</div>
          <div class="stat-label-main">Mejora en consistencia</div>
          <div class="stat-label-sub">Desde tu primer test</div>
        </div>
    `;
}
