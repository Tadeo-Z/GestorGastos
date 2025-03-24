const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../util/auth');

router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroup);
router.post('/', groupController.addGroup);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;