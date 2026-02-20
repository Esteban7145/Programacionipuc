const { getDashboardStats } = require('../services/dashboardService');

const getDashboard = async (req, res) => {
  const data = await getDashboardStats();
  res.json(data);
};

module.exports = { getDashboard };
