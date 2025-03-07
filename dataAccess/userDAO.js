const User = require('../models/user');

class UserDAO {
    // Obtener todos los usuarios
    static async getAllUsers() {
        try {
            return await User.findAll();
        } catch (error) {
            console.error('Error obteniendo a los usuarios: ', error);
            throw error;
        }
    }

    // Obtener el usuario por ID
    static async getUserById(id) {
        try{
            return await User.findByPk(id);
        } catch (error) {
            console.error('Error encontrando el usuario: ', error);
            throw error;
        }
    }

    // Crear un nuevo usuario
    static async createUser(userData) {
        try {
            return await User.create(userData);
        } catch(error) {
            console.error('Error creando al usuario: ', error);
            throw error;
        }
    }

    // Actualizar un usuario por ID
    static async updateUser(id, userData) {
        try {
            const user = await User.findByPk(id);
            if(!user) return null; // Si el usuario no existe, regresa nulo

            await user.update(userData);
            return user;
        } catch (error) {
            console.error('Error actualizando al usuario: ', error);
            throw error;
        }
    }

    // Eliminar un usuario por ID
    static async deleteUser(id) {
        try {
            const deleted = await User.destroy({ where: { id } });
            return deleted > 0; // Regresa true si elimino al menos un registro
        } catch (error) {
            console.error('Error eliminando al usuario: ', error);
            throw error;
        }
    }
}

module.exports = new UserDAO();