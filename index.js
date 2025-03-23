const express = require('express');
const sequelize = require('./config/db');
const app = express();
const { globalErrorHandler, AppError } = require('./util/AppError');
const userRoutes = require('./routes/userRoute');
const groupRoutes = require('./routes/groupRoute');
const userGroupRoutes = require('./routes/userGroupRoute');
const countRoutes = require('./routes/countRoute');
const expenseRoutes = require('./routes/expenseRoute');
const { User, Group, UserGroup, Count, Expense } = require('./models');
const morgan = require('morgan');
require('dotenv').config({ path: '.config.env'});

sequelize.sync({ force: true }).then(() => {
    console.log('Tablas creadas');
}).catch(error => {
    console.error('Error sincronizando el modelo con la base de datos', error);
});

app.use(express.json());
app.use(morgan('combined'));
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/userGroups', userGroupRoutes);
app.use('/api/counts', countRoutes);
app.use('/api/expenses', expenseRoutes);

app.all('*', (req, res, next) => {
    const error = new AppError(`No se ha podido acceder a ${req.originalUrl} en`);
    next(error);
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`El servidor escuchando en el puerto ${PORT}`);
});