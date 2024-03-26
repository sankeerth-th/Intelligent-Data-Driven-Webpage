const mongoose = require('mongoose');

const userHabitDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  completedDates: [{ type: Date }],
  failedDates: [{ type: Date }]
});

const UserHabitData = mongoose.model('UserHabitData', userHabitDataSchema);

module.exports = UserHabitData;