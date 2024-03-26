const mongoose = require('mongoose');

const motivationMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  milestone: { type: String, required: true }
});

const MotivationMessage = mongoose.model('MotivationMessage', motivationMessageSchema);

module.exports = MotivationMessage;