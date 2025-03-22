const { AppError } = require('../util/AppError');
const UserDAO = require('../dataAccess/userDAO');

const getUsers = (req, res) => {
    try {
        res.json(UserDAO.getAllUsers());
    } catch (error) {
        throw new AppError('No se pudieron obtener los usuarios', 500);
    }
}

const getUser = (req, res) => {
    try {
        const { id } = req.params;
        const user = UserDAO.getUserById(id);

        res.json(user);
    } catch (error) {
        throw new AppError(`No se pudo obtener el usuario ${id}`, 500);
    }
}

const addUser = (req, res) => {
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

        UserDAO.createUser(user);
        res.json(user);
    } catch (error) {
        throw new AppError('No se pudo agregar el usuario', 500);
    }
    
}

const updateUser = (req, res) => {
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

        UserDAO.updateUser(id, user);
        res.json(user);
    } catch (error) {
        throw new AppError(`No se pudo actualizar el usuario ${id}`, 500);
    }
}

const deleteUser = (req, res) => {
    try {
        const { id } = req.params;
        const user = UserDAO.getUserById(id)

        if(!user) {
            throw new AppError('Usuario no encontrado', 404);
        }

        UserDAO.deleteUser(id);
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