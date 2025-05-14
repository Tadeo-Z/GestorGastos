const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { auth } = require('../util/auth');

router.get('/', auth, contactController.getContactsByUser); // Obtener contactos del usuario actual
router.post('/', auth, contactController.addContact); // Agregar un contacto
router.delete('/:id', auth, contactController.deleteContact); // Eliminar un contacto

module.exports = router;