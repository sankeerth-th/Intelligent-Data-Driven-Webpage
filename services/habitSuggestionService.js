const mongoose = require('mongoose');
const Habit = require('../models/habit');
const UserHabitData = require('../models/UserHabitData');

const habitsData = [
  // Fitness Habits
  {
    name: "Morning Stretch Routine",
    description: "Energize your day with a 10-minute stretching routine designed for flexibility and mobility.",
    category: "Fitness",
    tags: ["active", "quick"],
    timeRequirement: 10
  },
  {  
    name: "Daily Cardio Burst",
    description: "Get your heart pumping with 20 minutes of moderate-intensity cardio.",
    category: "Fitness",
    tags: ["active", "intense"],
    timeRequirement: 20
  },
  {
    name: "3 Strength Sessions",
    description: "Build strength and muscle with three full-body strength workouts per week.",
    category: "Fitness",
    tags: ["active", "long-term"],
    timeRequirement: 45
  },
  
  // Other Goal Categories
  {
    name: "Meditate for 10",
    description: "Cultivate mindfulness with 10 minutes of guided meditation.",
    category: "Mindfulness",
    tags: ["calm", "quick"],
    timeRequirement: 10
  },
  {
    name: "Journal Reflections",
    description: "Capture your thoughts and feelings in a daily journal entry.",
    category: "Wellbeing",
    tags: ["reflective", "daily"],
    timeRequirement: 15
  },
  {
    name: "Tech-Free Hour",
    description: "Unplug and recharge with an hour away from screens before bed.",
    category: "Wellbeing",
    tags: ["unplug", "nightly"],
    timeRequirement: 60
  },
  {
    name: "Creative Spark",
    description: "Spend 30 minutes expressing yourself creatively: writing, drawing, music, etc.",
    category: "Creativity",
    tags: ["creative", "flexible"],
    timeRequirement: 30
  }
];

const generatePersonalizedHabits = async (userInput) => {
  const { goals, lifestyle, pastChallenges } = userInput;
  try {
    // Fetch all habits that match the user's goals
    let suggestedHabits = habitsData.filter(habit => goals.includes(habit.category));

    // Refine suggestions based on more sophisticated criteria
    suggestedHabits = suggestedHabits.filter(habit => {
      // Check if the habit matches the user's lifestyle
      if (lifestyle === 'Active' && !habit.tags.includes('active')) {
        return false;
      }
      // Avoid habits that require significant time commitment if the user has had past challenges with 'Time management'
      if (pastChallenges.includes('Time management') && habit.timeRequirement > 30) {
        return false;
      }
      return true;
    });

    console.log(`Found ${suggestedHabits.length} habits matching the user's input after sophisticated refinement.`);
    return suggestedHabits;
  } catch (error) {
    console.error('Error generating personalized habits:', error.message);
    console.error(error.stack);
    throw new Error('Failed to generate personalized habits.');
  }
};

const refineSuggestionsWithUserData = async (userId, suggestedHabits) => {
  const userHabitData = await UserHabitData.find({ userId });
  const refinedSuggestions = suggestedHabits.filter(suggestedHabit => {
    const userHabit = userHabitData.find(uhd => uhd.habitId.toString() === suggestedHabit._id.toString());
    // Logic to refine suggestions based on user habit data
    // For example, prioritize habits not frequently failed
    if (userHabit) {
      const failedRatio = userHabit.failedDates.length / (userHabit.completedDates.length + userHabit.failedDates.length);
      return failedRatio < 0.5; // Example condition, customize as needed
    }
    return true;
  });

  console.log(`Refined ${suggestedHabits.length} to ${refinedSuggestions.length} habits based on user data.`);
  return refinedSuggestions;
};

module.exports = { generatePersonalizedHabits, refineSuggestionsWithUserData };