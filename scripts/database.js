// scripts/database.js
// Base de datos simulada usando localStorage - Inspirado en patrones educativos

/**
 * Versión actual de la base de datos
 * Incrementar este número cada vez que se actualice la estructura
 */
const DB_VERSION = 2;

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
    const db = JSON.parse(existingDB);

    // Si la versión coincide, devolver la BD existente
    if (db.version === DB_VERSION) {
      console.log('✅ Base de datos cargada (versión ' + DB_VERSION + ')');
      return db;
    } else {
      console.log('🔄 Actualizando base de datos de versión ' + (db.version || 1) + ' a ' + DB_VERSION);
      // Versión antigua, crear nueva BD
      localStorage.removeItem('db');
    }
  }

  // Crear nueva base de datos con estructura actualizada
  console.log('🆕 Creando nueva base de datos (versión ' + DB_VERSION + ')');

  const db = {
    version: DB_VERSION,
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
                imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop',
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
