import { getActiveUser, getFavoriteCareers } from '../../scripts/utils.js';

document.addEventListener('DOMContentLoaded', () => {
    populateReport();
    
    const downloadButton = document.getElementById('download-report-btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', generatePDF);
    }
});

function populateReport() {
    const user = getActiveUser();
    const favoriteCareers = getFavoriteCareers();
    const config = JSON.parse(localStorage.getItem('reportConfig'));

    if (!user) {
        document.getElementById('report-user-name').textContent = "Usuario no encontrado";
        document.getElementById('report-summary').textContent = "Inicia sesión para ver tu reporte.";
        return;
    }

    // --- Apply Configuration if exists ---
    if (config) {
        if (config.title) {
            document.querySelector('.report-preview-title').textContent = config.title;
        }
        
        // Visibility Logic
        const toggleSection = (id, isVisible) => {
            const el = document.getElementById(id);
            if (el) el.style.display = isVisible ? 'block' : 'none';
        };

        if (config.sections) {
            toggleSection('section-header', config.sections['Portada personalizada']);
            toggleSection('section-test-results', config.sections['Resultados del test']);
            toggleSection('section-resumen', config.sections['Resumen ejecutivo']);
            toggleSection('section-favorite-careers', config.sections['Carreras recomendadas']);
        }
    }

    // Populate header
    document.getElementById('report-user-name').textContent = user.name;
    document.getElementById('report-date').textContent = `Generado el ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;

    // Populate test results
    const testResultsContainer = document.getElementById('report-test-results');
    testResultsContainer.innerHTML = ''; 
    if (user.testResults && user.testResults.length > 0) {
        const latestTest = user.testResults[user.testResults.length - 1];
        latestTest.results.sort((a, b) => b.score - a.score).slice(0, 3).forEach(result => {
             const resultItem = document.createElement('div');
             resultItem.className = 'career-item-preview';
             resultItem.innerHTML = `<span class="career-name-preview">${result.area}</span>
                                     <span class="career-match-preview">${result.score}% compatibilidad</span>`;
            testResultsContainer.appendChild(resultItem);
        });
        
        // Use custom message if available, otherwise default summary
        if (config && config.message && config.message.trim() !== "") {
             document.getElementById('report-summary').textContent = config.message;
        } else {
             document.getElementById('report-summary').textContent = `Basado en tu análisis vocacional, muestras una alta compatibilidad con el área de ${latestTest.results[0].area} (${latestTest.results[0].score}%).`;
        }

    } else {
        testResultsContainer.innerHTML = '<p>No has completado ningún test vocacional.</p>';
        document.getElementById('report-summary').textContent = "Completa un test vocacional para generar un resumen.";
    }

    // Populate favorite careers
    const favoriteCareersContainer = document.getElementById('report-favorite-careers');
    favoriteCareersContainer.innerHTML = '';
    if (favoriteCareers && favoriteCareers.length > 0) {
        favoriteCareers.slice(0, 3).forEach(career => {
            const careerItem = document.createElement('div');
            careerItem.className = 'career-item-preview';
            careerItem.innerHTML = `<span class="career-name-preview">${career.title}</span>
                                    <span class="career-match-preview">Área: ${career.area}</span>`;
            favoriteCareersContainer.appendChild(careerItem);
        });
    } else {
        favoriteCareersContainer.innerHTML = '<p>No has guardado ninguna carrera como favorita.</p>';
    }
}

function generatePDF() {
    const downloadButton = document.getElementById('download-report-btn');
    const element = document.getElementById('reporte-a-exportar');
    
    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     'Mi-Reporte-Vocacional.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true,
        scrollY: 0
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };

    if(downloadButton) downloadButton.style.display = 'none';

    html2pdf().from(element).set(opt).save().then(() => {
        if(downloadButton) downloadButton.style.display = 'block';
    });
}
