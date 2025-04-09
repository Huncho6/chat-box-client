import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await axios.post("http://localhost:3000/api/v1/users/login", {
        email,
        password,
      });
      const { token, userInfo } = response.data.data;

      localStorage.setItem("token", token); // Store the token
      localStorage.setItem("user", JSON.stringify(userInfo)); // Store the user info
      alert("Login successful!");

      if (onLogin) {
        onLogin(); // Notify the parent component about the successful login
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Invalid email or password");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;