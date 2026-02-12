const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');
const MovieStat = require('./models/MovieStat'); 
const authRoutes = require('./routes/auth');

require('dotenv').config(); 
connectDB();

const app = express();
app.use(cors()); 
app.use(express.json()); 

// TMDB API Key handling
const TMDB_KEY = process.env.TMDB_API_KEY || 'e8bb53615fb9f3fd95d776ecb199bb5';

// --- API ROUTES ---

// 1. Search Route (New Fix)
app.get('/api/movies/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ error: "Query is required" });

        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&region=IN`
        );
        res.json(response.data); 
    } catch (error) {
        console.error("Search Error:", error.message);
        res.status(500).json({ error: "Search failed" });
    }
});

// 2. Popular Movies
app.get('/api/movies/popular', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&region=IN`);
        res.json(response.data);
    } catch (error) { res.status(500).json({ error: "Fetch failed" }); }
});

// 3. Top 10 Trending
app.get('/api/movies/top10', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_KEY}`);
        res.json(response.data.results.slice(0, 10));
    } catch (err) { res.status(500).send("Error fetching top 10"); }
});

// 4. Trailer Route
app.get('/api/movies/trailer/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}/videos?api_key=${TMDB_KEY}`);
        res.json(response.data);
    } catch (error) { res.status(500).json({ error: "Trailer failed" }); }
});

// 5. Views & Rating (Stats)
app.post('/api/movies/view/:id', async (req, res) => {
    try {
        const stats = await MovieStat.findOneAndUpdate(
            { movieId: req.params.id },
            { $inc: { views: 1 } },
            { upsert: true, returnDocument: 'after' } // Updated 'new' to 'returnDocument'
        );
        res.json(stats);
    } catch (err) { res.status(500).send("Error updating views"); }
});

app.post('/api/movies/rate/:id', async (req, res) => {
    try {
        const { rating } = req.body;
        const stats = await MovieStat.findOneAndUpdate(
            { movieId: req.params.id },
            { $inc: { totalRating: rating, numberOfRatings: 1 } },
            { upsert: true, returnDocument: 'after' }
        );
        res.json(stats);
    } catch (err) { res.status(500).send("Rating update failed"); }
});

app.use('/api/auth', authRoutes);
app.get('/', (req, res) => res.send('StreamSasta Backend Running! 🚀'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));