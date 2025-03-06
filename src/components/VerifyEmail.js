import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import config from '../config'; 

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState(false);
  const hasFetched = useRef(false); // ✅ Ref to prevent duplicate requests

  useEffect(() => {
    if (hasFetched.current) return; // ✅ Stops duplicate API calls

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (!token) {
      setMessage("Invalid verification link.");
      setError(true);
      return;
    }

    const verifyEmail = async () => {
      try {
        console.log("🔄 Sending request to verify token:", token);
        hasFetched.current = true; // ✅ Mark request as sent before making the call

        const response = await fetch(
          `${config.apiUrl}/verifyEmail?code=${config.key}&token=${token}`,
          { method: "POST" }
        );

        console.log("🔹 API Response Status:", response.status);

        let result;
        try {
          result = await response.json();
          console.log("✅ API Response:", result);
        } catch (e) {
          result = {};
        }

        if (response.ok) {
          setMessage("🎉 Thank you for verifying your email! Redirecting to login...");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setMessage(result?.message || "Verification failed. Please try again.");
          setError(true);
        }
      } catch (error) {
        console.error("❌ Error verifying email:", error);
        setMessage("An error occurred. Please try again.");
        setError(true);
      }
    };

    verifyEmail();
  }, []); // ✅ Empty dependency array to ensure it runs only on mount

  return (
    <div className="verification-container">
      <h2>{error ? "Verification Failed" : "Verification Successful"}</h2>
      <p>{message}</p>
      {error && (
        <p>
          If the problem persists, try resending the verification email or{" "}
          <a href="/resend-verification">click here</a> to request a new one.
        </p>
      )}
    </div>
  );
};

export default VerifyEmail;
