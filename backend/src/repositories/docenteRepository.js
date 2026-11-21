const pool = require('../config/db');
const Docente = require("../models/Docente");

const convertirADocente = (fila) => {
    if (!fila) return undefined;

    return new Docente({
        idDocente: fila.id,
        idPersona: fila.id_persona,
        tipoDocumento: fila.tipo_documento,
        numeroDocumento: fila.numero_documento,
        nombres: fila.nombres,
        apellidos: fila.apellidos,
        correo: fila.correo,
        telefono: fila.celular,
        estado: fila.estado,
        codigoDocente: fila.codigo_docente,
        fechaRegistro: fila.fecha_registro
    });
};

const obtenerPorId = async (conexion, id) => {
    const resultado = await conexion.query(
        `
        SELECT
            d.id_docente AS id,
            d.id_persona,
            d.codigo_docente,
            d.fecha_registro,
            p.tipo_documento,
            p.numero_documento,
            p.nombres,
            p.apellidos,
            p.correo,
            p.telefono AS celular,
            p.estado
        FROM docentes d
        INNER JOIN personas p
            ON d.id_persona = p.id_persona
        WHERE d.id_docente = $1
        `,
        [id]
    );

    return convertirADocente(resultado.rows[0]);
};

const obtenerTodos = async () => {
    const resultado = await pool.query(
        `
        SELECT
            d.id_docente AS id,
            d.id_persona,
            d.codigo_docente,
            d.fecha_registro,
            p.tipo_documento,
            p.numero_documento,
            p.nombres,
            p.apellidos,
            p.correo,
            p.telefono AS celular,
            p.estado
        FROM docentes d
        INNER JOIN personas p
            ON d.id_persona = p.id_persona
        ORDER BY d.id_docente
        `
    );

    return resultado.rows.map(convertirADocente);
};

const crear = async (docente) => {
    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

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
                docente.tipoDocumento,
                docente.numeroDocumento,
                docente.nombres,
                docente.apellidos,
                docente.correo ?? null,
                docente.telefono ?? docente.celular ?? null,
                docente.estado ?? 'ACTIVO'
            ]
        );

        const idPersona = persona.rows[0].id_persona;

        const resultado = await conexion.query(
            `
            INSERT INTO docentes (
                id_persona,
                codigo_docente
            )
            VALUES ($1, $2)
            RETURNING id_docente
            `,
            [
                idPersona,
                docente.codigoDocente ?? null
            ]
        );

        const idDocente = resultado.rows[0].id_docente;

        await conexion.query('COMMIT');

        return await obtenerPorId(conexion, idDocente);

    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;

    } finally {
        conexion.release();
    }
};

const actualizar = async (id, docente) => {
    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        const existente = await conexion.query(
            `
            SELECT id_persona
            FROM docentes
            WHERE id_docente = $1
            FOR UPDATE
            `,
            [id]
        );

        if (existente.rowCount === 0) {
            await conexion.query('ROLLBACK');
            return undefined;
        }

        const idPersona = existente.rows[0].id_persona;

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
                docente.tipoDocumento,
                docente.numeroDocumento,
                docente.nombres,
                docente.apellidos,
                docente.correo ?? null,
                docente.telefono ?? docente.celular ?? null,
                docente.estado,
                idPersona
            ]
        );

        await conexion.query(
            `
            UPDATE docentes
            SET codigo_docente = $1
            WHERE id_docente = $2
            `,
            [
                docente.codigoDocente ?? null,
                id
            ]
        );

        await conexion.query('COMMIT');

        return await obtenerPorId(conexion, id);

    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;

    } finally {
        conexion.release();
    }
};

const eliminar = async (id) => {
    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        const docente = await obtenerPorId(conexion, id);

        if (!docente) {
            await conexion.query('ROLLBACK');
            return undefined;
        }

        await conexion.query(
            `
            DELETE FROM docentes
            WHERE id_docente = $1
            `,
            [id]
        );

        await conexion.query(
            `
            DELETE FROM personas p
            WHERE p.id_persona = $1
            AND NOT EXISTS (
                SELECT 1
                FROM estudiantes e
                WHERE e.id_persona = p.id_persona
            )
            `,
            [docente.idPersona]
        );

        await conexion.query('COMMIT');

        return docente;

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