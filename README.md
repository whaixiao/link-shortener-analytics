# 🔗 LinkAnalytics Dashboard

Una aplicación Fullstack moderna para acortar URLs y visualizar analíticas de tráfico en tiempo real. 

Este proyecto destaca por una interfaz fluida y un manejo de estado avanzado en el cliente, apoyado por una API robusta y rápida.

![Captura de pantalla del Dashboard](ruta-a-tu-imagen/dashboard.png) ## 🚀 Características Principales

* **Acortador instantáneo:** Generación de enlaces cortos con validación de URLs.
* **Dashboard de Analíticas:** Visualización interactiva de clics a lo largo del tiempo usando gráficos dinámicos.
* **Historial Persistente:** Almacenamiento local (LocalStorage) de los últimos enlaces generados para no perder el tracking al cerrar la pestaña.
* **UI/UX Moderna:** Diseño oscuro (Dark Mode), totalmente responsivo y con animaciones de entrada.

## 💻 Tecnologías Utilizadas

El proyecto está diseñado con un fuerte enfoque en el desarrollo de interfaces modernas y tipado estricto, utilizando un backend ligero para la gestión de datos.

### Frontend
* **React 18** + **TypeScript**: Arquitectura de componentes y tipado estricto.
* **Vite**: Empaquetador ultra rápido.
* **Tailwind CSS v4**: Estilizado mediante clases de utilidad y variables CSS nativas.
* **Recharts**: Renderizado de gráficos SVG para las métricas.
* **React Router DOM**: Navegación SPA fluida.
* **Lucide React**: Sistema de iconografía.

### Backend (Fundamento)
* **Python** + **FastAPI**: Endpoints asíncronos y documentación automática (Swagger).
* **MongoDB** + **Motor**: Base de datos NoSQL con driver asíncrono.
* **Pydantic**: Validación de datos y esquemas.
