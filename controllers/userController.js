const { AppError } = require('../util/AppError');
const UserDAO = require('../dataAccess/userDAO');

const getUsers = async(req, res) => {
    try {
        const users = await UserDAO.getAllUsers();
        res.json(users.map(user => user.toJSON()));
    } catch (error) {
        throw new AppError('No se pudieron obtener los usuarios', 500);
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserDAO.getUserById(id);

        res.json(user);
    } catch (error) {
        throw new AppError(`No se pudo obtener el usuario ${id}`, 500);
    }
}

const addUser = async(req, res) => {
    try {
        const { name, paternalSurname, maternalSurname, entryDate } = req.body;

        if(!name || !paternalSurname || !maternalSurname || !entryDate) {
            throw new AppError('Faltan campos obligatorios', 500);
        }

        const user = {
            name: name,
            paternalSurname: paternalSurname,
            maternalSurname: maternalSurname,
            entryDate: entryDate
        }

        await UserDAO.createUser(user);
        res.json(user);
    } catch (error) {
        throw new AppError('No se pudo agregar el usuario', 500);
    }
    
}

const updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, paternalSurname, maternalSurname, entryDate } = req.body;

        if(!name || !paternalSurname || !maternalSurname, !entryDate) {
            throw new AppError('Faltan campos obligatorios', 500);
        }

        const user = {
            name: name,
            paternalSurname: paternalSurname,
            maternalSurname: maternalSurname,
            entryDate: entryDate
        }

        await UserDAO.updateUser(id, user);
        res.json(user);
    } catch (error) {
        throw new AppError(`No se pudo actualizar el usuario ${id}`, 500);
    }
}

const deleteUser = async(req, res) => {
    try {
        const { id } = req.params;
        const user = UserDAO.getUserById(id)

        if(!user) {
            throw new AppError('Usuario no encontrado', 404);
        }

        await UserDAO.deleteUser(id);
        res.status(200).json({ message: 'Usuario eliminado correcta'} );
    } catch (error) {
        throw new AppError(`No se pudo eliminar el usuario ${id}`, 500);
    }
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser
}