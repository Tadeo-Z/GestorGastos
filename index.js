const UserDAO = require('./dataAccess/userDAO');
require('dotenv').config();
const sequelize = require('./config/db');
const User = require('./models/user');

// Sincronizar el modelo con la base de datos
sequelize.sync({ force: true }).then(() => {
    console.log('Tablas creadas');
    // Ejecutar las pruebas
    testDAO();
}).catch(error => {
    console.error('Error sincronizando el modelo con la base de datos', error);
});

async function testDAO() {
    try {
        // Verificar la conexion con la base de datos
        await sequelize.authenticate();
        console.log('La conexion se ha establecido correctamente');

        // Crear un usuario
        const newUser = await UserDAO.createUser({
            name: 'Tadeo',
            paternalSurname: 'Zayas',
            maternalSurname: 'Bernal',
            entryDate: new Date()
        });
        console.log('Usuario creado: ', newUser.toJSON());

        // Obtener todos los usuarios
        const users = await UserDAO.getAllUsers();
        console.log('Todos los usuarios: ', users.map(user => user.toJSON()));

        // Obtener un usuario por ID
        const user = await UserDAO.getUserById(newUser.id);
        console.log('Usuario por ID: ', user ? user.toJSON() : 'No encontrado');

        // Actualizar usuario
        const updatedUser = await UserDAO.updateUser(newUser.id, { name: 'Tadeo actualizado' });
        console.log('Usuario actualizado: ', updatedUser ? updatedUser.toJSON() : 'No encontrado');

        // Eliminar usuario
        const deleted = await UserDAO.deleteUser(newUser.id);
        console.log(deleted ? 'Usuario eliminado' : 'Usuario no encontrado');
    } catch (error) {
        console.error('Error probando el acceso a datos', error);
    } finally {
        await sequelize.close(); // Cierra la conexion a la BD
    }
}