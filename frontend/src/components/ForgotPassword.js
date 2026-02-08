import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = ({ onNavigateToLogin }) => {
  const [data, setData] = useState({ email: '', otp: '', newPassword: '' });
  const [step, setStep] = useState(1);

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { email: data.email });
      alert("OTP sent to your email!");
      setStep(2);
    } catch (err) { alert("Error sending OTP"); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', data);
      alert("Password reset successful!");
      onNavigateToLogin();
    } catch (err) { alert("Reset failed!"); }
  };

  const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' };
  const buttonStyle = { width: '100%', padding: '12px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#38bdf8' }}>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h2>
        <form onSubmit={step === 1 ? sendOtp : handleReset}>
          {step === 1 ? (
            <input style={inputStyle} type="email" placeholder="Email" onChange={(e) => setData({...data, email: e.target.value})} required />
          ) : (
            <>
              <input style={inputStyle} type="text" placeholder="OTP" onChange={(e) => setData({...data, otp: e.target.value})} required />
              <input style={inputStyle} type="password" placeholder="New Password" onChange={(e) => setData({...data, newPassword: e.target.value})} required />
            </>
          )}
          <button style={buttonStyle} type="submit">{step === 1 ? "Send OTP" : "Update Password"}</button>
        </form>
        <p onClick={onNavigateToLogin} style={{ color: '#38bdf8', cursor: 'pointer', marginTop: '15px' }}>Back to Login</p>
      </div>
    </div>
  );
};
export default ForgotPassword;