const pool = require('../config/db');
const Asignatura = require("../models/Asignatura");

const convertirAAsignatura = (fila) => {
    if (!fila) return undefined;

    return new Asignatura({
        idAsignatura: fila.id_asignatura,
        codigo: fila.codigo,
        nombre: fila.nombre,
        descripcion: fila.descripcion,
        intensidadHoraria: fila.intensidad_horaria,
        estado: fila.estado
    });
};

const obtenerTodos = async () => {
    const resultado = await pool.query(
        `
        SELECT *
        FROM asignaturas
        ORDER BY id_asignatura
        `
    );

    return resultado.rows.map(convertirAAsignatura);

};

const crear = async (asignatura) => {
    const resultado = await pool.query(
        `
        INSERT INTO asignaturas (
            codigo,
            nombre,
            descripcion,
            intensidad_horaria,
            estado
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
            asignatura.codigo,
            asignatura.nombre,
            asignatura.descripcion ?? null,
            asignatura.intensidadHoraria ?? null,
            asignatura.estado ?? 'ACTIVA'
        ]
    );

    return convertirAAsignatura(resultado.rows[0]);
};

const actualizar = async (id, asignatura) => {
    const resultado = await pool.query(
        `
        UPDATE asignaturas
        SET
            codigo = $1,
            nombre = $2,
            descripcion = $3,
            intensidad_horaria = $4,
            estado = $5
        WHERE id_asignatura = $6
        RETURNING *
        `,
        [
            asignatura.codigo,
            asignatura.nombre,
            asignatura.descripcion ?? null,
            asignatura.intensidadHoraria ?? null,
            asignatura.estado,
            id
        ]
    );

    return resultado.rows[0];
};

const eliminar = async (id) => {
    const resultado = await pool.query(
        `
        DELETE FROM asignaturas
        WHERE id_asignatura = $1
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