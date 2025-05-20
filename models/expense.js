const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    quoteDate:  {
        type: DataTypes.DATE,
        allowNull: false
    },
    paid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        //'0' no pagado, '1' está pagado
        defaultValue: 0
    }
}, {
    timestamps: false
});

module.exports = Expense;