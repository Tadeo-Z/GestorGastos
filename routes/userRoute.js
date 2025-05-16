const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
console.log('Contenido de userController:', userController);

const { auth } = require('../util/auth');
console.log('auth:', auth); // Esto debe mostrar `[Function: auth]`
const { body, validationResult } = require('express-validator');

const validateUser = [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next({ errors: errors.array(), statusCode: 400 });
        }
        next();
    },
];

router.get('/', auth, userController.getUsers);
router.get('/:id', auth, userController.getUser);
router.post('/', validateUser, userController.registerUser); // Valida la entrada antes de crear el usuario
router.put('/:id', auth, validateUser, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);
router.post('/login', validateUser, userController.loginUser); // Valida login


module.exports = router;
console.log(userController);
