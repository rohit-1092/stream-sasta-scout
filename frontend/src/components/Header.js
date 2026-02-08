import React, { useState } from 'react';
import './Header.css'; //

const Header = ({ onSearch, userEmail, onLogout }) => {
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="header-container">
      <div style={{ flex: 1 }}><h1 className="logo-text">STREAM SASTA SCOUT</h1></div>
      <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={(e) => { e.preventDefault(); onSearch(query); }} className="search-form">
          <input className="search-input" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="search-button">SEARCH</button>
        </form>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
        <div className="profile-circle" onClick={() => setIsMenuOpen(!isMenuOpen)}>{userInitial}</div>
        {isMenuOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={() => setIsMenuOpen(false)}>📊 Dashboard</button>
            <button className="dropdown-item" style={{color: '#f87171', borderTop: '1px solid #333'}} onClick={onLogout}>🚪 Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Header;