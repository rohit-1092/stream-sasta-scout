import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import MovieCard from "./MovieCard";
import VRCinema from "./VRCinema";

const Dashboard = ({ userEmail, onLogout }) => {
  const [movies, setMovies] = useState([]);
  const [top10, setTop10] = useState([]);
  const [vrVideoId, setVrVideoId] = useState(null);
  const [selectedMovieTitle, setSelectedMovieTitle] = useState("");
  const [movieStats, setMovieStats] = useState({});

  const BACKEND_URL = "https://stream-sasta-scout.onrender.com";

  const fetchData = async (query = "") => {
    try {
      let res;
      if (query && query.trim() !== "") {
        res = await axios.get(`${BACKEND_URL}/api/movies/search`, { params: { query } });
      } else {
        res = await axios.get(`${BACKEND_URL}/api/movies/popular`);
        const topRes = await axios.get(`${BACKEND_URL}/api/movies/top10`);
        setTop10(topRes.data || []);
      }
      const results = res.data.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);
      setMovies(results);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVRPreview = async (movie) => {
    try {
      // View count update logic
      const statsRes = await axios.post(`${BACKEND_URL}/api/movies/view/${movie.id}`);
      setMovieStats(prev => ({ ...prev, [movie.id]: { ...prev[movie.id], views: statsRes.data.views } }));

      // Trailer fetch logic
      const res = await axios.get(`${BACKEND_URL}/api/movies/trailer/${movie.id}`);
      const trailer = res.data.results.find(v => v.type === "Trailer" || v.type === "Teaser");
      
      if (trailer) {
        setVrVideoId(trailer.key);
        setSelectedMovieTitle(movie.title);
      } else {
        alert("VR Preview currently unavailable for this movie!");
      }
    } catch (e) {
      console.error("VR Preview Error:", e);
    }
  };

  const handleRate = async (id, val) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/movies/rate/${id}`, { rating: val });
      const avg = res.data.totalRating / res.data.numberOfRatings;
      setMovieStats(prev => ({ ...prev, [id]: { ...prev[id], avg: avg } }));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-[#0f1014] min-h-screen text-white font-sans overflow-x-hidden">
      <Navbar onSearch={(q) => fetchData(q)} onLogout={onLogout} userEmail={userEmail} />

      <main className="md:ml-20 pt-16 md:pt-6 pb-24 md:pb-6 transition-all duration-300">
        
        {/* Top 10 Trending Slider */}
        {top10.length > 0 && movies.length >= 20 && (
          <div className="px-6 py-4">
            <h2 className="text-[#38bdf8] text-xl font-bold mb-4 flex items-center gap-2">🔥 Top 10 Trending</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
              {top10.map((m) => (
                <div key={m.id} className="flex-none transition-transform hover:scale-105">
                  <img 
                    onClick={() => handleVRPreview(m)} 
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} 
                    className="h-44 md:h-52 rounded-xl cursor-pointer border-2 border-gray-800 hover:border-[#38bdf8]" 
                    alt={m.title} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responsive Movie Grid */}
        <div className="px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.length > 0 ? movies.map(m => (
            <MovieCard 
              key={m.id} 
              movie={m} 
              onPreview={() => handleVRPreview(m)} 
              onRate={handleRate} 
              currentStats={movieStats[m.id]} 
            />
          )) : (
            <div className="col-span-full py-20 text-center text-gray-500">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#38bdf8] mx-auto mb-4"></div>
               <p>Fetching movies for you...</p>
            </div>
          )}
        </div>
      </main>

      {/* VR Cinema Overlay */}
      {vrVideoId && (
        <VRCinema 
          videoId={vrVideoId} 
          movieTitle={selectedMovieTitle} 
          onClose={() => setVrVideoId(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;