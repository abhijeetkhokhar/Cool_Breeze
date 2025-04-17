const express = require('express');
const router = express.Router();
const { googleLogin, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/auth/google
// @desc    Authenticate user with Google
// @access  Public
router.post('/google', googleLogin);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getUserProfile);

module.exports = router;
