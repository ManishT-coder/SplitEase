const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/group/:groupId', expenseController.getGroupExpenses);
router.get('/summary/:groupId', expenseController.getExpenseSummary);

router.post(
  '/',
  validate({
    description: { required: true },
    amount: { required: true, type: 'number' },
    groupId: { required: true }
  }),
  expenseController.createExpense
);

router.put('/:expenseId', expenseController.updateExpense);
router.delete('/:expenseId', expenseController.deleteExpense);

module.exports = router;