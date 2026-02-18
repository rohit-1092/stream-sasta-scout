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
      const endpoint = query.trim() ? `${BACKEND_URL}/api/movies/search` : `${BACKEND_URL}/api/movies/popular`;
      const res = await axios.get(endpoint, { params: { query } });
      setMovies(res.data.results || res.data || []);
      if (!query) {
        const topRes = await axios.get(`${BACKEND_URL}/api/movies/top10`);
        setTop10(topRes.data || []);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleVRPreview = async (movie) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/movies/trailer/${movie.id}`);
      const trailer = res.data.results?.find(v => v.type === "Trailer" || v.type === "Teaser");
      if (trailer) {
        setVrVideoId(trailer.key);
        setSelectedMovieTitle(movie.title);
      } else { alert("Trailer not found!"); }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-[#0f1014] min-h-screen text-white">
      <Navbar onSearch={fetchData} onLogout={onLogout} />
      <main className="md:ml-20 pt-20 pb-24 px-4">
        {top10.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[#38bdf8] font-bold mb-4">🔥 Top 10 Trending</h2>
            <div className="flex overflow-x-auto gap-4 scrollbar-hide">
              {top10.map(m => (
                <img key={m.id} onClick={() => handleVRPreview(m)} src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} className="h-40 md:h-52 rounded-lg cursor-pointer border border-gray-800 flex-none" alt="" />
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map(m => (
            <MovieCard key={m.id} movie={m} onPreview={() => handleVRPreview(m)} currentStats={movieStats[m.id]} />
          ))}
        </div>
      </main>
      {vrVideoId && <VRCinema videoId={vrVideoId} movieTitle={selectedMovieTitle} onClose={() => setVrVideoId(null)} />}
    </div>
  );
};

export default Dashboard;