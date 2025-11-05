const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/authMiddleware');

// all transaction routes require authentication
router.use(auth);

router.get('/', transactionController.listTransactions);
router.post('/', transactionController.createTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.put('/:id', transactionController.updateTransaction);

module.exports = router;
