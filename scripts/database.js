// scripts/database.js
// Base de datos simulada usando localStorage - Inspirado en patrones educativos

/**
 * Inicializa la base de datos en localStorage si no existe
 *
 * ¿Cómo funciona?
 * 1. Verifica si ya existe una DB guardada
 * 2. Si existe, la devuelve
 * 3. Si NO existe, crea una nueva con datos de ejemplo
 * 4. La guarda en localStorage
 *
 * @returns {Object} La base de datos completa
 */
export function initDB() {
  // Si ya existe la base de datos, devolverla
  if (localStorage.getItem('db')) {
    return JSON.parse(localStorage.getItem('db'));
  }

  // Si NO existe, crear una nueva con estructura inicial

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
          question: '¿Te ves trabajando con computadoras y tecnología?',
          leftOption: {
            text: 'Prefiero trabajar con personas directamente',
            area: 'Salud',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'Me encanta la tecnología y programación',
            area: 'Tecnología',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop'
          }
        },
        {
          id: 2,
          question: '¿Qué actividad disfrutas más?',
          leftOption: {
            text: 'Resolver problemas lógicos y matemáticos',
            area: 'Tecnología',
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'Diseñar y crear cosas visualmente atractivas',
            area: 'Arte y Diseño',
            image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&h=600&fit=crop'
          }
        },
        {
          id: 3,
          question: '¿Cómo te ves en 10 años?',
          leftOption: {
            text: 'Dirigiendo mi propia empresa',
            area: 'Negocios',
            image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'Ayudando a mejorar la salud de las personas',
            area: 'Salud',
            image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=600&fit=crop'
          }
        },
        {
          id: 4,
          question: '¿Qué tipo de proyectos te emocionan más?',
          leftOption: {
            text: 'Proyectos creativos y artísticos',
            area: 'Arte y Diseño',
            image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'Proyectos de negocios e innovación',
            area: 'Negocios',
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop'
          }
        },
        {
          id: 5,
          question: '¿Qué ambiente de trabajo prefieres?',
          leftOption: {
            text: 'Un consultorio o clínica ayudando pacientes',
            area: 'Salud',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'Una oficina moderna con tecnología',
            area: 'Tecnología',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
          }
        },
        {
          id: 6,
          question: '¿Cómo resuelves problemas?',
          leftOption: {
            text: 'De forma creativa y original',
            area: 'Arte y Diseño',
            image: 'https://images.unsplash.com/photo-1506729623306-b5a934d88b53?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'Con análisis y lógica',
            area: 'Tecnología',
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop'
          }
        },
        {
          id: 7,
          question: '¿Qué te motiva más?',
          leftOption: {
            text: 'Generar ingresos y emprendimientos',
            area: 'Negocios',
            image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'Ayudar a otros y mejorar vidas',
            area: 'Salud',
            image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&h=600&fit=crop'
          }
        },
        {
          id: 8,
          question: '¿Qué habilidad te describe mejor?',
          leftOption: {
            text: 'Soy muy creativo y artístico',
            area: 'Arte y Diseño',
            image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'Soy estratégico y orientado a resultados',
            area: 'Negocios',
            image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop'
          }
        },
        {
          id: 9,
          question: '¿Dónde te ves más cómodo?',
          leftOption: {
            text: 'En un laboratorio o haciendo investigación',
            area: 'Tecnología',
            image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'En un estudio de diseño o taller creativo',
            area: 'Arte y Diseño',
            image: 'https://images.unsplash.com/photo-1600132806608-231446b2e7af?w=800&h=600&fit=crop'
          }
        },
        {
          id: 10,
          question: '¿Qué actividad disfrutas en tu tiempo libre?',
          leftOption: {
            text: 'Leer sobre economía y finanzas',
            area: 'Negocios',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'Hacer voluntariado o ayudar a otros',
            area: 'Salud',
            image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop'
          }
        },
        {
          id: 11,
          question: 'En un proyecto grupal, ¿cuál es tu rol?',
          leftOption: {
            text: 'El que diseña y hace que se vea bien',
            area: 'Arte y Diseño',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'El que programa o maneja la parte técnica',
            area: 'Tecnología',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop'
          }
        },
        {
          id: 12,
          question: '¿Qué te gustaría lograr profesionalmente?',
          leftOption: {
            text: 'Curar enfermedades o ayudar personas',
            area: 'Salud',
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop'
          },
          rightOption: {
            text: 'Crear mi propia startup exitosa',
            area: 'Negocios',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop'
          }
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
