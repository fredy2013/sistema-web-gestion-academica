const calificacionService = require("../services/calificacionService");

const esIdValido = (valor) => {
    return Number.isSafeInteger(Number(valor)) && Number(valor) > 0;
};

const validarCalificacion = (datos) => {
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        return { error: "Debe proporcionar los datos de la calificación." };
    }

    if (!esIdValido(datos.idEvaluacion)) {
        return { error: "El identificador de la evaluación no es válido." };
    }

    if (!esIdValido(datos.idMatricula)) {
        return { error: "El identificador de la matrícula no es válido." };
    }

    if (!esIdValido(datos.idGrupo)) {
        return { error: "El identificador del grupo no es válido." };
    }

    if (
        datos.nota === undefined ||
        datos.nota === null ||
        datos.nota === "" ||
        !Number.isFinite(Number(datos.nota)) ||
        Number(datos.nota) < 0 ||
        Number(datos.nota) > 999.99
    ) {
        return {
            error: "La nota debe ser un número entre 0 y 999.99."
        };
    }

    const observacion = datos.observacion ?? null;

    if (
        observacion !== null &&
        typeof observacion !== "string"
    ) {
        return { error: "La observación debe ser texto." };
    }

    return {
        datos: {
            idEvaluacion: Number(datos.idEvaluacion),
            idMatricula: Number(datos.idMatricula),
            idGrupo: Number(datos.idGrupo),
            nota: Number(datos.nota),
            observacion
        }
    };
};

const manejarError = (res, error) => {
    console.error(error);

    if (error.code === "23505") {
        return res.status(409).json({
            mensaje: "Esta matrícula ya tiene una calificación para esa evaluación."
        });
    }

    if (error.code === "23503") {
        return res.status(400).json({
            mensaje: "La evaluación, la matrícula o el grupo no existen, o no pertenecen al mismo grupo académico."
        });
    }

    if (["23514", "23502", "22P02", "22003"].includes(error.code)) {
        return res.status(400).json({
            mensaje: "Los datos de la calificación no cumplen las restricciones."
        });
    }

    return res.status(500).json({
        mensaje: "Error interno al procesar la calificación."
    });
};

// Obtener todas las calificaciones
const obtenerCalificaciones = async (req, res) => {
    try {
        const calificaciones =
            await calificacionService.listarCalificaciones();

        return res.status(200).json(calificaciones);
    } catch (error) {
        return manejarError(res, error);
    }
};

// Crear calificación
const crearCalificacion = async (req, res) => {
    const validacion = validarCalificacion(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const calificacionCreada =
            await calificacionService.crearCalificacion(validacion.datos);

        return res.status(201).json(calificacionCreada);
    } catch (error) {
        return manejarError(res, error);
    }
};

// Actualizar calificación
const actualizarCalificacion = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador de la calificación no es válido."
        });
    }

    const validacion = validarCalificacion(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const calificacionActualizada =
            await calificacionService.actualizarCalificacion(
                Number(id),
                validacion.datos
            );

        if (!calificacionActualizada) {
            return res.status(404).json({
                mensaje: "La calificación no existe."
            });
        }

        return res.status(200).json(calificacionActualizada);
    } catch (error) {
        return manejarError(res, error);
    }
};

// Eliminar calificación
const eliminarCalificacion = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador de la calificación no es válido."
        });
    }

    try {
        const calificacionEliminada =
            await calificacionService.eliminarCalificacion(Number(id));

        if (!calificacionEliminada) {
            return res.status(404).json({
                mensaje: "La calificación no existe."
            });
        }

        return res.status(200).json(calificacionEliminada);
    } catch (error) {
        return manejarError(res, error);
    }
};

module.exports = {
    obtenerCalificaciones,
    crearCalificacion,
    actualizarCalificacion,
    eliminarCalificacion
};