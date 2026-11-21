const pool = require('../config/db');
const GrupoAcademico = require("../models/GrupoAcademico");

const convertirAGrupoAcademico = (fila) => {
    if (!fila) return undefined;

    return new GrupoAcademico({
        idGrupo: fila.id_grupo,
        idAsignatura: fila.id_asignatura,
        idPeriodo: fila.id_periodo,
        idDocente: fila.id_docente,
        codigoGrupo: fila.codigo_grupo,
        cupoMaximo: fila.cupo_maximo,
        estado: fila.estado
    });
};

const obtenerTodos = async () => {
    const resultado = await pool.query(
        `
        SELECT *
        FROM grupos_academicos
        ORDER BY id_grupo
        `
    );

    return resultado.rows.map(convertirAGrupoAcademico);
};

const crear = async (grupo) => {
    const resultado = await pool.query(
        `
        INSERT INTO grupos_academicos (
            id_asignatura,
            id_periodo,
            id_docente,
            codigo_grupo,
            cupo_maximo,
            estado
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
            grupo.idAsignatura,
            grupo.idPeriodo,
            grupo.idDocente,
            grupo.codigoGrupo,
            grupo.cupoMaximo,
            grupo.estado ?? 'ACTIVO'
        ]
    );

    return convertirAGrupoAcademico(resultado.rows[0]);
};

const actualizar = async (id, grupo) => {
    const resultado = await pool.query(
        `
        UPDATE grupos_academicos
        SET
            id_asignatura = $1,
            id_periodo = $2,
            id_docente = $3,
            codigo_grupo = $4,
            cupo_maximo = $5,
            estado = $6
        WHERE id_grupo = $7
        RETURNING *
        `,
        [
            grupo.idAsignatura,
            grupo.idPeriodo,
            grupo.idDocente,
            grupo.codigoGrupo,
            grupo.cupoMaximo,
            grupo.estado,
            id
        ]
    );

    return convertirAGrupoAcademico(resultado.rows[0]);
};

const eliminar = async (id) => {
    const resultado = await pool.query(
        `
        DELETE FROM grupos_academicos
        WHERE id_grupo = $1
        RETURNING *
        `,
        [id]
    );

    return convertirAGrupoAcademico(resultado.rows[0]);
};

module.exports = {
    obtenerTodos,
    crear,
    actualizar,
    eliminar
};