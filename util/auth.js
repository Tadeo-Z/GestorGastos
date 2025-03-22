const jwt = require('jsonwebtoken');
const { AppError } = require('./AppError');
require('dotenv').config();

const auth = (req, res, next) => {
    const token = req.header('Authorization');

    if(!token) {
        throw new AppError('Acceso denegado, no hay token', 401);
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer, ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        new AppError('Token inválido', 401);
    }
}

module.exports = auth;