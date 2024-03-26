const express = require('express');
const { generatePersonalizedHabits, refineSuggestionsWithUserData } = require('../services/habitSuggestionService');
const Habit = require('../models/habit');
const { isAuthenticated } = require('./middleware/authMiddleware'); // Import isAuthenticated middleware
const router = express.Router();

router.post('/api/suggest-habits', isAuthenticated, async (req, res) => { // isAuthenticated middleware applied
  try {
    const userId = req.session.userId;
    const userInput = req.body;
    let suggestedHabits = await generatePersonalizedHabits(userInput);
    suggestedHabits = await refineSuggestionsWithUserData(userId, suggestedHabits);
    console.log(`Suggested habits generated and refined for user input: ${JSON.stringify(userInput)}`);
    res.json(suggestedHabits);
  } catch (error) {
    console.error('Error suggesting habits:', error.message);
    console.error(error.stack);
    res.status(500).send('Error processing your request.');
  }
});

router.get('/habits', isAuthenticated, async (req, res) => { // isAuthenticated middleware applied
  try {
    const habits = await Habit.find({});
    console.log('Fetched all habits successfully.');
    res.render('habits', { habits });
  } catch (error) {
    console.error('Error fetching habits:', error.message);
    console.error(error.stack);
    res.status(500).send('Error processing your request for habits.');
  }
});

router.get('/habits/:habitId/challenges', isAuthenticated, async (req, res) => { // isAuthenticated middleware applied
  try {
    const { habitId } = req.params;
    console.log(`Fetching challenges for habit ID: ${habitId}`);
    res.render('habits/challenges', { habitId });
  } catch (error) {
    console.error('Error fetching challenges for habit:', error.message);
    console.error(error.stack);
    res.status(500).send('Error processing your request for challenges.');
  }
});

module.exports = router;