const { AppError } = require('../util/AppError');
const ExpenseDAO = require('../dataAccess/expenseDAO');

const getExpenses = async(req, res) => {
    try {
        const expenses = await ExpenseDAO.getAllExpenses();
        res.json(expenses.map(expense => expense.toJSON()));
    } catch (error) {
        throw new AppError('No se pudieron obtener los gastos', 500);
    }
}

const getExpense = async(req, res) => {
    try {
        const { id } = req.params;
        const expense = await ExpenseDAO.getExpenseById(id);

        res.json(expense);
    } catch (error) {
        throw new AppError(`No se pudo obtener el gasto ${id}`, 500);
    }
}

const addExpense = async(req, res) => {
    try {
        const { name, amount, quoteDate, paid, userId, countId } = req.body;

        if(!name || !amount || !quoteDate || paid === undefined || !userId) {
            throw new AppError('Faltan campos para llenar', 500);
        }

        const expense = {
            name: name,
            amount: amount,
            quoteDate: quoteDate,
            paid: paid,
            userId,
            countId
        }

        await ExpenseDAO.createExpense(userId, countId, expense);
        res.json(expense);
    } catch (error) {
        throw new AppError('No se pudo agregar el gasto' + error.message, 500);
    }
}

const updateExpense = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, amount, quoteDate, paid } = req.body;

        if(!name, !amount, !quoteDate, !paid) {
            throw new AppError('Faltan campos para llenar', 500);
        }

        const expense = {
            name: name,
            amount: amount,
            quoteDate: quoteDate,
            paid: paid
        }

        await ExpenseDAO.updateExpense(expense);
        res.json(expense);
    } catch (error) {
        throw new AppError(`No se pudo actualizar el gasto ${id}`, 500);
    }
}

const deleteExpense = async(req, res) => {
    try {
        const { id } = req.params;
        const expense = await ExpenseDAO.getExpenseById(id);

        if(!expense) {
            throw new AppError('Gasto no encontrado', 404);
        }

        await ExpenseDAO.deleteExpense(id);
        res.status(200).json({ message: 'Gasto eliminado correctamente' });
    } catch (error) {
        throw new AppError(`No se pudo eliminar el gasto ${id}`, 500);
    }
}

const payExpense = async(req, res) => {
    try {
        const { id } = req.params;
        const expense = await ExpenseDAO.pagarExpense(id);

        if(!expense) {
            throw new AppError('Gasto no encontrado', 404);
        }

        res.status(200).json({ message: 'Gasto pagado correctamente' });
    } catch (error) {
        throw new AppError(`No se pudo pagar el gasto ${id}`, 500);
    }
}

module.exports = {
    getExpenses,
    getExpense,
    addExpense,
    updateExpense,
    deleteExpense,
    payExpense
}