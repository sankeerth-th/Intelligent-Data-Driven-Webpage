const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  datesCompleted: [{ type: Date }],
  streaks: { type: Number, default: 0 }
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;