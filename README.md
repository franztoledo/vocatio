# Vocatio 🧭

> **Orientación Vocacional Inteligente para tu Futuro**

![Vocatio Banner](assets/heroicon.png) 
## 📖 Introducción

**Vocatio** es una aplicación web diseñada para democratizar el acceso a la orientación vocacional en Perú. Enfocada en estudiantes de educación secundaria (4to y 5to año) y de los primeros ciclos universitarios, nuestra plataforma ofrece un ecosistema digital integral para la exploración profesional.

A diferencia de los tests tradicionales estáticos, Vocatio combina evaluaciones científicas, gamificación ("Modo Aventura"), herramientas de planificación financiera y académica, y un sistema de gestión de carrera personalizado para reducir la incertidumbre y la deserción universitaria.

🔗 **Demo en vivo:** [https://vocatio-chi.vercel.app/](https://vocatio-chi.vercel.app/)

---

## 🎯 Propósito y Objetivo

### Propósito
Reducir la brecha de información y la ansiedad vocacional en los jóvenes, proporcionando herramientas de autoconocimiento que permitan identificar intereses reales, aptitudes y oportunidades de mercado, más allá de la presión social o familiar.

### Objetivo General
Diseñar e implementar una plataforma web accesible y responsiva que permita a los usuarios:
1.  **Descubrir su perfil vocacional** mediante tests interactivos.
2.  **Explorar carreras** con información detallada de mercado, mallas curriculares y salarios.
3.  **Planificar su futuro** utilizando simuladores de costos y tiempo.
4.  **Gestionar su progreso** a través de un dashboard personalizado.

---

## 🛠️ Tecnologías Utilizadas

El proyecto ha sido desarrollado utilizando estándares web modernos, priorizando el rendimiento y la experiencia de usuario sin depender inicialmente de un backend complejo (arquitectura *Client-Side*).

* **Frontend:**
    * ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) **HTML5:** Estructura semántica y accesibilidad.
    * ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **CSS3:** Diseño responsivo, Flexbox, Grid y animaciones personalizadas.
    * ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **JavaScript (ES6+):** Lógica del negocio, manipulación del DOM y modularización.

* **Persistencia de Datos:**
    * **LocalStorage API:** Gestión de sesiones de usuario, guardado de progreso de tests y listas de favoritos de manera local en el navegador.

* **Librerías y Herramientas:**
    * **Lucide Icons:** Iconografía vectorial ligera y consistente.
    * **html2pdf.js / html2canvas:** Generación de reportes vocacionales en formato PDF.
    * **Git & GitHub:** Control de versiones y trabajo colaborativo.
    * **Vercel:** Despliegue continuo (CI/CD).

---

## 📂 Estructura del Proyecto

La organización del código sigue una arquitectura modular separando vistas, estilos y lógica.

```text
VOCATIO1/
├── index.html                  # Página de aterrizaje (Landing Page)
├── pages/
│   ├── Login/                  # Módulo de Autenticación
│   │   
│   ├── Perfil/                 # Módulo de Usuario
│   │   
│   ├── TestVocacional/         # Módulo de Evaluaciones
│   │   
│   ├── ExplorarCarreras/       # Módulo de Exploración
|   |
│   ├── Herramientas/           # Calculadoras y Simuladores
|   |
│   └── inicio.html     
│       
├── styles/
│   ├── global.css              # Variables CSS y estilos base
│   └── style.css               # Estilos generales de layout
├── scripts/
│   
└── assets/                     # Imágenes y recursos estáticos
```
## ✨ Features (Funcionalidades)

### 🔐 Módulo Login
* **Crear Cuenta de Usuario:** Registro de nuevos usuarios en la plataforma.
* **Iniciar Sesión:** Acceso seguro para usuarios registrados.
* **Completar Perfil Básico:** Configuración inicial de datos del usuario.

### 📝 Módulo Test Vocacionales
* **Realizar Test Vocacional Básico:** Evaluación interactiva para determinar intereses.
* **Guardar Progreso de Test:** Funcionalidad para pausar y retomar evaluaciones.
* **Visualizar Resultados de Test:** Presentación gráfica y detallada de los resultados obtenidos.
* **Historial de Evaluaciones:** Registro de tests pasados para ver la evolución vocacional.

### 🔍 Módulo Exploración de Carreras
* **Explorar Carreras por Filtros:** Búsqueda segmentada por área, duración, etc..
* **Ver Ficha Detallada de Carrera:** Información completa sobre cada profesión.
* **Marcar Carreras como Favoritas:** Guardado de opciones de interés para acceso rápido.
* **Comparar Carreras:** Herramienta para contrastar características entre diferentes opciones.
* **Galería de Proyectos por Carrera:** Visualización de trabajos reales de estudiantes.
* **Lista de Universidades por Carrera:** Directorio de instituciones donde estudiar.
* **Buscar Carreras por Palabras Clave:** Búsqueda inteligente por términos de interés.

### 🛠️ Módulo Herramientas
* **Calculadora de Cambio de Carrera:** Análisis de impacto al cambiar de especialidad.
* **Calculadora de Tiempo de Estudio:** Estimación de la duración total de la formación.
* **Simulador de Costos Educativos:** Proyección financiera de la inversión educativa.

### 👤 Módulo Perfil
* **Dashboard Personal:** Panel principal con resumen de actividad y progreso.
* **Ver Materiales Recomendados:** Recursos educativos sugeridos según el perfil.
* **Configurar Privacidad de Perfil:** Gestión de la visibilidad de datos personales.
* **Exportar Reporte Vocacional:** Generación de informe completo en formato PDF.

---

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado para el curso de **IHC y Tecnologías Móviles** por:

* **Wilber Franz Toledo Mamani** - *u202320608*

---

© 2025 Vocatio. Todos los derechos reservados.
