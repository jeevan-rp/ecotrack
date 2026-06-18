const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  category: { type: String, enum: ['transport', 'diet', 'energy', 'shopping'], required: true, index: true },
  co2Impact: { type: Number, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  date: { type: Date, default: Date.now, index: true },
  description: { type: String }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
