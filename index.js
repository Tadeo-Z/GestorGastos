const UserDAO = require('./dataAccess/userDAO');
const GroupDAO = require('./dataAccess/groupDAO');
const ExpenseDAO = require('./dataAccess/expenseDAO');
const CountDAO = require('./dataAccess/countDAO');
const UserGroupDAO = require('./dataAccess/userGroupDAO');
require('dotenv').config();
const sequelize = require('./config/db');
const { User, Group, UserGroup, Count, Expense } = require('./models');

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
        // Crear otro usuario
        const newUser2 = await UserDAO.createUser({
            name: 'Samuel',
            paternalSurname: 'Vega',
            maternalSurname: 'Hernandez',
            entryDate: new Date()
        });

        console.log('Usuario creado: ', newUser.toJSON());
        console.log('Usuario creado: ', newUser2.toJSON());

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
        //const deleted = await UserDAO.deleteUser(newUser.id);
        //console.log(deleted ? 'Usuario eliminado' : 'Usuario no encontrado');

        // Crear un grupo
        const newGroup = await GroupDAO.createGroup({
            description: 'Grupo para hacer tarea',
            creationDate: new Date()
        });

        console.log('Grupo creado: ', newGroup.toJSON());

        // Metiendo un usuario a un grupo
        const newUserGroup = await UserGroupDAO.createUserGroup(
            newUser.id, newGroup.id, {
                rol: 'Administrador'
            }
        );

        console.log('Relación hecha: ', newUserGroup.toJSON());

        // Metiendo a otro usuario al mismo grupo
        const newUserGroup2 = await UserGroupDAO.createUserGroup(
            newUser2.id, newGroup.id, {
                rol: 'Usuario'
            }
        );

        console.log('Relación hecha: ', newUserGroup2.toJSON());

        // Obtener a todos los usuarios del grupo creado
        const users1 = await UserGroupDAO.getUserGroupsByGroupId(newGroup.id);
        console.log('Usuarios del primer grupo: ', users1.map(user => user.toJSON()));

        // Eliminando un usuario
        const deleted = await UserDAO.deleteUser(newUser2.id);
        console.log(deleted ? 'Usuario eliminado' : 'Usuario no encontrado');

        // Crear una cuenta
        const newCount = await CountDAO.createCount({
            total: 100.00,
            startDate: new Date(),
            endDate: new Date(Date.now() + 5000000000)
        });
        console.log('Cuenta creada: ', newCount.toJSON());

        // Crear un gasto
        const gasto = await ExpenseDAO.createExpense(
            newUser.id, newCount.id, {
                amount: 50.00,
                quoteDate: new Date(Date.now() + 500000000)
            }
        );
        console.log('Gasto creado: ', gasto.toJSON());
    } catch (error) {
        console.error('Error probando el acceso a datos', error);
    } finally {
        await sequelize.close(); // Cierra la conexion a la BD
    }
}