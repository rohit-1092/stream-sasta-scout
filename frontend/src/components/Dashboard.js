import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const Dashboard = ({ userEmail, onLogout }) => {
  const [movies, setMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY || "e8bb5361b5fb9f3fd95d776ecb199bb5";

  const fetchMovies = async (q = "") => {
    const url = q ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${q}` : `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&region=IN`;
    try {
      const res = await axios.get(url);
      setMovies(res.data.results || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMovies(); }, []);

  const handlePreview = async (id) => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
      const trailer = res.data.results.find(v => v.type === "Trailer");
      if (trailer) setTrailerKey(trailer.key);
      else alert("Trailer not found!");
    } catch (e) { alert("Error fetching trailer"); }
  };

  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "#fff" }}>
      <Header onSearch={fetchMovies} userEmail={userEmail} onLogout={onLogout} />
      
      <div style={{ padding: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
        {movies.map(m => (
          <div key={m.id} style={{ background: "#1e293b", borderRadius: "15px", overflow: "hidden", border: "1px solid #334155" }}>
            <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} style={{ width: "100%", height: "350px", objectFit: "cover" }} alt="" />
            <div style={{ padding: "15px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "15px" }}>{m.title}</h3>
              <button onClick={() => handlePreview(m.id)} style={{ width: "100%", padding: "12px", background: "#38bdf8", border: "none", borderRadius: "8px", color: "#000", fontWeight: "bold", cursor: "pointer" }}>
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