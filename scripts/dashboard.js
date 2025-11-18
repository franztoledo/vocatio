import { getDB, getActiveUser, calculateProfileCompletion } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Definitive fix for dashboard initialization
    try {
        const user = getActiveUser();
        if (!user) {
            displayLoginMessage();
            return;
        }

        const db = getDB();
        const fullUser = db.users.find(u => u.id === user.id);
        const allCareers = db.careers;
        const allResources = db.resources;

        if (fullUser) {
            populateHeader(fullUser);
            updateHeroStats(fullUser);
            renderFavoriteCareers(fullUser, allCareers);
            renderRecentActivity(fullUser, allCareers, allResources);
        } else {
            // This case can happen if the user in localStorage is out of sync with the DB
            displayLoginMessage();
        }
    } catch (error) {
        console.error("Error initializing dashboard:", error);
        // Optionally, display a user-friendly error message on the page
        const container = document.querySelector('.dashboard-content .container');
        if(container) {
            container.innerHTML = `<div class="no-data-message" style="border-color: var(--danger-color); color: var(--danger-color);">Ocurrió un error al cargar tu dashboard. Intenta recargar la página.</div>`;
        }
    }
});

function displayLoginMessage() {
    const container = document.querySelector('.dashboard-content');
    if (container) {
        container.innerHTML = `
            <div class="container">
                 <div class="no-data-message" style="text-align: center; padding: 4rem 1rem;">
                    <h3>Inicia sesión para ver tu dashboard</h3>
                    <p>Tu progreso y recomendaciones personalizadas aparecerán aquí.</p>
                    <a href="../Login/login.html" class="btn-primary" style="margin-top: 1rem;">Iniciar Sesión</a>
                </div>
            </div>
        `;
    }
    const hero = document.querySelector('.explore-hero');
    const nextSteps = document.querySelector('.next-steps');
    if (hero) hero.style.display = 'none';
    if (nextSteps) nextSteps.style.display = 'none';
}

function populateHeader(user) {
    const subtitle = document.querySelector('.explore-subtitle');
    if (subtitle) {
        subtitle.textContent = `Resumen de tu progreso, ${user.name}`;
    }
}

function updateHeroStats(user) {
    const stats = document.querySelectorAll('.explore-stat-number');
    if (stats.length < 4) return;

    // 1. Max compatibility - Now with robust checking
    const latestTest = user.testResults?.[user.testResults.length - 1];
    let maxScore = 0;
    if (latestTest && Array.isArray(latestTest.results)) {
        maxScore = Math.max(0, ...latestTest.results.map(r => r.score || 0));
    }
    stats[0].textContent = `${maxScore}%`;

    // 2. Favorite careers
    stats[1].textContent = user.favoriteCareers?.length || 0;

    // 3. Profile completed
    stats[2].textContent = `${calculateProfileCompletion(user)}%`;

    // 4. Tests completed
    stats[3].textContent = user.testResults?.length || 0;
    const statLabels = document.querySelectorAll('.explore-stat-label');
    if (statLabels.length >= 4) {
        statLabels[3].textContent = 'Tests realizados';
    }
}

function renderFavoriteCareers(user, allCareers) {
    const container = document.querySelector('.careers-list');
    if (!container) return;

    container.innerHTML = '';
    const favoriteCareers = user.favoriteCareers?.map(favId => allCareers.find(c => c.id === favId)).filter(Boolean) || [];

    if (favoriteCareers.length === 0) {
        container.innerHTML = '<p class="no-data-message">Aún no tienes carreras favoritas. <a href="../ExplorarCarreras/explorar-carreras-seccion.html">¡Empieza a explorar!</a></p>';
        return;
    }

    const latestTest = user.testResults?.[user.testResults.length - 1];

    favoriteCareers.forEach(career => {
        let percentage = 0;
        if (latestTest && Array.isArray(latestTest.results)) {
            const result = latestTest.results.find(r => r.area === career.area);
            percentage = result?.score || 0;
        }

        const careerItem = document.createElement('div');
        careerItem.className = 'career-item';
        careerItem.innerHTML = `
            <div class="career-info">
                <span class="career-name">${career.title}</span>
                <div class="career-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            </div>
            <span class="career-percentage">${percentage}%</span>
        `;
        container.appendChild(careerItem);
    });
}

function renderRecentActivity(user, allCareers, allResources) {
    const container = document.querySelector('.activity-list');
    if (!container) return;

    container.innerHTML = '';
    if (!user.activityLog || user.activityLog.length === 0) {
        container.innerHTML = '<p class="no-data-message">No hay actividad reciente. ¡Empieza a explorar y realizar tests!</p>';
        return;
    }

    const sortedActivities = [...user.activityLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedActivities.slice(0, 5).forEach(activity => {
        let icon = 'activity';
        let title = 'Actividad desconocida';
        let iconClass = '';

        switch (activity.type) {
            case 'test_completed':
                icon = 'check-circle';
                title = `Test vocacional completado (${activity.details?.testType || 'N/A'})`;
                iconClass = 'completed';
                break;
            case 'career_favorited':
                icon = 'heart';
                const favoritedCareer = allCareers.find(c => c.id === activity.details?.careerId);
                title = `Carrera agregada a favoritas: ${favoritedCareer?.title || 'Desconocida'}`;
                iconClass = 'favorite';
                break;
            case 'resource_saved':
                icon = 'bookmark';
                const savedResource = allResources.find(r => r.id === activity.details?.resourceId);
                title = `Recurso guardado: ${savedResource?.title || 'Desconocido'}`;
                iconClass = 'saved';
                break;
            case 'profile_updated':
                icon = 'user';
                title = `Perfil actualizado (${activity.details?.field || 'N/A'})`;
                iconClass = 'profile';
                break;
            default:
                break;
        }

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon ${iconClass}">
                <i data-lucide="${icon}"></i>
            </div>
            <div class="activity-details">
                <p class="activity-title">${title}</p>
                <p class="activity-time">${timeAgo(activity.timestamp)}</p>
            </div>
        `;
        container.appendChild(activityItem);
    });
    lucide.createIcons();
}

function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30);
    const years = Math.round(days / 365);

    if (seconds < 60) return `Hace menos de un minuto`;
    if (minutes < 60) return `Hace ${minutes} minuto${minutes === 1 ? '' : 's'}`;
    if (hours < 24) return `Hace ${hours} hora${hours === 1 ? '' : 's'}`;
    if (days < 30) return `Hace ${days} día${days === 1 ? '' : 's'}`;
    if (months < 12) return `Hace ${months} mes${months === 1 ? '' : 'es'}`;
    return `Hace ${years} año${years === 1 ? '' : 's'}`;
}