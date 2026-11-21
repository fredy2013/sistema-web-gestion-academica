const periodoAcademicoRepository = require("../repositories/periodoAcademicoRepository");

const listarPeriodos = async () => {
    return await periodoAcademicoRepository.obtenerTodos();
};

const crearPeriodo = async (datosPeriodo) => {
    return await periodoAcademicoRepository.crear(datosPeriodo);
};

const actualizarPeriodo = async (id, datosPeriodo) => {
    return await periodoAcademicoRepository.actualizar(
        id,
        datosPeriodo
    );
};

const eliminarPeriodo = async (id) => {
    return await periodoAcademicoRepository.eliminar(id);
};

module.exports = {
    listarPeriodos,
    crearPeriodo,
    actualizarPeriodo,
    eliminarPeriodo
};