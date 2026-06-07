// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');
// require('dotenv').config();

// const app = express();

// app.use(cors({
//     origin: ['http://localhost:3000', 'https://your-frontend.vercel.app'],
//     credentials: true
// }));

// app.use(express.json());


// mongoose.connect(process.env.MONGODB_URI)
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));


// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', require('./routes/tasks'));
// app.use('/api/progress', require('./routes/progress'));

// app.get('/', (req, res) => {
//     res.send('API is running...');
// });


// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// CORS

app.use(cors({
  origin: [
    "https://fit-frontend-4wmt.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/progress', require('./routes/progress'));

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: 'Something went wrong!'
    });
});

// PORT
const PORT = process.env.PORT || 5000;

// MongoDB Connection + Start Server
mongoose.connect(process.env.MONGODB_URI)
.then(() => {

    console.log('MongoDB connected');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

})
.catch((err) => {

    console.error('MongoDB connection failed');
    console.error(err);

});