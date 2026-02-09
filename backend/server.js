const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Platform = require('./models/Platform');
const authRoutes = require('./routes/auth');

// 1. Dotenv ko sabse upar aur sahi se load karein
require('dotenv').config(); 

// 2. Database connect karein
connectDB();

const app = express();

// 3. Middleware setup
app.use(cors()); 
app.use(express.json()); 

// 4. API Routes
app.get('/', (req, res) => {
    res.send('StreamSasta Backend is Running! 🚀');
});

app.use('/api/auth', authRoutes); 

app.get('/api/platforms', async (req, res) => {
    try {
        const platforms = await Platform.find();
        res.json(platforms);
    } catch (err) {
        console.error("Error fetching platforms:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// 5. Port Setup (Render automatically sets process.env.PORT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});