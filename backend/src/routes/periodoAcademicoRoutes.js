const express = require("express");

const router = express.Router();

const periodoAcademicoController =
    require("../controllers/periodoAcademicoController");

router.get(
    "/",
    periodoAcademicoController.obtenerPeriodos
);

router.post(
    "/",
    periodoAcademicoController.crearPeriodo
);

router.put(
    "/:id",
    periodoAcademicoController.actualizarPeriodo
);

router.delete(
    "/:id",
    periodoAcademicoController.eliminarPeriodo
);

module.exports = router;