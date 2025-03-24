const { AppError } = require('../util/AppError');
const CountDAO = require('../dataAccess/CountDAO');

const getCounts = async(req, res) => {
    try {
        const counts = await CountDAO.getAllGroups();
        res.json(counts.map(count => count.toJSON()));
    } catch (error) {
        throw new AppError('No se pudieron obtener las cuentas', 500);
    }
}

const getCount = async(req, res) => {
    try {
        const { id } = req.params;
        const count = await CountDAO.getCountById(id);

        res.json(count);
    } catch (error) {
        throw new AppError('No se pudo obtener la cuenta', 500);
    }
}

const addCount = async(req, res) => {
    try {
        const { total, startDate, endDate } = req.body;

        if(!total, !startDate ) {
            throw new AppError('Faltan campos para llenar', 500);
        }

        const count = {
            total: total,
            startDate: startDate,
            endDate: endDate
        }

        await CountDAO.createCount(count);
        res.json(count);
    } catch (error) {
        throw new AppError('No se pudo agregar la cuenta', 500);
    }
}

const updateCount = async(req, res) => {
    try {
        const { id } = req.params;
        const { total, startDate, endDate } = req.body;

        if(!total, !startDate ) {
            throw new AppError('Faltan campos para llenar', 500);
        }

        const count = {
            total: total,
            startDate: startDate,
            endDate: endDate
        }

        await CountDAO.updateCount(id, count);
        res.json(count);
    } catch (error) {
        throw new AppError(`No se pudo actualizar la cuenta ${id}`, 500);
    }
}

const deleteCount = async(req, res) => {
    try {
        const { id } = req.params;
        const count = await CountDAO.getCountById(id);

        if(!count) {
            throw new AppError('Cuenta no encontrada', 404);
        }

        await CountDAO.deleteCount(id);
        res.status(200).json({ message: 'Cuenta eliminada correctamente' });
    } catch (error) {
        throw new AppError(`No se pudo eliminar la cuenta ${id}`, 500);
    }
}

module.exports = {
    getCounts,
    getCount,
    addCount,
    updateCount,
    deleteCount
}