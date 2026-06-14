const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  authProviderId: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  pfp: { type: String }, // Profile picture (base64 or URL)
  baselineFootprint: { type: Number, default: 0 },
  weeklyBudget: { type: Number, default: 50 },
  badges: { type: [String], default: [] },
  currentStreak: { type: Number, default: 0 },
  lastLogDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
