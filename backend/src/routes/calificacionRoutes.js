const express = require("express");

const router = express.Router();

const calificacionController =
    require("../controllers/calificacionController");

router.get(
    "/",
    calificacionController.obtenerCalificaciones
);

router.post(
    "/",
    calificacionController.crearCalificacion
);

router.put(
    "/:id",
    calificacionController.actualizarCalificacion
);

router.delete(
    "/:id",
    calificacionController.eliminarCalificacion
);

module.exports = router;