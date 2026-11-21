const express = require("express");

const router = express.Router();

const grupoAcademicoController =
    require("../controllers/grupoAcademicoController");

router.get(
    "/",
    grupoAcademicoController.obtenerGrupos
);

router.post(
    "/",
    grupoAcademicoController.crearGrupo
);

router.put(
    "/:id",
    grupoAcademicoController.actualizarGrupo
);

router.delete(
    "/:id",
    grupoAcademicoController.eliminarGrupo
);

module.exports = router;