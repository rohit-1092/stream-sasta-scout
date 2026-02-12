import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const Dashboard = ({ userEmail, onLogout }) => {
  const [movies, setMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);

  // Backend URL ko variable mein store karein taaki bar-bar typing error na ho
  const BACKEND_URL = process.env.REACT_APP_API_URL;

  // 1. Movies Fetch karne ke liye updated function
  const fetchMovies = async (q = "") => {
    try {
      // Direct TMDB ki jagah ab hum apne Render Backend ko call karenge
      const url = q 
        ? `${BACKEND_URL}/api/movies/search?query=${q}` 
        : `${BACKEND_URL}/api/movies/popular`;
      
      const res = await axios.get(url);
      setMovies(res.data.results || []);
    } catch (err) { 
      console.error("Movies load nahi ho rahi:", err); 
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  // 2. Trailer fetch karne ke liye fixed function
  const handlePreview = async (id) => {
    try {
      // Yahan humne endpoint badal kar /api/movies/trailer/${id} kar diya hai
      const res = await axios.get(`${BACKEND_URL}/api/movies/trailer/${id}`);
      
      // TMDB response mein 'results' array ke andar videos hote hain
      const trailer = res.data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
      
      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        alert("Is movie ka trailer filhal available nahi hai.");
      }
    } catch (e) { 
      alert("Trailer load karne mein error aaya. Kya aapne backend update kiya?"); 
    }
  };

  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "#fff" }}>
      <Header onSearch={fetchMovies} userEmail={userEmail} onLogout={onLogout} />
      
      <div style={{ padding: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
        {movies.map(m => (
          <div key={m.id} style={{ background: "#1e293b", borderRadius: "15px", overflow: "hidden", border: "1px solid #334155" }}>
            <img 
              src={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"} 
              style={{ width: "100%", height: "350px", objectFit: "cover" }} 
              alt={m.title} 
            />
            <div style={{ padding: "15px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</h3>
              <button 
                onClick={() => handlePreview(m.id)} 
                style={{ width: "100%", padding: "12px", background: "#38bdf8", border: "none", borderRadius: "8px", color: "#000", fontWeight: "bold", cursor: "pointer" }}
              >
                🥽 VR PREVIEW
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FULL SCREEN CINEMATIC TRAILER MODAL */}
      {trailerKey && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#000", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <button 
            onClick={() => setTrailerKey(null)} 
            style={{ position: "fixed", top: "30px", right: "30px", background: "#ef4444", color: "white", border: "none", padding: "15px 25px", borderRadius: "50px", cursor: "pointer", fontWeight: "bold", zIndex: 10000 }}
          >
            EXIT ✖
          </button>
          <iframe 
            width="100%" height="100%" 
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`} 
            frameBorder="0" allow="autoplay; encrypted-media; fullscreen" 
            allowFullScreen title="Movie Trailer" style={{ border: "none" }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Dashboard;