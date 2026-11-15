const estudianteRepository = require("../repositories/estudianteRepository");

const listarEstudiantes = async () => {
    return await estudianteRepository.obtenerTodos();
};

const crearEstudiante = async (datosEstudiante) => {
    return await estudianteRepository.crear(datosEstudiante);
};

const actualizarEstudiante = async (id, datosEstudiante) => {
    return await estudianteRepository.actualizar(
        id,
        datosEstudiante
    );
};

const eliminarEstudiante = async (id) => {
    return await estudianteRepository.eliminar(id);
};

module.exports = {
    listarEstudiantes,
    crearEstudiante,
    actualizarEstudiante,
    eliminarEstudiante
};