import { getDB, getActiveUser, saveDB, showToast } from './utils.js';

let DB = getDB();

document.addEventListener('DOMContentLoaded', () => {
    // Re-fetch DB in case it was updated by another script
    DB = getDB();
    
    // Logic for selection page
    if (document.querySelector('.select-compare-section')) {
        initSelectionPage();
    }

    // Logic for comparison page
    if (document.querySelector('.compare-result-section')) {
        initComparisonPage();
    }
});

// --- SELECTION PAGE LOGIC ---

const MAX_SELECT = 4;
const MIN_SELECT = 2;
let selectedCareers = [];

function initSelectionPage() {
    const careersGrid = document.querySelector('.careers-grid');
    const selectionBox = document.querySelector('.selected-careers-box');
    if (!careersGrid || !selectionBox) return;

    careersGrid.innerHTML = '';

    const allCareers = DB.careers;
    allCareers.forEach(career => {
        const card = createCareerSelectionCard(career);
        careersGrid.appendChild(card);
    });

    careersGrid.addEventListener('change', handleCareerSelection);

    const compareButton = document.querySelector('.btn-compare.primary');
    compareButton.addEventListener('click', (e) => {
        if (selectedCareers.length < MIN_SELECT) {
            e.preventDefault();
            updateUI(`Debes seleccionar al menos ${MIN_SELECT} carreras.`);
        } else {
            localStorage.setItem('careersToCompare', JSON.stringify(selectedCareers.map(c => c.id)));
        }
    });

    updateUI();
}

function createCareerSelectionCard(career) {
    const label = document.createElement('label');
    label.className = 'career-select-card';
    label.dataset.careerId = career.id;

    label.innerHTML = `
        <input type="checkbox" class="career-select-checkbox" data-id="${career.id}">
        <div class="career-select-check">
            <i data-lucide="check"></i>
        </div>
        <h3 class="career-select-title">${career.title}</h3>
        <p class="career-select-category">${career.area}</p>
        <p class="career-select-meta">${career.duration} • <strong>${career.modality}</strong></p>
    `;
    setTimeout(() => lucide.createIcons(), 0);
    return label;
}

function handleCareerSelection(event) {
    const checkbox = event.target;
    if (!checkbox.matches('.career-select-checkbox')) return;

    const careerId = parseInt(checkbox.dataset.id, 10);
    const career = DB.careers.find(c => c.id === careerId);
    let errorMessage = '';

    if (checkbox.checked) {
        if (selectedCareers.length < MAX_SELECT) {
            selectedCareers.push(career);
        } else {
            checkbox.checked = false;
            errorMessage = `No puedes seleccionar más de ${MAX_SELECT} carreras.`;
        }
    } else {
        selectedCareers = selectedCareers.filter(c => c.id !== careerId);
    }

    updateUI(errorMessage);
}

function updateUI(errorMessage = '') {
    const countSpan = document.getElementById('count');
    const selectedTagsContainer = document.getElementById('selectedTags');
    const compareButton = document.querySelector('.btn-compare.primary');
    const selectionBox = document.querySelector('.selected-careers-box');
    const messageContainer = document.getElementById('selectionMessage');

    countSpan.textContent = selectedCareers.length;

    selectedTagsContainer.innerHTML = '';
    selectedCareers.forEach(career => {
        const tag = document.createElement('span');
        tag.className = 'career-tag';
        tag.innerHTML = `${career.title} <button class="tag-remove" data-remove="${career.id}">×</button>`;
        selectedTagsContainer.appendChild(tag);
    });

    document.querySelectorAll('.tag-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const idToRemove = parseInt(e.target.dataset.remove, 10);
            selectedCareers = selectedCareers.filter(c => c.id !== idToRemove);
            const checkbox = document.querySelector(`.career-select-checkbox[data-id="${idToRemove}"]`);
            if (checkbox) checkbox.checked = false;
            updateUI();
        });
    });

    document.querySelectorAll('.career-select-card').forEach(card => {
        const cardId = parseInt(card.dataset.careerId, 10);
        card.classList.toggle('selected', selectedCareers.some(c => c.id === cardId));
    });

    if (errorMessage) {
        selectionBox.classList.add('error');
        messageContainer.textContent = errorMessage;
    } else if (selectedCareers.length >= 0 && selectedCareers.length < MIN_SELECT) {
        selectionBox.classList.add('error');
        messageContainer.textContent = `Selecciona al menos ${MIN_SELECT} carreras para comparar.`;
    } else {
        selectionBox.classList.remove('error');
        messageContainer.textContent = '';
    }

    const isValid = selectedCareers.length >= MIN_SELECT && selectedCareers.length <= MAX_SELECT;
    compareButton.classList.toggle('disabled', !isValid);
    compareButton.style.pointerEvents = isValid ? 'auto' : 'none';
}


// --- COMPARISON PAGE LOGIC ---

function initComparisonPage() {
    const careerIdsToCompare = JSON.parse(localStorage.getItem('careersToCompare'));

    if (!careerIdsToCompare || careerIdsToCompare.length < MIN_SELECT) {
        const container = document.querySelector('.compare-result-section .container');
        container.innerHTML = `
            <div class="no-comparison">
                <h2>No hay suficientes carreras para comparar.</h2>
                <p>Por favor, <a href="seleccionar-comparar.html">vuelve a la página de selección</a> y elige entre ${MIN_SELECT} y ${MAX_SELECT} carreras.</p>
            </div>`;
        return;
    }

    const careersData = careerIdsToCompare.map(id => DB.careers.find(c => c.id === id)).filter(Boolean);

    renderComparisonTable(careersData);
    renderComparisonCards(careersData);
    handleTabSwitching();
    setupActionButtons(careersData);
}

function renderComparisonTable(careers) {
    const table = document.querySelector('.comparison-table table');
    if (!table) return;
    table.innerHTML = '';

    const thead = document.createElement('thead');
    let headerRow = '<tr><th class="criterion">Criterio</th>';
    careers.forEach(career => {
        headerRow += `<th class="career-col">${career.title}</th>`;
    });
    headerRow += '</tr>';
    thead.innerHTML = headerRow;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const criteria = [
        { label: 'Área', key: 'area' },
        { label: 'Duración', key: 'duration' },
        { label: 'Dificultad', key: 'dificultad' },
        { label: 'Salario Promedio (anual)', key: 'avg_salary' },
        { label: 'Demanda Laboral', key: 'demanda_laboral' },
        { label: 'Modalidad', key: 'modality' },
        { label: 'Universidades', key: 'universidades_count' },
        { label: 'Empleabilidad', key: 'empleabilidad' },
    ];

    criteria.forEach(criterion => {
        let row = `<tr><td class="criterion">${criterion.label}</td>`;
        careers.forEach(career => {
            let value = career[criterion.key] || 'No especificado';
            if (criterion.key === 'avg_salary') {
                value = `$${value.toLocaleString()}`;
            }
            if (criterion.key === 'universidades_count') {
                value = `${value} universidades`;
            }
            row += `<td>${value}</td>`;
        });
        row += '</tr>';
        tbody.innerHTML += row;
    });

    table.appendChild(tbody);
}

function renderComparisonCards(careers) {
    const cardsContainer = document.querySelector('.comparison-cards');
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';

    careers.forEach((career, index) => {
        const card = document.createElement('div');
        card.className = 'career-comparison-card';

        card.innerHTML = `
            <div class="career-card-image">
                <img src="${career.imageUrl}" alt="${career.title}">
                <div class="career-card-badge">${index + 1}</div>
            </div>
            <div class="career-card-content">
                <h3 class="career-card-title"><i data-lucide="briefcase"></i> ${career.title}</h3>
                <div class="comparison-items">
                    <div class="comparison-item"><span class="comparison-item-label"><i data-lucide="briefcase"></i>Área</span><span class="comparison-item-value">${career.area}</span></div>
                    <div class="comparison-item"><span class="comparison-item-label"><i data-lucide="clock"></i>Duración</span><span class="comparison-item-value">${career.duration}</span></div>
                    <div class="comparison-item"><span class="comparison-item-label"><i data-lucide="trending-up"></i>Dificultad</span><span class="comparison-item-value">${career.dificultad}</span></div>
                    <div class="comparison-item"><span class="comparison-item-label"><i data-lucide="dollar-sign"></i>Salario Promedio</span><span class="comparison-item-value">$${(career.avg_salary || 0).toLocaleString()}</span></div>
                    <div class="comparison-item"><span class="comparison-item-label"><i data-lucide="award"></i>Campo Laboral</span><span class="comparison-item-value">${career.field || 'No especificado'}</span></div>
                    <div class="comparison-item"><span class="comparison-item-label"><i data-lucide="check-circle"></i>Empleabilidad</span><span class="comparison-item-value">${career.empleabilidad}</span></div>
                </div>
                <a href="detalle-carrera.html?id=${career.id}" class="career-card-button"><i data-lucide="arrow-right"></i><span>Ver Detalles Completos</span></a>
            </div>`;
        cardsContainer.appendChild(card);
    });

    setTimeout(() => lucide.createIcons(), 0);
}

function handleTabSwitching() {
    const tabs = document.querySelectorAll('.compare-tab-input');
    const tabLabels = document.querySelectorAll('.compare-tab[for]');

    tabs.forEach(tab => {
        tab.addEventListener('change', () => {
            tabLabels.forEach(label => {
                label.classList.toggle('active', label.getAttribute('for') === tab.id);
            });
        });
    });
}

function setupActionButtons(careers) {
    const favButton = document.querySelector('.btn-favorite-compare');
    const downloadButton = document.querySelector('.btn-download-compare');

    if (favButton) {
        favButton.addEventListener('click', () => {
            const user = getActiveUser();
            if (!user) {
                showToast('Debes iniciar sesión para guardar favoritas.', 'error');
                setTimeout(() => {
                    window.location.href = '../Login/login.html';
                }, 2000);
                return;
            }

            const userInDB = DB.users.find(u => u.id === user.id);
            if (!userInDB) {
                showToast('Error: No se pudo encontrar tu usuario.', 'error');
                return;
            }

            let addedCount = 0;
            careers.forEach(career => {
                if (!userInDB.favoriteCareers.includes(career.id)) {
                    userInDB.favoriteCareers.push(career.id);
                    addedCount++;
                }
            });

            saveDB(DB);

            favButton.innerHTML = `<i data-lucide="check"></i> Guardado`;
            favButton.disabled = true;
            setTimeout(() => lucide.createIcons(), 0);

            if (addedCount > 0) {
                showToast(`${addedCount} carrera(s) agregada(s) a favoritas.`, 'success');
            } else {
                showToast('Estas carreras ya estaban en tus favoritas.', 'info');
            }
        });
    }

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            const element = document.querySelector('.comparison-table');
            const opt = {
                margin:       0.5,
                filename:     'Comparacion-Carreras.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            showToast('Generando PDF...', 'info', 2000);
            html2pdf().from(element).set(opt).save();
        });
    }
}
