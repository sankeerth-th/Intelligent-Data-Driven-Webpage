const express = require('express');
const mongoose = require('mongoose');
const { generateChallengeForHabit } = require('../services/challengeService');
const { isAuthenticated } = require('./middleware/authMiddleware'); // Import isAuthenticated middleware
const router = express.Router();

router.get('/api/habit/:habitId/challenges', isAuthenticated, async (req, res) => { // isAuthenticated middleware applied
  try {
    const { habitId } = req.params;
    // Ensure habitId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(habitId)) {
      console.error(`Invalid habitId provided: ${habitId}`);
      return res.status(400).send('Invalid habit ID provided.');
    }
    const challenge = await generateChallengeForHabit(habitId);
    console.log(`Challenge fetched successfully for habit ID: ${habitId}`);
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge for habit:', error.message);
    console.error(error.stack);
    res.status(500).send('Error processing your request for challenges.');
  }
});

module.exports = router;