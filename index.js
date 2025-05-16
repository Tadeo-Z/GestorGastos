const express = require('express');
const sequelize = require('./config/db');
const cors = require('cors');
const app = express();
const { globalErrorHandler, AppError } = require('./util/AppError');
const userRoutes = require('./routes/userRoute');
const groupRoutes = require('./routes/groupRoute');
const userGroupRoutes = require('./routes/userGroupRoute');
const countRoutes = require('./routes/countRoute');
const expenseRoutes = require('./routes/expenseRoute');
const authRoutes = require('./routes/authRoute'); // Nueva ruta para autenticación
const { User, Group, UserGroup, Count, Expense } = require('./models');
const morgan = require('morgan');
require('dotenv').config({ path: '.config.env' });

// Sincronización de la base de datos
sequelize.sync({ alter: true }).then(() => {
    console.log('Base de datos conectada');
}).catch(error => {
    console.error('Error de conexion a la BD: ', error);
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cors({
    origin: '*', // Live server
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rutas organizadas
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/userGroups', userGroupRoutes);
app.use('/api/counts', countRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes); // Nueva ruta para autenticación

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
