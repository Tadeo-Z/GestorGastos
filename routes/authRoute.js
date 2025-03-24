const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para iniciar sesión y generar un token
router.post('/login', userController.loginUser);

module.exports = router;
