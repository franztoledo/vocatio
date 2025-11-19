import { db_calculators } from './database-calculators.js';
import { showToast } from './utils.js';

const formatCurrency = (value) => {
    if (isNaN(value)) return "S/ 0.00";
    return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
};

document.addEventListener('DOMContentLoaded', () => {
    const pagePath = window.location.pathname;

    if (pagePath.includes('configurar-simulacion-costos.html')) {
        initCostConfigPage();
    } else if (pagePath.includes('costos-educativos-resultado.html')) {
        initCostResultPage();
    } else if (pagePath.includes('opciones-financiamiento.html')) {
        initFinancingPage();
    }
});

function initCostConfigPage() {
    const careerSelect = document.getElementById('career-select');
    const universitySelect = document.getElementById('university-select');
    const modalitySelect = document.getElementById('modality-select');
    const calculateBtn = document.getElementById('calculate-costs-btn');

    // Populate selects
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

    // Populate modality based on first career
    if (db_calculators.careers.length > 0) {
        const firstCareer = db_calculators.careers[0];
        if (firstCareer.modalidades) {
            firstCareer.modalidades.forEach(m => {
                const option = document.createElement('option');
                option.value = m;
                option.textContent = m;
                modalitySelect.appendChild(option);
            });
        }
    }

    // Update modality when career changes
    careerSelect.addEventListener('change', () => {
        const selectedCareer = db_calculators.careers.find(c => c.id == careerSelect.value);
        modalitySelect.innerHTML = '';
        if (selectedCareer && selectedCareer.modalidades) {
            selectedCareer.modalidades.forEach(m => {
                const option = document.createElement('option');
                option.value = m;
                option.textContent = m;
                modalitySelect.appendChild(option);
            });
        }
    });


    // Handle button click
    calculateBtn.addEventListener('click', () => {
        const simulationData = {
            careerId: careerSelect.value,
            universityId: universitySelect.value,
            modality: modalitySelect.value,
            postgrad: document.getElementById('postgrad-select').value,
            transport: document.getElementById('transport-cost').value || 0,
            food: document.getElementById('food-cost').value || 0,
            materials: document.getElementById('materials-cost').value || 0,
            others: document.getElementById('other-costs').value || 0,
        };

        if (!simulationData.careerId || !simulationData.universityId) {
            showToast('Por favor, selecciona una carrera y una universidad.', 'error');
            return;
        }

        localStorage.setItem('costSimulationData', JSON.stringify(simulationData));
        window.location.href = 'costos-educativos-resultado.html';
    });
}

function initCostResultPage() {
    const data = JSON.parse(localStorage.getItem('costSimulationData'));
    if (!data) {
        window.location.href = 'configurar-simulacion-costos.html';
        return;
    }

    const career = db_calculators.careers.find(c => c.id == data.careerId);
    const university = db_calculators.universities.find(u => u.id == data.universityId);

    // --- Calculations ---
    const postgradType = parseInt(data.postgrad);
    let postgradDuration = 0;
    let postgradCost = 0;
    let postgradCredits = 0;

    if (postgradType === 1) { // Especialización
        postgradDuration = career.durationEspecializacion;
        postgradCredits = (career.totalCredits / career.durationPregrado) * postgradDuration; // Estimated credits
        postgradCost = postgradCredits * university.costPerCredit * university.postgradoCreditMultiplier;
    } else if (postgradType === 2) { // Maestría
        postgradDuration = career.durationMaestria;
         postgradCost = (career.totalCredits / career.durationPregrado) * postgradDuration * university.costPerCredit * university.postgradoCreditMultiplier;
    }

    const totalDuration = career.durationPregrado + postgradDuration;
    const pregradoCost = career.totalCredits * university.costPerCredit;
    
    // Monthly costs are multiplied by duration in months
    const transportTotal = parseFloat(data.transport) * totalDuration * 12;
    const foodTotal = parseFloat(data.food) * totalDuration * 12;
    const othersTotal = parseFloat(data.others) * totalDuration * 12;
    // Annual costs are multiplied by duration in years
    const materialsTotal = parseFloat(data.materials) * totalDuration;

    const totalCost = pregradoCost + postgradCost + transportTotal + foodTotal + materialsTotal + othersTotal;

    // --- Update UI ---
    document.getElementById('param-career').textContent = career.name;
    document.getElementById('param-university').textContent = university.name;
    document.getElementById('param-duration').textContent = `${totalDuration.toFixed(1)} años`;
    const monthlyExtra = parseFloat(data.transport) + parseFloat(data.food) + parseFloat(data.others);
    document.getElementById('param-extra-costs').textContent = formatCurrency(monthlyExtra);

    document.getElementById('cost-pregrado').textContent = formatCurrency(pregradoCost);
    document.getElementById('cost-postgrado').textContent = formatCurrency(postgradCost);
    document.getElementById('cost-transport').textContent = formatCurrency(transportTotal);
    document.getElementById('cost-food').textContent = formatCurrency(foodTotal);
    document.getElementById('cost-materials').textContent = formatCurrency(materialsTotal);
    document.getElementById('cost-others').textContent = formatCurrency(othersTotal);
    document.getElementById('total-cost').textContent = formatCurrency(totalCost);
    
    // Save for next page
    localStorage.setItem('totalCost', totalCost);
    localStorage.setItem('costDescription', `Para ${career.name} en ${university.name} (${totalDuration.toFixed(1)} años)`);

}

function initFinancingPage() {
    const totalCost = localStorage.getItem('totalCost');
    const description = localStorage.getItem('costDescription');

    if (totalCost && description) {
        document.getElementById('total-cost-banner').textContent = formatCurrency(parseFloat(totalCost));
        document.getElementById('cost-banner-description').textContent = description;
    } else {
        // Fallback if data is missing
        document.getElementById('total-cost-banner').textContent = "N/A";
        document.getElementById('cost-banner-description').textContent = "Por favor, realiza una simulación primero.";
    }
}