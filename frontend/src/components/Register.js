import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });
  const [step, setStep] = useState(1); // 1: Details bharna, 2: OTP Verify karna

  const BACKEND_URL = process.env.REACT_APP_API_URL || "https://stream-sasta-scout.onrender.com";

  // Logic 1: OTP bhejne ke liye (Step 1)
  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/auth/send-otp`, { email: formData.email });
      alert("Registration ke liye OTP aapki email par bhej diya gaya hai!");
      setStep(2); // OTP box dikhayega
    } catch (err) {
      alert(err.response?.data?.msg || "OTP bhejne mein error!");
    }
  };

  // Logic 2: OTP verify aur Password ke saath Registration (Step 2)
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Backend ko name, email, password aur otp sab bhej rahe hain
      const res = await axios.post(`${BACKEND_URL}/api/auth/register`, formData);
      
      // Dashboard par "RM" initials ke liye data save karein
      localStorage.setItem('user', JSON.stringify({ 
        name: formData.name, 
        email: formData.email 
      }));
      
      alert(res.data.msg || "Registration Safal!");
      onNavigateToLogin(); // Direct Login page par bhej dega
    } catch (err) {
      alert("Error: " + (err.response?.data?.msg || "Server Error"));
    }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' };
  const buttonStyle = { width: '100%', padding: '12px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#38bdf8', marginBottom: '25px' }}>{step === 1 ? 'Create Account' : 'Verify Email'}</h2>
        
        {step === 1 ? (
          <form onSubmit={sendOtp}>
            <input style={inputStyle} type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <input style={inputStyle} type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <input style={inputStyle} type="password" placeholder="Set Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            <button type="submit" style={buttonStyle}>Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <p style={{ color: '#94a3b8', marginBottom: '15px' }}>Enter OTP sent to {formData.email}</p>
            <input style={inputStyle} type="text" placeholder="6-Digit OTP" value={formData.otp} onChange={(e) => setFormData({...formData, otp: e.target.value})} required />
            <button type="submit" style={buttonStyle}>Register Now</button>
          </form>
        )}

        <p onClick={onNavigateToLogin} style={{ marginTop: '20px', color: '#94a3b8', cursor: 'pointer' }}>
          Already have an account? <span style={{color: '#38bdf8'}}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;