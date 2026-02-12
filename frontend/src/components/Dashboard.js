import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const Dashboard = ({ userEmail, onLogout }) => {
  const [movies, setMovies] = useState([]);
  const [top10, setTop10] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [movieStats, setMovieStats] = useState({});

  // Dynamic Backend URL
  const BACKEND_URL = "https://stream-sasta-scout.onrender.com";

  const fetchData = async (query = "") => {
    try {
      let res;
      if (query && query.trim() !== "") {
        // Search API Call
        res = await axios.get(`${BACKEND_URL}/api/movies/search`, {
          params: { query: query }
        });
      } else {
        // Initial/Popular Call
        res = await axios.get(`${BACKEND_URL}/api/movies/popular`);
        // Parallel call for Top 10
        const topRes = await axios.get(`${BACKEND_URL}/api/movies/top10`);
        setTop10(topRes.data || []);
      }

      // Handle TMDB data structure
      const results = res.data.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);
      setMovies(results);

    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePreview = async (id) => {
    try {
      const statsRes = await axios.post(`${BACKEND_URL}/api/movies/view/${id}`);
      setMovieStats(prev => ({ ...prev, [id]: { ...prev[id], views: statsRes.data.views } }));

      const res = await axios.get(`${BACKEND_URL}/api/movies/trailer/${id}`);
      const trailer = res.data.results.find(v => v.type === "Trailer" || v.type === "Teaser");
      if (trailer) setTrailerKey(trailer.key);
      else alert("Trailer currently unavailable!");
    } catch (e) { console.error(e); }
  };

  const handleRate = async (id, val) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/movies/rate/${id}`, { rating: val });
      const avg = res.data.totalRating / res.data.numberOfRatings;
      setMovieStats(prev => ({ ...prev, [id]: { ...prev[id], avg: avg, count: res.data.numberOfRatings } }));
      alert(`Rated: ${val} Stars!`);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "#fff", fontFamily: 'sans-serif' }}>
      <Header onSearch={(q) => fetchData(q)} userEmail={userEmail} onLogout={onLogout} />
      
      {/* Top 10 Trending */}
      {!movies.length < 20 && ( // Hide when searching
        <div style={{ padding: "20px 30px" }}>
          <h2 style={{ color: "#38bdf8" }}>🔥 Top 10 Trending</h2>
          <div style={{ display: "flex", overflowX: "auto", gap: "20px", padding: "10px 0" }}>
            {top10.map((m) => (
              <img 
                key={m.id} 
                onClick={() => handlePreview(m.id)} 
                src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} 
                style={{ height: "180px", borderRadius: "12px", cursor: "pointer", border: "2px solid #1e293b" }} 
                alt={m.title} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Movie Grid */}
      <div style={{ padding: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "25px" }}>
        {movies.length > 0 ? movies.map(m => (
          <div key={m.id} style={{ background: "#1e293b", borderRadius: "15px", overflow: "hidden", border: "1px solid #334155", transition: "0.3s" }}>
            <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} style={{ width: "100%", height: "320px", objectFit: "cover" }} alt={m.title} />
            <div style={{ padding: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <h3 style={{ fontSize: "15px", margin: 0 }}>{m.title}</h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>👁️ {movieStats[m.id]?.views || 0}</span>
              </div>

              <div style={{ margin: "12px 0" }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} onClick={() => handleRate(m.id, s)} style={{ cursor: "pointer", fontSize: "18px", color: s <= (movieStats[m.id]?.avg || 0) ? "#ffb703" : "#444" }}>★</span>
                ))}
              </div>

              <button onClick={() => handlePreview(m.id)} style={{ width: "100%", padding: "10px", background: "#38bdf8", border: "none", color: "#000", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>🥽 VR PREVIEW</button>
            </div>
          </div>
        )) : <h3 style={{ textAlign: "center", gridColumn: "1/-1" }}>Searching movies...</h3>}
      </div>

      {trailerKey && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#000", zIndex: 1000 }}>
          <button onClick={() => setTrailerKey(null)} style={{ position: "absolute", top: "20px", right: "20px", padding: "10px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", zRule: 1001 }}>CLOSE ✖</button>
          <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen title="trailer"></iframe>
        </div>
      )}
    </div>
  );
};

export default Dashboard;