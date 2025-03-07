const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Count = sequelize.define('Account', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    total: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = Count;