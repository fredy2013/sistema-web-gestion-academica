const grupoAcademicoRepository = require("../repositories/grupoAcademicoRepository");

const listarGrupos = async () => {
    return await grupoAcademicoRepository.obtenerTodos();
};

const crearGrupo = async (datosGrupo) => {
    return await grupoAcademicoRepository.crear(datosGrupo);
};

const actualizarGrupo = async (id, datosGrupo) => {
    return await grupoAcademicoRepository.actualizar(
        id,
        datosGrupo
    );
};

const eliminarGrupo = async (id) => {
    return await grupoAcademicoRepository.eliminar(id);
};

module.exports = {
    listarGrupos,
    crearGrupo,
    actualizarGrupo,
    eliminarGrupo
};