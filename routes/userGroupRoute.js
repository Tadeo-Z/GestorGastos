const express = require('express');
const router = express.Router();
const userGroupController = require('../controllers/userGroupController');
const { auth } = require('../util/auth');

router.get('/', auth, userGroupController.getUserGroups);
router.get('/:id', auth, userGroupController.getUserGroup);
router.get('/user/:id', auth, userGroupController.getUserGroupUser);
router.get('/group/:id', auth, userGroupController.getUserGroupGroup);
router.post('/', auth, userGroupController.addUserGroup);
router.put('/:id', auth, userGroupController.updateUserGroup);
router.delete('/:id', auth, userGroupController.deleteUserGroup);

module.exports = router;