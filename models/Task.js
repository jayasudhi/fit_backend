const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Task name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Task description is required'],
        trim: true
    },
    workoutId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Workout ID is required'],
        ref: 'Workout'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
        ref: 'User'
    },
    completed: {
        type: Boolean,
        default: false
    },
    duration: {
        type: String,
        trim: true
    },
    sets: {
        type: Number
    },
    reps: {
        type: Number
    },
    rest: {
        type: String,
        trim: true
    },
    intensity: {
        type: String,
        enum: ['Low', 'Moderate', 'High'],
        default: 'Moderate'
    },
    fitnessGoals: {
        type: String,
        enum: ['weight-loss', 'muscle-gain', 'maintenance', 'general-fitness'],
        required: true
    },
    workoutType: {
        type: String,
        enum: ['Strength', 'Cardio', 'Flexibility', 'HIIT'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 

