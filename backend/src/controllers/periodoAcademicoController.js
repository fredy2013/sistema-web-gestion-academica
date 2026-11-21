const periodoAcademicoService = require("../services/periodoAcademicoService");

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

const validarPeriodo = (datos) => {
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        return { error: "Debe proporcionar los datos del periodo académico." };
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

    const fechas = [
        ["fechaInicio", datos.fechaInicio],
        ["fechaFin", datos.fechaFin],
        ["fechaInicioMatricula", datos.fechaInicioMatricula],
        ["fechaFinMatricula", datos.fechaFinMatricula]
    ];

    for (const [campo, fecha] of fechas) {
        if (!esFechaValida(fecha)) {
            return {
                error: `El campo ${campo} debe contener una fecha válida en formato YYYY-MM-DD.`
            };
        }
    }

    if (datos.fechaInicio >= datos.fechaFin) {
        return { error: "La fecha de inicio debe ser anterior a la fecha de finalización." };
    }

    if (datos.fechaInicioMatricula > datos.fechaFinMatricula) {
        return { error: "La fecha inicial de matrícula no puede ser posterior a la fecha final." };
    }

    const estado = datos.estado ?? "PLANIFICADO";

    if (
        typeof estado !== "string" ||
        estado.trim() === "" ||
        estado.length > 20
    ) {
        return { error: "El estado del periodo no es válido." };
    }

    return {
        datos: {
            codigo: datos.codigo.trim(),
            nombre: datos.nombre.trim(),
            fechaInicio: datos.fechaInicio,
            fechaFin: datos.fechaFin,
            fechaInicioMatricula: datos.fechaInicioMatricula,
            fechaFinMatricula: datos.fechaFinMatricula,
            estado: estado.trim()
        }
    };
};

const manejarError = (res, error) => {
    console.error(error);

    if (error.code === "23505") {
        return res.status(409).json({
            mensaje: "Ya existe un periodo académico con ese código."
        });
    }

    if (error.code === "23503") {
        return res.status(409).json({
            mensaje: "No se puede eliminar el periodo porque tiene grupos académicos relacionados."
        });
    }

    if (["23514", "23502", "22007", "22008"].includes(error.code)) {
        return res.status(400).json({
            mensaje: "Los datos del periodo no cumplen las restricciones."
        });
    }

    return res.status(500).json({
        mensaje: "Error interno al procesar el periodo académico."
    });
};

const obtenerPeriodos = async (req, res) => {
    try {
        const periodos = await periodoAcademicoService.listarPeriodos();

        return res.status(200).json(periodos);
    } catch (error) {
        return manejarError(res, error);
    }
};

const crearPeriodo = async (req, res) => {
    const validacion = validarPeriodo(req.body);

    if (validacion.error) {
        return res.status(400).json({ mensaje: validacion.error });
    }

    try {
        const periodoCreado =
            await periodoAcademicoService.crearPeriodo(validacion.datos);

        return res.status(201).json(periodoCreado);
    } catch (error) {
        return manejarError(res, error);
    }
};

const actualizarPeriodo = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador del periodo no es válido."
        });
    }

    const validacion = validarPeriodo(req.body);

    if (validacion.error) {
        return res.status(400).json({ mensaje: validacion.error });
    }

    try {
        const periodoActualizado =
            await periodoAcademicoService.actualizarPeriodo(
                Number(id),
                validacion.datos
            );

        if (!periodoActualizado) {
            return res.status(404).json({
                mensaje: "El periodo académico no existe."
            });
        }

        return res.status(200).json(periodoActualizado);
    } catch (error) {
        return manejarError(res, error);
    }
};

const eliminarPeriodo = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador del periodo no es válido."
        });
    }

    try {
        const periodoEliminado =
            await periodoAcademicoService.eliminarPeriodo(Number(id));

        if (!periodoEliminado) {
            return res.status(404).json({
                mensaje: "El periodo académico no existe."
            });
        }

        return res.status(200).json(periodoEliminado);
    } catch (error) {
        return manejarError(res, error);
    }
};

module.exports = {
    obtenerPeriodos,
    crearPeriodo,
    actualizarPeriodo,
    eliminarPeriodo
};