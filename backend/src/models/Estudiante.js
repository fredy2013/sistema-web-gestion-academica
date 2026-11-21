const Persona = require("./Persona");

class Estudiante extends Persona {
    constructor({
        idEstudiante,
        idPersona,
        tipoDocumento,
        numeroDocumento,
        nombres,
        apellidos,
        correo = null,
        telefono = null,
        estado = "ACTIVO",
        codigoEstudiantil = null,
        fechaIngreso = null,
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

        this.idEstudiante = idEstudiante;
        this.codigoEstudiantil = codigoEstudiantil;
        this.fechaIngreso = fechaIngreso;
        this.fechaRegistro = fechaRegistro;
    }

    toJSON() {
        return {
            id: this.idEstudiante,
            id_persona: this.idPersona,
            codigo_estudiantil: this.codigoEstudiantil,
            fecha_ingreso: this.fechaIngreso,
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

module.exports = Estudiante;