
class Evaluacion {
    constructor({
        idEvaluacion,
        idGrupo,
        codigo,
        nombre,
        descripcion = null,
        porcentaje,
        fechaEvaluacion = null,
        estado = "ACTIVA"
    }) {
        this.idEvaluacion = idEvaluacion;
        this.idGrupo = idGrupo;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.porcentaje = porcentaje;
        this.fechaEvaluacion = fechaEvaluacion;
        this.estado = estado;
    }

    toJSON() {
        return {
            id_evaluacion: this.idEvaluacion,
            id_grupo: this.idGrupo,
            codigo: this.codigo,
            nombre: this.nombre,
            descripcion: this.descripcion,
            porcentaje: this.porcentaje,
            fecha_evaluacion: this.fechaEvaluacion,
            estado: this.estado
        };
    }
}

module.exports = Evaluacion;
