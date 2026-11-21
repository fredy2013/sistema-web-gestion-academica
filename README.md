# Sistema Web Configurable para la Gestión Académica

## 1. Descripción del Proyecto

Proyecto formativo desarrollado en el programa Tecnología en Análisis y Desarrollo de Software (ADSO) del SENA, orientado a la gestión académica de una institución educativa.

El sistema busca facilitar la administración de la información académica mediante una aplicación web organizada por módulos y una arquitectura de software por capas.

## 2. Tecnologías Utilizadas

Las tecnologías y herramientas utilizadas en el proyecto son:

- **Node.js:** entorno de ejecución de JavaScript.
- **Express.js:** framework para el desarrollo del backend y la API REST.
- **PostgreSQL:** sistema gestor de bases de datos relacional.
- **JavaScript:** lenguaje de programación utilizado en el backend.
- **Git:** sistema de control de versiones.
- **GitHub:** plataforma de alojamiento del repositorio.
- **Visual Studio Code:** entorno de desarrollo.

## 3. Estructura del Proyecto

El proyecto está organizado en los siguientes directorios y archivos principales:

```text
SistemaWebGestionAcademica/
│
├── .git/
├── .vscode/
├── backend/
├── database/
├── docs/
├── frontend/
├── tests/
├── .gitignore
└── README.md
```

Descripción de los directorios:

- **backend/**: contiene el servidor, las rutas, los controladores, los servicios, los repositorios y la configuración de conexión a la base de datos.
- **database/**: contiene los recursos y scripts SQL relacionados con la estructura de la base de datos.
- **docs/**: directorio destinado a la documentación del proyecto.
- **frontend/**: directorio destinado al desarrollo de la interfaz de usuario.
- **tests/**: directorio destinado a los recursos de pruebas.
- **.gitignore**: especifica los archivos y directorios excluidos del control de versiones.
- **README.md**: contiene la documentación general del proyecto.

## 4. Arquitectura Implementada

El backend está desarrollado mediante una arquitectura por capas, que permite separar las responsabilidades y organizar el código.

Las capas implementadas son:

- **Routes:** define las rutas de acceso a los servicios de la API.
- **Controllers:** recibe las solicitudes HTTP y gestiona las respuestas.
- **Services:** contiene la lógica de negocio.
- **Repositories:** administra el acceso y las operaciones sobre la base de datos.
- **Models:** representa la estructura de los objetos utilizados por el sistema.
- **Config:** contiene la configuración de conexión con PostgreSQL.

## 5. Módulo Desarrollado: Gestión de Estudiantes

Se implementó el módulo de gestión de estudiantes, permitiendo administrar la información personal y académica mediante operaciones CRUD.

### Funcionalidades implementadas

- **Registrar estudiantes (POST):** permite crear nuevos registros de estudiantes.
- **Consultar estudiantes (GET):** permite obtener la información de los estudiantes registrados.
- **Actualizar estudiantes (PUT):** permite modificar la información de un estudiante existente.
- **Eliminar estudiantes (DELETE):** permite eliminar registros de estudiantes.

El módulo incorpora validaciones de datos y comunicación con la base de datos PostgreSQL.

## 6. Base de Datos

El proyecto utiliza **PostgreSQL** como sistema gestor de bases de datos relacional.

El directorio `database/` contiene el archivo `esquema_academico.sql`, que define y adapta la estructura del modelo académico mediante:

- Creación de tablas.
- Relaciones entre entidades mediante claves foráneas.
- Restricciones de integridad y unicidad.
- Validaciones mediante restricciones CHECK.
- Creación de índices para optimizar las consultas.

El esquema contempla las siguientes entidades:

1. Personas.
2. Estudiantes.
3. Docentes.
4. Asignaturas.
5. Períodos académicos.
6. Grupos académicos.
7. Matrículas.
8. Evaluaciones.
9. Calificaciones.

**Nota:** El script SQL realiza modificaciones sobre tablas existentes, por lo que requiere una estructura previa compatible en PostgreSQL.

La conexión del backend con PostgreSQL se configura mediante variables de entorno almacenadas en el archivo `backend/.env`.

Las variables requeridas son:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

Por seguridad, el archivo `.env` no debe publicarse en el repositorio.

## 7. Requisitos Previos

Para instalar y ejecutar el backend se requiere:

- Node.js.
- npm.
- PostgreSQL.
- Git.
- Visual Studio Code (recomendado).

## 8. Instalación y Configuración

### 8.1. Clonar el repositorio

```bash
git clone https://github.com/fredy2013/sistema-web-gestion-academica.git
```

### 8.2. Ingresar al directorio del proyecto

```bash
cd sistema-web-gestion-academica
```

### 8.3. Ingresar al backend

```bash
cd backend
```

### 8.4. Instalar las dependencias

```bash
npm install
```

### 8.5. Configurar las variables de entorno

Crear un archivo `.env` dentro del directorio `backend/` y configurar los datos de conexión a PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_base_datos
DB_USER=usuario
DB_PASSWORD=contraseña
```

Los valores anteriores son ejemplos y deben sustituirse por los datos correspondientes a la instalación local.

## 9. Ejecución del Backend

Desde el directorio `backend/`, ejecutar:

### Modo normal

```bash
npm start
```

### Modo desarrollo

```bash
npm run dev
```

El servidor backend se ejecuta en el puerto **3000**.

## 10. API REST - Gestión de Estudiantes

La API REST del módulo de estudiantes utiliza la siguiente ruta base:

```text
http://localhost:3000/api/estudiantes
```

Operaciones disponibles:

| Método HTTP | Funcionalidad          |
| ----------- | ---------------------- |
| GET         | Consultar estudiantes  |
| POST        | Registrar estudiantes  |
| PUT         | Actualizar estudiantes |
| DELETE      | Eliminar estudiantes   |

Las operaciones fueron verificadas mediante pruebas funcionales utilizando Thunder Client en Visual Studio Code.

## 11. Persistencia de Datos

La información del módulo de estudiantes se almacena en PostgreSQL.

El acceso a los datos se realiza mediante la librería `pg` de Node.js, utilizando consultas SQL y operaciones gestionadas desde la capa Repository.

## 12. Control de Versiones

El proyecto utiliza Git y GitHub para el control de versiones y el seguimiento de los cambios realizados durante el desarrollo.

El repositorio remoto se encuentra disponible en:

https://github.com/fredy2013/sistema-web-gestion-academica

## 13. Estado Actual del Proyecto

Se encuentra implementado el módulo de gestión de estudiantes con operaciones CRUD (crear, consultar, actualizar y eliminar), conexión con PostgreSQL, validaciones de datos y pruebas funcionales de la API REST.

## 14. Autor

**Fredy De Jesus Morales Morales**

Aprendiz - SENA
Tecnología en Análisis y Desarrollo de Software (ADSO)
