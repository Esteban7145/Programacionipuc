const express = require('express');
const { body } = require('express-validator');
const { createOrder, getOrders } = require('../controllers/orderController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  [
    body('customer.fullName').notEmpty(),
    body('customer.email').isEmail(),
    body('customer.phone').notEmpty(),
    body('customer.address').notEmpty(),
    body('items').isArray({ min: 1 })
  ],
  createOrder
);

router.get('/', protectAdmin, getOrders);

module.exports = router;
