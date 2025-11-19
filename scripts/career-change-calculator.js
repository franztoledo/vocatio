import { db_calculators } from './database-calculators.js';

document.addEventListener('DOMContentLoaded', () => {
    const pagePath = window.location.pathname;

    if (pagePath.includes('informacion-academica-actual.html')) {
        initAcademicInfoPage();
    } else if (pagePath.includes('seleccionar-carrera-destino.html')) {
        initSelectDestinationPage();
    } else if (pagePath.includes('analisis-convalidacion.html')) {
        initAnalysisPage();
    } else if (pagePath.includes('plan-transicion.html')) {
        initPlanTransicionPage();
    }
});

// --- Lógica para pages/Herramientas/cambiocarrera/informacion-academica-actual.html ---
function initAcademicInfoPage() {
    const careerSelect = document.getElementById('carrera-actual');
    const universitySelect = document.getElementById('universidad-actual');
    const form = document.querySelector('.academic-form');

    db_calculators.careers.forEach(career => {
        const option = document.createElement('option');
        option.value = career.id;
        option.textContent = career.name;
        careerSelect.appendChild(option);
    });

    db_calculators.universities.forEach(uni => {
        const option = document.createElement('option');
        option.value = uni.id;
        option.textContent = uni.name;
        universitySelect.appendChild(option);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const academicInfo = {
            careerId: document.getElementById('carrera-actual').value,
            universityId: document.getElementById('universidad-actual').value,
            cycle: document.getElementById('ciclo-actual').value,
            average: document.getElementById('promedio-actual').value
        };
        localStorage.setItem('academicInfo', JSON.stringify(academicInfo));
        window.location.href = 'seleccionar-carrera-destino.html';
    });
}

// --- Lógica para pages/Herramientas/cambiocarrera/seleccionar-carrera-destino.html ---
function initSelectDestinationPage() {
    const academicInfo = JSON.parse(localStorage.getItem('academicInfo'));
    if (!academicInfo) {
        window.location.href = 'informacion-academica-actual.html';
        return;
    }

    const currentCareer = db_calculators.careers.find(c => c.id == academicInfo.careerId);
    
    const currentCareerInfoContainer = document.getElementById('current-career-info');
    currentCareerInfoContainer.innerHTML = `
        <p class="current-career-label">Tu carrera actual: <strong>${currentCareer.name}</strong></p>
        <p class="current-career-detail">${academicInfo.cycle}º ciclo completado • Promedio: ${academicInfo.average || 'No especificado'}</p>
    `;

    const careersGrid = document.getElementById('careers-grid-container');
    const areaFilter = document.getElementById('area-filter');

    function populateCareers(filter = 'all') {
        careersGrid.innerHTML = '';
        const destinationCareers = db_calculators.careers.filter(career => {
            const isCurrentCareer = career.id == academicInfo.careerId;
            const areaMatch = (filter === 'all' || career.area === filter);
            return !isCurrentCareer && areaMatch;
        });

        if (destinationCareers.length === 0) {
            careersGrid.innerHTML = '<p>No hay carreras que coincidan con el filtro seleccionado.</p>';
            return;
        }

        destinationCareers.forEach(career => {
            const compatibility = calculateCompatibility(currentCareer, career);
            const card = document.createElement('div');
            card.className = 'career-card';
            card.innerHTML = `
                <div class="career-image">
                    <img src="https://via.placeholder.com/400x250/22c55e/ffffff?text=${career.name.replace(/\s/g, '+')}" alt="${career.name}">
                </div>
                <div class="career-content">
                    <h3 class="career-name">${career.name}</h3>
                    <div class="career-stats">
                        <div class="stat">
                            <span class="stat-label">Área:</span>
                            <span class="stat-value">${career.area}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Compatibilidad:</span>
                            <span class="stat-value">${compatibility}%</span>
                        </div>
                    </div>
                    <button class="btn-analyze" data-career-id="${career.id}">Analizar cambio</button>
                </div>
            `;
            careersGrid.appendChild(card);
        });
    }

    areaFilter.addEventListener('change', () => populateCareers(areaFilter.value));
    populateCareers();

    careersGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-analyze')) {
            const destinationCareerId = e.target.getAttribute('data-career-id');
            localStorage.setItem('destinationCareerId', destinationCareerId);
            window.location.href = 'analisis-convalidacion.html';
        }
    });
}

function calculateCompatibility(currentCareer, destinationCareer) {
    let score = 50;
    if (currentCareer.area === destinationCareer.area) {
        score += 40;
    } else {
        const convalidationRate = db_calculators.convalidationMap[`${currentCareer.area}-${destinationCareer.area}`] || 0;
        score += convalidationRate * 50;
    }
    return Math.min(Math.round(score), 99);
}

// --- Lógica para pages/Herramientas/cambiocarrera/analisis-convalidacion.html ---
function initAnalysisPage() {
    const academicInfo = JSON.parse(localStorage.getItem('academicInfo'));
    const destinationCareerId = localStorage.getItem('destinationCareerId');

    if (!academicInfo || !destinationCareerId) {
        window.location.href = 'informacion-academica-actual.html';
        return;
    }

    const currentCareer = db_calculators.careers.find(c => c.id == academicInfo.careerId);
    const destinationCareer = db_calculators.careers.find(c => c.id == destinationCareerId);
    const university = db_calculators.universities.find(u => u.id == academicInfo.universityId);

    document.getElementById('analisis-carrera-actual').value = currentCareer.name;
    document.getElementById('analisis-carrera-destino').value = destinationCareer.name;
    document.getElementById('analisis-ciclo-actual').value = `${academicInfo.cycle}º ciclo`;

    const creditsTaken = (academicInfo.cycle / 10) * currentCareer.totalCredits;
    const convalidationRateKey = `${currentCareer.area}-${destinationCareer.area}`;
    let convalidationRate = db_calculators.convalidationMap[convalidationRateKey];

    if(currentCareer.area === destinationCareer.area && currentCareer.id !== destinationCareer.id){
        convalidationRate = db_calculators.convalidationMap[`${currentCareer.area}-${destinationCareer.area}`] || 0.6;
    } else if (currentCareer.id === destinationCareer.id) {
        convalidationRate = 1;
    } else if (!convalidationRate) {
        convalidationRate = 0.1;
    }
    
    const validatedCredits = Math.round(creditsTaken * convalidationRate);
    const remainingCredits = destinationCareer.totalCredits - validatedCredits;
    const newStartCycle = Math.floor(validatedCredits / (destinationCareer.totalCredits / 10)) + 1;
    const remainingYears = (remainingCredits / (destinationCareer.totalCredits / 10)) / 2;
    const estimatedCost = remainingCredits * university.costPerCredit;

    const validatedCourses = Math.round((validatedCredits / currentCareer.totalCredits) * currentCareer.totalCourses);

    document.getElementById('convalidables-count').textContent = validatedCourses;
    document.getElementById('adicionales-count').textContent = destinationCareer.totalCourses - validatedCourses;
    document.getElementById('nuevo-ciclo').textContent = `${newStartCycle}º ciclo`;
    document.getElementById('tiempo-restante').textContent = `${remainingYears.toFixed(1)} años`;
    
    const convalidablesList = document.getElementById('convalidables-list');
    convalidablesList.innerHTML = '<li>Cursos generales (Matemática, Lenguaje)</li><li>Cursos de área común</li>';

    const adicionalesList = document.getElementById('adicionales-list');
    adicionalesList.innerHTML = '<li>Cursos de especialidad de la nueva carrera</li><li>Proyectos específicos</li>';

    // Guardar resultados para la siguiente página
    const analysisResults = {
        validatedCourses: validatedCourses,
        remainingYears: remainingYears.toFixed(1),
        estimatedCost: estimatedCost.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })
    };
    localStorage.setItem('analysisResults', JSON.stringify(analysisResults));
}

// --- Lógica para pages/Herramientas/cambiocarrera/plan-transicion.html ---
function initPlanTransicionPage() {
    const results = JSON.parse(localStorage.getItem('analysisResults'));
    if (!results) {
        // Si no hay resultados, no mostrar nada o redirigir
        return;
    }

    const convalidablesEl = document.getElementById('summary-convalidables');
    const tiempoEl = document.getElementById('summary-tiempo');
    const costoEl = document.getElementById('summary-costo');

    if (convalidablesEl) {
        convalidablesEl.querySelector('.summary-item-label').textContent = `${results.validatedCourses} materias`;
    }
    if (tiempoEl) {
        tiempoEl.querySelector('.summary-item-label').textContent = `${results.remainingYears} años`;
    }
    if (costoEl) {
        costoEl.querySelector('.summary-item-label').textContent = results.estimatedCost;
    }
}
