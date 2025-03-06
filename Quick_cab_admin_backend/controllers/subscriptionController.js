const Subscription = require('../models/subscriptionModel');

// Create subscription
const createSubscription = async (req, res) => {
  try {
    const { duration, price } = req.body;

    // Basic validation
    if (!duration || !price) {
      return res.status(400).json({ 
        status: false, 
        error: 'Duration and price are required.' 
      });
    }

    const result = await Subscription.create({ duration, price });
    
    return res.status(201).json({ 
      status: true, 
      message: 'Subscription created successfully', 
      id: result.insertId 
    });
  } catch (err) {
    console.error('Create subscription error:', err);
    return res.status(500).json({ 
      status: false, 
      error: err.message 
    });
  }
};

// Update subscription
const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration, price } = req.body;

    // Validate input
    if (!duration || !price) {
      return res.status(400).json({ 
        status: false, 
        error: 'Duration and price are required.' 
      });
    }

    await Subscription.update(id, { duration, price });
    
    return res.status(200).json({ 
      status: true, 
      message: 'Subscription updated successfully' 
    });
  } catch (err) {
    console.error('Update subscription error:', err);
    
    if (err.message === 'Subscription not found.') {
      return res.status(404).json({ 
        status: false, 
        message: 'Subscription not found' 
      });
    }
    
    return res.status(500).json({ 
      status: false, 
      error: err.message 
    });
  }
};

// Delete subscription
const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    await Subscription.delete(id);
    
    return res.status(200).json({ 
      status: true, 
      message: 'Subscription deleted successfully' 
    });
  } catch (err) {
    console.error('Delete subscription error:', err);
    
    if (err.message === 'Subscription not found.') {
      return res.status(404).json({ 
        status: false, 
        message: 'Subscription not found' 
      });
    }
    
    return res.status(500).json({ 
      status: false, 
      error: err.message 
    });
  }
};

// Search subscriptions by column
const searchSubscription = async (req, res) => {
  try {
    const { column, value } = req.query;

    // Validate input
    if (!column || !value) {
      return res.status(400).json({ 
        status: false, 
        error: 'Column and value are required for search.' 
      });
    }

    // Validate column to prevent SQL injection
    const allowedColumns = ['id', 'duration', 'price', 'createdAt', 'updatedAt'];
    if (!allowedColumns.includes(column)) {
      return res.status(400).json({
        status: false,
        error: 'Invalid column name'
      });
    }

    const result = await Subscription.findByColumn(column, value);
    
    if (result.length === 0) {
      return res.status(404).json({ 
        status: false, 
        message: 'No subscriptions found' 
      });
    }

    return res.status(200).json({ 
      status: true, 
      message: 'Subscriptions found',
      data: result 
    });
  } catch (err) {
    console.error('Search subscription error:', err);
    return res.status(500).json({ 
      status: false, 
      error: err.message 
    });
  }
};

// Get all subscriptions with pagination
const getSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await Subscription.findAll(page, limit);
    
    return res.status(200).json({ 
      status: true, 
      message: 'Subscriptions retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (err) {
    console.error('Get subscriptions error:', err);
    return res.status(500).json({ 
      status: false, 
      error: err.message 
    });
  }
};

// Get subscription by ID
const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);
    
    return res.status(200).json({
      status: true,
      message: 'Subscription retrieved successfully',
      data: subscription
    });
  } catch (err) {
    console.error('Get subscription by ID error:', err);
    
    if (err.message === 'Subscription not found.') {
      return res.status(404).json({
        status: false,
        message: 'Subscription not found'
      });
    }
    
    return res.status(500).json({
      status: false,
      error: err.message
    });
  }
};

module.exports = { 
  createSubscription, 
  updateSubscription, 
  deleteSubscription, 
  searchSubscription, 
  getSubscriptions,
  getSubscriptionById
};