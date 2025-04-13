import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatBox from "./components/ChatBox";
import ForgotPassword from "./components/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Notification from "./components/Notification"; // Import the Notification component

const App = () => {
  return (
    <>
      <Notification /> {/* Add the Notification component */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatBox />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;