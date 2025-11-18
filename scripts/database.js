// scripts/database.js
// Base de datos simulada usando localStorage - Inspirado en patrones educativos

/**
 * Versión actual de la base de datos
 * Incrementar este número cada vez que se actualice la estructura
 */
const DB_VERSION = 10;

/**
 * Inicializa la base de datos en localStorage si no existe
 *
 * ¿Cómo funciona?
 * 1. Verifica si ya existe una DB guardada
 * 2. Verifica la versión de la BD
 * 3. Si la versión es antigua o no existe, crea una nueva
 * 4. Si NO existe, crea una nueva con datos de ejemplo
 * 5. La guarda en localStorage
 *
 * @returns {Object} La base de datos completa
 */
export function initDB() {
  // Verificar si existe la BD y su versión
  const existingDB = localStorage.getItem('db');

  if (existingDB) {
    try {
      const db = JSON.parse(existingDB);
      // Si la versión coincide, devolver la BD existente
      if (db.version === DB_VERSION) {
        console.log('✅ Base de datos cargada (versión ' + DB_VERSION + ')');
        return db;
      }
    } catch (e) {
      console.error('Error al parsear la base de datos, creando una nueva.', e);
      localStorage.removeItem('db');
    }
  }

  // Si la versión es antigua o no existe, crear nueva BD
  console.log('🔄 Actualizando/Creando base de datos a versión ' + DB_VERSION);
  console.log('⚠️ IMPORTANTE: Si estás viendo este mensaje, tu base de datos se está reinicializando.');
  console.log('⚠️ Esto significa que se perderán los datos antiguos y se crearán nuevos datos de ejemplo.');
  localStorage.removeItem('db');


  // Crear nueva base de datos con estructura actualizada
  const db = {
    version: DB_VERSION,
    users: [
      {
        id: 1,
        name: 'Usuario de Prueba',
        email: 'test@test.com',
        password: 'Password123',
        profile: {
          age: 22,
          level: 'Universitario',
          interests: ['Tecnología', 'Innovación'],
          gender: 'Masculino',
          city: 'Lima'
        },
        favoriteCareers: [1, 4], // IDs de carreras favoritas
        savedResources: [2, 3], // IDs de recursos guardados
        testResults: [
          {
            date: '2024-10-26T10:00:00Z',
            type: 'tradicional',
            results: [
              { area: 'Tecnología', score: 92 },
              { area: 'Salud', score: 75 },
              { area: 'Arte y Diseño', score: 72 },
              { area: 'Negocios', score: 68 },
              { area: 'Ciencias Sociales', score: 55 }
            ]
          }
        ], // Historial de resultados de tests
        customLists: [], // Listas personalizadas de carreras
        privacySettings: {
          profileVisibility: 'public',      // 'public', 'friends', 'private'
          showEmail: false,                  // Mostrar email en perfil público
          showAge: true,                     // Mostrar edad en perfil público
          showEducationLevel: true,          // Mostrar nivel educativo
          showTestResults: false,            // Mostrar resultados de tests vocacionales
          showFavoriteCareers: true,         // Mostrar carreras favoritas
          allowMessages: true,               // Permitir mensajes de otros usuarios
          showOnlineStatus: true             // Mostrar estado en línea
        }
      }
    ],
    hero_profiles: {
      'Tecnología': {
        name: 'El Mago Tecnológico',
        image: '../../assets/heroes/hero1.webp',
        color_class: 'primary',
        related_careers: [
          { name: 'Ing. de Software', icon: '💻' },
          { name: 'Data Science', icon: '📊' },
          { name: 'Ciberseguridad', icon: '🔐' }
        ]
      },
      'Arte y Diseño': {
        name: 'El Artista Visionario',
        image: '../../assets/heroes/hero2.webp',
        color_class: 'secondary',
        related_careers: [
          { name: 'Diseño UX/UI', icon: '🎨' },
          { name: 'Diseño Gráfico', icon: '✏️' },
          { name: 'Arquitectura', icon: '🏛️' }
        ]
      },
      'Negocios': {
        name: 'El Líder Estratega',
        image: '../../assets/heroes/hero3.webp',
        color_class: 'tertiary',
        related_careers: [
          { name: 'Administración', icon: '📈' },
          { name: 'Marketing', icon: '🎯' },
          { name: 'Economía', icon: '💰' }
        ]
      },
      'Salud': {
        name: 'El Sanador Compasivo',
        image: '../../assets/heroes/hero2.webp',
        color_class: 'primary',
        related_careers: [
          { name: 'Medicina', icon: '⚕️' },
          { name: 'Enfermería', icon: '🩺' },
          { name: 'Fisioterapia', icon: '💪' }
        ]
      },
      'Ciencias Sociales': {
        name: 'El Defensor de la Humanidad',
        image: '../../assets/heroes/hero3.webp',
        color_class: 'tertiary',
        related_careers: [
          { name: 'Psicología', icon: '🧠' },
          { name: 'Derecho', icon: '⚖️' },
          { name: 'Sociología', icon: '👥' }
        ]
      }
    },
    mastery_badges: {
      'Tecnología': { name: 'Pensamiento Lógico', icon: '🧠' },
      'Salud': { name: 'Vocación de Servicio', icon: '❤️' },
      'Arte y Diseño': { name: 'Creatividad Infinita', icon: '✨' },
      'Negocios': { name: 'Liderazgo Nato', icon: '👑' },
      'Ciencias Sociales': { name: 'Empatía Superior', icon: '💬' }
    },
    inventory_items: {
      'Tecnología': [
        { name: 'Capacidad Analítica', level: 'Nivel Máximo', icon: '🎯' },
        { name: 'Pensamiento Lógico', level: 'Alto Nivel', icon: '🧩' }
      ],
      'Arte y Diseño': [
        { name: 'Visión Estética', level: 'Nivel Máximo', icon: '👁️' },
        { name: 'Innovación Disruptiva', level: 'Alto Nivel', icon: '💡' }
      ],
      'Negocios': [
        { name: 'Visión Estratégica', level: 'Nivel Máximo', icon: '🗺️' },
        { name: 'Habilidad de Negociación', level: 'Alto Nivel', icon: '🤝' }
      ],
      'Salud': [
        { name: 'Precisión Quirúrgica', level: 'Nivel Máximo', icon: '🔪' },
        { name: 'Cuidado del Paciente', level: 'Alto Nivel', icon: '💓' }
      ],
      'Ciencias Sociales': [
        { name: 'Escucha Activa', level: 'Nivel Máximo', icon: '👂' },
        { name: 'Análisis Social', level: 'Alto Nivel', icon: '🌍' }
      ]
    },
    missions: {
      'Tecnología': { name: 'Desarrollar un Proyecto de Código', reward: '+500 XP', icon: '💻' },
      'Arte y Diseño': { name: 'Crear un Portafolio de Diseño', reward: '+500 XP', icon: '🎨' },
      'Negocios': { name: 'Elaborar un Plan de Negocios', reward: '+600 XP', icon: '💼' },
      'Salud': { name: 'Voluntariado en un Centro de Salud', reward: '+750 XP', icon: '🏥' },
      'Ciencias Sociales': { name: 'Participar en un Debate', reward: '+400 XP', icon: '📣' }
    },
    careers: [
        {
            id: 1,
            title: 'Ingeniería de Software',
            area: 'Tecnología',
            duration: '5 años',
            modality: 'Presencial',
            dificultad: 'Alto',
            demanda_laboral: 'Muy Alta',
            universidades_count: 12,
            empleabilidad: '95%',
            compatibility: 92,
            initial_salary: 4500,
            avg_salary: 80000,
            description: 'La Ingeniería de Software es una disciplina que combina principios de ciencias de la computación, matemáticas y gestión de proyectos para diseñar, desarrollar y mantener sistemas de software de alta calidad.',
            student_profile: [
                'Pensamiento lógico y analítico desarrollado',
                'Creatividad para resolver problemas complejos',
                'Capacidad de trabajo en equipo',
                'Pasión por la tecnología y la innovación',
                'Habilidades de comunicación efectiva'
            ],
            competencies: [
                'Programación en múltiples lenguajes',
                'Diseño de arquitecturas de software',
                'Gestión de bases de datos',
                'Metodologías ágiles de desarrollo',
                'Seguridad informática y testing'
            ],
            curriculum: [
                { year: 1, courses: [
                    { title: 'Programación I', type: 'Obligatorio', credits: 5 },
                    { title: 'Matemáticas para Computación I', type: 'Obligatorio', credits: 4 },
                    { title: 'Fundamentos de Algoritmos', type: 'Obligatorio', credits: 5 },
                    { title: 'Inglés I', type: 'Obligatorio', credits: 3 }
                ]},
                { year: 2, courses: [
                    { title: 'Programación II', type: 'Obligatorio', credits: 5 },
                    { title: 'Estructuras de Datos', type: 'Obligatorio', credits: 5 },
                    { title: 'Matemáticas para Computación II', type: 'Obligatorio', credits: 4 },
                    { title: 'Inglés II', type: 'Electivo', credits: 3 }
                ]},
                { year: 3, courses: [
                    { title: 'Ingeniería de Software', type: 'Obligatorio', credits: 5 },
                    { title: 'Bases de Datos', type: 'Obligatorio', credits: 5 },
                    { title: 'Desarrollo Web', type: 'Obligatorio', credits: 5 },
                    { title: 'Seguridad Informática', type: 'Obligatorio', credits: 4 }
                ]}
            ],
            field: 'Desarrollo de software, gestión de proyectos, arquitectura de sistemas.',
            labor_field: {
                work_areas: [
                    'Empresas de tecnología y startups',
                    'Consultoras de software',
                    'Bancos y sector financiero',
                    'Retail y e-commerce',
                    'Freelance y emprendimiento',
                    'Empresas multinacionales'
                ],
                positions: [
                    { name: 'Junior Developer', salary: '$2,500 - $3,500' },
                    { name: 'Full Stack Developer', salary: '$4,000 - $6,000' },
                    { name: 'Senior Developer', salary: '$6,500 - $9,000' },
                    { name: 'Tech Lead', salary: '$8,000 - $12,000' },
                    { name: 'Software Architect', salary: '$10,000 - $15,000' }
                ],
                growth: {
                    projection: 'La demanda de ingenieros de software ha crecido 35% en los últimos 3 años y se proyecta un crecimiento sostenido del 25% anual hasta 2030.',
                    employability: '95%',
                    insertion_time: '6 meses',
                    work_in_area: '85%'
                }
            },
            testimonials: [
                { name: 'Diego Ramírez', info: 'Estudiante de 7mo ciclo • UTEC', text: '"La carrera es exigente pero muy gratificante. Los proyectos que desarrollamos son super interesantes y aplicables al mundo real."', rating: 5, avatar: 'DR' },
                { name: 'Ana Torres', info: 'Egresada 2022 • UPC', text: '"Conseguí trabajo 2 meses antes de graduarme. Las prácticas pre-profesionales son clave para ganar experiencia."', rating: 5, avatar: 'AT' },
                { name: 'Carlos Mendoza', info: 'Estudiante de 5to ciclo • PUCP', text: '"Lo mejor es la comunidad de estudiantes. Siempre hay alguien dispuesto a ayudarte con proyectos o dudas."', rating: 4, avatar: 'CM' }
            ],
            keywords: ['tecnología', 'programación', 'creatividad', 'innovación', 'lógica', 'matemáticas'],
            imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop'
          },
          {
            id: 2,
            title: 'Medicina',
            area: 'Salud',
            duration: '7 años',
            modality: 'Presencial',
            dificultad: 'Muy Alto',
            demanda_laboral: 'Alta',
            universidades_count: 8,
            empleabilidad: '98%',
            compatibility: 88,
            initial_salary: 5000,
            avg_salary: 90000,
            description: 'La Medicina es la ciencia dedicada al estudio de la vida, la salud, las enfermedades y la muerte del ser humano. Implica el arte de diagnosticar, tratar y prevenir enfermedades.',
            student_profile: [
                'Vocación de servicio y empatía',
                'Resistencia física y emocional',
                'Capacidad de toma de decisiones bajo presión',
                'Habilidades de comunicación',
                'Compromiso ético y dedicación'
            ],
            competencies: [
                'Diagnóstico clínico',
                'Tratamiento de enfermedades',
                'Cirugía y procedimientos médicos',
                'Investigación médica',
                'Gestión de salud pública'
            ],
            curriculum: [
                { year: 1, courses: [
                    { title: 'Anatomía Humana', type: 'Obligatorio', credits: 6 },
                    { title: 'Biología Celular y Molecular', type: 'Obligatorio', credits: 5 },
                    { title: 'Química General', type: 'Obligatorio', credits: 4 }
                ]},
                { year: 2, courses: [
                    { title: 'Fisiología', type: 'Obligatorio', credits: 6 },
                    { title: 'Bioquímica', type: 'Obligatorio', credits: 5 },
                    { title: 'Histología', type: 'Obligatorio', credits: 4 }
                ]}
            ],
            field: 'Hospitales, clínicas, investigación, salud pública.',
            labor_field: {
                work_areas: [
                    'Hospitales y clínicas (públicas y privadas)',
                    'Consultorios privados',
                    'Investigación médica y farmacéutica',
                    'Docencia universitaria',
                    'Organizaciones de salud pública (MINSA, OMS)'
                ],
                positions: [
                    { name: 'Médico Residente', salary: '$3,000 - $4,500' },
                    { name: 'Médico General', salary: '$5,000 - $7,000' },
                    { name: 'Médico Especialista', salary: '$8,000 - $15,000+' },
                    { name: 'Director Médico', salary: '$12,000 - $20,000' }
                ],
                growth: {
                    projection: 'La necesidad de profesionales de la salud es constante y se espera un crecimiento estable, especialmente en áreas de especialización y geriatría.',
                    employability: '98%',
                    insertion_time: '3 meses',
                    work_in_area: '95%'
                }
            },
            testimonials: [
                { name: 'Lucía Fernández', info: 'Residente de Pediatría', text: '"Cada día es un desafío, pero saber que ayudas a los niños a sanar no tiene precio. Es una carrera de vocación."', rating: 5, avatar: 'LF' }
            ],
            keywords: ['salud', 'ayudar personas', 'ciencia', 'biología', 'empatía', 'servicio'],
            imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop'
          },
          {
            id: 3,
            title: 'Arquitectura',
            area: 'Arte y Diseño',
            duration: '5 años',
            modality: 'Presencial',
            dificultad: 'Alto',
            demanda_laboral: 'Media',
            universidades_count: 10,
            empleabilidad: '85%',
            compatibility: 85,
            initial_salary: 3800,
            avg_salary: 70000,
            description: 'La Arquitectura combina arte, ciencia y tecnología para diseñar y planificar espacios habitables. Los arquitectos crean edificios y espacios que son funcionales, estéticos y sostenibles.',
            student_profile: [
                'Creatividad y visión espacial',
                'Habilidades de dibujo y diseño',
                'Sensibilidad estética',
                'Capacidad de análisis estructural',
                'Pasión por el entorno construido'
            ],
            competencies: [
                'Diseño arquitectónico',
                'Construcción y urbanismo',
                'Diseño de interiores',
                'Restauración patrimonial',
                'Gestión de proyectos inmobiliarios'
            ],
            curriculum: null, // No information available
            field: 'Diseño arquitectónico, urbanismo, paisajismo, diseño de interiores.',
            labor_field: {
                work_areas: ['Estudios de arquitectura', 'Constructoras', 'Inmobiliarias', 'Sector público (urbanismo)'],
                positions: [
                    { name: 'Arquitecto Junior', salary: '$2,200 - $3,200' },
                    { name: 'Arquitecto de Proyectos', salary: '$3,500 - $5,500' }
                ],
                growth: { projection: 'Crecimiento ligado al sector construcción.', employability: '85%', insertion_time: '9 meses', work_in_area: '78%' }
            },
            testimonials: null, // No information available
            keywords: ['diseño', 'creatividad', 'arte', 'construcción', 'espacios', 'sostenibilidad'],
            imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop'
          },
          {
            id: 4,
            title: 'Administración de Empresas',
            area: 'Negocios',
            duration: '4 años',
            modality: 'Híbrida',
            dificultad: 'Medio',
            demanda_laboral: 'Alta',
            universidades_count: 15,
            empleabilidad: '90%',
            compatibility: 90,
            initial_salary: 3500,
            avg_salary: 75000,
            description: 'La Administración de Empresas prepara profesionales para dirigir, gestionar y optimizar los recursos de una organización. Abarca áreas como finanzas, marketing, recursos humanos y operaciones.',
            student_profile: [
                'Liderazgo y habilidades de comunicación',
                'Pensamiento estratégico',
                'Capacidad analítica',
                'Orientación a resultados y adaptabilidad',
                'Iniciativa y habilidades interpersonales'
            ],
            competencies: [
                'Gerencia general',
                'Análisis financiero',
                'Consultoría empresarial',
                'Gestión de marketing',
                'Dirección de recursos humanos'
            ],
            curriculum: [
                { year: 1, courses: [
                    { title: 'Contabilidad General', type: 'Obligatorio', credits: 4 },
                    { title: 'Matemática para los Negocios', type: 'Obligatorio', credits: 4 },
                    { title: 'Introducción a la Administración', type: 'Obligatorio', credits: 3 }
                ]}
            ],
            field: 'Gerencia, finanzas, marketing, recursos humanos.',
            labor_field: {
                work_areas: ['Banca y finanzas', 'Consultoría', 'Retail', 'Consumo masivo'],
                positions: [
                    { name: 'Analista de Marketing', salary: '$2,800 - $4,000' },
                    { name: 'Jefe de Producto', salary: '$5,000 - $7,500' }
                ],
                growth: { projection: 'Crecimiento estable del 10% anual.', employability: '90%', insertion_time: '8 meses', work_in_area: '80%' }
            },
            testimonials: [
                { name: 'Sofía Vargas', info: 'Gerente de Marketing', text: '"La carrera te da una visión 360 de los negocios, lo que es fundamental para cualquier puesto de liderazgo."', rating: 4, avatar: 'SV' }
            ],
            keywords: ['negocios', 'liderazgo', 'gestión', 'finanzas', 'estrategia', 'emprendimiento'],
            imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop'
          },
          {
            id: 5,
            title: 'Psicología',
            area: 'Ciencias Sociales',
            duration: '5 años',
            modality: 'Híbrida',
            dificultad: 'Medio',
            demanda_laboral: 'Media',
            universidades_count: 9,
            empleabilidad: '85%',
            compatibility: 82,
            initial_salary: 3000,
            avg_salary: 65000,
            description: 'La Psicología es el estudio científico del comportamiento humano y los procesos mentales. Los psicólogos ayudan a las personas a comprender sus pensamientos, emociones y conductas.',
            student_profile: [
                'Empatía y habilidades de escucha',
                'Objetividad y paciencia',
                'Interés en ayudar a otros',
                'Capacidad de análisis del comportamiento',
                'Estabilidad emocional y ética'
            ],
            competencies: [
                'Psicología clínica',
                'Psicología educativa',
                'Psicología organizacional',
                'Investigación y docencia',
                'Consultoría privada'
            ],
            curriculum: [
                { year: 1, courses: [
                    { title: 'Introducción a la Psicología', type: 'Obligatorio', credits: 3 },
                    { title: 'Bases Biológicas del Comportamiento', type: 'Obligatorio', credits: 4 }
                ]}
            ],
            field: 'Psicología clínica, recursos humanos, educación, investigación.',
            labor_field: {
                work_areas: ['Clínicas y hospitales', 'Recursos humanos', 'Colegios y universidades', 'Consultoría privada'],
                positions: [
                    { name: 'Psicólogo Clínico', salary: '$3,500 - $5,000' },
                    { name: 'Analista de RRHH', salary: '$3,000 - $4,500' }
                ],
                growth: { projection: 'Demanda creciente en salud mental y bienestar organizacional.', employability: '85%', insertion_time: '9 meses', work_in_area: '75%' }
            },
            testimonials: [
                { name: 'Javier Luna', info: 'Psicólogo Organizacional', text: '"Poder mejorar el clima laboral de una empresa y el bienestar de los empleados es muy satisfactorio."', rating: 5, avatar: 'JL' }
            ],
            keywords: ['comportamiento', 'empatía', 'ayuda', 'salud mental', 'ciencia', 'personas'],
            imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=200&fit=crop'
          },
          {
            id: 6,
            title: 'Derecho',
            area: 'Ciencias Sociales',
            duration: '6 años',
            modality: 'Presencial',
            dificultad: 'Alto',
            demanda_laboral: 'Alta',
            universidades_count: 11,
            empleabilidad: '88%',
            compatibility: 89,
            initial_salary: 4000,
            avg_salary: 85000,
            description: 'El Derecho es el estudio de las normas jurídicas que regulan la sociedad. Los abogados representan, asesoran y defienden los derechos de personas y organizaciones.',
            student_profile: [
                'Capacidad analítica',
                'Excelente expresión oral y escrita',
                'Argumentación lógica y ética sólida',
                'Memoria para detalles y leyes',
                'Habilidad para la negociación'
            ],
            competencies: [
                'Asesoría legal corporativa',
                'Litigio y notarías',
                'Fiscalía y defensoría pública',
                'Carrera judicial y docencia',
                'Derecho penal, civil, laboral, etc.'
            ],
            curriculum: [
                { year: 1, courses: [
                    { title: 'Introducción al Derecho', type: 'Obligatorio', credits: 3 },
                    { title: 'Derecho Romano', type: 'Obligatorio', credits: 4 }
                ]}
            ],
            field: 'Estudios de abogados, área legal de empresas, sector público.',
            labor_field: {
                work_areas: ['Estudios de abogados', 'Empresas (área legal)', 'Sector público (jueces, fiscales)', 'Notarías'],
                positions: [
                    { name: 'Abogado Junior', salary: '$3,800 - $5,000' },
                    { name: 'Abogado Corporativo', salary: '$6,000 - $9,000' }
                ],
                growth: { projection: 'Campo competitivo pero con altas recompensas para especialistas.', employability: '88%', insertion_time: '7 meses', work_in_area: '82%' }
            },
            testimonials: [
                { name: 'Isabella Rojas', info: 'Abogada Corporativa', text: '"La carrera es demandante, pero defender los intereses de tu cliente y ganar un caso es una sensación inigualable."', rating: 4, avatar: 'IR' }
            ],
            keywords: ['justicia', 'leyes', 'argumentación', 'defensa', 'análisis', 'ética'],
            imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop'
          },
          {
            id: 7,
            title: 'Desarrollo de Aplicaciones',
            area: 'Tecnología',
            duration: '3 años',
            modality: 'Virtual',
            dificultad: 'Medio',
            demanda_laboral: 'Muy Alta',
            universidades_count: 7,
            empleabilidad: '96%',
            compatibility: 90,
            initial_salary: 3200,
            avg_salary: 72000,
            description: 'Programación de aplicaciones móviles y web.',
            student_profile: [
                'Creatividad y lógica de programación',
                'Ganas de crear soluciones digitales',
                'Autoaprendizaje constante',
                'Atención al detalle',
                'Resolución de problemas'
            ],
            competencies: [
                'Desarrollo de apps móviles (iOS/Android)',
                'Desarrollo web front-end y back-end',
                'Diseño de experiencia de usuario (UX/UI)',
                'Manejo de bases de datos',
                'Trabajo remoto y en equipo'
            ],
            curriculum: [
                { year: 1, courses: [
                    { title: 'Fundamentos de Programación Web', type: 'Obligatorio', credits: 5 },
                    { title: 'Diseño de Interfaces', type: 'Obligatorio', credits: 4 }
                ]}
            ],
            field: 'Desarrollo móvil, desarrollo web, UI/UX.',
            labor_field: {
                work_areas: ['Startups de tecnología', 'Agencias digitales', 'Empresas de software', 'Freelance'],
                positions: [
                    { name: 'Desarrollador Front-end', salary: '$3,000 - $4,500' },
                    { name: 'Desarrollador de Apps Móviles', salary: '$3,500 - $5,500' }
                ],
                growth: { projection: 'Crecimiento explosivo, especialmente en desarrollo móvil y web3.', employability: '96%', insertion_time: '4 meses', work_in_area: '90%' }
            },
            testimonials: [
                { name: 'Mateo Díaz', info: 'Desarrollador iOS', text: '"Es increíble poder crear una app que miles de personas usan. El aprendizaje es constante y muy divertido."', rating: 5, avatar: 'MD' }
            ],
            keywords: ['tecnología', 'apps', 'móvil', 'web', 'programación', 'virtual'],
            imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop'
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
        },
        {
          id: 11,
          text: 'Me gusta experimentar y descubrir cómo funcionan las cosas',
          area: 'Tecnología',
          weight: 0.9
        },
        {
          id: 12,
          text: 'Me siento bien cuando ayudo a resolver conflictos entre personas',
          area: 'Ciencias Sociales',
          weight: 0.9
        },
        {
          id: 13,
          text: 'Prefiero actividades que requieren creatividad e innovación',
          area: 'Arte y Diseño',
          weight: 0.9
        },
        {
          id: 14,
          text: 'Me interesa organizar eventos o proyectos',
          area: 'Negocios',
          weight: 0.9
        },
        {
          id: 15,
          text: 'Me gustaría trabajar en investigación médica o científica',
          area: 'Salud',
          weight: 0.9
        },
        {
          id: 16,
          text: 'Disfruto aprendiendo nuevos lenguajes de programación',
          area: 'Tecnología',
          weight: 1
        },
        {
          id: 17,
          text: 'Me atrae la idea de cuidar y proteger a los demás',
          area: 'Salud',
          weight: 0.8
        },
        {
          id: 18,
          text: 'Me gusta expresarme a través del arte o la música',
          area: 'Arte y Diseño',
          weight: 1
        },
        {
          id: 19,
          text: 'Me interesa emprender mi propio negocio',
          area: 'Negocios',
          weight: 1
        },
        {
          id: 20,
          text: 'Me gusta estudiar el comportamiento de las sociedades',
          area: 'Ciencias Sociales',
          weight: 0.8
        }
      ],
      aventura: {
        levels: [
          {
            id: 1,
            title: 'Primeros Pasos',
            icon: '🔍',
            badge: 'Explorador Curioso',
            description: '¡Has empezado a descubrir tus intereses únicos!',
            cards: [
              {
                id: 1,
                title: '¿Te ves aquí?',
                description: 'Trabajando con computadoras y tecnología',
                imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
                likeArea: 'Tecnología',
                dislikeArea: null,
                confirmationLike: '¡Anotado! La tecnología te llama 💻',
                confirmationDislike: '¡Entendido! Busquemos otras opciones 👍'
              },
              {
                id: 2,
                title: '¿Esto va contigo?',
                description: 'Ayudar a personas con su salud y bienestar',
                imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
                likeArea: 'Salud',
                dislikeArea: null,
                confirmationLike: '¡Genial! Ayudar a otros te motiva 🏥',
                confirmationDislike: '¡Perfecto! Sigamos explorando 👍'
              },
              {
                id: 3,
                title: '¿Te imaginas aquí?',
                description: 'Creando diseños y arte visual',
                imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
                likeArea: 'Arte y Diseño',
                dislikeArea: null,
                confirmationLike: '¡Increíble! La creatividad es lo tuyo 🎨',
                confirmationDislike: '¡Ok! Hay más por descubrir 👍'
              },
              {
                id: 4,
                title: '¿Esto te emociona?',
                description: 'Liderar equipos y tomar decisiones',
                imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                likeArea: 'Negocios',
                dislikeArea: null,
                confirmationLike: '¡Anotado! El liderazgo es tu fuerte 💼',
                confirmationDislike: '¡Entendido! Continuemos 👍'
              },
              {
                id: 5,
                title: '¿Te identificas?',
                description: 'Comprender el comportamiento humano',
                imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
                likeArea: 'Ciencias Sociales',
                dislikeArea: null,
                confirmationLike: '¡Excelente! Las personas te interesan 🧠',
                confirmationDislike: '¡Perfecto! Sigamos adelante 👍'
              }
            ],
            funFact: '¡Momento de Inspiración! 💡\n¿Sabías que Steve Jobs estudió caligrafía en la universidad? ¡Eso influyó en el diseño de las fuentes de Mac!'
          },
          {
            id: 2,
            title: 'Tu Estilo de Trabajo',
            icon: '⚡',
            badge: 'Descubridor de Talentos',
            description: '¡Estás identificando cómo te gusta trabajar!',
            cards: [
              {
                id: 6,
                title: '¿Prefieres esto?',
                description: 'Trabajar solo en proyectos complejos',
                imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
                likeArea: 'Tecnología',
                dislikeArea: 'Negocios',
                confirmationLike: '¡Anotado! Te gusta la concentración 🎯',
                confirmationDislike: '¡Ok! Prefieres el trabajo en equipo 👥'
              },
              {
                id: 7,
                title: '¿Esto te llama?',
                description: 'Resolver problemas de manera práctica',
                imageUrl: 'https://images.unsplash.com/photo-1581092918484-8313e1f7e8d6?w=800&h=600&fit=crop',
                likeArea: 'Tecnología',
                dislikeArea: null,
                confirmationLike: '¡Genial! Eres orientado a soluciones 🔧',
                confirmationDislike: '¡Entendido! Sigamos descubriendo 👍'
              },
              {
                id: 8,
                title: '¿Te ves haciendo esto?',
                description: 'Cuidar y escuchar a las personas',
                imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop',
                likeArea: 'Salud',
                dislikeArea: null,
                confirmationLike: '¡Perfecto! La empatía es tu don 💚',
                confirmationDislike: '¡Ok! Hay más opciones para ti 👍'
              },
              {
                id: 9,
                title: '¿Esto va contigo?',
                description: 'Crear presentaciones y convencer personas',
                imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
                likeArea: 'Negocios',
                dislikeArea: null,
                confirmationLike: '¡Excelente! La comunicación es clave 🎤',
                confirmationDislike: '¡Entendido! Continuemos explorando 👍'
              },
              {
                id: 10,
                title: '¿Te imaginas aquí?',
                description: 'Analizar datos y encontrar patrones',
                imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                likeArea: 'Tecnología',
                dislikeArea: null,
                confirmationLike: '¡Increíble! Los datos hablan contigo 📊',
                confirmationDislike: '¡Perfecto! Sigamos adelante 👍'
              }
            ],
            funFact: '¡Dato Curioso! 🌟\nMuchos cirujanos practican con videojuegos para mejorar su coordinación mano-ojo. ¡Los gamers también pueden ser doctores!'
          },
          {
            id: 3,
            title: 'Tu Creatividad',
            icon: '🎨',
            badge: 'Visionario Creativo',
            description: '¡Estás explorando tu lado creativo y artístico!',
            cards: [
              {
                id: 11,
                title: '¿Esto te inspira?',
                description: 'Diseñar espacios y edificios',
                imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
                likeArea: 'Arte y Diseño',
                dislikeArea: null,
                confirmationLike: '¡Anotado! La arquitectura te llama 🏛️',
                confirmationDislike: '¡Ok! Busquemos tu pasión 👍'
              },
              {
                id: 12,
                title: '¿Te ves aquí?',
                description: 'Creando contenido digital y multimedia',
                imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop',
                likeArea: 'Arte y Diseño',
                dislikeArea: null,
                confirmationLike: '¡Genial! El mundo digital es tuyo 🎬',
                confirmationDislike: '¡Entendido! Hay más por explorar 👍'
              },
              {
                id: 13,
                title: '¿Esto va contigo?',
                description: 'Innovar y crear cosas nuevas',
                imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
                likeArea: 'Tecnología',
                dislikeArea: null,
                confirmationLike: '¡Excelente! La innovación te motiva 🚀',
                confirmationDislike: '¡Perfecto! Sigamos descubriendo 👍'
              },
              {
                id: 14,
                title: '¿Te identificas?',
                description: 'Escribir historias y contenido',
                imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
                likeArea: 'Arte y Diseño',
                dislikeArea: null,
                confirmationLike: '¡Increíble! Las palabras son tu arte ✍️',
                confirmationDislike: '¡Ok! Continuemos explorando 👍'
              },
              {
                id: 15,
                title: '¿Esto te emociona?',
                description: 'Experimentar y descubrir cosas nuevas',
                imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
                likeArea: 'Salud',
                dislikeArea: null,
                confirmationLike: '¡Genial! La ciencia te fascina 🔬',
                confirmationDislike: '¡Entendido! Hay más opciones 👍'
              }
            ],
            funFact: '¡Sabías que...? 🎨\nLos diseñadores gráficos también trabajan en videojuegos, películas y aplicaciones que usas todos los días!'
          },
          {
            id: 4,
            title: 'Tu Impacto',
            icon: '💡',
            badge: 'Agente de Cambio',
            description: '¡Descubriendo cómo quieres impactar el mundo!',
            cards: [
              {
                id: 16,
                title: '¿Te imaginas?',
                description: 'Ayudar a comunidades vulnerables',
                imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop',
                likeArea: 'Ciencias Sociales',
                dislikeArea: null,
                confirmationLike: '¡Anotado! El servicio social te mueve 🤝',
                confirmationDislike: '¡Ok! Hay más formas de ayudar 👍'
              },
              {
                id: 17,
                title: '¿Esto va contigo?',
                description: 'Crear soluciones para el medio ambiente',
                imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
                likeArea: 'Tecnología',
                dislikeArea: null,
                confirmationLike: '¡Genial! Cuidar el planeta importa 🌱',
                confirmationDislike: '¡Entendido! Sigamos buscando 👍'
              },
              {
                id: 18,
                title: '¿Te ves aquí?',
                description: 'Emprender y generar empleo',
                imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
                likeArea: 'Negocios',
                dislikeArea: null,
                confirmationLike: '¡Increíble! El emprendimiento te llama 🚀',
                confirmationDislike: '¡Perfecto! Hay más caminos 👍'
              },
              {
                id: 19,
                title: '¿Esto te inspira?',
                description: 'Defender los derechos de las personas',
                imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
                likeArea: 'Ciencias Sociales',
                dislikeArea: null,
                confirmationLike: '¡Excelente! La justicia te motiva ⚖️',
                confirmationDislike: '¡Ok! Sigamos explorando 👍'
              },
              {
                id: 20,
                title: '¿Te identificas?',
                description: 'Investigar y generar nuevo conocimiento',
                imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=600&fit=crop',
                likeArea: 'Salud',
                dislikeArea: null,
                confirmationLike: '¡Genial! La investigación es tu pasión 🔬',
                confirmationDislike: '¡Entendido! Continuemos 👍'
              }
            ],
            funFact: '¡Increíble! 🌟\n¿Sabías que muchos emprendedores exitosos estudiaron carreras muy diferentes antes de crear sus empresas?'
          },
          {
            id: 5,
            title: 'Tu Futuro',
            icon: '🌟',
            badge: 'Visionario del Futuro',
            description: '¡Casi listo! Estás definiendo tu camino ideal',
            cards: [
              {
                id: 21,
                title: '¿Te imaginas en 10 años?',
                description: 'Trabajando con inteligencia artificial',
                imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
                likeArea: 'Tecnología',
                dislikeArea: null,
                confirmationLike: '¡Increíble! El futuro tech es tuyo 🤖',
                confirmationDislike: '¡Ok! Hay muchas opciones 👍'
              },
              {
                id: 22,
                title: '¿Esto te emociona?',
                description: 'Viajar y trabajar en diferentes países',
                imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
                likeArea: 'Negocios',
                dislikeArea: null,
                confirmationLike: '¡Genial! El mundo te espera ✈️',
                confirmationDislike: '¡Perfecto! Sigamos adelante 👍'
              },
              {
                id: 23,
                title: '¿Te ves haciendo esto?',
                description: 'Trabajar en tu propia clínica o consultorio',
                imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd26fd0d?w=800&h=600&fit=crop',
                likeArea: 'Salud',
                dislikeArea: null,
                confirmationLike: '¡Anotado! Tu independencia profesional 🏥',
                confirmationDislike: '¡Entendido! Hay más posibilidades 👍'
              }
            ],
            funFact: '¡Lo lograste! 🎉\n¡Has completado tu viaje de autodescubrimiento! Ahora veamos qué camino es el mejor para ti.'
          }
        ]
      }
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

  // Guardar la base de datos en localStorage
  // Convertir el objeto a texto con JSON.stringify()
  localStorage.setItem('db', JSON.stringify(db));
  return db;
}

/**
 * Obtiene toda la base de datos desde localStorage
 *
 * Si no existe, la inicializa automáticamente
 *
 * @returns {Object} La base de datos completa
 */
export function getDB() {
  return JSON.parse(localStorage.getItem('db')) || initDB();
}