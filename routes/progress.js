const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const authenticate = require('../middleware/auth'); // if using auth

// Save or update progress
router.post('/update', authenticate, async (req, res) => {
  const { taskId, date, status, note } = req.body;
  const userId = req.user.id;

  try {
    let progress = await Progress.findOne({ userId, taskId, date });

    if (progress) {
      // Update existing
      progress.status = status;
      progress.note = note;
      progress.timestamp = new Date();
      await progress.save();
    } else {
      // Create new
      progress = new Progress({
        userId,
        taskId,
        date,
        status,
        note
      });
      await progress.save();
    }

    res.status(200).json({ message: 'Progress saved successfully', progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error saving progress' });
  }
});

module.exports = router;
