import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  // Default step ko pehle khali rakhenge persistence check ke liye
  const [step, setStep] = useState("loading"); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check karein ki kya user pehle se logged in hai
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setStep("dashboard");
      } catch (error) {
        console.error("LocalStorage data error:", error);
        localStorage.removeItem("user");
        setStep("register"); // Agar data corrupt ho toh register par bhejien
      }
    } else {
      setStep("register"); // Naye device/user ke liye pehle register aayega
    }
  }, []);

  // Jab tak check ho raha hai, tab tak ek simple loading background dikhayein
  if (step === "loading") {
    return <div style={{ minHeight: '100vh', background: '#0f172a' }}></div>;
  }

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', background: '#0f172a' }}>
        
        {/* 1. Registration Screen - Pehle yahi aayega */}
        {step === "register" && (
          <Register onNavigateToLogin={() => setStep("login")} />
        )}

        {/* 2. Login Screen */}
        {step === "login" && (
          <Login 
            onLoginSuccess={(u) => {
              setUser(u);
              localStorage.setItem("user", JSON.stringify(u)); // Data persistence ke liye
              setStep("dashboard");
            }} 
            onNavigateToRegister={() => setStep("register")}
            onNavigateToForgot={() => setStep("forgot")}
          />
        )}

        {/* 3. Forgot Password Screen */}
        {step === "forgot" && (
          <ForgotPassword onNavigateToLogin={() => setStep("login")} />
        )}

        {/* 4. Dashboard Screen */}
        {step === "dashboard" && user && (
          <Dashboard 
            userEmail={user.email} 
            onLogout={() => {
              setUser(null);
              localStorage.removeItem("user"); // Logout par data clear karein
              setStep("login");
            }} 
          />
        )}
        
      </div>
    </Router>
  );
}

export default App;