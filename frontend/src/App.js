import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Yeh sabse zaroori hai
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  const [step, setStep] = useState("register");
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', background: '#0f172a' }}>
        {step === "register" && (
          <Register onNavigateToLogin={() => setStep("login")} />
        )}
        {step === "login" && (
          <Login 
            onLoginSuccess={(u) => { setUser(u); setStep("dashboard"); }} 
            onNavigateToRegister={() => setStep("register")}
            onNavigateToForgot={() => setStep("forgot")}
          />
        )}
        {step === "forgot" && <ForgotPassword onNavigateToLogin={() => setStep("login")} />}
        {step === "dashboard" && <Dashboard userEmail={user?.email} onLogout={() => setStep("login")} />}
      </div>
    </Router>
  );
}
export default App;