const { AppError } = require('../util/AppError');
const UserDAO = require('../dataAccess/userDAO');
const { auth, generateToken } = require('../util/auth');


const getUsers = async (req, res, next) => {
    try {
        const users = await UserDAO.getAllUsers();
        res.status(200).json(users.map(user => user.toJSON())); // 200 OK
    } catch (error) {
        next(new AppError('No se pudieron obtener los usuarios', 500)); // Enviar al middleware de manejo de errores
    }
};


const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserDAO.getUserById(id);

        res.json(user);
    } catch (error) {
        throw new AppError(`No se pudo obtener el usuario ${id}`, 500);
    }
}

const addUser = async (req, res, next) => {
    try {
        const { name, paternalSurname, maternalSurname, entryDate, password } = req.body;

        if (!name || !paternalSurname || !maternalSurname || !entryDate || !password) {
            return next(new AppError('Faltan campos obligatorios', 400));
        }

        const user = await UserDAO.createUser({
            name,
            paternalSurname,
            maternalSurname,
            entryDate,
            password
        });

        res.status(201).json(user); // 201 Created
    } catch (error) {
        next(new AppError('No se pudo agregar el usuario', 500));
    }
};


const updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, paternalSurname, maternalSurname, entryDate, password} = req.body;

        if(!name || !paternalSurname || !maternalSurname, !entryDate, !password) {
            throw new AppError('Faltan campos obligatorios', 500);
        }

        const user = {
            name: name,
            paternalSurname: paternalSurname,
            maternalSurname: maternalSurname,
            entryDate: entryDate,
            password:  password
        }

        await UserDAO.updateUser(id, user);
        res.json(user);
    } catch (error) {
        throw new AppError(`No se pudo actualizar el usuario ${id}`, 500);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await UserDAO.getUserById(id);
        if (!user) {
            return next(new AppError('Usuario no encontrado', 404));
        }

        await UserDAO.deleteUser(id);
        res.status(204).send(); // 204 No Content, no retorna cuerpo
    } catch (error) {
        next(new AppError('No se pudo eliminar el usuario', 500));
    }
};



const loginUser = async (req, res, next) => {
    const { name, password } = req.body;
    console.log('Datos recibidos:', { name, password }); // Verifica los datos enviados

    try {
        const user = await UserDAO.getUserByName(name); // Busca al usuario
        console.log('Usuario encontrado:', user); // Muestra el usuario encontrado

        if (!user || user.password !== password) {
            console.log('Credenciales inválidas');
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = generateToken(user);
        console.log('Token generado:', token); // Verifica el token generado
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al autenticar:', error); // Muestra el error en consola
        next(new AppError('Error al autenticar al usuario', 500));
    }
};



module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    loginUser,
};

