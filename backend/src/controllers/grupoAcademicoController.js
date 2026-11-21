const grupoAcademicoService = require("../services/grupoAcademicoService");

const esIdValido = (valor) => {
    return Number.isSafeInteger(Number(valor)) && Number(valor) > 0;
};

const validarGrupo = (datos) => {
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
        return { error: "Debe proporcionar los datos del grupo académico." };
    }

    if (!esIdValido(datos.idAsignatura)) {
        return { error: "El identificador de la asignatura no es válido." };
    }

    if (!esIdValido(datos.idPeriodo)) {
        return { error: "El identificador del periodo académico no es válido." };
    }

    if (!esIdValido(datos.idDocente)) {
        return { error: "El identificador del docente no es válido." };
    }

    if (
        typeof datos.codigoGrupo !== "string" ||
        datos.codigoGrupo.trim() === "" ||
        datos.codigoGrupo.length > 30
    ) {
        return { error: "El código del grupo es obligatorio y debe tener máximo 30 caracteres." };
    }

    const cupoMaximo = Number(datos.cupoMaximo);

    if (!Number.isSafeInteger(cupoMaximo) || cupoMaximo <= 0) {
        return { error: "El cupo máximo debe ser un número entero positivo." };
    }

    const estado = datos.estado ?? "ACTIVO";

    if (
        typeof estado !== "string" ||
        estado.trim() === "" ||
        estado.length > 20
    ) {
        return { error: "El estado del grupo no es válido." };
    }

    return {
        datos: {
            idAsignatura: Number(datos.idAsignatura),
            idPeriodo: Number(datos.idPeriodo),
            idDocente: Number(datos.idDocente),
            codigoGrupo: datos.codigoGrupo.trim(),
            cupoMaximo,
            estado: estado.trim()
        }
    };
};

const manejarError = (res, error) => {
    console.error(error);

    if (error.code === "23505") {
        return res.status(409).json({
            mensaje: "Ya existe un grupo con ese código para la asignatura y el periodo indicados."
        });
    }

    if (error.code === "23503") {
        return res.status(400).json({
            mensaje: "La asignatura, el periodo o el docente indicado no existe, o el grupo tiene registros relacionados."
        });
    }

    if (["23514", "23502", "22P02"].includes(error.code)) {
        return res.status(400).json({
            mensaje: "Los datos del grupo no cumplen las restricciones."
        });
    }

    return res.status(500).json({
        mensaje: "Error interno al procesar el grupo académico."
    });
};

const obtenerGrupos = async (req, res) => {
    try {
        const grupos = await grupoAcademicoService.listarGrupos();

        return res.status(200).json(grupos);
    } catch (error) {
        return manejarError(res, error);
    }
};

const crearGrupo = async (req, res) => {
    const validacion = validarGrupo(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const grupoCreado =
            await grupoAcademicoService.crearGrupo(validacion.datos);

        return res.status(201).json(grupoCreado);
    } catch (error) {
        return manejarError(res, error);
    }
};

const actualizarGrupo = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador del grupo no es válido."
        });
    }

    const validacion = validarGrupo(req.body);

    if (validacion.error) {
        return res.status(400).json({
            mensaje: validacion.error
        });
    }

    try {
        const grupoActualizado =
            await grupoAcademicoService.actualizarGrupo(
                Number(id),
                validacion.datos
            );

        if (!grupoActualizado) {
            return res.status(404).json({
                mensaje: "El grupo académico no existe."
            });
        }

        return res.status(200).json(grupoActualizado);
    } catch (error) {
        return manejarError(res, error);
    }
};

const eliminarGrupo = async (req, res) => {
    const { id } = req.params;

    if (!esIdValido(id)) {
        return res.status(400).json({
            mensaje: "El identificador del grupo no es válido."
        });
    }

    try {
        const grupoEliminado =
            await grupoAcademicoService.eliminarGrupo(Number(id));

        if (!grupoEliminado) {
            return res.status(404).json({
                mensaje: "El grupo académico no existe."
            });
        }

        return res.status(200).json(grupoEliminado);

    } catch (error) {
        if (error.code === "23503") {
            return res.status(409).json({
                mensaje: "No se puede eliminar el grupo porque tiene matrículas o evaluaciones relacionadas."
            });
        }

        return manejarError(res, error);
    }
};

module.exports = {
    obtenerGrupos,
    crearGrupo,
    actualizarGrupo,
    eliminarGrupo
};