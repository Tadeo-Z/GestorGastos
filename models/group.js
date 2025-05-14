const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UserGroup = require('./userGroup');

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false
});

// Relación muchos a muchos con usuarios
Group.belongsToMany(require('./user'), { through: UserGroup, foreignKey: 'groupId' });

module.exports = Group;