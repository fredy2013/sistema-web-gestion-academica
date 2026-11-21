class Asignatura {
    constructor({
        idAsignatura,
        codigo,
        nombre,
        descripcion = null,
        intensidadHoraria = null,
        estado = "ACTIVA"
    }) {
        this.idAsignatura = idAsignatura;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.intensidadHoraria = intensidadHoraria;
        this.estado = estado;
    }

    toJSON() {
        return {
            id_asignatura: this.idAsignatura,
            codigo: this.codigo,
            nombre: this.nombre,
            descripcion: this.descripcion,
            intensidad_horaria: this.intensidadHoraria,
            estado: this.estado
        };
    }
}

module.exports = Asignatura;