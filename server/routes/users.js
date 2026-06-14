const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile (current user)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update budget
router.put('/me/budget', auth, async (req, res) => {
  try {
    const { weeklyBudget } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { weeklyBudget },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile (name and pfp)
router.put('/me/profile', auth, async (req, res) => {
  try {
    const { name, pfp } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, pfp },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
