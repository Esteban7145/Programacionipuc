const Product = require('../models/Product');
const Order = require('../models/Order');

const getDashboardStats = async () => {
  const [orders, topProducts, lowStock] = await Promise.all([
    Order.find(),
    Product.find().sort({ soldCount: -1 }).limit(5),
    Product.find({ inventory: { $lt: 5 } }).sort({ inventory: 1 })
  ]);

  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);

  return {
    totalSales,
    ordersCount: orders.length,
    topProducts,
    lowStock
  };
};

module.exports = { getDashboardStats };
