const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../util/auth');

router.get('/', expenseController.getExpenses);
router.get('/user/:userId', expenseController.getExpensesByUserId);
router.get('/:id', expenseController.getExpense);
router.post('/', expenseController.addExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);
router.patch('/:id/pay', expenseController.payExpense);

module.exports = router;