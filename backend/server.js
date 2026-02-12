const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Axios ko require karna zaroori hai
const connectDB = require('./config/db');
const Platform = require('./models/Platform');
const authRoutes = require('./routes/auth');

// 1. Dotenv load karein
require('dotenv').config(); 

// 2. Database connect karein
connectDB();

const app = express();

// 3. Middleware setup
app.use(cors()); 
app.use(express.json()); 

// TMDB API KEY (Ek hi jagah define karein taaki galti na ho)
const TMDB_KEY = process.env.TMDB_API_KEY || 'e8bb53615fb9f3fd95d776ecb199bb5';

// 4. API Routes

// Root Route
app.get('/', (req, res) => {
    res.send('StreamSasta Backend is Running! 🚀');
});

// Auth Routes
app.use('/api/auth', authRoutes); 

// --- TMDB PROXY ROUTES START ---

// A. Popular Movies Proxy
app.get('/api/movies/popular', async (req, res) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
            params: {
                api_key: TMDB_KEY,
                language: 'en-US',
                region: 'IN', // India specific movies ke liye
                page: 1
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Popular Fetch Error:", error.message);
        res.status(500).json({ error: "TMDB se data nahi mil raha" });
    }
});

// B. Search Movies Proxy (Dashboard search ke liye zaroori hai)
app.get('/api/movies/search', async (req, res) => {
    try {
        const query = req.query.query;
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: TMDB_KEY,
                query: query,
                language: 'en-US'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Search Error:", error.message);
        res.status(500).json({ error: "Search fail ho gaya" });
    }
});

// C. Movie Trailer Proxy (handlePreview function isi route ko call karega)
app.get('/api/movies/trailer/:id', async (req, res) => {
    try {
        const movie_id = req.params.id;
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/videos`, {
            params: {
                api_key: TMDB_KEY,
                language: 'en-US'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Trailer Error:", error.message);
        res.status(500).json({ error: "Trailer fetch fail ho gaya" });
    }
});

// --- TMDB PROXY ROUTES END ---

// Platforms Route
app.get('/api/platforms', async (req, res) => {
    try {
        const platforms = await Platform.find();
        res.json(platforms);
    } catch (err) {
        console.error("Error fetching platforms:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// 5. Port Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});