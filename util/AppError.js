const winston = require("winston");

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log'})
    ]
});

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') || `${statusCode}`.startsWith('5') ? 'error' : 'fail';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; // Establecer el código de estado por defecto
    err.status = err.status || 'error'; // Establecer el estado por defecto

    // Loggear los errores
    logger.error(`Error: ${err.message}`); // Registrar los errores en la consola o en un archivo de log

    // Validación de errores de entrada (express-validator)
    if (err.errors) {
        return res.status(400).json({
            status: 'fail',
            statusCode: 400,
            message: 'Datos inválidos',
            errors: err.errors, // Devuelve las validaciones fallidas
        });
    }

    // Responder con el error
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err : undefined, // Muestra detalles solo en desarrollo
    });
};

module.exports = globalErrorHandler;


module.exports = {
    AppError,
    globalErrorHandler
}