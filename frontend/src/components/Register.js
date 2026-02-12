import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = ({ onNavigateToLogin }) => {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, user);
      
      // Initials ke liye data save karein
      localStorage.setItem('user', JSON.stringify({ name: user.name, email: user.email }));
      
      alert(res.data.msg || "Registration Safal!");
      onNavigateToLogin ? onNavigateToLogin() : navigate('/login');
    } catch (err) {
      alert("Error: " + (err.response?.data?.msg || "Server Error"));
    }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' };
  const buttonStyle = { width: '100%', padding: '12px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#38bdf8', marginBottom: '25px' }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input style={inputStyle} type="text" placeholder="Full Name" onChange={(e) => setUser({...user, name: e.target.value})} required />
          <input style={inputStyle} type="email" placeholder="Email Address" onChange={(e) => setUser({...user, email: e.target.value})} required />
          <input style={inputStyle} type="password" placeholder="Password" onChange={(e) => setUser({...user, password: e.target.value})} required />
          <button type="submit" style={buttonStyle}>Register</button>
        </form>
        <p onClick={onNavigateToLogin} style={{ marginTop: '20px', color: '#94a3b8', cursor: 'pointer' }}>Login here</p>
      </div>
    </div>
  );
};
export default Register;