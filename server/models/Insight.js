const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  periodStart: { type: Date },
  periodEnd: { type: Date },
  trendSummary: { type: String },
  geminiAnalogy: { type: String },
  actionableTip: { type: String },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Insight', insightSchema);
