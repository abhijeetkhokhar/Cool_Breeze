const express = require('express');
const router = express.Router();
const {
  getUsers,
  getRiders,
  updateUserProfile,
  addApprovedEmail,
  getApprovedEmails,
  deleteApprovedEmail
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', protect, admin, getUsers);

// @route   GET /api/users/riders
// @desc    Get all riders
// @access  Private/Admin


// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateUserProfile);

// @route   POST /api/users/approved-emails
// @desc    Add an approved email
// @access  Private/Admin
router.post('/approved-emails', protect, admin, addApprovedEmail);

// @route   GET /api/users/approved-emails
// @desc    Get all approved emails
// @access  Private/Admin
router.get('/approved-emails', protect, admin, getApprovedEmails);

// @route   DELETE /api/users/approved-emails/:id
// @desc    Delete an approved email
// @access  Private/Admin
router.delete('/approved-emails/:id', protect, admin, deleteApprovedEmail);

module.exports = router;
