const { AppError } = require("../util/AppError");
const ContactDAO = require("../dataAccess/contactDAO");
const UserDAO = require("../dataAccess/userDAO");

const getContacts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const contacts = await ContactDAO.getUserContacts(userId);
        res.status(200).json(contacts);
    } catch (error) {
        next(new AppError("No se pudieron obtener los contactos", 500));
    }
};

const addContact = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { contactName } = req.body;

        if (!contactName) {
            return next(new AppError("Falta el nombre del contacto", 400));
        }

        const userContact = await UserDAO.getUserByName(contactName);
        if (!userContact) {
            return next(new AppError("Usuario no encontrado", 404));
        }

        const newContact = await ContactDAO.addContact(userId, userContact.id);
        res.status(201).json(newContact);
    } catch (error) {
        next(new AppError("No se pudo agregar el contacto", 500));
    }
};

const deleteContact = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { contactName } = req.params;

        const userContact = await UserDAO.getUserByName(contactName);
        if (!userContact) {
            return next(new AppError("Usuario no encontrado", 404));
        }

        await ContactDAO.deleteContact(userId, userContact.id);
        res.status(204).send();
    } catch (error) {
        next(new AppError("No se pudo eliminar el contacto", 500));
    }
};

module.exports = {
    getContacts,
    addContact,
    deleteContact,
};