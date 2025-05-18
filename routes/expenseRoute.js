const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { auth } = require('../util/auth');

router.get('/', auth, expenseController.getExpenses);
router.get('/user/:userId', auth, expenseController.getExpensesByUserId);
router.get('/:id', auth, expenseController.getExpense);
router.post('/', auth, expenseController.addExpense);
router.put('/:id', auth, expenseController.updateExpense);
router.delete('/:id', auth, expenseController.deleteExpense);
router.patch('/:id/pay', auth, expenseController.payExpense);

module.exports = router;