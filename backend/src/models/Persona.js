class Persona {
    constructor(
        idPersona,
        tipoDocumento,
        numeroDocumento,
        nombres,
        apellidos,
        correo = null,
        telefono = null,
        estado = "ACTIVO"
    ) {
        this.idPersona = idPersona;
        this.tipoDocumento = tipoDocumento;
        this.numeroDocumento = numeroDocumento;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.telefono = telefono;
        this.estado = estado;
    }
}

module.exports = Persona;