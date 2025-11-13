// scripts/database.js
// Base de datos simulada para la aplicación Vocatio

/**
 * Inicializa la base de datos en localStorage si no existe
 * @returns {Object} La base de datos completa
 */
export function initDB() {
  if (localStorage.getItem('db')) {
    return JSON.parse(localStorage.getItem('db'));
  }

  const db = {
    users: [
      {
        id: 1,
        name: 'Usuario de Prueba',
        email: 'test@test.com',
        password: 'Password123',
        profile: {
          age: null,
          level: '',
          interests: [],
          gender: '',
          city: ''
        },
        favoriteCareers: [], // IDs de carreras favoritas
        testResults: [], // Historial de resultados de tests
        customLists: [] // Listas personalizadas de carreras
      }
    ],
    careers: [
      {
        id: 1,
        title: 'Ingeniería de Software',
        area: 'Tecnología',
        duration: '5 años',
        modality: 'Universitaria',
        description: 'La Ingeniería de Software es una disciplina que se enfoca en el diseño, desarrollo, mantenimiento y gestión de sistemas de software. Combina principios de ingeniería con conocimientos de programación para crear soluciones tecnológicas innovadoras.',
        profile: 'Ideal para personas con pensamiento lógico, creatividad para resolver problemas, capacidad de trabajo en equipo y pasión por la tecnología. Se requiere habilidad matemática y disposición para el aprendizaje continuo.',
        field: 'Los graduados pueden trabajar como desarrolladores de software, arquitectos de sistemas, ingenieros DevOps, consultores tecnológicos, gerentes de proyectos IT, especialistas en ciberseguridad, entre otros roles en empresas tech, startups, consultoras o como freelancers.',
        avg_salary: 80000,
        keywords: ['tecnología', 'programación', 'creatividad', 'innovación', 'lógica', 'matemáticas'],
        imageUrl: '../../assets/heroes/hero1.webp'
      },
      {
        id: 2,
        title: 'Medicina',
        area: 'Salud',
        duration: '7 años',
        modality: 'Universitaria',
        description: 'La Medicina es la ciencia dedicada al estudio de la vida, la salud, las enfermedades y la muerte del ser humano. Implica el arte de diagnosticar, tratar y prevenir enfermedades, así como el mantenimiento y recuperación de la salud.',
        profile: 'Personas con vocación de servicio, empatía, resistencia física y emocional, capacidad de toma de decisiones bajo presión, habilidades de comunicación y compromiso ético. Requiere dedicación total y disposición para estudiar constantemente.',
        field: 'Los médicos pueden especializarse en diversas áreas como cirugía, pediatría, cardiología, neurología, medicina interna, entre otras. Pueden trabajar en hospitales, clínicas, consultorios privados, investigación médica, docencia universitaria o en organizaciones de salud pública.',
        avg_salary: 90000,
        keywords: ['salud', 'ayudar personas', 'ciencia', 'biología', 'empatía', 'servicio'],
        imageUrl: '../../assets/heroes/hero2.webp'
      },
      {
        id: 3,
        title: 'Arquitectura',
        area: 'Arte y Diseño',
        duration: '5 años',
        modality: 'Universitaria',
        description: 'La Arquitectura combina arte, ciencia y tecnología para diseñar y planificar espacios habitables. Los arquitectos crean edificios y espacios que son funcionales, estéticos y sostenibles.',
        profile: 'Ideal para personas creativas con visión espacial, habilidades de dibujo y diseño, sensibilidad estética, capacidad de análisis estructural y pasión por mejorar el entorno construido. Requiere conocimientos técnicos y artísticos.',
        field: 'Pueden trabajar en estudios de arquitectura, construcción, urbanismo, diseño de interiores, restauración patrimonial, consultoría, gestión de proyectos inmobiliarios o emprender su propio estudio.',
        avg_salary: 70000,
        keywords: ['diseño', 'creatividad', 'arte', 'construcción', 'espacios', 'sostenibilidad'],
        imageUrl: '../../assets/heroes/hero3.webp'
      },
      {
        id: 4,
        title: 'Administración de Empresas',
        area: 'Negocios',
        duration: '4 años',
        modality: 'Universitaria',
        description: 'La Administración de Empresas prepara profesionales para dirigir, gestionar y optimizar los recursos de una organización. Abarca áreas como finanzas, marketing, recursos humanos y operaciones.',
        profile: 'Personas con liderazgo, habilidades de comunicación, pensamiento estratégico, capacidad analítica, orientación a resultados y adaptabilidad. Se valora la iniciativa y las habilidades interpersonales.',
        field: 'Los graduados pueden ser gerentes generales, analistas financieros, consultores empresariales, gerentes de marketing, directores de recursos humanos, emprendedores o ejecutivos en diversas industrias.',
        avg_salary: 75000,
        keywords: ['negocios', 'liderazgo', 'gestión', 'finanzas', 'estrategia', 'emprendimiento'],
        imageUrl: '../../assets/heroes/hero1.webp'
      },
      {
        id: 5,
        title: 'Psicología',
        area: 'Ciencias Sociales',
        duration: '5 años',
        modality: 'Universitaria',
        description: 'La Psicología es el estudio científico del comportamiento humano y los procesos mentales. Los psicólogos ayudan a las personas a comprender sus pensamientos, emociones y conductas.',
        profile: 'Personas empáticas, con excelentes habilidades de escucha, objetividad, paciencia, interés genuino en ayudar a otros y capacidad de análisis del comportamiento humano. Requiere estabilidad emocional y ética profesional.',
        field: 'Pueden trabajar en clínicas, hospitales, escuelas, empresas (recursos humanos), consultorios privados, investigación, docencia, organizaciones comunitarias o especializarse en áreas como psicología clínica, educativa, organizacional o deportiva.',
        avg_salary: 65000,
        keywords: ['comportamiento', 'empatía', 'ayuda', 'salud mental', 'ciencia', 'personas'],
        imageUrl: '../../assets/heroes/hero2.webp'
      },
      {
        id: 6,
        title: 'Derecho',
        area: 'Ciencias Sociales',
        duration: '6 años',
        modality: 'Universitaria',
        description: 'El Derecho es el estudio de las normas jurídicas que regulan la sociedad. Los abogados representan, asesoran y defienden los derechos de personas y organizaciones dentro del marco legal.',
        profile: 'Personas con capacidad analítica, excelente expresión oral y escrita, argumentación lógica, ética sólida, memoria para detalles y leyes, y habilidad para la negociación. Requiere lectura constante y actualización legal.',
        field: 'Los abogados pueden ejercer en estudios jurídicos, asesoría legal corporativa, litigio, notarías, fiscalía, defensoría pública, carrera judicial, docencia universitaria o especializarse en áreas como derecho penal, civil, laboral, corporativo o internacional.',
        avg_salary: 85000,
        keywords: ['justicia', 'leyes', 'argumentación', 'defensa', 'análisis', 'ética'],
        imageUrl: '../../assets/heroes/hero3.webp'
      }
    ],
    universities: [
      {
        id: 1,
        name: 'Universidad Nacional de Ingeniería (UNI)',
        cost: 'Bajo',
        location: 'Lima',
        prestige: 'Alto',
        type: 'Pública',
        careers: [1], // Ofrece Ingeniería de Software
        description: 'Universidad pública líder en ingeniería y tecnología en el Perú.',
        website: 'https://www.uni.edu.pe'
      },
      {
        id: 2,
        name: 'Universidad de Lima',
        cost: 'Alto',
        location: 'Lima',
        prestige: 'Alto',
        type: 'Privada',
        careers: [1, 4, 6], // Ofrece Ingeniería de Software, Administración y Derecho
        description: 'Universidad privada reconocida por su excelencia académica.',
        website: 'https://www.ulima.edu.pe'
      },
      {
        id: 3,
        name: 'Universidad Peruana Cayetano Heredia',
        cost: 'Alto',
        location: 'Lima',
        prestige: 'Alto',
        type: 'Privada',
        careers: [2, 5], // Ofrece Medicina y Psicología
        description: 'Universidad especializada en ciencias de la salud.',
        website: 'https://www.upch.edu.pe'
      },
      {
        id: 4,
        name: 'Pontificia Universidad Católica del Perú (PUCP)',
        cost: 'Medio-Alto',
        location: 'Lima',
        prestige: 'Muy Alto',
        type: 'Privada',
        careers: [1, 2, 3, 4, 5, 6], // Ofrece todas las carreras
        description: 'La universidad más prestigiosa del Perú, con amplia oferta académica.',
        website: 'https://www.pucp.edu.pe'
      },
      {
        id: 5,
        name: 'Universidad Nacional Mayor de San Marcos (UNMSM)',
        cost: 'Bajo',
        location: 'Lima',
        prestige: 'Alto',
        type: 'Pública',
        careers: [2, 3, 4, 5, 6], // Ofrece varias carreras
        description: 'La universidad más antigua de América, con tradición y prestigio.',
        website: 'https://www.unmsm.edu.pe'
      },
      {
        id: 6,
        name: 'Universidad de Piura',
        cost: 'Alto',
        location: 'Piura / Lima',
        prestige: 'Alto',
        type: 'Privada',
        careers: [1, 4, 6], // Ofrece Ingeniería, Administración y Derecho
        description: 'Universidad privada con campus en Piura y Lima.',
        website: 'https://www.udep.edu.pe'
      }
    ],
    vocational_tests: {
      tradicional: [
        {
          id: 1,
          text: 'Me gusta resolver problemas lógicos y matemáticos',
          area: 'Tecnología',
          weight: 1
        },
        {
          id: 2,
          text: 'Disfruto ayudando a otras personas cuando tienen problemas',
          area: 'Salud',
          weight: 1
        },
        {
          id: 3,
          text: 'Me interesa diseñar y crear cosas nuevas',
          area: 'Arte y Diseño',
          weight: 1
        },
        {
          id: 4,
          text: 'Me gusta liderar grupos y tomar decisiones',
          area: 'Negocios',
          weight: 1
        },
        {
          id: 5,
          text: 'Me interesa comprender cómo piensan y se comportan las personas',
          area: 'Ciencias Sociales',
          weight: 1
        },
        {
          id: 6,
          text: 'Prefiero trabajar con datos y análisis antes que con personas',
          area: 'Tecnología',
          weight: 0.8
        },
        {
          id: 7,
          text: 'Me gustaría curar enfermedades y mejorar la salud de las personas',
          area: 'Salud',
          weight: 1
        },
        {
          id: 8,
          text: 'Me atrae el mundo de los negocios y las finanzas',
          area: 'Negocios',
          weight: 1
        },
        {
          id: 9,
          text: 'Disfruto dibujando, pintando o creando arte',
          area: 'Arte y Diseño',
          weight: 1
        },
        {
          id: 10,
          text: 'Me interesa estudiar las leyes y la justicia',
          area: 'Ciencias Sociales',
          weight: 1
        }
      ],
      aventura: [
        {
          id: 1,
          text: 'Estás en una isla desierta. ¿Qué haces primero?',
          options: [
            { text: 'Construir un refugio con tecnología improvisada', area: 'Tecnología' },
            { text: 'Buscar plantas medicinales y evaluar mi salud', area: 'Salud' },
            { text: 'Diseñar un plan de supervivencia creativo', area: 'Arte y Diseño' },
            { text: 'Organizar recursos y establecer prioridades', area: 'Negocios' }
          ]
        },
        {
          id: 2,
          text: 'Encuentras un objeto misterioso. ¿Qué haces?',
          options: [
            { text: 'Analizarlo científicamente y desarmarlo', area: 'Tecnología' },
            { text: 'Verificar si es seguro para la salud', area: 'Salud' },
            { text: 'Imaginar historias sobre su origen', area: 'Arte y Diseño' },
            { text: 'Evaluar su valor y utilidad práctica', area: 'Negocios' }
          ]
        },
        {
          id: 3,
          text: 'Te ofrecen liderar un proyecto importante. ¿Cuál eliges?',
          options: [
            { text: 'Desarrollar una aplicación innovadora', area: 'Tecnología' },
            { text: 'Organizar una campaña de salud comunitaria', area: 'Salud' },
            { text: 'Crear una instalación artística urbana', area: 'Arte y Diseño' },
            { text: 'Lanzar un nuevo emprendimiento', area: 'Negocios' }
          ]
        },
        {
          id: 4,
          text: '¿Qué superpoder te gustaría tener?',
          options: [
            { text: 'Entender y controlar la tecnología con la mente', area: 'Tecnología' },
            { text: 'Curar cualquier enfermedad con el tacto', area: 'Salud' },
            { text: 'Materializar cualquier cosa que imagines', area: 'Arte y Diseño' },
            { text: 'Predecir tendencias del mercado', area: 'Negocios' }
          ]
        },
        {
          id: 5,
          text: 'En tu tiempo libre prefieres...',
          options: [
            { text: 'Programar o aprender nuevas tecnologías', area: 'Tecnología' },
            { text: 'Hacer voluntariado o ayudar a otros', area: 'Salud' },
            { text: 'Crear arte, música o contenido', area: 'Arte y Diseño' },
            { text: 'Leer sobre negocios o invertir', area: 'Negocios' }
          ]
        }
      ]
    },
    projects: [
      {
        id: 1,
        careerId: 1,
        title: 'App de Red Social Universitaria',
        level: '3er año',
        imageUrl: '../../assets/heroes/hero1.webp',
        description: 'Desarrollo de una red social exclusiva para estudiantes universitarios con funciones de networking académico.',
        technologies: ['React', 'Node.js', 'MongoDB']
      },
      {
        id: 2,
        careerId: 1,
        title: 'Sistema de Gestión Hospitalaria',
        level: '4to año',
        imageUrl: '../../assets/heroes/hero2.webp',
        description: 'Plataforma web para gestionar citas médicas, historias clínicas y administración hospitalaria.',
        technologies: ['Angular', 'Spring Boot', 'PostgreSQL']
      },
      {
        id: 3,
        careerId: 2,
        title: 'Investigación sobre Enfermedades Tropicales',
        level: '5to año',
        imageUrl: '../../assets/heroes/hero3.webp',
        description: 'Estudio clínico sobre prevención y tratamiento de enfermedades tropicales en zonas rurales.',
        technologies: []
      },
      {
        id: 4,
        careerId: 3,
        title: 'Diseño de Centro Cultural Comunitario',
        level: '4to año',
        imageUrl: '../../assets/heroes/hero1.webp',
        description: 'Proyecto arquitectónico de un centro cultural sostenible para una comunidad local.',
        technologies: ['AutoCAD', 'Revit', 'SketchUp']
      },
      {
        id: 5,
        careerId: 4,
        title: 'Plan de Negocios para Startup Tech',
        level: '3er año',
        imageUrl: '../../assets/heroes/hero2.webp',
        description: 'Desarrollo completo de plan de negocios para startup de tecnología educativa.',
        technologies: []
      }
    ],
    resources: [
      {
        id: 1,
        area: 'Tecnología',
        title: '¿Qué es un desarrollador Full-Stack?',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=example1',
        description: 'Introducción al desarrollo web full-stack y sus tecnologías.',
        duration: '15 min'
      },
      {
        id: 2,
        area: 'Salud',
        title: 'Un día en la vida de un médico',
        type: 'articulo',
        url: 'https://example.com/article1',
        description: 'Experiencia real de profesionales de la medicina.',
        duration: '10 min'
      },
      {
        id: 3,
        area: 'Tecnología',
        title: 'Introducción a la Inteligencia Artificial',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=example2',
        description: 'Conceptos básicos de IA y machine learning.',
        duration: '20 min'
      },
      {
        id: 4,
        area: 'Arte y Diseño',
        title: 'Fundamentos de Arquitectura Sostenible',
        type: 'articulo',
        url: 'https://example.com/article2',
        description: 'Principios de diseño arquitectónico sostenible.',
        duration: '12 min'
      },
      {
        id: 5,
        area: 'Negocios',
        title: 'Cómo crear un plan de negocios exitoso',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=example3',
        description: 'Guía paso a paso para emprendedores.',
        duration: '25 min'
      },
      {
        id: 6,
        area: 'Ciencias Sociales',
        title: 'Psicología del Comportamiento Humano',
        type: 'curso',
        url: 'https://example.com/course1',
        description: 'Curso introductorio sobre psicología.',
        duration: '2 horas'
      }
    ]
  };

  localStorage.setItem('db', JSON.stringify(db));
  return db;
}

/**
 * Obtiene toda la base de datos
 * @returns {Object} La base de datos completa
 */
export function getDB() {
  return JSON.parse(localStorage.getItem('db')) || initDB();
}
