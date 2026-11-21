const express = require("express");
const cors = require("cors");

const estudianteRoutes = require("./routes/estudianteRoutes");
const docenteRoutes = require("./routes/docenteRoutes");
const asignaturaRoutes = require("./routes/asignaturaRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
const periodoAcademicoRoutes = require("./routes/periodoAcademicoRoutes");
const grupoAcademicoRoutes = require("./routes/grupoAcademicoRoutes");
const evaluacionRoutes = require("./routes/evaluacionRoutes");
const calificacionRoutes = require("./routes/calificacionRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/docentes", docenteRoutes);
app.use("/api/asignaturas", asignaturaRoutes);
app.use("/api/matriculas", matriculaRoutes);
app.use("/api/periodos-academicos", periodoAcademicoRoutes);
app.use("/api/grupos-academicos", grupoAcademicoRoutes);
app.use("/api/evaluaciones", evaluacionRoutes);
app.use("/api/calificaciones", calificacionRoutes);

// Middleware global para el manejo de errores
app.use(errorHandler);

module.exports = app;