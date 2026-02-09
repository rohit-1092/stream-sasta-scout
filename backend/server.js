const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const Platform = require('./models/Platform');
const authRoutes = require('./routes/auth'); // 1. Auth routes ko import kiya

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- Middleware ---
app.use(cors()); 
app.use(express.json()); 

// --- API Routes ---

// 1. Home Route
app.get('/', (req, res) => {
    res.send('StreamSasta Backend is Running! 🚀');
});

// 2. Authentication Routes (OTP, Login, Register)
// Ab aapka URL hoga: http://localhost:5000/api/auth/send-otp
app.use('/api/auth', authRoutes); 

// 3. Platform Routes (Aapka purana kaam)
app.get('/api/platforms', async (req, res) => {
    try {
        const platforms = await Platform.find();
        res.json(platforms);
    } catch (err) {
        console.error("Error fetching platforms:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// --- Port Setup ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});