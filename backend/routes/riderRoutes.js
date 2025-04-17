const express = require('express');
const router = express.Router();
const { protect, rider } = require('../middlewares/authMiddleware');
const { getRiderOrders } = require('../controllers/orderController');

// @route   GET /api/riders/orders
// @desc    Get orders assigned to rider
// @access  Private/Rider
router.get('/orders', protect, rider, getRiderOrders);

module.exports = router;
