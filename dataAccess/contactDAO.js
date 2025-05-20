const Contact = require("../models/contact");
const User = require("../models/user");

class ContactDAO {
    static async getUserContacts(userId) {
        try {
            const contacts = await Contact.findAll({
                where: { userId },
                include: [
                    {
                        model: User,
                        as: "contact",
                        attributes: ["id", "name", "paternalSurname", "maternalSurname"],
                    },
                ],
            });

            return contacts
            .map(c => c.contact ? c.contact.toJSON() : null)
            .filter(c => c !== null);
        } catch (error) {
            console.error("Error obteniendo contactos: ", error);
            throw error;
        }
    }

    static async addContact(userId, contactId) {
        try {
            const exists = await Contact.findOne({
                where: { userId, contactId },
            });

            if (exists) {
                throw new Error("El contacto ya esta agregado");
            }

            return await Contact.create({ userId, contactId });
        } catch (error) {
            console.error("Error agregando contacto: ", error);
            throw error;
        }
    }

    static async deleteContact(userId, contactId) {
        try {
            const removed = await Contact.destroy({
                where: { userId, contactId },
            });

            if (removed === 0) {
                throw new Error("No se encontro el contacto para eliminar");
            }

            return removed;
        } catch (error) {
            console.error("Error eliminando contacto: ", error);
            throw error;
        }
    }
}

module.exports = ContactDAO;