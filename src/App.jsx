import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatBox from "./components/ChatBox";
import ForgotPassword from "./components/ForgotPassword";

const MainApp = () => {
  const [currentView, setCurrentView] = useState("login"); // login, register, forgotPassword, chat

  const handleLogin = () => setCurrentView("chat");
  const handleRegister = () => setCurrentView("login");
  const handleForgotPassword = () => setCurrentView("forgotPassword");

  return (
    <div>
      {currentView === "login" && (
        <Login onLogin={handleLogin} />
      )}
      {currentView === "register" && (
        <Register onRegister={handleRegister} />
      )}
      {currentView === "forgotPassword" && (
        <ForgotPassword />
      )}
      {currentView === "chat" && <ChatBox />}
      <div>
        {currentView !== "register" && (
          <button onClick={() => setCurrentView("register")}>Create Account</button>
        )}
        {currentView !== "login" && (
          <button onClick={() => setCurrentView("login")}>Login</button>
        )}
        {currentView !== "forgotPassword" && (
          <button onClick={() => setCurrentView("forgotPassword")}>Forgot Password</button>
        )}
      </div>
    </div>
  );
};

export default MainApp;