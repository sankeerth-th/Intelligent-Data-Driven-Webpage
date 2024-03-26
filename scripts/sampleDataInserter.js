require('dotenv').config(); // Ensuring environment variables are loaded
const mongoose = require('mongoose');
const Habit = require('../models/habit');
const Progress = require('../models/Progress');
const User = require('../models/User');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected for sample data insertion'))
  .catch(err => console.error('MongoDB connection error:', err));

const sampleHabits = [
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
  }
];

const insertSampleData = async () => {
  try {
    const habitsCount = await Habit.countDocuments();
    const progressCount = await Progress.countDocuments();

    if (habitsCount === 0) {
      console.log('Inserting sample habits...');
      await Habit.insertMany(sampleHabits);
      console.log('Sample habits inserted successfully.');
    } else {
      console.log('Habits collection already has data. Skipping habit insertion.');
    }

    if (progressCount === 0) {
      console.log('Inserting sample progress...');
      const user = await User.findOne(); // Assuming there's at least one user in the database
      if (!user) {
        console.error('No users found in the database. Cannot insert sample progress.');
        return;
      }
      const habits = await Habit.find();
      const sampleProgress = habits.map(habit => ({
        userId: user._id,
        habitId: habit._id,
        datesCompleted: [new Date()],
        streaks: Math.floor(Math.random() * 10) + 1
      }));
      await Progress.insertMany(sampleProgress);
      console.log('Sample progress inserted successfully.');
    } else {
      console.log('Progress collection already has data. Skipping progress insertion.');
    }
  } catch (err) {
    console.error('Error inserting sample data:', err.message);
    console.error(err.stack);
  } finally {
    mongoose.disconnect().then(() => console.log('MongoDB disconnected after sample data insertion'));
  }
};

insertSampleData();