// AuthContext.js (updated dynamic require)
import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const loadUserFromToken = () => {
    console.log("document.cookie:", document.cookie);

    // Try to get the token from localStorage first.
    let token = localStorage.getItem("token");
    if (token) {
      console.log("Token retrieved from localStorage:", token);
    } else {
      token = Cookies.get("token");
      if (token) {
        console.log("Token retrieved from cookie:", token);
      }
    }

    if (token) {
      try {
        // Dynamically require jwt-decode and check for default export.
        const jwtDecodeModule = require("jwt-decode");
        const jwtDecode = jwtDecodeModule.default || jwtDecodeModule;
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // Check if the token is expired (decoded.exp is in seconds).
        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token is expired.");
          setUser(null);
          Cookies.remove("token");
          localStorage.removeItem("token");
        } else {
          console.log("Token is valid. Setting user.");
          setUser(decoded);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
      }
    } else {
      console.log("No token found.");
      setUser(null);
    }
    setLoadingAuth(false);
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loadUserFromToken, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
