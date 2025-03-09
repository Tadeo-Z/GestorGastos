const sequelize = require('../config/db');

const User = require('./user');
const Group = require('./group');
const UserGroup = require('./userGroup');
const Expense = require('./expense');
const Count = require('./count');

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

User.hasMany(Expense, { foreignKey: 'userID' });
Expense.belongsTo(User, { foreignKey: 'userID' });

Expense.belongsTo(Count, { foreignKey: 'countID' });
Count.hasMany(Expense, { foreignKey: 'countID' });

module.exports = {User, Group, UserGroup, Expense, Count};