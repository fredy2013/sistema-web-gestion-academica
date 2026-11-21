
BEGIN;

-- =====================================================
-- 1. TABLA PERSONAS
-- =====================================================

CREATE TABLE personas (
    id_persona SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(30) NOT NULL,
    numero_documento VARCHAR(30) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100),
    telefono VARCHAR(30),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    CONSTRAINT uq_persona_documento
        UNIQUE (tipo_documento, numero_documento)
);

-- =====================================================
-- 2. TABLA PERIODOS ACADEMICOS
-- =====================================================

CREATE TABLE periodos_academicos (
    id_periodo SERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    fecha_inicio_matricula DATE NOT NULL,
    fecha_fin_matricula DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PLANIFICADO',

    CONSTRAINT chk_periodo_fechas
        CHECK (fecha_inicio < fecha_fin),

    CONSTRAINT chk_periodo_matriculas
        CHECK (fecha_inicio_matricula <= fecha_fin_matricula)
);

-- =====================================================
-- 3. ADAPTAR TABLA ESTUDIANTES
-- =====================================================

ALTER TABLE estudiantes
    RENAME COLUMN id TO id_estudiante;

ALTER TABLE estudiantes
    DROP COLUMN tipo_documento,
    DROP COLUMN numero_documento,
    DROP COLUMN nombres,
    DROP COLUMN apellidos,
    DROP COLUMN correo,
    DROP COLUMN celular,
    DROP COLUMN estado;

ALTER TABLE estudiantes
    ADD COLUMN id_persona INTEGER NOT NULL UNIQUE,
    ADD COLUMN codigo_estudiantil VARCHAR(30) UNIQUE,
    ADD COLUMN fecha_ingreso DATE;

ALTER TABLE estudiantes
    ALTER COLUMN fecha_registro SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN fecha_registro SET NOT NULL;

ALTER TABLE estudiantes
    ADD CONSTRAINT fk_estudiante_persona
    FOREIGN KEY (id_persona)
    REFERENCES personas(id_persona)
    ON DELETE RESTRICT;

-- =====================================================
-- 4. ADAPTAR TABLA DOCENTES
-- =====================================================

ALTER TABLE docentes
    RENAME COLUMN id TO id_docente;

ALTER TABLE docentes
    DROP COLUMN tipo_documento,
    DROP COLUMN numero_documento,
    DROP COLUMN nombres,
    DROP COLUMN apellidos,
    DROP COLUMN correo,
    DROP COLUMN celular,
    DROP COLUMN estado;

ALTER TABLE docentes
    ADD COLUMN id_persona INTEGER NOT NULL UNIQUE,
    ADD COLUMN codigo_docente VARCHAR(30) UNIQUE;

ALTER TABLE docentes
    ALTER COLUMN fecha_registro SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN fecha_registro SET NOT NULL;

ALTER TABLE docentes
    ADD CONSTRAINT fk_docente_persona
    FOREIGN KEY (id_persona)
    REFERENCES personas(id_persona)
    ON DELETE RESTRICT;

-- =====================================================
-- 5. ADAPTAR TABLA ASIGNATURAS
-- =====================================================

ALTER TABLE asignaturas
    RENAME COLUMN id TO id_asignatura;

ALTER TABLE asignaturas
    ADD COLUMN intensidad_horaria INTEGER;

ALTER TABLE asignaturas
    ALTER COLUMN estado SET DEFAULT 'ACTIVA',
    ALTER COLUMN estado SET NOT NULL;

ALTER TABLE asignaturas
    ADD CONSTRAINT chk_asignatura_intensidad
    CHECK (
        intensidad_horaria IS NULL
        OR intensidad_horaria > 0
    );

-- =====================================================
-- 6. TABLA GRUPOS ACADEMICOS
-- =====================================================

CREATE TABLE grupos_academicos (
    id_grupo SERIAL PRIMARY KEY,
    id_asignatura INTEGER NOT NULL,
    id_periodo INTEGER NOT NULL,
    id_docente INTEGER NOT NULL,
    codigo_grupo VARCHAR(30) NOT NULL,
    cupo_maximo INTEGER NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT uq_grupo_periodo_asignatura
        UNIQUE (id_periodo, id_asignatura, codigo_grupo),

    CONSTRAINT chk_grupo_cupo
        CHECK (cupo_maximo > 0),

    CONSTRAINT fk_grupo_asignatura
        FOREIGN KEY (id_asignatura)
        REFERENCES asignaturas(id_asignatura)
        ON DELETE RESTRICT,

    CONSTRAINT fk_grupo_periodo
        FOREIGN KEY (id_periodo)
        REFERENCES periodos_academicos(id_periodo)
        ON DELETE RESTRICT,

    CONSTRAINT fk_grupo_docente
        FOREIGN KEY (id_docente)
        REFERENCES docentes(id_docente)
        ON DELETE RESTRICT
);

-- =====================================================
-- 7. ADAPTAR TABLA MATRICULAS
-- =====================================================

ALTER TABLE matriculas
    RENAME COLUMN id TO id_matricula;

ALTER TABLE matriculas
    ADD COLUMN id_estudiante INTEGER NOT NULL,
    ADD COLUMN id_grupo INTEGER NOT NULL,
    ADD COLUMN motivo_estado TEXT;

ALTER TABLE matriculas
    ALTER COLUMN estado SET DEFAULT 'ACTIVA',
    ALTER COLUMN estado SET NOT NULL;

ALTER TABLE matriculas
    ADD CONSTRAINT uq_matricula_estudiante_grupo
        UNIQUE (id_estudiante, id_grupo),

    ADD CONSTRAINT uq_matricula_id_grupo
        UNIQUE (id_matricula, id_grupo),

    ADD CONSTRAINT chk_matricula_estado
        CHECK (
            estado IN ('ACTIVA', 'CANCELADA', 'FINALIZADA')
        ),

    ADD CONSTRAINT fk_matricula_estudiante
        FOREIGN KEY (id_estudiante)
        REFERENCES estudiantes(id_estudiante)
        ON DELETE RESTRICT,

    ADD CONSTRAINT fk_matricula_grupo
        FOREIGN KEY (id_grupo)
        REFERENCES grupos_academicos(id_grupo)
        ON DELETE RESTRICT;

-- =====================================================
-- 8. TABLA EVALUACIONES
-- =====================================================

CREATE TABLE evaluaciones (
    id_evaluacion SERIAL PRIMARY KEY,
    id_grupo INTEGER NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    porcentaje NUMERIC(5,2) NOT NULL,
    fecha_evaluacion DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',

    CONSTRAINT uq_evaluacion_grupo_codigo
        UNIQUE (id_grupo, codigo),

    CONSTRAINT uq_evaluacion_id_grupo
        UNIQUE (id_evaluacion, id_grupo),

    CONSTRAINT chk_evaluacion_porcentaje
        CHECK (porcentaje >= 0 AND porcentaje <= 100),

    CONSTRAINT fk_evaluacion_grupo
        FOREIGN KEY (id_grupo)
        REFERENCES grupos_academicos(id_grupo)
        ON DELETE RESTRICT
);

-- =====================================================
-- 9. TABLA CALIFICACIONES
-- =====================================================

CREATE TABLE calificaciones (
    id_calificacion SERIAL PRIMARY KEY,
    id_evaluacion INTEGER NOT NULL,
    id_matricula INTEGER NOT NULL,
    id_grupo INTEGER NOT NULL,
    nota NUMERIC(5,2) NOT NULL,
    observacion TEXT,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_calificacion_evaluacion_matricula
        UNIQUE (id_evaluacion, id_matricula),

    CONSTRAINT chk_calificacion_nota
        CHECK (nota >= 0),

    CONSTRAINT fk_calificacion_evaluacion_grupo
        FOREIGN KEY (id_evaluacion, id_grupo)
        REFERENCES evaluaciones(id_evaluacion, id_grupo)
        ON DELETE RESTRICT,

    CONSTRAINT fk_calificacion_matricula_grupo
        FOREIGN KEY (id_matricula, id_grupo)
        REFERENCES matriculas(id_matricula, id_grupo)
        ON DELETE RESTRICT
);

-- =====================================================
-- 10. INDICES PARA LAS RELACIONES
-- =====================================================

CREATE INDEX idx_grupos_asignatura
    ON grupos_academicos(id_asignatura);

CREATE INDEX idx_grupos_periodo
    ON grupos_academicos(id_periodo);

CREATE INDEX idx_grupos_docente
    ON grupos_academicos(id_docente);

CREATE INDEX idx_matriculas_estudiante
    ON matriculas(id_estudiante);

CREATE INDEX idx_matriculas_grupo
    ON matriculas(id_grupo);

CREATE INDEX idx_evaluaciones_grupo
    ON evaluaciones(id_grupo);

CREATE INDEX idx_calificaciones_evaluacion
    ON calificaciones(id_evaluacion);

CREATE INDEX idx_calificaciones_matricula
    ON calificaciones(id_matricula);

COMMIT;
