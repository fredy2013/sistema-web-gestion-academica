const express = require("express");

const router = express.Router();

const matriculaController =
require("../controllers/matriculaController");

router.get(
    "/",
    matriculaController.obtenerMatriculas
);

router.post(
    "/",
    matriculaController.crearMatricula
);

router.put(
    "/:id",
    matriculaController.actualizarMatricula
);

router.delete(
    "/:id",
    matriculaController.eliminarMatricula
);

module.exports = router;