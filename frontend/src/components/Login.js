import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess, onNavigateToRegister, onNavigateToForgot }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Email mangna, Step 2: OTP mangna

  // OTP bhejane ka function
  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      // Backend route /send-otp par request
      await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      alert("OTP aapki email par bhej diya gaya hai!");
      setStep(2); // Isse UI change hoga aur OTP box dikhega
    } catch (err) {
      alert(err.response?.data?.msg || "OTP bhejane mein galti hui");
    }
  };

  // OTP verify karne ka function
  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      // Backend route /verify-otp par request
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      alert("Login Safal rha!");
      onLoginSuccess({ email }); // User ko dashboard par bhejein
    } catch (err) {
      alert(err.response?.data?.msg || "Galat OTP!");
    }
  };

  // UI Styles
  const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' };
  const buttonStyle = { width: '100%', padding: '12px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        
        {/* Step ke hisab se Heading badalna */}
        <h2 style={{ color: '#38bdf8', marginBottom: '25px' }}>
          {step === 1 ? 'Login' : 'Enter OTP'}
        </h2>

        {step === 1 ? (
          /* STEP 1: Email Form */
          <form onSubmit={sendOtp}>
            <input 
              style={inputStyle} 
              type="email" 
              placeholder="Aapki Email daalein" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <button type="submit" style={buttonStyle}>Send OTP</button>
          </form>
        ) : (
          /* STEP 2: OTP Form - Yeh ab pakka dikhega */
          <form onSubmit={verifyOtp}>
            <p style={{ color: '#94a3b8', marginBottom: '15px', fontSize: '14px' }}>
              OTP {email} par bheja gaya hai.
            </p>
            <input 
              style={inputStyle} 
              type="text" 
              placeholder="6-digit OTP daalein" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required 
            />
            <button type="submit" style={buttonStyle}>Verify & Login</button>
            <p 
              onClick={() => setStep(1)} 
              style={{ color: '#38bdf8', marginTop: '15px', cursor: 'pointer', fontSize: '13px' }}
            >
              Email badalna hai?
            </p>
          </form>
        )}

        <p onClick={onNavigateToForgot} style={{ color: '#94a3b8', cursor: 'pointer', marginTop: '20px', fontSize: '14px' }}>
          Password bhool gaye? <span style={{color:'#38bdf8'}}>Reset</span>
        </p>
        <p onClick={onNavigateToRegister} style={{ color: '#94a3b8', cursor: 'pointer', marginTop: '10px', fontSize: '14px' }}>
          Account nahi hai? <span style={{color:'#38bdf8'}}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;