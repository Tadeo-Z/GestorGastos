const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { auth } = require('../util/auth');

router.get('/', auth, groupController.getGroups);
router.get('/:id', auth, groupController.getGroup);
router.post('/', auth, groupController.addGroup);
router.put('/:id', auth, groupController.updateGroup);
router.delete('/:id', auth, groupController.deleteGroup);

module.exports = router;