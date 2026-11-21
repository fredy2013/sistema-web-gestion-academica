const Persona = require("./Persona");

class Docente extends Persona {
    constructor({
        idDocente,
        idPersona,
        tipoDocumento,
        numeroDocumento,
        nombres,
        apellidos,
        correo = null,
        telefono = null,
        estado = "ACTIVO",
        codigoDocente = null,
        fechaRegistro = null
    }) {
        super(
            idPersona,
            tipoDocumento,
            numeroDocumento,
            nombres,
            apellidos,
            correo,
            telefono,
            estado
        );

        this.idDocente = idDocente;
        this.codigoDocente = codigoDocente;
        this.fechaRegistro = fechaRegistro;
    }

    toJSON() {
        return {
            id: this.idDocente,
            id_persona: this.idPersona,
            codigo_docente: this.codigoDocente,
            fecha_registro: this.fechaRegistro,
            tipo_documento: this.tipoDocumento,
            numero_documento: this.numeroDocumento,
            nombres: this.nombres,
            apellidos: this.apellidos,
            correo: this.correo,
            celular: this.telefono,
            estado: this.estado
        };
    }
}

module.exports = Docente;