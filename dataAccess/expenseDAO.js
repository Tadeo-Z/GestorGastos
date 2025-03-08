const Expense = require('../models/expense');

class ExpenseDAO {
    // Obtener todos los gastos
    static async getAllExpenses() {
        try {
            return await Expense.findAll();
        } catch (error) {
            console.log('Error obteniendo los gastos: ', error);
            throw error;
        }
    }

    // Obtener el gasto por ID
    static async getExpenseById(id) {
        try {
            return await Expense.findByPk(id);
        } catch (error) {
            console.log('Error encontrando el gasto: ', error);
            throw error;
        }
    }

    // Crear un nuevo gasto
    static async createExpense(expenseData) {
        try {
            return await Expense.create(expenseData);
        } catch (error) {
            console.log('Error creando el gasto: ', error);
            throw error;
        }
    }

    // Actualizar gasto por id
    static async updateExpense(id, expenseData) {
        try {
            const expense = await Expense.findByPk(id);
            if(!expense) return null;

            await Expense.update(expenseData);
            return expense;
        } catch (error) {
            console.log('Error actualizando el gasto: ', error);
            throw error;
        }
    }

    // Eliminar gasto por id
    static async deleteExpense(id) {
        try {
            const deleted = await Expense.destroy({ where: id });
            return deleted > 0;
        } catch (error) {
            console.log('Error eliminando el gasto: ', error);
            throw error;
        }
    }
}

module.exports = new ExpenseDAO();