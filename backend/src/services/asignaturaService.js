const asignaturaRepository = require("../repositories/asignaturaRepository");

const listarAsignaturas = async () => {
    return await asignaturaRepository.obtenerTodos();
};

const crearAsignatura = async (datosAsignatura) => {
    return await asignaturaRepository.crear(datosAsignatura);
};

const actualizarAsignatura = async (id, datosAsignatura) => {
    return await asignaturaRepository.actualizar(
        id,
        datosAsignatura
    );
};

const eliminarAsignatura = async (id) => {
    return await asignaturaRepository.eliminar(id);
};

module.exports = {
    listarAsignaturas,
    crearAsignatura,
    actualizarAsignatura,
    eliminarAsignatura
};