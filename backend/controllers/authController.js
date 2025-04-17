const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ApprovedEmail = require('../models/approvedEmailModel');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email_verified, name, email, picture } = ticket.getPayload();
    
    if (!email_verified) {
      return res.status(400).json({ message: 'Email not verified with Google' });
    }
    
    // Allow any email to log in (remove approved list check)
    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user, default role is 'rider'
      user = await User.create({
        name,
        email,
        googleId: ticket.getUserId(),
        role: 'rider',
        isApproved: true
      });
    } else {
      // Update existing user if needed
      if (!user.googleId) {
        user.googleId = ticket.getUserId();
        await user.save();
      }
      
      // Ensure user is approved
      if (!user.isApproved) {
        user.isApproved = true;
        await user.save();
      }
    }
    
    // Return user data and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { googleLogin, getUserProfile };
