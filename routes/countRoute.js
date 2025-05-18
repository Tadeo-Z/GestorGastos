const express = require('express');
const router = express.Router();
const countController = require('../controllers/countController');
const { auth } = require('../util/auth');

router.get('/', auth, countController.getCounts);
router.get('/:id', auth, countController.getCount);
router.post('/', auth, countController.addCount);
router.put('/:id', auth, countController.updateCount);
router.delete('/:id', auth, countController.deleteCount);

module.exports = router;