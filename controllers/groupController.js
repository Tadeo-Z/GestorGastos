const { AppError } = require('../util/AppError');
const GroupDAO = require('../dataAccess/groupDAO');
const { now } = require('sequelize/lib/utils');
const Group = require('../models/group');
const UserGroup = require('../models/userGroup');

const getGroups = async(req, res) => {
    try {
        const groups = await GroupDAO.getAllGroups();
        res.json(groups.map(group => group.toJSON()));
    } catch (error) {
        throw new AppError('No se pudieron obtener los grupos', 500);
    }
}

const getGroup = async(req, res) => {
    try {
        const { id } = req.params;
        const group = await GroupDAO.getGroupById(id);

        res.json(group);
    } catch (error) {
        throw new AppError(`No se pudo obtener el grupo ${id}`, 500);
    }
}

const addGroup = async(req, res) => {
    try {
        const { description, creationDate } = req.body;

        if(!description) {
            throw new AppError('Falta una descripción', 500);
        }else if(!creationDate) {
            creationDate = now();
        }

        const group = {
            description: description,
            creationDate: creationDate
        }

        await GroupDAO.createGroup(group);
        res.json(group);
    } catch (error) {
        throw new AppError('No se pudo agregar el grupo', 500);
    }
}

const updateGroup = async(req, res) => {
    try {
        const { id } = req.params;
        const { description, creationDate } = req.body;

        if(!description) {
            throw new AppError('Falta una descripción', 500);
        }else if(!creationDate) {
            creationDate = now();
        }

        const group = {
            description: description,
            creationDate: creationDate
        }

        await GroupDAO.updateGroup(id, group);
        res.json(group);
    } catch (error) {
        throw new AppError(`No se pudo actualizar el grupo ${id}`, 500);
    }
}

const deleteGroup = async(req, res) => {
    try {
        const { id } = req.params;
        const group = await GroupDAO.getGroupById(id);

        if(!group) {
            throw new AppError('Grupo no encontrado', 404);
        }

        await GroupDAO.deleteGroup(id);
        res.status(200).json({ message: 'Grupo eliminado correctamente' });
    } catch (error) {
        throw new AppError(`No se pudo eliminar el grupo ${id}`, 500);
    }
}

const getGroupsByUser = async (req, res, next) => {
    try {
        const userId = req.user.id; // ID del usuario autenticado

        // Obtener los grupos relacionados con el usuario
        const groups = await Group.findAll({
            include: {
                model: require('../models/user'),
                through: { where: { userId } },
                attributes: [] // No incluir datos del usuario
            }
        });

        res.status(200).json(groups);
    } catch (error) {
        next(new AppError('No se pudieron obtener los grupos', 500));
    }
};

module.exports = {
    getGroups,
    getGroup,
    addGroup,
    updateGroup,
    deleteGroup,
    getGroupsByUser
};