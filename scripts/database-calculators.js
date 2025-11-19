// scripts/database-calculators.js
// Base de datos simulada para las calculadoras de planificación

export const db_calculators = {
  universities: [
    { id: 1, name: 'Universidad Nacional de Ingeniería (UNI)', costPerCredit: 100 },
    { id: 2, name: 'Universidad de Lima', costPerCredit: 450 },
    { id: 3, name: 'Universidad Peruana Cayetano Heredia (UPCH)', costPerCredit: 550 },
    { id: 4, name: 'Pontificia Universidad Católica del Perú (PUCP)', costPerCredit: 500 },
    { id: 5, name: 'Universidad Nacional Mayor de San Marcos (UNMSM)', costPerCredit: 80 },
    { id: 6, name: 'Universidad Peruana de Ciencias Aplicadas (UPC)', costPerCredit: 480 },
  ],
  careers: [
    {
      id: 1,
      name: 'Ingeniería de Software',
      totalCourses: 40,
      totalCredits: 200,
      area: 'Tecnología',
      courses: [
        { id: 101, name: 'Cálculo I', cycle: 1 },
        { id: 102, name: 'Programación I', cycle: 1 },
        { id: 103, name: 'Introducción a la Ingeniería', cycle: 1 },
        { id: 104, name: 'Física I', cycle: 2 },
        { id: 105, name: 'Estructuras de Datos', cycle: 3 },
        { id: 106, name: 'Bases de Datos I', cycle: 4 },
      ]
    },
    {
      id: 2,
      name: 'Administración de Empresas',
      totalCourses: 38,
      totalCredits: 190,
      area: 'Negocios',
      courses: [
        { id: 201, name: 'Matemática Básica', cycle: 1 },
        { id: 202, name: 'Contabilidad General', cycle: 1 },
        { id: 203, name: 'Introducción a la Administración', cycle: 1 },
        { id: 204, name: 'Microeconomía', cycle: 2 },
        { id: 205, name: 'Estadística para Negocios', cycle: 3 },
        { id: 206, name: 'Gestión de Marketing', cycle: 4 },
      ]
    },
    {
      id: 3,
      name: 'Marketing Digital',
      totalCourses: 36,
      totalCredits: 180,
      area: 'Negocios',
      courses: [
        { id: 301, name: 'Fundamentos de Marketing', cycle: 1 },
        { id: 302, name: 'Comunicación Digital', cycle: 1 },
        { id: 303, name: 'Diseño Gráfico Básico', cycle: 2 },
        { id: 304, name: 'SEO y SEM', cycle: 3 },
        { id: 305, name: 'Gestión de Redes Sociales', cycle: 4 },
      ]
    },
    {
        id: 4,
        name: 'Ingeniería Industrial',
        totalCourses: 42,
        totalCredits: 210,
        area: 'Tecnología',
        courses: [
          { id: 401, name: 'Cálculo I', cycle: 1 },
          { id: 402, name: 'Química General', cycle: 1 },
          { id: 403, name: 'Dibujo Técnico', cycle: 1 },
          { id: 404, name: 'Física I', cycle: 2 },
          { id: 405, name: 'Procesos Industriales', cycle: 3 },
          { id: 406, name: 'Termodinámica', cycle: 4 },
        ]
    },
    {
        id: 5,
        name: 'Psicología',
        totalCourses: 35,
        totalCredits: 175,
        area: 'Ciencias Sociales',
        courses: [
            { id: 501, name: 'Introducción a la Psicología', cycle: 1 },
            { id: 502, name: 'Bases Biológicas del Comportamiento', cycle: 1 },
            { id: 503, name: 'Filosofía', cycle: 2 },
            { id: 504, name: 'Psicología del Desarrollo', cycle: 3 },
        ]
    }
  ],
  // Mapa de convalidación simulado.
  // La clave es una combinación de áreas: 'AreaOrigen-AreaDestino'
  // El valor es el porcentaje de cursos que se pueden convalidar.
  convalidationMap: {
    'Negocios-Tecnología': 0.3, // 30% de cursos de Negocios son convalidables en Tecnología
    'Tecnología-Negocios': 0.4, // 40% de cursos de Tecnología son convalidables en Negocios
    'Tecnología-Tecnología': 0.8, // 80% si es dentro de la misma área (ej. Ing. Software a Ing. Industrial)
    'Ciencias Sociales-Negocios': 0.2,
    'Negocios-Ciencias Sociales': 0.25,
    // Añadir más combinaciones según sea necesario
  }
};
