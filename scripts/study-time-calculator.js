import { db_calculators } from './database-calculators.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const careerSelect = document.getElementById('career-select');
    const modalitySelect = document.getElementById('modality-select');
    const specializationSelect = document.getElementById('specialization-select');
    
    // --- Result Elements ---
    const resultPregrado = document.getElementById('result-pregrado');
    const resultMaestria = document.getElementById('result-maestria');
    const resultPracticas = document.getElementById('result-practicas');
    const resultTimeline = document.getElementById('result-timeline');
    const resultTotalTime = document.getElementById('result-total-time');

    // --- Populate Career Select ---
    if (db_calculators && db_calculators.careers) {
        db_calculators.careers.forEach(career => {
            const option = document.createElement('option');
            option.value = career.id;
            option.textContent = career.name;
            careerSelect.appendChild(option);
        });
    }

    // --- Event Listeners ---
    careerSelect.addEventListener('change', handleCareerChange);
    modalitySelect.addEventListener('change', calculateAndUpdate);
    specializationSelect.addEventListener('change', calculateAndUpdate);

    // --- Functions ---
    function handleCareerChange() {
        const selectedCareerId = careerSelect.value;
        
        if (!selectedCareerId) {
            clearResults();
            modalitySelect.disabled = true;
            specializationSelect.disabled = true;
            return;
        }

        modalitySelect.disabled = false;
        specializationSelect.disabled = false;

        const selectedCareer = db_calculators.careers.find(c => c.id == selectedCareerId);
        populateModalities(selectedCareer.modalidades);
        calculateAndUpdate(); // Trigger calculation after career change
    }

    function populateModalities(modalidades) {
        modalitySelect.innerHTML = '';
        modalidades.forEach(modality => {
            const option = document.createElement('option');
            option.value = modality;
            option.textContent = modality;
            modalitySelect.appendChild(option);
        });
    }

    function calculateAndUpdate() {
        const selectedCareerId = careerSelect.value;
        if (!selectedCareerId) {
            clearResults();
            return;
        }
        const career = db_calculators.careers.find(c => c.id == selectedCareerId);

        const specializationValue = parseInt(specializationSelect.value);
        let maestriaDuration = 0;
        let especializacionDuration = 0;

        if (specializationValue === 1) { // Especialización
            especializacionDuration = career.durationEspecializacion || 1;
        } else if (specializationValue === 2) { // Maestría
            maestriaDuration = career.durationMaestria || 2;
        }
        
        const pregradoDuration = career.durationPregrado;
        const practicasDuration = career.durationPracticas;
        const totalDuration = pregradoDuration + maestriaDuration + especializacionDuration + practicasDuration;
        
        // Update Results UI
        resultPregrado.textContent = `${pregradoDuration} años`;
        resultMaestria.textContent = `${maestriaDuration + especializacionDuration} años`;
        resultPracticas.textContent = `${practicasDuration * 12} meses`;
        resultTotalTime.textContent = `${totalDuration.toFixed(1)} Años`;

        // Update Timeline UI
        updateTimeline(career, pregradoDuration, maestriaDuration, especializacionDuration);
    }
    
    function updateTimeline(career, pregrado, maestria, especializacion) {
        resultTimeline.innerHTML = '';
        const currentYear = new Date().getFullYear();
        let startYear = currentYear;

        // Pregrado
        let endYear = startYear + pregrado;
        let liPregrado = document.createElement('li');
        liPregrado.innerHTML = `<span class="timeline-year">${startYear} - ${endYear}</span>
                              <span class="timeline-text">Pregrado en ${career.name}</span>`;
        resultTimeline.appendChild(liPregrado);
        startYear = endYear;

        // Maestria / Especialización
        const postgradoDuration = maestria + especializacion;
        if (postgradoDuration > 0) {
            endYear = startYear + postgradoDuration;
            let liPostgrado = document.createElement('li');
            liPostgrado.innerHTML = `<span class="timeline-year">${startYear} - ${endYear}</span>
                                   <span class="timeline-text">${maestria > 0 ? 'Maestría' : 'Especialización'} en área afín</span>`;
            resultTimeline.appendChild(liPostgrado);
            startYear = endYear;
        }

        // Prácticas / Mercado Laboral
        let liFinal = document.createElement('li');
        liFinal.innerHTML = `<span class="timeline-year">${startYear}</span>
                             <span class="timeline-text">Ingreso al mercado laboral ${postgradoDuration > 0 ? 'especializado' : ''}</span>`;
        resultTimeline.appendChild(liFinal);
    }

    function clearResults() {
        modalitySelect.innerHTML = '';
        resultPregrado.textContent = '--';
        resultMaestria.textContent = '--';
        resultPracticas.textContent = '--';
        resultTotalTime.textContent = '0 Años';
        resultTimeline.innerHTML = '<li>Selecciona una carrera para ver la línea de tiempo.</li>';
    }

    // Initial state
    clearResults();
    modalitySelect.disabled = true;
    specializationSelect.disabled = true;
});