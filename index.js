const express = require('express');
const sequelize = require('./config/db');
const cors = require('cors');
const app = express();
const { globalErrorHandler, AppError } = require('./util/AppError');
const userRoutes = require('./routes/userRoute');
const groupRoutes = require('./routes/groupRoute'); // Registrar la ruta de grupos
const userGroupRoutes = require('./routes/userGroupRoute');
const countRoutes = require('./routes/countRoute');
const expenseRoutes = require('./routes/expenseRoute');
const authRoutes = require('./routes/authRoute'); // Nueva ruta para autenticación
const contactRoutes = require('./routes/contactRoute'); // Importar la nueva ruta
const { User, Group, UserGroup, Count, Expense, contact } = require('./models');
const morgan = require('morgan');
require('dotenv').config({ path: '.config.env' });

// Sincronización de la base de datos
sequelize.sync({ alter: true }).then(() => {
    console.log('Tablas creadas');
}).catch(error => {
    console.error('Error sincronizando el modelo con la base de datos', error);
});

// Middlewares
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

// Rutas organizadas
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes); // Registrar la ruta de grupos
app.use('/api/userGroups', userGroupRoutes);
app.use('/api/counts', countRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes); // Nueva ruta para autenticación
app.use('/api/contactos', contactRoutes); // Registrar la ruta

// Manejo de rutas no encontradas
app.all('*', (req, res, next) => {
    const error = new AppError(`No se ha podido acceder a ${req.originalUrl}`, 404);
    next(error);
});

// Middleware global de manejo de errores
app.use(globalErrorHandler);

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${PORT}`);
});
sequelize.sync({ alter: true }).then(() => {
    console.log('Tablas creadas');
}).catch(error => {
    console.error('Error sincronizando el modelo con la base de datos', error);
});
