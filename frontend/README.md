# Frontend - Sistema Web Configurable para la Gestión Académica

## 1. Descripción

El frontend corresponde al componente de interfaz de usuario del Sistema Web Configurable para la Gestión Académica. Está desarrollado con JavaScript y React JS, utilizando Vite como herramienta de desarrollo y compilación.

Su propósito es proporcionar una interfaz para la interacción de los usuarios con los procesos académicos contemplados en el proyecto.

## 2. Tecnologías utilizadas

- JavaScript: lenguaje de programación.
- React JS: biblioteca para la construcción de interfaces mediante componentes.
- Vite: herramienta de desarrollo y compilación.
- HTML5: estructura de las interfaces.
- CSS3: presentación y estilos visuales.
- ESLint: análisis estático y revisión del código.
- Prettier: formato automático del código.
- Git: control de versiones.

## 3. Estructura del frontend

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── FormField.jsx
│   ├── modules/
│   │   └── auth/
│   │       └── Login.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── .prettierrc.json
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js

```

## 4. Componentes implementados

### 4.1. App

Componente principal de la aplicación. Se encarga de incorporar y presentar el componente de inicio de sesión.

### 4.2. Login

Componente correspondiente a la interfaz de inicio de sesión. Incluye campos de usuario y contraseña, visualización u ocultamiento de contraseña y validación de campos obligatorios.

La autenticación real todavía requiere integración con el servicio de acceso del backend.

### 4.3. FormField

Componente reutilizable para construir campos de formulario mediante propiedades (props). Actualmente se utiliza en el campo de usuario del inicio de sesión.

## 5. Interacción y validaciones

La interfaz permite ingresar las credenciales, mostrar u ocultar la contraseña y verificar que los campos obligatorios estén diligenciados.

El formulario muestra un mensaje informativo indicando que la autenticación se habilitará cuando se integre el servicio correspondiente del backend.

## 6. Herramientas de calidad y desarrollo

El frontend utiliza ESLint para el análisis estático del código y Prettier para mantener un formato uniforme.

Comandos disponibles:

| Comando                | Función                               |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Iniciar el servidor de desarrollo.    |
| `npm run lint`         | Ejecutar la revisión con ESLint.      |
| `npm run format`       | Aplicar el formato con Prettier.      |
| `npm run format:check` | Comprobar el formato del código.      |
| `npm run build`        | Generar la compilación de producción. |

## 7. Instalación y ejecución

Desde la carpeta principal del proyecto, ingresar al frontend:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir en el navegador la dirección local indicada por Vite, normalmente:

```text
http://localhost:5173/
```

## 8. Integración con el backend

La integración con los servicios y la API del backend se realizará posteriormente. El frontend no establece conexiones directas con PostgreSQL; las operaciones académicas se gestionarán mediante los servicios del servidor.

## 9. Control de versiones

El código fuente del frontend forma parte del repositorio general del proyecto y se gestiona mediante Git.

Repositorio:

https://github.com/fredy2013/sistema-web-gestion-academica
