import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess, onNavigateToRegister, onNavigateToForgot }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://stream-sasta-scout.onrender.com/api/auth/send-otp', { email });
      alert("OTP aapki email par bhej diya gaya hai!");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.msg || "OTP bhejane mein galti hui");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://stream-sasta-scout.onrender.com/api/auth/verify-otp', { email, otp });
      
      // Initials ke liye data save karna
      const userData = {
        name: res.data.user?.name || email.split('@')[0],
        email: email
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      alert("Login Safal rha!");
      onLoginSuccess(userData);
    } catch (err) {
      alert(err.response?.data?.msg || "Galat OTP!");
    }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' };
  const buttonStyle = { width: '100%', padding: '12px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#38bdf8', marginBottom: '25px' }}>{step === 1 ? 'Login' : 'Enter OTP'}</h2>
        {step === 1 ? (
          <form onSubmit={sendOtp}>
            <input style={inputStyle} type="email" placeholder="Email daalein" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" style={buttonStyle}>Send OTP</button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <input style={inputStyle} type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <button type="submit" style={buttonStyle}>Verify & Login</button>
          </form>
        )}
        <p onClick={onNavigateToRegister} style={{ color: '#94a3b8', cursor: 'pointer', marginTop: '20px' }}>Account nahi hai? <span style={{color:'#38bdf8'}}>Register</span></p>
      </div>
    </div>
  );
};

export default Login;