const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlan');

// GET all plans
router.get('/', async (req, res) => {
  try {
    const plans = await WorkoutPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single plan by ID
router.get('/:id', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new plan
router.post('/', async (req, res) => {
  const { name, description, imageUrl, workouts } = req.body;
  const newPlan = new WorkoutPlan({ name, description, imageUrl, workouts });
  try {
    const saved = await newPlan.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
