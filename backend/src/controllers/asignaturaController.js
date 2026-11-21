const asignaturaService = require("../services/asignaturaService");

const esIdValido = (valor) => {
    return Number.isSafeInteger(Number(valor)) && Number(valor) > 0;
};

const validarAsignatura = (datos) => {
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        return { error: "Debe proporcionar los datos de la asignatura." };
    }

    if (
        typeof datos.codigo !== "string" ||
        datos.codigo.trim() === "" ||
        datos.codigo.length > 20
    ) {
        return { error: "El código es obligatorio y debe tener máximo 20 caracteres." };
    }

    if (
        typeof datos.nombre !== "string" ||
        datos.nombre.trim() === "" ||
        datos.nombre.length > 100
    ) {
        return { error: "El nombre es obligatorio y debe tener máximo 100 caracteres." };
    }

    const descripcion = datos.descripcion ?? null;

    if (
        descripcion !== null &&
        (typeof descripcion !== "string" || descripcion.length > 255)
    ) {
        return { error: "La descripción debe tener máximo 255 caracteres." };
    }

    const intensidadHoraria = datos.intensidadHoraria ?? null;

    if (
        intensidadHoraria !== null &&
        (!Number.isSafeInteger(Number(intensidadHoraria)) ||
         Number(intensidadHoraria) <= 0)
    ) {
        return { error: "La intensidad horaria debe ser un número entero positivo." };
    }

    const estado = datos.estado ?? "ACTIVA";

    if (!["ACTIVA", "INACTIVA"].includes(estado)) {
        return { error: "El estado debe ser ACTIVA o INACTIVA." };
    }

    return {
        datos: {
            codigo: datos.codigo.trim(),
            nombre: datos.nombre.trim(),
            descripcion: descripcion === null ? null : descripcion.trim(),
            intensidadHoraria:
                intensidadHoraria === null ? null : Number(intensidadHoraria),
            estado
        }
    };
};

const manejarError = (res, error) => {
    console.error(error);

    if (error.code === "23505") {
        return res.status(409).json({
            mensaje: "Ya existe una asignatura con ese código."
        });
    }

    if (error.code === "23503") {
        return res.status(409).json({
            mensaje: "No se puede eliminar la asignatura porque tiene grupos académicos relacionados."
        });
    }

    if (["23514", "23502", "22P02"].includes(error.code)) {
        return res.status(400).json({
            mensaje: "Los datos proporcionados no cumplen las restricciones."
        });
    }

    return res.status(500).json({
        mensaje: "Error interno al procesar la asignatura."
    });
};

const obtenerAsignaturas = async (req, res) => {
    try {
        const asignaturas = await asignaturaService.listarAsignaturas();

        return res.status(200).json(asignaturas);
    } catch (error) {
        return manejarError(res, error);
    }
};

const crearAsignatura = async (req, res) => {
    const validacion = validarAsignatura(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const asignaturaCreada =
            await asignaturaService.crearAsignatura(validacion.datos);

        return res.status(201).json(asignaturaCreada);
    } catch (error) {
        return manejarError(res, error);
    }
};

const actualizarAsignatura = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador de la asignatura no es válido."
        });
    }

    const validacion = validarAsignatura(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const asignaturaActualizada =
            await asignaturaService.actualizarAsignatura(
                Number(id),
                validacion.datos
            );

        if (!asignaturaActualizada) {
            return res.status(404).json({
                mensaje: "La asignatura no existe."
            });
        }

        return res.status(200).json(asignaturaActualizada);
    } catch (error) {
        return manejarError(res, error);
    }
};

const eliminarAsignatura = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador de la asignatura no es válido."
        });
    }

    try {
        const asignaturaEliminada =
            await asignaturaService.eliminarAsignatura(Number(id));

        if (!asignaturaEliminada) {
            return res.status(404).json({
                mensaje: "La asignatura no existe."
            });
        }

        return res.status(200).json(asignaturaEliminada);
    } catch (error) {
        return manejarError(res, error);
    }
};

module.exports = {
    obtenerAsignaturas,
    crearAsignatura,
    actualizarAsignatura,
    eliminarAsignatura
};