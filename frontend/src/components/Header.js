import React, { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5";
import './Header.css';

const Header = ({ onLogout }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [initials, setInitials] = useState('??');

    const API_KEY = 'e8bb53615fb9f3fd95d776ecb199bb5';

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.name) {
            const nameParts = storedUser.name.trim().split(' ');
            const res = nameParts.length > 1 ? (nameParts[0][0] + nameParts[nameParts.length-1][0]) : nameParts[0].substring(0, 2);
            setInitials(res.toUpperCase());
        }
    }, []);

    const handleLogoutClick = () => {
        localStorage.removeItem('user'); // Data saaf karein
        onLogout(); // Dashboard ka logout function chalayein
    };

    return (
        <header className="header-container">
            <div className="logo-text">STREAM SASTA SCOUT</div>
            <div className="search-wrapper">
                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                    <input type="text" className="search-input" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} onBlur={() => setTimeout(() => setShowDropdown(false), 200)} onFocus={() => query.length > 0 && setShowDropdown(true)} />
                    <button type="submit" className="search-button"><IoSearch size={20} /></button>
                </form>
                {/* Result dropdown mapping yahan... */}
            </div>
            <div className="profile-section">
                <div className="profile-circle" onClick={() => setShowProfileMenu(!showProfileMenu)}>{initials}</div>
                {showProfileMenu && (
                    <div className="dropdown-menu">
                        <button className="dropdown-item" onClick={handleLogoutClick}>Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
};
export default Header;