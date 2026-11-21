const estudianteService = require("../services/estudianteService");

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

const validarEstudiante = (datos) => {
    if (
        !datos ||
        typeof datos !== "object" ||
        Array.isArray(datos)
    ) {
        return {
            error: "Debe proporcionar los datos del estudiante."
        };
    }

    const camposObligatorios = [
        ["tipoDocumento", 30],
        ["numeroDocumento", 30],
        ["nombres", 100],
        ["apellidos", 100]
    ];

    for (const [campo, longitud] of camposObligatorios) {
        if (
            typeof datos[campo] !== "string" ||
            datos[campo].trim() === "" ||
            datos[campo].length > longitud
        ) {
            return {
                error: `El campo ${campo} es obligatorio y debe tener máximo ${longitud} caracteres.`
            };
        }
    }

    const correo = datos.correo?.trim() || null;
    const telefono = datos.telefono ?? datos.celular ?? null;
    const codigoEstudiantil = datos.codigoEstudiantil?.trim() || null;
    const fechaIngreso = datos.fechaIngreso || null;
    const estado = datos.estado ?? "ACTIVO";

    if (
        correo !== null &&
        (
            correo.length > 100 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
        )
    ) {
        return {
            error: "El correo electrónico no es válido."
        };
    }

    if (
        telefono !== null &&
        (
            typeof telefono !== "string" ||
            telefono.length > 30
        )
    ) {
        return {
            error: "El teléfono debe tener máximo 30 caracteres."
        };
    }

    if (
        codigoEstudiantil !== null &&
        (
            typeof codigoEstudiantil !== "string" ||
            codigoEstudiantil.length > 30
        )
    ) {
        return {
            error: "El código estudiantil debe tener máximo 30 caracteres."
        };
    }

    if (
        fechaIngreso !== null &&
        !esFechaValida(fechaIngreso)
    ) {
        return {
            error: "La fecha de ingreso no es válida. Utilice el formato YYYY-MM-DD."
        };
    }

    if (
        typeof estado !== "string" ||
        estado.trim() === "" ||
        estado.length > 20
    ) {
        return {
            error: "El estado del estudiante no es válido."
        };
    }

    return {
        datos: {
            tipoDocumento: datos.tipoDocumento.trim(),
            numeroDocumento: datos.numeroDocumento.trim(),
            nombres: datos.nombres.trim(),
            apellidos: datos.apellidos.trim(),
            correo,
            telefono,
            codigoEstudiantil,
            fechaIngreso,
            estado: estado.trim()
        }
    };
};

const manejarError = (res, error) => {
    console.error(error);

    if (error.code === "23505") {
        return res.status(409).json({
            mensaje: "Ya existe una persona o un estudiante con esos datos."
        });
    }

    if (error.code === "23503") {
        return res.status(409).json({
            mensaje: "No se puede completar la operación porque existen registros relacionados."
        });
    }

    if (
        ["23514", "23502", "22P02", "22007", "22008", "22001"].includes(error.code)
    ) {
        return res.status(400).json({
            mensaje: "Los datos proporcionados no cumplen las restricciones."
        });
    }

    return res.status(500).json({
        mensaje: "Error interno al procesar la operación del estudiante."
    });
};

// Obtener todos los estudiantes
const obtenerEstudiantes = async (req, res) => {
    try {
        const estudiantes =
            await estudianteService.listarEstudiantes();

        return res.status(200).json(estudiantes);

    } catch (error) {
        return manejarError(res, error);
    }
};

// Crear estudiante
const crearEstudiante = async (req, res) => {
    const validacion = validarEstudiante(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const estudianteCreado =
            await estudianteService.crearEstudiante(validacion.datos);

        return res.status(201).json(estudianteCreado);

    } catch (error) {
        return manejarError(res, error);
    }
};

// Actualizar estudiante
const actualizarEstudiante = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador del estudiante no es válido."
        });
    }

    const validacion = validarEstudiante(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const estudianteActualizado =
            await estudianteService.actualizarEstudiante(
                Number(id),
                validacion.datos
            );

        if (!estudianteActualizado) {
            return res.status(404).json({
                mensaje: "El estudiante no existe."
            });
        }

        return res.status(200).json(estudianteActualizado);

    } catch (error) {
        return manejarError(res, error);
    }
};

// Eliminar estudiante
const eliminarEstudiante = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador del estudiante no es válido."
        });
    }

    try {
        const estudianteEliminado =
            await estudianteService.eliminarEstudiante(Number(id));

        if (!estudianteEliminado) {
            return res.status(404).json({
                mensaje: "El estudiante no existe."
            });
        }

        return res.status(200).json(estudianteEliminado);

    } catch (error) {
        return manejarError(res, error);
    }
};

module.exports = {
    obtenerEstudiantes,
    crearEstudiante,
    actualizarEstudiante,
    eliminarEstudiante
};