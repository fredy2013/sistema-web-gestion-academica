const evaluacionService = require("../services/evaluacionService");

const esIdValido = (valor) => {
    return Number.isSafeInteger(Number(valor)) && Number(valor) > 0;
};

const esFechaValida = (fecha) => {
    if (
        typeof fecha !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
    ) {
        return false;
    }

    const fechaConvertida = new Date(`${fecha}T00:00:00.000Z`);

    return (
        !Number.isNaN(fechaConvertida.getTime()) &&
        fechaConvertida.toISOString().slice(0, 10) === fecha
    );
};

const validarEvaluacion = (datos) => {
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        return { error: "Debe proporcionar los datos de la evaluación." };
    }

    if (!esIdValido(datos.idGrupo)) {
        return { error: "El identificador del grupo no es válido." };
    }

    if (
        typeof datos.codigo !== "string" ||
        datos.codigo.trim() === "" ||
        datos.codigo.length > 30
    ) {
        return { error: "El código es obligatorio y debe tener máximo 30 caracteres." };
    }

    if (
        typeof datos.nombre !== "string" ||
        datos.nombre.trim() === "" ||
        datos.nombre.length > 100
    ) {
        return { error: "El nombre es obligatorio y debe tener máximo 100 caracteres." };
    }

    const porcentaje = Number(datos.porcentaje);

    if (
        datos.porcentaje === undefined ||
        datos.porcentaje === null ||
        datos.porcentaje === "" ||
        !Number.isFinite(porcentaje) ||
        porcentaje < 0 ||
        porcentaje > 100
    ) {
        return { error: "El porcentaje debe ser un número entre 0 y 100." };
    }

    const descripcion = datos.descripcion ?? null;
    const fechaEvaluacion = datos.fechaEvaluacion ?? null;
    const estado = datos.estado ?? "ACTIVA";

    if (
        descripcion !== null &&
        typeof descripcion !== "string"
    ) {
        return { error: "La descripción debe ser texto." };
    }

    if (
        fechaEvaluacion !== null &&
        !esFechaValida(fechaEvaluacion)
    ) {
        return { error: "La fecha de evaluación no es válida. Utilice YYYY-MM-DD." };
    }

    if (
        typeof estado !== "string" ||
        estado.trim() === "" ||
        estado.length > 20
    ) {
        return { error: "El estado de la evaluación no es válido." };
    }

    return {
        datos: {
            idGrupo: Number(datos.idGrupo),
            codigo: datos.codigo.trim(),
            nombre: datos.nombre.trim(),
            descripcion,
            porcentaje,
            fechaEvaluacion,
            estado: estado.trim()
        }
    };
};

const manejarError = (res, error) => {
    console.error(error);

    if (error.code === "23505") {
        return res.status(409).json({
            mensaje: "Ya existe una evaluación con ese código en el grupo indicado."
        });
    }

    if (error.code === "23503") {
        return res.status(409).json({
            mensaje: "El grupo no existe o la evaluación tiene calificaciones relacionadas."
        });
    }

    if (["23514", "23502", "22P02", "22007", "22008"].includes(error.code)) {
        return res.status(400).json({
            mensaje: "Los datos de la evaluación no cumplen las restricciones."
        });
    }

    return res.status(500).json({
        mensaje: "Error interno al procesar la evaluación."
    });
};

const obtenerEvaluaciones = async (req, res) => {
    try {
        const evaluaciones =
            await evaluacionService.listarEvaluaciones();

        return res.status(200).json(evaluaciones);
    } catch (error) {
        return manejarError(res, error);
    }
};

const crearEvaluacion = async (req, res) => {
    const validacion = validarEvaluacion(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const evaluacionCreada =
            await evaluacionService.crearEvaluacion(validacion.datos);

        return res.status(201).json(evaluacionCreada);
    } catch (error) {
        return manejarError(res, error);
    }
};

const actualizarEvaluacion = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador de la evaluación no es válido."
        });
    }

    const validacion = validarEvaluacion(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const evaluacionActualizada =
            await evaluacionService.actualizarEvaluacion(
                Number(id),
                validacion.datos
            );

        if (!evaluacionActualizada) {
            return res.status(404).json({
                mensaje: "La evaluación no existe."
            });
        }

        return res.status(200).json(evaluacionActualizada);
    } catch (error) {
        return manejarError(res, error);
    }
};

const eliminarEvaluacion = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador de la evaluación no es válido."
        });
    }

    try {
        const evaluacionEliminada =
            await evaluacionService.eliminarEvaluacion(Number(id));

        if (!evaluacionEliminada) {
            return res.status(404).json({
                mensaje: "La evaluación no existe."
            });
        }

        return res.status(200).json(evaluacionEliminada);
    } catch (error) {
        return manejarError(res, error);
    }
};

module.exports = {
    obtenerEvaluaciones,
    crearEvaluacion,
    actualizarEvaluacion,
    eliminarEvaluacion
};