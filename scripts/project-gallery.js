// scripts/project-gallery.js

import { getDB } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('galeria-proyecto.html')) {
        initGalleryPage();
    } else if (path.includes('detalle-proyecto.html')) {
        initProjectDetailPage();
    }
});

function initGalleryPage() {
    const db = getDB();
    const params = new URLSearchParams(window.location.search);
    let requestedCareerId = parseInt(params.get('careerId'), 10);

    // If careerId is not provided or invalid, default to the first career that has projects
    if (isNaN(requestedCareerId) || !db.careers.some(c => c.id === requestedCareerId)) {
        const firstCareerWithProjects = db.careers.find(c => db.projects.some(p => p.careerId === c.id));
        requestedCareerId = firstCareerWithProjects ? firstCareerWithProjects.id : (db.careers[0]?.id || 0);
    }
    
    const currentCareer = db.careers.find(c => c.id === requestedCareerId);
    if (!currentCareer) {
        document.querySelector('.gallery-content .container').innerHTML = '<p class="no-data-message">No se encontró la carrera.</p>';
        return;
    }

    renderCareerTabs(db.careers, requestedCareerId, db.projects);
    renderProjectsForCareer(db, requestedCareerId);
    updateGalleryHeader(currentCareer);
    setupLevelFilters();
}

function renderCareerTabs(allCareers, activeCareerId, allProjects) {
    const tabsContainer = document.querySelector('.career-tabs');
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';

    allCareers.forEach(career => {
        const projectCount = allProjects.filter(p => p.careerId === career.id).length;
        const tab = document.createElement('button');
        tab.className = `career-tab ${career.id === activeCareerId ? 'active' : ''}`;
        tab.textContent = `${career.title} (${projectCount})`;
        tab.addEventListener('click', () => {
            // Use history.pushState to avoid full page reload for a smoother experience
            window.history.pushState({careerId: career.id}, '', `?careerId=${career.id}`);
            initGalleryPage(); // Re-initialize the page content
        });
        tabsContainer.appendChild(tab);
    });
}

function renderProjectsForCareer(db, careerId) {
    const projectsGrid = document.querySelector('.projects-grid');
    const resultsCountSpan = document.querySelector('.academic-level-results span');
    if (!projectsGrid || !resultsCountSpan) return;
    
    projectsGrid.innerHTML = '';
    const filteredProjects = db.projects.filter(p => p.careerId === careerId);

    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="no-results-message">
                <div class="no-results-card">
                    <div class="no-results-icon"><i data-lucide="folder-x"></i></div>
                    <h3 class="no-results-title">No hay proyectos disponibles</h3>
                    <p class="no-results-text">Estamos trabajando para encontrar más proyectos para esta carrera. ¡Vuelve pronto!</p>
                </div>
            </div>`;
        resultsCountSpan.textContent = '0 proyectos encontrados';
        lucide.createIcons();
        return;
    }

    filteredProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });

    resultsCountSpan.textContent = `${filteredProjects.length} proyectos encontrados`;
    lucide.createIcons();
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.level = project.level;

    const authorName = project.author?.name || 'Anónimo';
    const authorUniversity = project.author?.university || 'Universidad Desconocida';
    const rating = project.rating || 'N/A';
    const views = project.views || 0;
    const description = project.description ? project.description.substring(0, 100) + '...' : 'No hay descripción disponible.';
    const technologies = project.technologies || [];

    card.innerHTML = `
        <div class="project-image">
            <img src="${project.imageUrl}" alt="${project.title}">
            <div class="project-level-badge">${project.level}</div>
            <div class="project-views"><i data-lucide="eye"></i><span>${views}</span></div>
        </div>
        <div class="project-content">
            <div class="project-rating"><i data-lucide="star"></i><span>${rating}</span></div>
            <h3 class="project-title">${project.title}</h3>
            <div class="project-meta"><span>Por <strong>${authorName}</strong> • ${authorUniversity}</span></div>
            <p class="project-description">${description}</p>
            <div class="project-tags">
                ${technologies.slice(0, 2).map(t => `<span class="project-tag">${t}</span>`).join('')}
                ${technologies.length > 2 ? `<span class="project-tag">+${technologies.length - 2}</span>` : ''}
            </div>
            <a href="detalle-proyecto.html?id=${project.id}" class="project-button">Ver Detalles del Proyecto <i data-lucide="arrow-right"></i></a>
        </div>`;
    return card;
}

function updateGalleryHeader(career) {
    const infoBanner = document.querySelector('.info-banner div');
    if (infoBanner) {
        infoBanner.innerHTML = `
            <strong>Viendo proyectos de: ${career.title}</strong>
            <p>Proyectos reales que hacen estudiantes de esta carrera.</p>`;
    }
}

function setupLevelFilters() {
    const filterButtons = document.querySelectorAll('.level-btn');
    const projectsGrid = document.querySelector('.projects-grid');
    const resultsCountSpan = document.querySelector('.academic-level-results span');
    const galleryContentContainer = document.querySelector('.gallery-content .container'); // Parent of projectsGrid and no-results-message

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const selectedLevel = button.textContent.trim();
            const projectCards = document.querySelectorAll('.projects-grid .project-card');
            let visibleProjects = 0;

            projectCards.forEach(card => {
                const cardLevel = card.dataset.level;
                const shouldBeVisible = (selectedLevel === 'Todos los niveles' || cardLevel === selectedLevel);
                card.style.display = shouldBeVisible ? '' : 'none'; // Display project card (flex or block depending on CSS)
                if (shouldBeVisible) {
                    visibleProjects++;
                }
            });
            
            if (resultsCountSpan) {
                resultsCountSpan.textContent = `${visibleProjects} proyectos encontrados`;
            }

            // --- Handle no results message for filters ---
            const existingNoResultsMessage = galleryContentContainer.querySelector('.no-results-message');
            if (existingNoResultsMessage) {
                existingNoResultsMessage.remove(); // Remove existing no results message if any
            }

            if (visibleProjects === 0) {
                // Hide the main projects grid
                projectsGrid.style.display = 'none';

                // Display a new "no results" message
                const noResultsHTML = `
                    <div class="no-results-message">
                        <div class="no-results-card">
                            <div class="no-results-icon"><i data-lucide="folder-x"></i></div>
                            <h3 class="no-results-title">No hay proyectos para este nivel</h3>
                            <p class="no-results-text">Intenta con otro filtro o <a href="#" class="reset-filters-link">limpia todos los filtros</a>.</p>
                            <button class="no-results-btn">Limpiar Filtros</button>
                        </div>
                    </div>`;
                galleryContentContainer.insertAdjacentHTML('beforeend', noResultsHTML);
                lucide.createIcons();

                const resetFiltersBtn = galleryContentContainer.querySelector('.no-results-btn');
                if (resetFiltersBtn) {
                    resetFiltersBtn.addEventListener('click', clearLevelFilters);
                }
                const resetFiltersLink = galleryContentContainer.querySelector('.reset-filters-link');
                if (resetFiltersLink) {
                    resetFiltersLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        clearLevelFilters();
                    });
                }

            } else {
                // Ensure the main projects grid is visible
                projectsGrid.style.display = 'grid'; // Restore grid display
            }
        });
    });
}

function clearLevelFilters() {
    const allLevelsButton = document.querySelector('.level-buttons .level-btn'); // Select the "Todos los niveles" button
    if (allLevelsButton) {
        allLevelsButton.click(); // Simulate click to reset filters
    }
}


function initProjectDetailPage() {
    const db = getDB();
    const params = new URLSearchParams(window.location.search);
    const projectId = parseInt(params.get('id'), 10);
    const project = db.projects.find(p => p.id === projectId);

    if (!project) {
        document.querySelector('.detail-content .container').innerHTML = '<p class="no-data-message">Proyecto no encontrado.</p>';
        return;
    }

    document.title = `${project.title} - OrientaVocacional`;
    document.querySelector('.detail-title').textContent = project.title;
    document.querySelector('.detail-subtitle').textContent = `Proyecto detallado desarrollado por ${project.author.name} - ${project.level}`;
    document.querySelector('.breadcrumb-current').textContent = project.title;
    
    const image = document.querySelector('.project-featured-image img');
    if (image) {
        image.src = project.imageUrl;
        image.alt = project.title;
    }
    
    const description = document.querySelector('.detail-section p');
    if(description) description.textContent = project.description;
    
    const techList = document.querySelector('.tech-list');
    if(techList) techList.innerHTML = project.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('');
    
    const avatar = document.querySelector('.student-avatar');
    if(avatar) avatar.textContent = project.author.avatar;

    const studentName = document.querySelector('.student-details strong');
    if(studentName) studentName.textContent = project.author.name;

    const studentDetails1 = document.querySelector('.student-details p:nth-of-type(1)');
    if(studentDetails1) studentDetails1.textContent = `${project.level} • ${project.author.university}`;
    
    const studentDetails2 = document.querySelector('.student-details p:nth-of-type(2)');
    if(studentDetails2) studentDetails2.textContent = `Especialización: ${project.author.specialization}`;
    
    const stats = document.querySelectorAll('.stat-value');
    if (stats.length === 3) {
        stats[0].textContent = project.devTime;
        stats[1].textContent = project.finalGrade;
        stats[2].textContent = `${project.views}`;
    }
    
    const githubLink = document.querySelector('.detail-actions a[href*="github.com"]');
    if(githubLink) githubLink.href = project.githubUrl;

    const demoLink = document.querySelector('.detail-actions a[href*="play"]');
    if(demoLink) demoLink.href = project.demoUrl;

    lucide.createIcons();
}