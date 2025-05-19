const jwt = require('jsonwebtoken');
require('dotenv').config();
const { AppError } = require('./AppError');

// Función para generar tokens JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, name: user.name }, // Datos que incluirás en el token
        process.env.JWT_SECRET,          // Clave secreta
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Tiempo de expiración
    );
};

// Middleware para autenticar usuarios mediante tokens JWT
const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Acceso denegado, no hay token', 401));
    }

    const token = authHeader.split(' ')[1]; // Extrae el token solo despues de Bearer

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError('Token inválido', 401));
    }
};


// Exporta ambas funciones
module.exports = { auth, generateToken };
