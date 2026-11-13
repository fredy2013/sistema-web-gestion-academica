const estudianteService = require("../services/estudianteService");

const obtenerEstudiantes = async (req, res) => {
    try {
        const estudiantes = await estudianteService.listarEstudiantes();

        res.status(200).json(estudiantes);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener estudiantes"
        });
    }
};

const crearEstudiante = async (req, res) => {
    try {
        const estudianteCreado =
            await estudianteService.crearEstudiante(req.body);

        res.status(201).json(estudianteCreado);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al crear estudiante",
            error: error.message
        });
    }
};

module.exports = {
    obtenerEstudiantes,
    crearEstudiante
};