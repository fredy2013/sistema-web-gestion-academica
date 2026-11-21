
class Matricula {
    constructor({
        idMatricula,
        idEstudiante,
        idGrupo,
        fechaMatricula,
        estado,
        fechaRegistro = null,
        motivoEstado = null
    }) {
        this.idMatricula = idMatricula;
        this.idEstudiante = idEstudiante;
        this.idGrupo = idGrupo;
        this.fechaMatricula = fechaMatricula;
        this.estado = estado;
        this.fechaRegistro = fechaRegistro;
        this.motivoEstado = motivoEstado;
    }

    toJSON() {
        return {
            id_matricula: this.idMatricula,
            id_estudiante: this.idEstudiante,
            id_grupo: this.idGrupo,
            fecha_matricula: this.fechaMatricula,
            estado: this.estado,
            fecha_registro: this.fechaRegistro,
            motivo_estado: this.motivoEstado
        };
    }
}

module.exports = Matricula;
