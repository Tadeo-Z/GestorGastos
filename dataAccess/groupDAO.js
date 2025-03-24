const Group = require('../models/group');

class GroupDAO {
    //Obtener todos los grupos
    static async getAllGroups() {
        try {
            return await Group.findAll();
        } catch (error) {
            console.error('Error obteniendo a los grupos: ', error);
            throw error;
        }
    }

    //Obtener grupo por id
    static async getGroupById(id) {
        try {
            return await Group.findByPk(id);
        } catch (error) {
            console.error('Error encontrando el grupo: ', error);
            throw error;
        }
    }

    //Crear un nuevo grupo
    static async createGroup(groupData) {
        try {
            return await Group.create(groupData);
        } catch (error) {
            console.error('Error creando el grupo: ', error);
            throw error;
        }
    }

    //Actualizar un grupo por id
    static async updateGroup(id, groupData) {
        try {
            const group = await Group.findByPk(id);
            if(!group) return null;

            await group.update(groupData);
            return group;
        } catch (error) {
            console.error('Error actualizando el grupo: ', error);
            throw error;
        }
    }

    //Eliminar grupo por id
    static async deleteGroup(id) {
        try {
            const deleted = await Group.destroy({ where: { id }});
            return deleted > 0;
        } catch (error) {
            console.error('Error eliminando el grupo: ', error);
            throw error;
        }
    }
}

module.exports = GroupDAO;