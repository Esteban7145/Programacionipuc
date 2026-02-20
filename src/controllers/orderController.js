const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');

const generateOrderNumber = () => `AZ-${Date.now().toString().slice(-8)}`;

const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { customer, items } = req.body;

  const normalizedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || product.status !== 'active') {
      return res.status(400).json({ message: `Producto inválido: ${item.productId}` });
    }

    if (product.inventory < item.quantity) {
      return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
    }

    product.inventory -= item.quantity;
    product.soldCount += item.quantity;
    if (product.inventory === 0) product.status = 'inactive';
    await product.save();

    subtotal += product.price * item.quantity;

    normalizedItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: product.images[0] || ''
    });
  }

  const shipping = subtotal > 200 ? 0 : 12;
  const total = subtotal + shipping;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customer,
    items: normalizedItems,
    subtotal,
    shipping,
    total,
    paymentStatus: 'simulated_pending'
  });

  res.status(201).json(order);
};

const getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

module.exports = {
  createOrder,
  getOrders
};
