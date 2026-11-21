const pool = require('../config/db');
const PeriodoAcademico = require("../models/PeriodoAcademico");

const convertirAPeriodoAcademico = (fila) => {
    if (!fila) return undefined;

    return new PeriodoAcademico({
        idPeriodo: fila.id_periodo,
        codigo: fila.codigo,
        nombre: fila.nombre,
        fechaInicio: fila.fecha_inicio,
        fechaFin: fila.fecha_fin,
        fechaInicioMatricula: fila.fecha_inicio_matricula,
        fechaFinMatricula: fila.fecha_fin_matricula,
        estado: fila.estado
    });
};

const obtenerTodos = async () => {
    const resultado = await pool.query(
        `
        SELECT *
        FROM periodos_academicos
        ORDER BY id_periodo
        `
    );

    return resultado.rows.map(convertirAPeriodoAcademico);
};

const crear = async (periodo) => {
    const resultado = await pool.query(
        `
        INSERT INTO periodos_academicos (
            codigo,
            nombre,
            fecha_inicio,
            fecha_fin,
            fecha_inicio_matricula,
            fecha_fin_matricula,
            estado
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
            periodo.codigo,
            periodo.nombre,
            periodo.fechaInicio,
            periodo.fechaFin,
            periodo.fechaInicioMatricula,
            periodo.fechaFinMatricula,
            periodo.estado ?? 'PLANIFICADO'
        ]
    );

    return convertirAPeriodoAcademico(resultado.rows[0]);
};

const actualizar = async (id, periodo) => {
    const resultado = await pool.query(
        `
        UPDATE periodos_academicos
        SET
            codigo = $1,
            nombre = $2,
            fecha_inicio = $3,
            fecha_fin = $4,
            fecha_inicio_matricula = $5,
            fecha_fin_matricula = $6,
            estado = $7
        WHERE id_periodo = $8
        RETURNING *
        `,
        [
            periodo.codigo,
            periodo.nombre,
            periodo.fechaInicio,
            periodo.fechaFin,
            periodo.fechaInicioMatricula,
            periodo.fechaFinMatricula,
            periodo.estado,
            id
        ]
    );

    return convertirAPeriodoAcademico(resultado.rows[0]);
};

const eliminar = async (id) => {
    const resultado = await pool.query(
        `
        DELETE FROM periodos_academicos
        WHERE id_periodo = $1
        RETURNING *
        `,
        [id]
    );

    return convertirAPeriodoAcademico(resultado.rows[0]);
};

module.exports = {
    obtenerTodos,
    crear,
    actualizar,
    eliminar
};