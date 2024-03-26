const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/api/progress', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId; // Assumes user session is set after isAuthenticated middleware
    const progressData = await Progress.find({ userId }).populate('habitId');
    console.log(`Fetched progress data for user ID: ${userId}`);
    res.json(progressData);
  } catch (error) {
    console.error('Error fetching progress data:', error.message);
    console.error(error.stack);
    res.status(500).send('Server error retrieving progress data.');
  }
});

module.exports = router;