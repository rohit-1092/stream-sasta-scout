import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email/OTP bhejna, 2: OTP Verify & Reset

  const BACKEND_URL = process.env.REACT_APP_API_URL || "https://stream-sasta-scout.onrender.com";

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/auth/send-otp`, { email });
      alert("Password reset ke liye OTP bhej diya gaya hai!");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.msg || "Email nahi mila!");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // Backend route: /api/auth/reset-password (check karein aapke backend mein hai ya nahi)
      await axios.post(`${BACKEND_URL}/api/auth/reset-password`, { email, otp, newPassword });
      alert("Password kamyabi se badal gaya hai! Ab login karein.");
      onNavigateToLogin();
    } catch (err) {
      alert(err.response?.data?.msg || "OTP galat hai ya koi error hai!");
    }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' };
  const buttonStyle = { width: '100%', padding: '12px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#38bdf8', marginBottom: '25px' }}>Reset Password</h2>
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <input style={inputStyle} type="email" placeholder="Apna Email daalein" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" style={buttonStyle}>Send Reset OTP</button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <input style={inputStyle} type="text" placeholder="OTP daalein" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <input style={inputStyle} type="password" placeholder="Naya Password set karein" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <button type="submit" style={buttonStyle}>Update Password</button>
          </form>
        )}
        <p onClick={onNavigateToLogin} style={{ marginTop: '20px', color: '#94a3b8', cursor: 'pointer' }}>Back to Login</p>
      </div>
    </div>
  );
};

export default ForgotPassword;