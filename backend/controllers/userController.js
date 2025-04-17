const User = require('../models/userModel');
const ApprovedEmail = require('../models/approvedEmailModel');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all riders
// @route   GET /api/users/riders
// @access  Private/Admin
const getRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' }).select('-password');
    res.json(riders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.address) {
        user.address = {
          street: req.body.address.street || user.address?.street,
          city: req.body.address.city || user.address?.city,
          state: req.body.address.state || user.address?.state,
          zipCode: req.body.address.zipCode || user.address?.zipCode,
          country: req.body.address.country || user.address?.country
        };
      }
      
      user.phone = req.body.phone || user.phone;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        phone: updatedUser.phone
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add approved email
// @route   POST /api/users/approved-emails
// @access  Private/Admin
const addApprovedEmail = async (req, res) => {
  try {
    const { email, role } = req.body;

    // Check if email already exists
    const existingEmail = await ApprovedEmail.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already approved' });
    }

    const approvedEmail = new ApprovedEmail({
      email,
      role: role || 'customer'
    });

    const savedEmail = await approvedEmail.save();
    res.status(201).json(savedEmail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all approved emails
// @route   GET /api/users/approved-emails
// @access  Private/Admin
const getApprovedEmails = async (req, res) => {
  try {
    const approvedEmails = await ApprovedEmail.find({});
    res.json(approvedEmails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete approved email
// @route   DELETE /api/users/approved-emails/:id
// @access  Private/Admin
const deleteApprovedEmail = async (req, res) => {
  try {
    const approvedEmail = await ApprovedEmail.findById(req.params.id);
    
    if (approvedEmail) {
      await approvedEmail.remove();
      res.json({ message: 'Approved email removed' });
    } else {
      res.status(404).json({ message: 'Approved email not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getUsers,
  getRiders,
  updateUserProfile,
  addApprovedEmail,
  getApprovedEmails,
  deleteApprovedEmail
};
