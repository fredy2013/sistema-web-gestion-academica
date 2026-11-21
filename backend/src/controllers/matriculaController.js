const matriculaService = require("../services/matriculaService");

// Validar identificadores positivos
const esIdValido = (valor) => {
    return Number.isSafeInteger(Number(valor)) && Number(valor) > 0;
};

// Validar fecha en formato YYYY-MM-DD
const esFechaValida = (fecha) => {
    if (typeof fecha !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return false;
    }

    const fechaConvertida = new Date(`${fecha}T00:00:00.000Z`);

    return !Number.isNaN(fechaConvertida.getTime()) &&
        fechaConvertida.toISOString().slice(0, 10) === fecha;
};

// Validar datos de matrícula
const validarMatricula = (datos, exigirEstado = false) => {
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        return { error: "Debe proporcionar los datos de la matrícula." };
    }

    const {
        idEstudiante,
        idGrupo,
        fechaMatricula,
        estado,
        motivoEstado
    } = datos;

    if (!esIdValido(idEstudiante)) {
        return { error: "El identificador del estudiante no es válido." };
    }

    if (!esIdValido(idGrupo)) {
        return { error: "El identificador del grupo no es válido." };
    }

    if (!esFechaValida(fechaMatricula)) {
        return { error: "La fecha de matrícula no es válida. Utilice YYYY-MM-DD." };
    }

    const estadoFinal = estado ?? (exigirEstado ? null : "ACTIVA");

    const estadosPermitidos = [
        "ACTIVA",
        "CANCELADA",
        "FINALIZADA"
    ];

    if (!estadosPermitidos.includes(estadoFinal)) {
        return { error: "El estado de la matrícula no es válido." };
    }

    return {
        datos: {
            idEstudiante: Number(idEstudiante),
            idGrupo: Number(idGrupo),
            fechaMatricula,
            estado: estadoFinal,
            motivoEstado: motivoEstado ?? null
        }
    };
};

// Manejo de errores de PostgreSQL
const manejarError = (res, error) => {
    console.error(error);

    if (error.code === "GRUPO_NO_EXISTE") {
        return res.status(404).json({
            mensaje: "El grupo académico no existe."
        });
    }

    if (error.code === "GRUPO_INACTIVO") {
        return res.status(409).json({
            mensaje: "No se pueden realizar matrículas en un grupo inactivo."
        });
    }

    if (error.code === "CUPO_COMPLETO") {
        return res.status(409).json({
            mensaje: "El grupo académico alcanzó su cupo máximo."
        });
    }

    if (error.code === "23505") {
        return res.status(409).json({
            mensaje: "El estudiante ya está matriculado en ese grupo."
        });
    }

    if (error.code === "23503") {
        return res.status(400).json({
            mensaje: "El estudiante o el grupo indicado no existe, o hay registros relacionados."
        });
    }

    if (["23514", "23502", "22P02", "22007", "22008"].includes(error.code)) {
        return res.status(400).json({
            mensaje: "Los datos de la matrícula no cumplen las restricciones."
        });
    }

    return res.status(500).json({
        mensaje: "Error interno al procesar la matrícula."
    });
};
// Obtener todas las matrículas
const obtenerMatriculas = async (req, res) => {
    try {
        const matriculas =
            await matriculaService.listarMatriculas();

        return res.status(200).json(matriculas);

    } catch (error) {
        return manejarError(res, error);
    }
};

// Crear matrícula
const crearMatricula = async (req, res) => {
    const validacion = validarMatricula(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const matriculaCreada =
            await matriculaService.crearMatricula(validacion.datos);

        return res.status(201).json(matriculaCreada);

    } catch (error) {
        return manejarError(res, error);
    }
};

// Actualizar matrícula
const actualizarMatricula = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador de matrícula no es válido."
        });
    }

    const validacion = validarMatricula(req.body, true);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const matriculaActualizada =
            await matriculaService.actualizarMatricula(
                Number(id),
                validacion.datos
            );

        if (!matriculaActualizada) {
            return res.status(404).json({
                mensaje: "La matrícula no existe."
            });
        }

        return res.status(200).json(matriculaActualizada);

    } catch (error) {
        return manejarError(res, error);
    }
};

// Eliminar matrícula
const eliminarMatricula = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador de matrícula no es válido."
        });
    }

    try {
        const matriculaEliminada =
            await matriculaService.eliminarMatricula(Number(id));

        if (!matriculaEliminada) {
            return res.status(404).json({
                mensaje: "La matrícula no existe."
            });
        }

        return res.status(200).json(matriculaEliminada);

    } catch (error) {
        if (error.code === "23503") {
            return res.status(409).json({
                mensaje: "No se puede eliminar la matrícula porque tiene calificaciones relacionadas."
            });
        }

        return manejarError(res, error);
    }
};

module.exports = {
    obtenerMatriculas,
    crearMatricula,
    actualizarMatricula,
    eliminarMatricula
};