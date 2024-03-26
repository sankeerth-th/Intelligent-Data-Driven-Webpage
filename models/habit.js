const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }], // Array of strings to represent various tags associated with the habit
  timeRequirement: { type: Number, required: true } // Time requirement in minutes for the habit
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;