import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // Main changes Dashboard file mein honge
import ForgotPassword from "./components/ForgotPassword";

function App() {
  const [step, setStep] = useState("loading"); 
  const [user, setUser] = useState(null);

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
        setStep("register");
      }
    } else {
      setStep("register");
    }
  }, []);

  if (step === "loading") {
    return <div className="min-h-screen bg-[#0f1014]"></div>;
  }

  return (
    <Router>
      {/* Background color Hotstar wala set kiya hai */}
      <div className="App min-h-screen bg-[#0f1014] text-white">
        
        {step === "register" && (
          <Register onNavigateToLogin={() => setStep("login")} />
        )}

        {step === "login" && (
          <Login 
            onLoginSuccess={(u) => {
              setUser(u);
              localStorage.setItem("user", JSON.stringify(u));
              setStep("dashboard");
            }} 
            onNavigateToRegister={() => setStep("register")}
            onNavigateToForgot={() => setStep("forgot")}
          />
        )}

        {step === "forgot" && (
          <ForgotPassword onNavigateToLogin={() => setStep("login")} />
        )}

        {/* Yahan Dashboard load ho raha hai jab user login hai */}
        {step === "dashboard" && user && (
          <Dashboard 
            userEmail={user.email} 
            onLogout={() => {
              setUser(null);
              localStorage.removeItem("user");
              setStep("login");
            }} 
          />
        )}
        
      </div>
    </Router>
  );
}

export default App;