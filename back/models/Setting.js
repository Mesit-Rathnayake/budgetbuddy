const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed }
});

// ensure uniqueness per user+key when user exists
settingSchema.index({ user: 1, key: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Setting', settingSchema);
