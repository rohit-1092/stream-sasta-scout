import React, { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5"; // npm install react-icons zaroor karein
import './Header.css';

const Header = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const API_KEY = 'e8bb53615fb9f3fd95d776ecb199bb5'; // Apni TMDB API key yahan dalein

    useEffect(() => {
        if (query.length > 0) {
            const fetchMovies = async () => {
                try {
                    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
                    const data = await res.json();
                    setResults(data.results?.slice(0, 5) || []); // Sirf top 5 results dikhayenge
                    setShowDropdown(true);
                } catch (err) {
                    console.error("Search Error:", err);
                }
            };

            const timeoutId = setTimeout(fetchMovies, 500);
            return () => clearTimeout(timeoutId);
        } else {
            setResults([]);
            setShowDropdown(false);
        }
    }, [query]);

    return (
        <header className="header-container">
            <div className="logo-text">STREAM SASTA SCOUT</div>

            <div className="search-wrapper">
                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="text" 
                        placeholder="Search movies..." 
                        className="search-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        onFocus={() => query.length > 0 && setShowDropdown(true)}
                    />
                    <button type="submit" className="search-button">
                        <IoSearch size={20} />
                    </button>
                </form>

                {showDropdown && results.length > 0 && (
                    <div className="search-results-dropdown">
                        {results.map(movie => (
                            <div key={movie.id} className="result-item">
                                <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt="" />
                                <span>{movie.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="profile-section">
                <span className="dev-credit">Developed by Rohit Maurya</span>
                <div className="profile-circle">R</div>
            </div>
        </header>
    );
};

export default Header;