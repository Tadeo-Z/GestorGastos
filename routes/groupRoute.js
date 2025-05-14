const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { auth } = require('../util/auth');

router.get('/', auth, groupController.getGroupsByUser);

module.exports = router;