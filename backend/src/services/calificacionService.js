const calificacionRepository = require("../repositories/calificacionRepository");

const listarCalificaciones = async () => {
    return await calificacionRepository.obtenerTodos();
};

const crearCalificacion = async (datosCalificacion) => {
    return await calificacionRepository.crear(datosCalificacion);
};

const actualizarCalificacion = async (id, datosCalificacion) => {
    return await calificacionRepository.actualizar(
        id,
        datosCalificacion
    );
};

const eliminarCalificacion = async (id) => {
    return await calificacionRepository.eliminar(id);
};

module.exports = {
    listarCalificaciones,
    crearCalificacion,
    actualizarCalificacion,
    eliminarCalificacion
};