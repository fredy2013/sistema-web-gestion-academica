class Estudiante {
    constructor(
        id,
        tipoDocumento,
        numeroDocumento,
        nombres,
        apellidos,
        correo,
        celular,
        estado
    ) {
        this.id = id;
        this.tipoDocumento = tipoDocumento;
        this.numeroDocumento = numeroDocumento;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.celular = celular;
        this.estado = estado;
    }
}

module.exports = Estudiante;