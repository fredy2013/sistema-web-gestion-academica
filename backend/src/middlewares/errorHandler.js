
/**
 * Middleware global para el manejo de errores.
 * Sistema Web de Gestión Académica.
 */

const errorHandler = (error, req, res, next) => {

    // Si la respuesta ya comenzó, Express debe continuar
    // con su manejo predeterminado del error.
    if (res.headersSent) {
        return next(error);
    }

    let status = 500;
    let mensaje = "Error interno del servidor.";

    // Errores conocidos de PostgreSQL
    switch (error.code) {

        case "23505":
            status = 409;
            mensaje = "Ya existe un registro con esos datos.";
            break;

        case "23503":
            status = 409;
            mensaje = "La operación afecta registros relacionados.";
            break;

        case "23514":
        case "23502":
        case "22P02":
        case "22007":
        case "22008":
        case "22001":
            status = 400;
            mensaje = "Los datos proporcionados no cumplen las restricciones.";
            break;

        default:
            // Errores controlados de la aplicación
            if (
                Number.isInteger(error.statusCode) &&
                error.statusCode >= 400 &&
                error.statusCode < 500
            ) {
                status = error.statusCode;
                mensaje = error.publicMessage ||
                    "La solicitud no pudo ser procesada.";
            }
    }

    // Registro inicial en la terminal del servidor
    console.error("[ERROR API]", {
        fecha: new Date().toISOString(),
        metodo: req.method,
        ruta: req.originalUrl,
        codigo: error.code || "APP_ERROR",
        mensajeTecnico: error.message
    });

    // Respuesta controlada al cliente
    return res.status(status).json({
        mensaje
    });
};

module.exports = errorHandler;
