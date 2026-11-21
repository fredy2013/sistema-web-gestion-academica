const pool = require('../config/db');

const obtenerTodos = async () => {
    const resultado = await pool.query(
        `
        SELECT *
        FROM calificaciones
        ORDER BY id_calificacion
        `
    );

    return resultado.rows;
};

const crear = async (calificacion) => {
    const resultado = await pool.query(
        `
        INSERT INTO calificaciones (
            id_evaluacion,
            id_matricula,
            id_grupo,
            nota,
            observacion
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
            calificacion.idEvaluacion,
            calificacion.idMatricula,
            calificacion.idGrupo,
            calificacion.nota,
            calificacion.observacion ?? null
        ]
    );

    return resultado.rows[0];
};

const actualizar = async (id, calificacion) => {
    const resultado = await pool.query(
        `
        UPDATE calificaciones
        SET
            id_evaluacion = $1,
            id_matricula = $2,
            id_grupo = $3,
            nota = $4,
            observacion = $5
        WHERE id_calificacion = $6
        RETURNING *
        `,
        [
            calificacion.idEvaluacion,
            calificacion.idMatricula,
            calificacion.idGrupo,
            calificacion.nota,
            calificacion.observacion ?? null,
            id
        ]
    );

    return resultado.rows[0];
};

const eliminar = async (id) => {
    const resultado = await pool.query(
        `
        DELETE FROM calificaciones
        WHERE id_calificacion = $1
        RETURNING *
        `,
        [id]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerTodos,
    crear,
    actualizar,
    eliminar
};