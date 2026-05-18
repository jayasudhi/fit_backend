const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // Format: "YYYY-MM-DD"
  tasks: {
    type: Map,
    of: String, // e.g., { "Drink Water": "completed" }
    required: true
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
