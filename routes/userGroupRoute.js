const express = require('express');
const router = express.Router();
const userGroupController = require('../controllers/userGroupController');
const { auth } = require('../util/auth'); // Middleware de autenticación

// Ruta para obtener los grupos del usuario autenticado
router.get('/', auth, userGroupController.getUserGroups);
router.get('/:id', userGroupController.getUserGroup);
router.get('/user/:id', userGroupController.getUserGroupUser);
router.get('/group/:id', userGroupController.getUserGroupGroup);
router.post('/', userGroupController.addUserGroup);
router.put('/:id', userGroupController.updateUserGroup);
router.delete('/:id', userGroupController.deleteUserGroup);

module.exports = router;