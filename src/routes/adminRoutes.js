const express = require('express');
const { getDashboard } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protectAdmin, getDashboard);

module.exports = router;
