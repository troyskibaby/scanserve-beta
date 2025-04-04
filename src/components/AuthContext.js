// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

// A simple fallback JWT decoder (does not verify signature)
const simpleJwtDecode = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error("Failed to decode token with fallback decoder");
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const loadUserFromToken = async () => {
    console.log("document.cookie:", document.cookie);

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
        const jwtDecodeModule = await import("jwt-decode");
        const jwtDecode = jwtDecodeModule.default || jwtDecodeModule;
        let decoded;
        if (typeof jwtDecode === "function") {
          decoded = jwtDecode(token);
        } else {
          console.warn("jwt-decode is not a function; using fallback decoder");
          decoded = simpleJwtDecode(token);
        }
        console.log("Decoded token:", decoded);

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
        try {
          const decoded = simpleJwtDecode(token);
          console.log("Decoded token with fallback:", decoded);
          if (decoded.exp * 1000 < Date.now()) {
            console.log("Token is expired.");
            setUser(null);
            Cookies.remove("token");
            localStorage.removeItem("token");
          } else {
            console.log("Token is valid. Setting user.");
            setUser(decoded);
          }
        } catch (fallbackError) {
          console.error("Fallback decoder also failed:", fallbackError);
          setUser(null);
        }
      }
    } else {
      console.log("No token found.");
      setUser(null);
    }
    setLoadingAuth(false);
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    setUser(null);
    console.log("User logged out.");
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loadUserFromToken,
        logout,              // ✅ expose logout here
        loadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
