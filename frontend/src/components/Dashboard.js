import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const Dashboard = ({ userEmail, onLogout }) => {
  const [movies, setMovies] = useState([]);
  const [top10, setTop10] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [movieStats, setMovieStats] = useState({}); 

  // --- Backend URL Fix ---
  // Agar .env file read nahi hoti, toh ye seedha Onrender URL uthayega
  const BACKEND_URL = process.env.REACT_APP_API_URL || "https://stream-sasta-scout.onrender.com";

  const fetchData = async (query = "") => {
  try {
    if (query) {
      // Backend route aur parameter check karein
      const res = await axios.get(`${BACKEND_URL}/api/movies/search?query=${query}`);
      setMovies(res.data.results || res.data || []); 
    } else {
      const [pop, top] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/movies/popular`),
        axios.get(`${BACKEND_URL}/api/movies/top10`)
      ]);
      setMovies(pop.data.results || pop.data || []);
      setTop10(top.data.results || top.data || []);
    }
  } catch (err) {
    console.error("Content Fetch Error:", err);
  }
};

  useEffect(() => { fetchData(); }, []);

  const handlePreview = async (id) => {
    try {
        const statsRes = await axios.post(`${BACKEND_URL}/api/movies/view/${id}`);
        setMovieStats(prev => ({ ...prev, [id]: { ...prev[id], views: statsRes.data.views } }));

        const res = await axios.get(`${BACKEND_URL}/api/movies/trailer/${id}`);
        const trailer = res.data.results.find(v => v.type === "Trailer");
        if (trailer) setTrailerKey(trailer.key);
        else alert("Trailer not found!");
    } catch (e) { console.error(e); }
  };

  const handleRate = async (id, val) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/api/movies/rate/${id}`, { rating: val });
        const avg = res.data.totalRating / res.data.numberOfRatings;
        setMovieStats(prev => ({ ...prev, [id]: { ...prev[id], avg: avg, count: res.data.numberOfRatings } }));
        alert(`Aapne ${val} stars diye!`);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "#fff", fontFamily: 'sans-serif' }}>
      {/* Search query pass karne ke liye fetchData update kiya hai */}
      <Header onSearch={(q) => fetchData(q)} userEmail={userEmail} onLogout={onLogout} />
      
      {/* Top 10 Section */}
      <div style={{ padding: "20px 30px" }}>
        <h2 style={{ color: "#38bdf8" }}>🔥 Top 10 Trending</h2>
        <div style={{ display: "flex", overflowX: "auto", gap: "20px", padding: "20px 0" }}>
          {top10.length > 0 ? top10.map((m, i) => (
            <img 
                 key={m.id} 
                 onClick={() => handlePreview(m.id)} 
                 src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} 
                 style={{ height: "200px", borderRadius: "10px", cursor: "pointer" }} 
                 alt={m.title} 
            />
          )) : <p style={{color: "#94a3b8"}}>Loading Trending Movies...</p>}
        </div>
      </div>

      <div style={{ padding: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
        {movies.length > 0 ? movies.map(m => (
          <div key={m.id} style={{ background: "#1e293b", borderRadius: "15px", overflow: "hidden", border: "1px solid #334155" }}>
            <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} style={{ width: "100%", height: "350px", objectFit: "cover" }} alt="" />
            <div style={{ padding: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: "16px" }}>{m.title}</h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>👁️ {movieStats[m.id]?.views || 0}</span>
              </div>

              {/* Rating Stars */}
              <div style={{ margin: "10px 0" }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} onClick={() => handleRate(m.id, s)} style={{ cursor: "pointer", color: s <= (movieStats[m.id]?.avg || 0) ? "#ffb703" : "#444" }}>★</span>
                ))}
              </div>

              <button onClick={() => handlePreview(m.id)} style={{ width: "100%", padding: "12px", background: "#38bdf8", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>🥽 VR PREVIEW</button>
            </div>
          </div>
        )) : <p style={{textAlign: "center", width: "100%"}}>Movies load ho rahi hain...</p>}
      </div>

      {trailerKey && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#000", zIndex: 9999 }}>
          <button onClick={() => setTrailerKey(null)} style={{ position: "fixed", top: "20px", right: "20px", padding: "10px", background: "red", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>EXIT ✖</button>
          <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} frameBorder="0" allowFullScreen title="trailer"></iframe>
        </div>
      )}
    </div>
  );
};

export default Dashboard;