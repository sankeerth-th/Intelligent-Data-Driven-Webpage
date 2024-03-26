const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  associatedHabit: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true }
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;