const pool = require('../config/db');
const Matricula = require("../models/Matricula");

const convertirAMatricula = (fila) => {
    if (!fila) return undefined;

    return new Matricula({
        idMatricula: fila.id_matricula,
        idEstudiante: fila.id_estudiante,
        idGrupo: fila.id_grupo,
        fechaMatricula: fila.fecha_matricula,
        estado: fila.estado,
        fechaRegistro: fila.fecha_registro ?? null,
        motivoEstado: fila.motivo_estado ?? null
    });
};

const obtenerTodos = async () => {
    const resultado = await pool.query(
        `SELECT *
         FROM matriculas
         ORDER BY id_matricula`
    );

    return resultado.rows.map(convertirAMatricula);
};

const crear = async (matricula) => {
    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        // Bloquear el grupo durante la operación
        const grupo = await conexion.query(
            `
            SELECT cupo_maximo, estado
            FROM grupos_academicos
            WHERE id_grupo = $1
            FOR UPDATE
            `,
            [matricula.idGrupo]
        );

        if (grupo.rowCount === 0) {
            const error = new Error("El grupo académico no existe.");
            error.code = "GRUPO_NO_EXISTE";
            throw error;
        }

        if (grupo.rows[0].estado !== "ACTIVO") {
            const error = new Error("El grupo académico no está activo.");
            error.code = "GRUPO_INACTIVO";
            throw error;
        }

        // Contar las matrículas activas del grupo
        const conteo = await conexion.query(
            `
            SELECT COUNT(*)::integer AS total
            FROM matriculas
            WHERE id_grupo = $1
              AND estado = 'ACTIVA'
            `,
            [matricula.idGrupo]
        );

        if (conteo.rows[0].total >= grupo.rows[0].cupo_maximo) {
            const error = new Error("El grupo alcanzó su cupo máximo.");
            error.code = "CUPO_COMPLETO";
            throw error;
        }

        const resultado = await conexion.query(
            `
            INSERT INTO matriculas (
                id_estudiante,
                id_grupo,
                fecha_matricula,
                estado,
                motivo_estado
            )
            VALUES ($1, $2, $3, COALESCE($4, 'ACTIVA'), $5)
            RETURNING *
            `,
            [
                matricula.idEstudiante,
                matricula.idGrupo,
                matricula.fechaMatricula,
                matricula.estado,
                matricula.motivoEstado ?? null
            ]
        );

        await conexion.query('COMMIT');
        return convertirAMatricula(resultado.rows[0]);

    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;

    } finally {
        conexion.release();
    }
};

const actualizar = async (id, matricula) => {
    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        const matriculaActual = await conexion.query(
            `
            SELECT id_grupo
            FROM matriculas
            WHERE id_matricula = $1
            FOR UPDATE
            `,
            [id]
        );

        if (matriculaActual.rowCount === 0) {
            await conexion.query('ROLLBACK');
            return undefined;
        }

        const gruposBloquear = [
            ...new Set([
                matriculaActual.rows[0].id_grupo,
                Number(matricula.idGrupo)
            ])
        ].sort((a, b) => a - b);

        const grupos = await conexion.query(
            `
            SELECT id_grupo, cupo_maximo, estado
            FROM grupos_academicos
            WHERE id_grupo = ANY($1::integer[])
            ORDER BY id_grupo
            FOR UPDATE
            `,
            [gruposBloquear]
        );

        const grupoDestino = grupos.rows.find(
            grupo => grupo.id_grupo === Number(matricula.idGrupo)
        );

        if (!grupoDestino) {
            const error = new Error("El grupo académico no existe.");
            error.code = "GRUPO_NO_EXISTE";
            throw error;
        }

        if (matricula.estado === "ACTIVA") {
            if (grupoDestino.estado !== "ACTIVO") {
                const error = new Error("El grupo académico no está activo.");
                error.code = "GRUPO_INACTIVO";
                throw error;
            }

            const conteo = await conexion.query(
                `
                SELECT COUNT(*)::integer AS total
                FROM matriculas
                WHERE id_grupo = $1
                  AND estado = 'ACTIVA'
                  AND id_matricula <> $2
                `,
                [matricula.idGrupo, id]
            );

            if (conteo.rows[0].total >= grupoDestino.cupo_maximo) {
                const error = new Error("El grupo alcanzó su cupo máximo.");
                error.code = "CUPO_COMPLETO";
                throw error;
            }
        }

        const resultado = await conexion.query(
            `
            UPDATE matriculas
            SET
                id_estudiante = $1,
                id_grupo = $2,
                fecha_matricula = $3,
                estado = $4,
                motivo_estado = $5
            WHERE id_matricula = $6
            RETURNING *
            `,
            [
                matricula.idEstudiante,
                matricula.idGrupo,
                matricula.fechaMatricula,
                matricula.estado,
                matricula.motivoEstado ?? null,
                id
            ]
        );

        await conexion.query('COMMIT');

        return convertirAMatricula(resultado.rows[0]);

    } catch (error) {
        await conexion.query('ROLLBACK');
        throw error;

    } finally {
        conexion.release();
    }
};

 const eliminar = async (id) => {
    const resultado = await pool.query(
        `
        DELETE FROM matriculas
        WHERE id_matricula = $1
        RETURNING *
        `,
        [id]
    );

    return convertirAMatricula(resultado.rows[0]);
};

module.exports = {
    obtenerTodos,
    crear,
    actualizar,
    eliminar
};