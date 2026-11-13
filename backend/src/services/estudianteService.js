const estudianteRepository = require("../repositories/estudianteRepository");

const listarEstudiantes = async () => {
    return await estudianteRepository.obtenerTodos();
};

const crearEstudiante = async (datosEstudiante) => {
    return await estudianteRepository.crear(datosEstudiante);
};

module.exports = {
    listarEstudiantes,
    crearEstudiante
};