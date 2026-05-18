const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const workoutPlanSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  workouts: [workoutSchema],
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
