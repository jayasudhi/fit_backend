const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const DailyTaskProgress=require('../models/Progress');

// Get tasks for a specific workout based on user's fitness goals
router.get('/workouts/:workoutId/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({
            workoutId: req.params.workoutId,
            userId: req.user._id,
            fitnessGoals: req.user.fitnessGoals // Filter by user's fitness goals
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// Create initial tasks for a new user
router.post('/tasks/initialize', auth, async (req, res) => {
    try {
        const { workoutId, workoutType } = req.body;
        const user = req.user;

        // Define tasks based on fitness goals
        const tasksByGoal = {
            'weight-loss': [
                {
                    name: 'High-Intensity Cardio',
                    description: '30 minutes of intense cardio to burn calories',
                    duration: '30 minutes',
                    intensity: 'High',
                    workoutType: 'Cardio'
                },
                {
                    name: 'Strength Training',
                    description: 'Focus on compound movements with moderate weights',
                    sets: 3,
                    reps: 12,
                    rest: '60 seconds',
                    workoutType: 'Strength'
                }
            ],
            'muscle-gain': [
                {
                    name: 'Heavy Lifting',
                    description: 'Focus on progressive overload with heavy weights',
                    sets: 4,
                    reps: 8,
                    rest: '90 seconds',
                    workoutType: 'Strength'
                },
                {
                    name: 'Protein-Rich Meal',
                    description: 'Consume protein-rich meal within 30 minutes of workout',
                    duration: '30 minutes',
                    workoutType: 'Nutrition'
                }
            ],
            'maintenance': [
                {
                    name: 'Balanced Workout',
                    description: 'Mix of cardio and strength training',
                    sets: 3,
                    reps: 10,
                    duration: '45 minutes',
                    workoutType: 'Mixed'
                }
            ],
            'general-fitness': [
                {
                    name: 'Full Body Workout',
                    description: 'Complete body workout focusing on all major muscle groups',
                    sets: 3,
                    reps: 12,
                    duration: '40 minutes',
                    workoutType: 'Mixed'
                }
            ]
        };

        // Create tasks based on user's fitness goal
        const tasks = tasksByGoal[user.fitnessGoals].map(taskData => ({
            ...taskData,
            workoutId,
            userId: user._id,
            fitnessGoals: user.fitnessGoals
        }));

        await Task.insertMany(tasks);
        res.status(201).json({ message: 'Tasks initialized successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing tasks' });
    }
});

// Toggle task completion status
router.patch('/tasks/:taskId/toggle', auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.taskId,
            userId: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.completed = !task.completed;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
});

// Create a new task
router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            userId: req.user._id,
            fitnessGoals: req.user.fitnessGoals
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error creating task' });
    }
});


// GET today's task status
router.get('/today', auth, async (req, res) => {
  const date = req.query.date;
  try {
    const progress = await DailyTaskProgress.findOne({
      userId: req.user._id,
      date,
    });

    res.json({ tasks: progress ? Object.fromEntries(progress.tasks) : {} });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch task progress' });
  }
});
//post
router.post('/progress', auth, async (req, res) => {
  try {
    const { taskId, date, completed } = req.body;

    const progress = new DailyTaskProgress({
      user: req.user._id,
      task: taskId,
      date,
      completed,
    });

    await progress.save();
    res.status(201).json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to store progress' });
  }
});
module.exports = router; 