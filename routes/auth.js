const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// // Signup route
// router.post('/signup', async (req, res) => {
//     try {
//         const { name, email, password, age, weight, height, fitnessGoals } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists with this email' });
//         }

//         // Create new user
//         const user = new User({
//             name,
//             email,
//             password,
//             age,
//             weight,
//             height,
//             fitnessGoals
//         });

//         await user.save();

//         // Generate JWT token
//         const token = jwt.sign(
//             { userId: user._id },
//             process.env.JWT_SECRET || 'your-secret-key',
//             { expiresIn: '24h' }
//         );

//         // Send response without password
//         const userResponse = user.toObject();
//         delete userResponse.password;

//         res.status(201).json({
//             message: 'User created successfully',
//             token,
//             user: userResponse
//         });
//     } catch (error) {
//         console.error('Signup error:', error);
//         if (error.name === 'ValidationError') {
//             return res.status(400).json({
//                 message: 'Validation error',
//                 errors: Object.values(error.errors).map(err => err.message)
//             });
//         }
//         res.status(500).json({ message: 'Error creating user' });
//     }
// });

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, age, weight, height, fitnessGoals } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      age,
      weight,
      height,
      fitnessGoals
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = { message: error.errors[field].message };
      }
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Send response without password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            message: 'Login successful',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

module.exports = router; 