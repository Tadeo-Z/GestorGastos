const { AppError } = require('../util/AppError');
const Contact = require('../models/contact');

const getContactsByUser = async (req, res, next) => {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        const contacts = await Contact.findAll({ where: { userId } });
        res.status(200).json(contacts.map(contact => ({
            id: contact.id,
            name: contact.name || contact.nombre, // Asegúrate de enviar la propiedad correcta
            email: contact.email,
            phone: contact.phone
        })));
    } catch (error) {
        next(new AppError('No se pudieron obtener los contactos', 500));
    }
};

const addContact = async (req, res, next) => {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        const { name, email, phone } = req.body;

        if (!name) {
            return next(new AppError('El nombre es obligatorio', 400));
        }

        const contact = await Contact.create({ name, email, phone, userId });
        res.status(201).json(contact);
    } catch (error) {
        next(new AppError('No se pudo agregar el contacto', 500));
    }
};

const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // ID del usuario autenticado

        const contact = await Contact.findOne({ where: { id, userId } });
        if (!contact) {
            return next(new AppError('Contacto no encontrado', 404));
        }

        await contact.destroy();
        res.status(204).send();
    } catch (error) {
        next(new AppError('No se pudo eliminar el contacto', 500));
    }
};

module.exports = {
    getContactsByUser,
    addContact,
    deleteContact
};