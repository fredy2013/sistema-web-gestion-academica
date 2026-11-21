class GrupoAcademico {
    constructor({
        idGrupo,
        idAsignatura,
        idPeriodo,
        idDocente,
        codigoGrupo,
        cupoMaximo,
        estado
    }) {
        this.idGrupo = idGrupo;
        this.idAsignatura = idAsignatura;
        this.idPeriodo = idPeriodo;
        this.idDocente = idDocente;
        this.codigoGrupo = codigoGrupo;
        this.cupoMaximo = cupoMaximo;
        this.estado = estado;
    }

    toJSON() {
        return {
            id_grupo: this.idGrupo,
            id_asignatura: this.idAsignatura,
            id_periodo: this.idPeriodo,
            id_docente: this.idDocente,
            codigo_grupo: this.codigoGrupo,
            cupo_maximo: this.cupoMaximo,
            estado: this.estado
        };
    }
}

module.exports = GrupoAcademico;