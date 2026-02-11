import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  const [step, setStep] = useState("login"); // Default step login rakha hai persistence check ke liye
  const [user, setUser] = useState(null);

  // 1. App load hote hi check karein ki kya koi user pehle se logged in hai
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setStep("dashboard");
      } catch (error) {
        console.error("LocalStorage data error:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', background: '#0f172a' }}>
        
        {/* Registration Screen */}
        {step === "register" && (
          <Register onNavigateToLogin={() => setStep("login")} />
        )}

        {/* Login Screen - Login success par data save hota hai */}
        {step === "login" && (
          <Login 
            onLoginSuccess={(u) => {
              setUser(u);
              localStorage.setItem("user", JSON.stringify(u)); // Browser mein user data save karein
              setStep("dashboard");
            }} 
            onNavigateToRegister={() => setStep("register")}
            onNavigateToForgot={() => setStep("forgot")}
          />
        )}

        {/* Forgot Password Screen */}
        {step === "forgot" && (
          <ForgotPassword onNavigateToLogin={() => setStep("login")} />
        )}

        {/* Dashboard - Logout par data remove hota hai */}
        {step === "dashboard" && (
          <Dashboard 
            userEmail={user?.email} 
            onLogout={() => {
              setUser(null);
              localStorage.removeItem("user"); // Browser se data delete karein
              setStep("login");
            }} 
          />
        )}
        
      </div>
    </Router>
  );
}

export default App;