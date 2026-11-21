
const pool = require('../config/db');
const Estudiante = require("../models/Estudiante");

const convertirAEstudiante = (fila) => {
    if (!fila) return undefined;

    return new Estudiante({
        idEstudiante: fila.id,
        idPersona: fila.id_persona,
        tipoDocumento: fila.tipo_documento,
        numeroDocumento: fila.numero_documento,
        nombres: fila.nombres,
        apellidos: fila.apellidos,
        correo: fila.correo,
        telefono: fila.celular,
        estado: fila.estado,
        codigoEstudiantil: fila.codigo_estudiantil,
        fechaIngreso: fila.fecha_ingreso,
        fechaRegistro: fila.fecha_registro
    });
};

// Obtener un estudiante por su identificador
const obtenerPorId = async (conexion, id) => {
    const resultado = await conexion.query(
        `
        SELECT
            e.id_estudiante AS id,
            e.id_persona,
            e.codigo_estudiantil,
            e.fecha_ingreso,
            e.fecha_registro,
            p.tipo_documento,
            p.numero_documento,
            p.nombres,
            p.apellidos,
            p.correo,
            p.telefono AS celular,
            p.estado
        FROM estudiantes e
        INNER JOIN personas p
            ON e.id_persona = p.id_persona
        WHERE e.id_estudiante = $1
        `,
        [id]
    );

    return convertirAEstudiante(resultado.rows[0]);
};

// Obtener todos los estudiantes
const obtenerTodos = async () => {
    const resultado = await pool.query(
        `
        SELECT
            e.id_estudiante AS id,
            e.id_persona,
            e.codigo_estudiantil,
            e.fecha_ingreso,
            e.fecha_registro,
            p.tipo_documento,
            p.numero_documento,
            p.nombres,
            p.apellidos,
            p.correo,
            p.telefono AS celular,
            p.estado
        FROM estudiantes e
        INNER JOIN personas p
            ON e.id_persona = p.id_persona
        ORDER BY e.id_estudiante
        `
    );

    return resultado.rows.map(convertirAEstudiante);
};

// Generar código estudiantil único por año
const generarCodigoEstudiantil = async (conexion) => {
    const anio = new Date().getFullYear();

    // Bloquear la generación de códigos del año actual
    await conexion.query(
        "SELECT pg_advisory_xact_lock($1, $2)",
        [2026, anio]
    );

    const resultado = await conexion.query(
        `
        SELECT COALESCE(
            MAX(
                CAST(
                    SUBSTRING(codigo_estudiantil FROM '[0-9]+$')
                    AS INTEGER
                )
            ),
            0
        ) AS ultimo_consecutivo
        FROM estudiantes
        WHERE codigo_estudiantil LIKE $1
        `,
        [`EST-${anio}-%`]
    );

    const siguiente = Number(resultado.rows[0].ultimo_consecutivo) + 1;

    return `EST-${anio}-${String(siguiente).padStart(3, "0")}`;
};

// Crear estudiante y persona en una transacción
const crear = async (estudiante) => {
    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        const codigoEstudiantil =
            estudiante.codigoEstudiantil ||
            await generarCodigoEstudiantil(conexion);

        const persona = await conexion.query(
            `
            INSERT INTO personas (
                tipo_documento,
                numero_documento,
                nombres,
                apellidos,
                correo,
                telefono,
                estado
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id_persona
            `,
            [
                estudiante.tipoDocumento,
                estudiante.numeroDocumento,
                estudiante.nombres,
                estudiante.apellidos,
                estudiante.correo ?? null,
                estudiante.telefono ?? estudiante.celular ?? null,
                estudiante.estado ?? 'ACTIVO'
            ]
        );

        const idPersona = persona.rows[0].id_persona;

        const resultado = await conexion.query(
            `
            INSERT INTO estudiantes (
                id_persona,
                codigo_estudiantil,
                fecha_ingreso
            )
            VALUES ($1, $2, $3)
            RETURNING id_estudiante
            `,
            [
                idPersona,
                codigoEstudiantil,
                estudiante.fechaIngreso ?? null
            ]
        );

        const nuevoEstudiante = await obtenerPorId(
            conexion,
            resultado.rows[0].id_estudiante
        );

        await conexion.query('COMMIT');

        return nuevoEstudiante;

    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;

    } finally {
        conexion.release();
    }
};

// Actualizar estudiante y sus datos personales
const actualizar = async (id, estudiante) => {
    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        const existente = await conexion.query(
            `
            SELECT
                id_persona,
                codigo_estudiantil,
                fecha_ingreso
            FROM estudiantes
            WHERE id_estudiante = $1
            FOR UPDATE
            `,
            [id]
        );

        if (existente.rowCount === 0) {
            await conexion.query('ROLLBACK');
            return undefined;
        }

        const idPersona = existente.rows[0].id_persona;

        const codigoEstudiantil =
            estudiante.codigoEstudiantil ??
            existente.rows[0].codigo_estudiantil;

        const fechaIngreso =
            estudiante.fechaIngreso ??
            existente.rows[0].fecha_ingreso;

        await conexion.query(
            `
            UPDATE personas
            SET
                tipo_documento = $1,
                numero_documento = $2,
                nombres = $3,
                apellidos = $4,
                correo = $5,
                telefono = $6,
                estado = $7
            WHERE id_persona = $8
            `,
            [
                estudiante.tipoDocumento,
                estudiante.numeroDocumento,
                estudiante.nombres,
                estudiante.apellidos,
                estudiante.correo ?? null,
                estudiante.telefono ?? estudiante.celular ?? null,
                estudiante.estado,
                idPersona
            ]
        );

        await conexion.query(
            `
            UPDATE estudiantes
            SET
                codigo_estudiantil = $1,
                fecha_ingreso = $2
            WHERE id_estudiante = $3
            `,
            [
                codigoEstudiantil,
                fechaIngreso,
                id
            ]
        );

        const estudianteActualizado = await obtenerPorId(conexion, id);

        await conexion.query('COMMIT');

        return estudianteActualizado;

    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;

    } finally {
        conexion.release();
    }
};

// Eliminar estudiante
const eliminar = async (id) => {
    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        const estudiante = await obtenerPorId(conexion, id);

        if (!estudiante) {
            await conexion.query('ROLLBACK');
            return undefined;
        }

        await conexion.query(
            `
            DELETE FROM estudiantes
            WHERE id_estudiante = $1
            `,
            [id]
        );

        await conexion.query(
            `
            DELETE FROM personas p
            WHERE p.id_persona = $1
            AND NOT EXISTS (
                SELECT 1
                FROM docentes d
                WHERE d.id_persona = p.id_persona
            )
            `,
            [estudiante.idPersona]
        );

        await conexion.query('COMMIT');

        return estudiante;

    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;

    } finally {
        conexion.release();
    }
};

module.exports = {
    obtenerTodos,
    crear,
    actualizar,
    eliminar
};
