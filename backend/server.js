const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');
const Platform = require('./models/Platform');
const MovieStat = require('./models/MovieStat'); // Model import
const authRoutes = require('./routes/auth');

require('dotenv').config(); 
connectDB();

const app = express();
app.use(cors()); 
app.use(express.json()); 

const TMDB_KEY = process.env.TMDB_API_KEY || 'e8bb53615fb9f3fd95d776ecb199bb5';

// API Routes
app.get('/', (req, res) => res.send('StreamSasta Backend Running! 🚀'));
app.use('/api/auth', authRoutes); 

// --- VIEWS, RATING & TOP 10 ROUTES ---

// View badhane ka route
app.post('/api/movies/view/:id', async (req, res) => {
    try {
        const stats = await MovieStat.findOneAndUpdate(
            { movieId: req.params.id },
            { $inc: { views: 1 } },
            { upsert: true, new: true }
        );
        res.json(stats);
    } catch (err) { res.status(500).send("Error updating views"); }
});

// Rating update karne ka route
app.post('/api/movies/rate/:id', async (req, res) => {
    try {
        const { rating } = req.body;
        const stats = await MovieStat.findOneAndUpdate(
            { movieId: req.params.id },
            { $inc: { totalRating: rating, numberOfRatings: 1 } },
            { upsert: true, new: true }
        );
        res.json(stats);
    } catch (err) { res.status(500).send("Rating update failed"); }
});

// Top 10 Movies route
app.get('/api/movies/top10', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_KEY}`);
        res.json(response.data.results.slice(0, 10));
    } catch (err) { res.status(500).send("Error fetching top 10"); }
});

// TMDB Proxy Routes (ISP Bypass)
app.get('/api/movies/popular', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&region=IN`);
        res.json(response.data);
    } catch (error) { res.status(500).json({ error: "Fetch failed" }); }
});

app.get('/api/movies/trailer/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/videos?api_key=${TMDB_KEY}`);
        res.json(response.data);
    } catch (error) { res.status(500).json({ error: "Trailer failed" }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));