class PeriodoAcademico {
    constructor({
        idPeriodo,
        codigo,
        nombre,
        fechaInicio,
        fechaFin,
        fechaInicioMatricula,
        fechaFinMatricula,
        estado
    }) {
        this.idPeriodo = idPeriodo;
        this.codigo = codigo;
        this.nombre = nombre;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.fechaInicioMatricula = fechaInicioMatricula;
        this.fechaFinMatricula = fechaFinMatricula;
        this.estado = estado;
    }

    toJSON() {
        return {
            id_periodo: this.idPeriodo,
            codigo: this.codigo,
            nombre: this.nombre,
            fecha_inicio: this.fechaInicio,
            fecha_fin: this.fechaFin,
            fecha_inicio_matricula: this.fechaInicioMatricula,
            fecha_fin_matricula: this.fechaFinMatricula,
            estado: this.estado
        };
    }
}

module.exports = PeriodoAcademico;