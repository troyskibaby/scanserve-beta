// login.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { AuthContext } from "./AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, loadUserFromToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_URL = `${config.apiUrl}/loginUser?code=${config.key}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ensures cookie is set
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid login credentials.");
      }

      console.log("Login successful. Token set in cookie.");

      // Store token in localStorage as a fallback.
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // Update the authentication context.
      loadUserFromToken();

    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
    setLoading(false);
  };

  // Navigate to /dashboard when user state is updated.
  useEffect(() => {
    console.log("User state changed:", user);
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </p>
        <p className="forgot-password">
          Don't have an account? <a href="/signup">Signup</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
