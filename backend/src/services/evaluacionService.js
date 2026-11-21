const evaluacionRepository = require("../repositories/evaluacionRepository");

const listarEvaluaciones = async () => {
    return await evaluacionRepository.obtenerTodos();
};

const crearEvaluacion = async (datosEvaluacion) => {
    return await evaluacionRepository.crear(datosEvaluacion);
};

const actualizarEvaluacion = async (id, datosEvaluacion) => {
    return await evaluacionRepository.actualizar(
        id,
        datosEvaluacion
    );
};

const eliminarEvaluacion = async (id) => {
    return await evaluacionRepository.eliminar(id);
};

module.exports = {
    listarEvaluaciones,
    crearEvaluacion,
    actualizarEvaluacion,
    eliminarEvaluacion
};