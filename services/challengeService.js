const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');

const generateChallengeForHabit = async (habitId) => {
  try {
    // Ensure habitId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(habitId)) {
      throw new Error('Invalid habitId provided.');
    }
    const challenges = await Challenge.find({ associatedHabit: new mongoose.Types.ObjectId(habitId) });
    if (challenges.length === 0) {
      console.log('No challenges found for this habit:', habitId);
      throw new Error('No challenges found for this habit.');
    }
    // Select a random challenge
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const selectedChallenge = challenges[randomIndex];
    console.log(`Challenge selected for habit ${habitId}: ${selectedChallenge.name}`);
    return selectedChallenge;
  } catch (error) {
    console.error('Error in generateChallengeForHabit:', error.message, error.stack);
    throw error;
  }
};

module.exports = { generateChallengeForHabit };