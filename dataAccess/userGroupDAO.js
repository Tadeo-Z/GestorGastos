const UserGroup = require('../models/userGroup');

class UserGroupDAO {
    // Obtener todos los grupos con sus usuarios
    static async getAllUserGroups() {
        try {
            return await UserGroup.findAll();
        } catch (error) {
            console.log('Error obteniendo los grupos con sus usuarios: ', error);
            throw error;
        }
    }

    // Obtener el grupo con usuarios por id
    static async getUserGroupsById(id) {
        try {
            return await UserGroup.findByPk(id);
        } catch (error) {
            console.log('Error obteniendo al grupo con sus usuarios: ', error);
            throw error;
        }
    }

    // Obtener los grupos de un usuario
    static async getUserGroupsByUserId(userId) {
        try {
            return await UserGroup.findAll({ where: { userId } });
        } catch (error) {
            console.log('Error obteniendo el grupo del usuario: ', error);
            throw error;
        }
    }

    // Obtener los usuarios de un grupo
    static async getUserGroupsByGroupId(groupId) {
        try {
            return await UserGroup.findAll({ where: { groupId } });
        } catch (error) {
            console.log('Error obteniendo los usuarios del grupo: ', error);
            throw error;
        }
    }

    // Crear un nuevo grupo con usuarios
    static async createUserGroup(userId, groupId, userGroupData) {
        try {
            return await UserGroup.create({userId, groupId, ...userGroupData});
        } catch (error) {
            console.log('Error obteniendo los grupos con sus usuarios: ', error);
            throw error;
        }
    }

    // Actualizar grupo con usuarios por id
    static async updateUserGroup(id, userGroupData) {
        try {
            const userGroup = await UserGroup.findByPk(id);
            if(!userGroup) return null;

            await Expense.update(userGroupData);
            return userGroup;
        } catch (error) {
            console.log('Error actualizando el grupo con sus usuarios: ', error);
            throw error;
        }
    }

    static async deleteUserGroup(id) {
        try {
            const deleted = await UserGroup.destroy({ where: id });
            return deleted > 0;
        } catch (error) {
            console.log('Error eliminando el grupo con sus usuarios: ', error);
            throw error;
        }
    }
}

module.exports = UserGroupDAO;