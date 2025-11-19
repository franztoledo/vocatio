// scripts/university.js

import { getDB } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('universidades.html')) {
        initUniversitiesPage();
    } else if (path.includes('detalle-universidad.html')) {
        initUniversityDetailPage();
    }
});

function initUniversitiesPage() {
    const db = getDB();
    const params = new URLSearchParams(window.location.search);
    let careerId = parseInt(params.get('careerId'), 10);

    if (isNaN(careerId)) {
        careerId = db.careers[0]?.id || 0;
    }

    const currentCareer = db.careers.find(c => c.id === careerId);
    if (!currentCareer) {
        document.querySelector('.uni-content .container').innerHTML = '<p>Carrera no encontrada.</p>';
        return;
    }

    populateCareerFilter(db.careers, careerId);
    renderUniversitiesForCareer(db, careerId);
    updateUniHeader(currentCareer, db.universities.filter(u => u.careers.includes(careerId)).length);
}

function populateCareerFilter(careers, activeCareerId) {
    const select = document.getElementById('career-select');
    if (!select) return;

    select.innerHTML = '';
    careers.forEach(career => {
        const option = document.createElement('option');
        option.value = career.id;
        option.textContent = career.title;
        if (career.id === activeCareerId) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        const newCareerId = e.target.value;
        window.location.href = `?careerId=${newCareerId}`;
    });
}

function renderUniversitiesForCareer(db, careerId) {
    const listContainer = document.querySelector('.universities-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const filteredUniversities = db.universities.filter(u => u.careers.includes(careerId));

    if (filteredUniversities.length === 0) {
        listContainer.innerHTML = '<p>No hay universidades disponibles para esta carrera todavía.</p>';
        return;
    }

    filteredUniversities.forEach(uni => {
        const card = createUniversityCard(uni);
        listContainer.appendChild(card);
    });

    lucide.createIcons();
}

function createUniversityCard(uni) {
    const card = document.createElement('div');
    card.className = 'university-card';

    const typeClass = uni.type === 'Pública' ? 'nacional' : 'privada';

    card.innerHTML = `
        <div class="uni-card-image">
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop" alt="${uni.name}">
        </div>
        <div class="uni-card-content">
            <div class="uni-card-header">
                <div>
                    <h3 class="uni-card-title">${uni.name}</h3>
                    <div class="uni-accreditation">
                        <span class="accredit-badge">
                            <i data-lucide="check-circle"></i>
                            Acreditada ${uni.accreditation}
                        </span>
                    </div>
                </div>
            </div>
            <div class="uni-details">
                <div class="detail-row">
                    <span class="detail-label"><i data-lucide="tag"></i>Tipo</span>
                    <span class="detail-value"><span class="type-badge ${typeClass}">${uni.type}</span></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label"><i data-lucide="map-pin"></i>Ubicación</span>
                    <span class="detail-value">${uni.location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label"><i data-lucide="dollar-sign"></i>Costo mensual</span>
                    <span class="detail-value">${uni.cost}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label"><i data-lucide="star"></i>Rating</span>
                    <span class="detail-value">${uni.rating}/5</span>
                </div>
            </div>
            <div class="uni-actions">
                <a href="detalle-universidad.html?id=${uni.id}" class="btn-secondary">Ver Detalles</a>
                <a href="${uni.website}" target="_blank" class="btn-outline">
                    <i data-lucide="external-link"></i>Web oficial
                </a>
            </div>
        </div>
    `;
    return card;
}

function updateUniHeader(career, count) {
    const subtitle = document.querySelector('.uni-subtitle');
    if (subtitle) {
        subtitle.textContent = `${count} universidades ofrecen esta carrera`;
    }
    const infoBanner = document.querySelector('.info-banner strong');
    if (infoBanner) {
        infoBanner.textContent = `Viendo universidades para: ${career.title}`;
    }
}


function initUniversityDetailPage() {
    const db = getDB();
    const params = new URLSearchParams(window.location.search);
    const universityId = parseInt(params.get('id'), 10);
    const university = db.universities.find(u => u.id === universityId);

    if (!university) {
        document.querySelector('.uni-detail-content').innerHTML = '<p>Universidad no encontrada.</p>';
        return;
    }

    // Header
    document.title = `${university.name} - OrientaVocacional`;
    document.querySelector('.uni-detail-title').textContent = university.name;
    document.querySelector('.breadcrumb-current').textContent = university.name;
    document.querySelector('.badge.acreditada').innerHTML = `<i data-lucide="check-circle"></i> Acreditada ${university.accreditation}`;
    
    // Quick Info
    const quickInfo = document.querySelectorAll('.quick-info-item .quick-value');
    quickInfo[0].innerHTML = `<span class="type-badge ${university.type === 'Pública' ? 'nacional' : 'privada'}">${university.type}</span>`;
    quickInfo[1].textContent = university.location;
    quickInfo[2].innerHTML = `<i data-lucide="star"></i> ${university.rating}/5`;
    quickInfo[3].textContent = university.employability;
    
    // General Info
    const infoRows = document.querySelectorAll('.info-row .info-value');
    infoRows[0].textContent = university.foundationYear;
    infoRows[1].textContent = `Universidad ${university.type}`;
    infoRows[2].textContent = university.facultyCount;
    infoRows[3].textContent = university.studentCount;
    infoRows[4].textContent = university.facultyCount;
    infoRows[5].textContent = university.internationalAccreditations.join(', ');

    // Modalities
    const modalitiesGrid = document.querySelector('.modalities-grid');
    modalitiesGrid.innerHTML = university.modalities.map(m => `<div class="modality-item"><i data-lucide="users"></i><span>${m}</span></div>`).join('');

    // Campuses
    const locationsList = document.querySelector('.locations-list');
    locationsList.innerHTML = university.campuses.map(c => `
        <div class="location-item">
            <div class="location-header"><strong>${c.name}</strong></div>
            <p>${c.address}</p>
        </div>
    `).join('');

    // Costs
    // This is a simplification, as cost is just a string 'Bajo', 'Medio', 'Alto'
    document.querySelector('.costs-container .cost-value').textContent = university.cost;

    // Admission Dates
    const datesList = document.querySelector('.dates-list');
    datesList.innerHTML = `
        <div class="date-item">
            <span class="date-label">Inscripción</span>
            <span class="date-value">${university.admissionDates.inscription}</span>
        </div>
        <div class="date-item">
            <span class="date-label">Examen de admisión</span>
            <span class="date-value">${university.admissionDates.exam}</span>
        </div>
        <div class="date-item">
            <span class="date-label">Resultados</span>
            <span class="date-value">${university.admissionDates.results}</span>
        </div>
    `;

    // Contact
    const contactInfo = document.querySelector('.contact-info');
    contactInfo.innerHTML = `
        <p><strong>Teléfono:</strong><br><a href="tel:${university.contact.phone}">${university.contact.phone}</a></p>
        <p><strong>Email:</strong><br><a href="mailto:${university.contact.email}">${university.contact.email}</a></p>
        <p><strong>Web oficial:</strong><br><a href="${university.website}" target="_blank">${university.website}</a></p>
    `;

    lucide.createIcons();
}
