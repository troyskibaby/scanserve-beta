// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const loadUserFromToken = () => {
    console.log("document.cookie:", document.cookie);

    // Attempt to retrieve the token from cookies.
    let token = Cookies.get("token");
    if (!token) {
      // If not found in cookies, try localStorage.
      token = localStorage.getItem("token");
      console.log("Token retrieved from localStorage:", token);
    } else {
      console.log("Token retrieved from cookie:", token);
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // Check if the token is expired (decoded.exp is in seconds)
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
