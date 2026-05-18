const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [13, 'Age must be at least 13'],
        max: [100, 'Age must be less than 100']
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [20, 'Weight must be at least 20 kg'],
        max: [300, 'Weight must be less than 300 kg']
    },
    height: {
        type: Number,
        required: [true, 'Height is required'],
        min: [100, 'Height must be at least 100 cm'],
        max: [250, 'Height must be less than 250 cm']
    },
    fitnessGoals: {
        type: String,
        required: [true, 'Fitness goal is required'],
 enum: ['weight-loss', 'muscle-gain', 'maintenance', 'general-fitness', 'flexibility']    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User; 