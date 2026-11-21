
class Calificacion {
    constructor({
        idCalificacion,
        idEvaluacion,
        idMatricula,
        idGrupo,
        nota,
        observacion = null,
        fechaRegistro = null
    }) {
        this.idCalificacion = idCalificacion;
        this.idEvaluacion = idEvaluacion;
        this.idMatricula = idMatricula;
        this.idGrupo = idGrupo;
        this.nota = nota;
        this.observacion = observacion;
        this.fechaRegistro = fechaRegistro;
    }

    toJSON() {
        return {
            id_calificacion: this.idCalificacion,
            id_evaluacion: this.idEvaluacion,
            id_matricula: this.idMatricula,
            id_grupo: this.idGrupo,
            nota: this.nota,
            observacion: this.observacion,
            fecha_registro: this.fechaRegistro
        };
    }
}

module.exports = Calificacion;
