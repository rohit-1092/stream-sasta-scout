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
      const statsRes = await axios.post(`${BACKEND_URL}/api/movies/view/${movie.id}`);
      setMovieStats(prev => ({ ...prev, [movie.id]: { ...prev[movie.id], views: statsRes.data.views } }));

      const res = await axios.get(`${BACKEND_URL}/api/movies/trailer/${movie.id}`);
      const trailer = res.data.results.find(v => v.type === "Trailer" || v.type === "Teaser");
      
      if (trailer) {
        setVrVideoId(trailer.key);
        setSelectedMovieTitle(movie.title);
      } else {
        alert("VR Preview is not available for this movie yet.");
      }
    } catch (e) {
      console.error("VR Error:", e);
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
    <div className="bg-[#0f1014] min-h-screen text-white font-sans selection:bg-[#38bdf8] selection:text-black">
      <Navbar onSearch={(q) => fetchData(q)} onLogout={onLogout} userEmail={userEmail} />

      {/* Responsive Main Content */}
      <main className="md:ml-20 pt-20 md:pt-10 pb-28 transition-all duration-300">
        
        {/* Top 10 Trending Slider */}
        {top10.length > 0 && movies.length >= 15 && (
          <div className="px-4 md:px-8 py-4 mb-4">
            <h2 className="text-[#38bdf8] text-lg font-bold mb-4 flex items-center gap-2">
               🔥 Top 10 Trending
            </h2>
            <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
              {top10.map((m) => (
                <div key={m.id} className="flex-none transition-transform hover:scale-105">
                  <img 
                    onClick={() => handleVRPreview(m)} 
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} 
                    className="h-40 md:h-52 rounded-lg cursor-pointer border border-gray-800" 
                    alt={m.title} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Movie Grid */}
        <div className="px-4 md:px-8">
          <h2 className="text-white text-lg font-bold mb-6">Latest & Popular</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
            {movies.length > 0 ? movies.map(m => (
              <MovieCard 
                key={m.id} 
                movie={m} 
                onPreview={handleVRPreview} 
                onRate={handleRate} 
                currentStats={movieStats[m.id]} 
              />
            )) : (
              <div className="col-span-full py-20 text-center">
                 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#38bdf8] mx-auto mb-4"></div>
                 <p className="text-gray-500">Searching movies...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* VR Cinema Component */}
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