const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/groups', require('./groups'));
router.use('/expenses', require('./expenses'));
router.use('/settle', require('./settlements'));
router.use('/users', require('./users'));

module.exports = router;