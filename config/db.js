require('dotenv').config({ path: '.config.env' }); // Cargar las variables del .env
const { Sequelize } = require('sequelize');

console.log('Dialect:', process.env.DB_DIALECT); // Depuración

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
);

module.exports = sequelize;