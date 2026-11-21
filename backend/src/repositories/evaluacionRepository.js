const pool = require('../config/db');
const Evaluacion = require("../models/Evaluacion");

const convertirAEvaluacion = (fila) => {
    if (!fila) return undefined;

    return new Evaluacion({
        idEvaluacion: fila.id_evaluacion,
        idGrupo: fila.id_grupo,
        codigo: fila.codigo,
        nombre: fila.nombre,
        descripcion: fila.descripcion,
        porcentaje: fila.porcentaje,
        fechaEvaluacion: fila.fecha_evaluacion,
        estado: fila.estado
    });
};

const obtenerTodos = async () => {
    const resultado = await pool.query(
        `
        SELECT *
        FROM evaluaciones
        ORDER BY id_evaluacion
        `
    );

    return resultado.rows.map(convertirAEvaluacion);
};

const crear = async (evaluacion) => {
    const resultado = await pool.query(
        `
        INSERT INTO evaluaciones (
            id_grupo,
            codigo,
            nombre,
            descripcion,
            porcentaje,
            fecha_evaluacion,
            estado
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
            evaluacion.idGrupo,
            evaluacion.codigo,
            evaluacion.nombre,
            evaluacion.descripcion ?? null,
            evaluacion.porcentaje,
            evaluacion.fechaEvaluacion ?? null,
            evaluacion.estado ?? 'ACTIVA'
        ]
    );

    return convertirAEvaluacion(resultado.rows[0]);
};

const actualizar = async (id, evaluacion) => {
    const resultado = await pool.query(
        `
        UPDATE evaluaciones
        SET
            id_grupo = $1,
            codigo = $2,
            nombre = $3,
            descripcion = $4,
            porcentaje = $5,
            fecha_evaluacion = $6,
            estado = $7
        WHERE id_evaluacion = $8
        RETURNING *
        `,
        [
            evaluacion.idGrupo,
            evaluacion.codigo,
            evaluacion.nombre,
            evaluacion.descripcion ?? null,
            evaluacion.porcentaje,
            evaluacion.fechaEvaluacion ?? null,
            evaluacion.estado,
            id
        ]
    );

    return convertirAEvaluacion(resultado.rows[0]);
};

const eliminar = async (id) => {
    const resultado = await pool.query(
        `
        DELETE FROM evaluaciones
        WHERE id_evaluacion = $1
        RETURNING *
        `,
        [id]
    );

    return convertirAEvaluacion(resultado.rows[0]);
};

module.exports = {
    obtenerTodos,
    crear,
    actualizar,
    eliminar
};