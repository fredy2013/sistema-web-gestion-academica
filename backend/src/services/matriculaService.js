const matriculaRepository = require("../repositories/matriculaRepository");

const listarMatriculas = async () => {
    return await matriculaRepository.obtenerTodos();
};

const crearMatricula = async (datosMatricula) => {
    return await matriculaRepository.crear(datosMatricula);
};

const actualizarMatricula = async (id, datosMatricula) => {
    return await matriculaRepository.actualizar(
        id,
        datosMatricula
    );
};

const eliminarMatricula = async (id) => {
    return await matriculaRepository.eliminar(id);
};

module.exports = {
    listarMatriculas,
    crearMatricula,
    actualizarMatricula,
    eliminarMatricula
};