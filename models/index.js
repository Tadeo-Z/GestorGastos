const sequelize = require('../config/db');

const User = require('./user');
const Group = require('./group');
const UserGroup = require('./userGroup');
const Expense = require('./expense');
const Count = require('./count');
const Contact = require('./contact');

User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId' });
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId' });

User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Contact, { foreignKey: 'userId', as: 'contacts'});

Contact.belongsTo(User, { foreignKey: 'contactId', as: 'contact'});

Expense.belongsTo(Count, { foreignKey: 'countId' });
Count.hasMany(Expense, { foreignKey: 'countId' });

module.exports = {User, Group, UserGroup, Expense, Count, Contact};