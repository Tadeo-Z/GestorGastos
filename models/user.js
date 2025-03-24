const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paternalSurname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    maternalSurname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entryDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false // Agregamos el campo para contraseñas
    }
}, {
    timestamps: false
});

module.exports = User;
