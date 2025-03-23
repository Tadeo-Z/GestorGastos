const express = require('express');
const router = express.Router();
const countController = require('../controllers/countController');
const auth = require('../util/auth');

router.get('/', countController.getCounts);
router.get('/:id', countController.getCount);
router.post('/', countController.addCount);
router.put('/:id', countController.updateCount);
router.delete('/:id', countController.deleteCount);

module.exports = router;