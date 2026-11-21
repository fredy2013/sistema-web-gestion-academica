const docenteService = require("../services/docenteService");

const esIdValido = (valor) => {
    return Number.isSafeInteger(Number(valor)) && Number(valor) > 0;
};

const validarDocente = (datos) => {
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        return { error: "Debe proporcionar los datos del docente." };
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
    const codigoDocente = datos.codigoDocente?.trim() || null;
    const estado = datos.estado ?? "ACTIVO";

    if (correo !== null &&
        (correo.length > 100 ||
         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))) {
        return { error: "El correo electrónico no es válido." };
    }

    if (telefono !== null &&
        (typeof telefono !== "string" || telefono.length > 30)) {
        return { error: "El teléfono debe tener máximo 30 caracteres." };
    }

    if (codigoDocente !== null &&
        (typeof codigoDocente !== "string" || codigoDocente.length > 30)) {
        return { error: "El código del docente debe tener máximo 30 caracteres." };
    }

    if (typeof estado !== "string" || estado.trim() === "" || estado.length > 20) {
        return { error: "El estado del docente no es válido." };
    }

    return {
        datos: {
            tipoDocumento: datos.tipoDocumento.trim(),
            numeroDocumento: datos.numeroDocumento.trim(),
            nombres: datos.nombres.trim(),
            apellidos: datos.apellidos.trim(),
            correo,
            telefono,
            codigoDocente,
            estado: estado.trim()
        }
    };
};

const manejarError = (res, error) => {
    console.error(error);

    if (error.code === "23505") {
        return res.status(409).json({
            mensaje: "Ya existe una persona o un docente con esos datos."
        });
    }

    if (error.code === "23503") {
        return res.status(409).json({
            mensaje: "No se puede realizar la operación porque existen registros relacionados."
        });
    }

    if (["23514", "23502", "22P02"].includes(error.code)) {
        return res.status(400).json({
            mensaje: "Los datos proporcionados no cumplen las restricciones."
        });
    }

    return res.status(500).json({
        mensaje: "Error interno al procesar la operación del docente."
    });
};

const obtenerDocentes = async (req, res) => {
    try {
        const docentes = await docenteService.listarDocentes();

        return res.status(200).json(docentes);
    } catch (error) {
        return manejarError(res, error);
    }
};

const crearDocente = async (req, res) => {
    const validacion = validarDocente(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const docenteCreado =
            await docenteService.crearDocente(validacion.datos);

        return res.status(201).json(docenteCreado);
    } catch (error) {
        return manejarError(res, error);
    }
};

const actualizarDocente = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador del docente no es válido."
        });
    }

    const validacion = validarDocente(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const docenteActualizado =
            await docenteService.actualizarDocente(
                Number(id),
                validacion.datos
            );

        if (!docenteActualizado) {
            return res.status(404).json({
                mensaje: "El docente no existe."
            });
        }

        return res.status(200).json(docenteActualizado);
    } catch (error) {
        return manejarError(res, error);
    }
};

const eliminarDocente = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador del docente no es válido."
        });
    }

    try {
        const docenteEliminado =
            await docenteService.eliminarDocente(Number(id));

        if (!docenteEliminado) {
            return res.status(404).json({
                mensaje: "El docente no existe."
            });
        }

        return res.status(200).json(docenteEliminado);
    } catch (error) {
        return manejarError(res, error);
    }
};

module.exports = {
    obtenerDocentes,
    crearDocente,
    actualizarDocente,
    eliminarDocente
};