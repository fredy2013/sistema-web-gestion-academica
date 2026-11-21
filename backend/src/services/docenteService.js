const docenteRepository = require("../repositories/docenteRepository");

const listarDocentes = async () => {
    return await docenteRepository.obtenerTodos();
};

const crearDocente = async (datosDocente) => {
    return await docenteRepository.crear(datosDocente);
};

const actualizarDocente = async (id, datosDocente) => {
    return await docenteRepository.actualizar(
        id,
        datosDocente
    );
};

const eliminarDocente = async (id) => {
    return await docenteRepository.eliminar(id);
};

module.exports = {
    listarDocentes,
    crearDocente,
    actualizarDocente,
    eliminarDocente
};