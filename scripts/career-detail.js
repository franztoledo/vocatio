// scripts/career-detail.js

import { getDB } from './database.js';
import { isFavorite, toggleFavorite } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const db = getDB();
  const params = new URLSearchParams(window.location.search);
  const careerId = parseInt(params.get('id'), 10);
  const career = db.careers.find(c => c.id === careerId);

  if (!career) {
    document.body.innerHTML = '<h1>Carrera no encontrada</h1>';
    return;
  }

  renderCareerDetails(career);
});

function renderCareerDetails(career) {
  // Update document title
  document.title = `${career.title} - OrientaVocacional`;

  // Render Hero
  const hero = document.querySelector('.career-hero');
  if (hero) {
    hero.style.background = `linear-gradient(135deg, rgba(23, 37, 42, 0.85) 0%, rgba(23, 37, 42, 0.92) 100%), url('${career.imageUrl.replace('w=400&h=200', 'w=1200&h=300')}') center/cover`;
    hero.querySelector('.career-hero-title').textContent = career.title;
    hero.querySelector('.career-hero-desc').textContent = career.description;
    hero.querySelector('.career-hero-badges').innerHTML = `
      <span class="career-badge primary">${career.area}</span>
      <span class="career-badge success">${career.compatibility}% Compatible</span>
    `;
  }
  
  // Update Breadcrumb
  const breadcrumb = document.querySelector('.breadcrumb-current');
  if(breadcrumb) {
      breadcrumb.textContent = career.title;
  }

  // Render Info Cards
  const infoGrid = document.querySelector('.career-info-grid');
  if (infoGrid) {
    infoGrid.innerHTML = `
      <div class="career-info-card">
        <div class="career-info-icon"><i data-lucide="clock"></i></div>
        <div class="career-info-content">
          <div class="career-info-value">${career.duration}</div>
          <div class="career-info-label">Duración</div>
        </div>
      </div>
      <div class="career-info-card">
        <div class="career-info-icon salary"><i data-lucide="dollar-sign"></i></div>
        <div class="career-info-content">
          <div class="career-info-value">$${career.initial_salary.toLocaleString('en-US')}</div>
          <div class="career-info-label">Salario inicial</div>
        </div>
      </div>
      <div class="career-info-card">
        <div class="career-info-icon demand"><i data-lucide="trending-up"></i></div>
        <div class="career-info-content">
          <div class="career-info-value">${career.demanda_laboral}</div>
          <div class="career-info-label">Demanda</div>
        </div>
      </div>
      <div class="career-info-card">
        <div class="career-info-icon universities"><i data-lucide="map-pin"></i></div>
        <div class="career-info-content">
          <div class="career-info-value">${career.universidades_count}</div>
          <div class="career-info-label">Universidades</div>
        </div>
      </div>
    `;
  }

  // Render General Info Tab
  const generalTab = document.querySelector('#general');
  if (generalTab) {
    generalTab.innerHTML = `
      <div class="career-description">
        <h2 class="section-title">Descripción de la Carrera</h2>
        <p>${career.description}</p>
      </div>
      <div class="career-profiles">
        <div class="profile-card ideal">
          <h3 class="profile-title"><i data-lucide="user-check"></i> Perfil del Estudiante Ideal</h3>
          <ul class="profile-list">
            ${career.student_profile.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <div class="profile-card competencies">
          <h3 class="profile-title"><i data-lucide="target"></i> Competencias a Desarrollar</h3>
          <ul class="profile-list">
            ${career.competencies.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // Render Curriculum Tab
  const curriculumTab = document.querySelector('#curriculum');
  if (curriculumTab) {
    if (career.curriculum && career.curriculum.length > 0) {
      curriculumTab.innerHTML = `
        <h2 class="section-title">Malla Curricular</h2>
        <div class="curriculum-container">
          ${career.curriculum.map(year => `
            <div class="curriculum-year">
              <div class="year-header">
                <div class="year-badge">${year.year}</div>
                <h3 class="year-title">Año ${year.year}</h3>
              </div>
              <div class="curriculum-grid">
                ${year.courses.map(course => `
                  <div class="course-card">
                    <div class="course-header">
                      <h4 class="course-title">${course.title}</h4>
                      <span class="course-type">${course.type}</span>
                    </div>
                    <div class="course-credits">${course.credits} créditos</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      renderNoInfoAvailable(curriculumTab);
    }
  }

  // Render Labor Field Tab
  const laborTab = document.querySelector('#labor');
  if (laborTab) {
    if (career.labor_field) {
      laborTab.innerHTML = `
        <h2 class="section-title">Campo Laboral</h2>
        <div class="labor-grid">
          <div class="labor-card work-areas">
            <h3 class="labor-title"><i data-lucide="briefcase"></i> Áreas de Trabajo</h3>
            <ul class="labor-list">
              ${career.labor_field.work_areas.map(area => `<li>${area}</li>`).join('')}
            </ul>
          </div>
          <div class="labor-card positions">
            <h3 class="labor-title"><i data-lucide="target"></i> Puestos Comunes</h3>
            <div class="positions-list">
              ${career.labor_field.positions.map(pos => `
                <div class="position-item">
                  <span class="position-name">${pos.name}</span>
                  <span class="position-salary">${pos.salary}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="growth-section">
          <h3 class="growth-title"><i data-lucide="trending-up"></i> Proyección de Crecimiento</h3>
          <p class="growth-text">${career.labor_field.growth.projection}</p>
          <div class="growth-stats">
            <div class="growth-stat">
              <div class="growth-value">${career.labor_field.growth.employability}</div>
              <div class="growth-label">Empleabilidad</div>
            </div>
            <div class="growth-stat">
              <div class="growth-value">${career.labor_field.growth.insertion_time}</div>
              <div class="growth-label">Tiempo promedio de inserción</div>
            </div>
            <div class="growth-stat">
              <div class="growth-value">${career.labor_field.growth.work_in_area}</div>
              <div class="growth-label">Trabaja en su área</div>
            </div>
          </div>
        </div>
      `;
    } else {
      renderNoInfoAvailable(laborTab);
    }
  }

  // Render Testimonials Tab
  const testimonialsTab = document.querySelector('#testimonials');
  if (testimonialsTab) {
    if (career.testimonials && career.testimonials.length > 0) {
      testimonialsTab.innerHTML = `
        <h2 class="section-title">Testimonios de Estudiantes</h2>
        <div class="testimonials-list">
          ${career.testimonials.map(t => `
            <div class="testimonial-card">
              <div class="testimonial-avatar">${t.avatar}</div>
              <div class="testimonial-content">
                <h4 class="testimonial-name">${t.name}</h4>
                <p class="testimonial-info">${t.info}</p>
                <p class="testimonial-text">"${t.text}"</p>
              </div>
              <div class="testimonial-rating">
                ${[...Array(5)].map((_, i) => `<i data-lucide="star"${i < t.rating ? ' class="filled"' : ''}></i>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      renderNoInfoAvailable(testimonialsTab);
    }
  }

  // Favorite Button Logic
  const favoriteBtn = document.querySelector('.career-action-btn.favorite');
  if (favoriteBtn) {
    // Set initial state
    if (isFavorite(career.id)) {
      favoriteBtn.classList.add('active');
    }

    // Add click listener
    favoriteBtn.addEventListener('click', () => {
      const isNowFavorite = toggleFavorite(career.id);
      favoriteBtn.classList.toggle('active', isNowFavorite);
    });
  }

  lucide.createIcons();
}

function renderNoInfoAvailable(container) {
  container.innerHTML = `
    <div class="no-results-message">
        <div class="no-results-card">
            <div class="no-results-icon">
                <i data-lucide="info"></i>
            </div>
            <h3 class="no-results-title">Información no disponible</h3>
            <p class="no-results-text">
                Actualmente no contamos con esta información detallada para esta carrera. 
                Estamos trabajando para añadirla pronto.
            </p>
        </div>
    </div>
  `;
  lucide.createIcons();
}
