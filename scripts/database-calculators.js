// scripts/database-calculators.js
// Base de datos simulada para las calculadoras de planificación

export const db_calculators = {
  universities: [
    { id: 1, name: 'Universidad Nacional de Ingeniería (UNI)', costPerCredit: 100, postgradoCreditMultiplier: 1.8 },
    { id: 2, name: 'Universidad de Lima', costPerCredit: 450, postgradoCreditMultiplier: 1.5 },
    { id: 3, name: 'Universidad Peruana Cayetano Heredia (UPCH)', costPerCredit: 550, postgradoCreditMultiplier: 1.6 },
    { id: 4, name: 'Pontificia Universidad Católica del Perú (PUCP)', costPerCredit: 500, postgradoCreditMultiplier: 1.5 },
    { id: 5, name: 'Universidad Nacional Mayor de San Marcos (UNMSM)', costPerCredit: 80, postgradoCreditMultiplier: 2.0 },
    { id: 6, name: 'Universidad Peruana de Ciencias Aplicadas (UPC)', costPerCredit: 480, postgradoCreditMultiplier: 1.4 },
  ],
  careers: [
    {
      id: 1,
      name: 'Ingeniería de Software',
      totalCredits: 200,
      area: 'Tecnología',
      durationPregrado: 5,
      durationMaestria: 2,
      durationEspecializacion: 1,
      durationPracticas: 0.5, // 6 meses
      modalidades: ['Presencial', 'Virtual']
    },
    {
      id: 2,
      name: 'Administración de Empresas',
      totalCredits: 190,
      area: 'Negocios',
      durationPregrado: 5,
      durationMaestria: 2,
      durationEspecializacion: 1,
      durationPracticas: 0.5,
      modalidades: ['Presencial', 'Híbrida', 'Virtual']
    },
    {
      id: 3,
      name: 'Marketing Digital',
      totalCredits: 180,
      area: 'Negocios',
      durationPregrado: 4,
      durationMaestria: 1,
      durationEspecializacion: 0.5,
      durationPracticas: 0.5,
      modalidades: ['Virtual']
    },
    {
        id: 4,
        name: 'Ingeniería Industrial',
        totalCredits: 210,
        area: 'Tecnología',
        durationPregrado: 5,
        durationMaestria: 2,
        durationEspecializacion: 1,
        durationPracticas: 1,
        modalidades: ['Presencial']
    },
    {
        id: 5,
        name: 'Psicología',
        totalCredits: 175,
        area: 'Ciencias Sociales',
        durationPregrado: 5,
        durationMaestria: 2,
        durationEspecializacion: 1,
        durationPracticas: 1,
        modalidades: ['Presencial', 'Virtual']
    }
  ],
  // Mapa de convalidación simulado.
  convalidationMap: {
    'Negocios-Tecnología': 0.3, 
    'Tecnología-Negocios': 0.4, 
    'Tecnología-Tecnología': 0.8,
    'Ciencias Sociales-Negocios': 0.2,
    'Negocios-Ciencias Sociales': 0.25,
  }
};
