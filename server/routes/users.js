const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get or create user profile
router.post('/sync', async (req, res) => {
  try {
    const { authProviderId, email, name } = req.body;
    let user = await User.findOne({ authProviderId });
    if (!user) {
      user = new User({ authProviderId, email, name });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/:authProviderId', async (req, res) => {
  try {
    const user = await User.findOne({ authProviderId: req.params.authProviderId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update budget
router.put('/:authProviderId/budget', async (req, res) => {
  try {
    const { weeklyBudget } = req.body;
    const user = await User.findOneAndUpdate(
      { authProviderId: req.params.authProviderId },
      { weeklyBudget },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile (name and pfp)
router.put('/:authProviderId/profile', async (req, res) => {
  try {
    const { name, pfp } = req.body;
    const user = await User.findOneAndUpdate(
      { authProviderId: req.params.authProviderId },
      { name, pfp },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
