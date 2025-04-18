const Order = require('../models/orderModel');
const User = require('../models/userModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentResult
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // Create order object with basic info
    if (!req.user) {
      console.error('No user attached to request!');
      return res.status(401).json({ message: 'No user attached to request (authentication failed)' });
    }
    const orderData = {
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    };
    
    // If payment result is provided, update order status
    if (paymentResult && paymentResult.status === 'Paid') {
      orderData.paymentResult = paymentResult;
      orderData.isPaid = true;
      orderData.paidAt = Date.now();
      orderData.status = 'Paid';
    } else {
      orderData.status = 'Pending';
    }

    const order = new Order(orderData);
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: error.stack
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      ;

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: error.stack
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin or Rider
const updateOrderStatus = async (req, res) => {
  try {
    const { status, riderId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }



    // Update order status
    order.status = status;

    // Handle status-specific updates
    if (status === 'Paid' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
    } else if (status === 'Delivered' && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    

    const updatedOrder = await order.save();
    await updatedOrder.populate('user', 'name email');
    await updatedOrder;
    res.json(updatedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: error.stack
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      
      .sort('-createdAt');
    
    res.json(orders);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: error.stack
    });
  }
};

// @desc    Get rider orders
// @route   GET /api/orders/rider
// @access  Private/Rider
const getRiderOrders = async (req, res) => {
  try {
    // Public: return all orders that have a rider assigned
    const orders = await Order.find({ rider: { $exists: true, $ne: null } })
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get rider orders (PUBLIC, NO AUTH)
// @route   GET /api/rider/orders
// @access  Public
const getPublicRiderOrders = async (req, res) => {
  try {
    // For demo, return all orders with a rider assigned (or all orders)
    const orders = await Order.find({ rider: { $exists: true, $ne: null } })
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      
      .sort('-createdAt');
    
    res.json(orders);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      stack: error.stack
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getPublicRiderOrders,
  getOrders,
  getRiderOrders,
  getMyOrders
};
