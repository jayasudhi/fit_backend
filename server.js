const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// ✅ CORS (allow both local + deployed frontend)
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-frontend.vercel.app'],
    credentials: true
}));

app.use(express.json());

// ✅ MongoDB Connection (fixed env name)
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/progress', require('./routes/progress'));

// ✅ Test route (prevents "Cannot GET /")
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// ✅ FIXED PORT (this solves your error properly)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});