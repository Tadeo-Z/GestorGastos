const { AppError } = require('../util/AppError');
const UserGroupDAO = require('../dataAccess/userGroupDAO');

const getUserGroups = async(req, res) => {
    try {
        const userGroups = await UserGroupDAO.getAllUserGroups();
        res.json(userGroups.map(userGroup => userGroup.toJSON()));
    } catch (error) {
        throw new AppError('No se pudieron obtener los grupos con usuarios', 500);
    }
}

const getUserGroup = async(req, res) => {
    try {
        const { id } = req.params;
        const userGroup = await UserGroupDAO.getUserGroupsById(id);

        res.json(userGroup);
    } catch (error) {
        throw new AppError(`No se pudo obtener el grupo con usuarios ${id}`, 500);
    }
}

const getUserGroupUser = async(req, res) => {
    try {
        const { id } = req.params;
        const userGroup = await UserGroupDAO.getUserGroupsByUserId(id);

        res.json(userGroup);
    } catch (error) {
        throw new AppError(`No se pudo obtener el grupo con usuarios con usuario ${id}`, 500);
    }
}

const getUserGroupGroup = async(req, res) => {
    try {
        const { id } = req.params;
        const userGroup = await UserGroupDAO.getUserGroupsByGroupId(id);

        res.json(userGroup);
    } catch (error) {
        throw new AppError(`No se pudo obtener el grupo con usuarios con grupo ${id}`, 500);
    }
}

const addUserGroup = async(req, res) => {
    try {
        const { entryDate, rol, userId, groupId } = req.body;

        if(!entryDate || !rol || !userId || !groupId) {
            throw new AppError('Faltan campos que llenar', 500);
        }

        const userGroup = {
            entryDate: entryDate,
            rol: rol,
            userId: userId,
            groupId: groupId
        }

        await UserGroupDAO.createUserGroup(userId, groupId, userGroup);
        res.json(userGroup);
    } catch (error) {
        throw new AppError('No se pudo agregar el grupo con usuarios' + error.message, 500);
    }
}

const updateUserGroup = async(req, res) => {
    try {
        const { id } = req.params;
        const { entryDate, rol } = req.body;

        if(!entryDate || !rol) {
            throw new AppError('Faltan campos que llenar', 500);
        }

        const userGroup = {
            entryDate: entryDate,
            rol: rol
        }

        await UserGroupDAO.updateUserGroup(id, userGroup);
        res.json(userGroup);
    } catch (error) {
        throw new AppError(`No se pudo actualizar el grupo con usuarios ${id}`, 500);
    }
}

const deleteUserGroup = async(req, res) => {
    try {
        const { id } = req.params;
        const userGroup = await UserGroupDAO.getUserGroupsById(id);

        if(!userGroup) {
            throw new AppError('Grupo con usuarios no encontrado', 404);
        }

        await UserGroupDAO.deleteUserGroup(id);
        res.status(200).json({ message: 'Grupo con usuarios eliminado' });
    } catch (error) {
        throw new AppError(`No se pudo eliminar el grupo con usuarios ${id}`, 500);
    }
}

module.exports = {
    getUserGroups,
    getUserGroup,
    getUserGroupUser,
    getUserGroupGroup,
    addUserGroup,
    updateUserGroup,
    deleteUserGroup
}