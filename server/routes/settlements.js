const express = require('express');
const router = express.Router();
const settlementController = require('../controllers/settlementController');
const protect = require('../middleware/auth');

router.use(protect);

router.get('/history/:groupId', settlementController.history);
router.post('/:groupId', settlementController.calculateSettlement);
router.put('/:settlementId/pay', settlementController.markAsPaid);

module.exports = router;