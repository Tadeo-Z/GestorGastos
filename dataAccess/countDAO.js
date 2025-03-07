const Count = require('../models/count');

class CountDAO {
    // Obtener todas las cuentas
    static async getAllCounts() {
        try {
            return await Count.findAll();
        } catch (error) {
            console.log('Error obteniendo las cuentas: ', error);
            throw error;
        }
    }

    // Obtener la cuenta por id
    static async getCountById(id) {
        try {
            return await Count.findByPk(id);
        } catch (error) {
            console.log('Error encontrando la cuenta: ', error);
            throw error;
        }
    }

    // Crear una nueva cuenta
    static async createCount(countData) {
        try {
            return await Count.create(countData);
        } catch (error) {
            console.log('Error creando la cuenta: ', error);
            throw error;
        }
    }

    // Actualizar una cuenta por id
    static async updateCount(id, countData) {
        try {
            const count = Count.findByPk(id);
            if(!count) return null;
            
            await count.update(countData);
            return count;
        } catch (error) {
            console.log('Error actualizando la cuenta: ', error);
            throw error;
        }
    }

    // Eliminar una cuanta por id
    static async deleteCount(id) {
        try {
            const deleted = await Count.destroy({ where: id });
            return deleted > 0;
        } catch (error) {
            console.log('Error eliminando la cuenta: ', error);
            throw error;
        }
    }
}

module.exports = new CountDAO();