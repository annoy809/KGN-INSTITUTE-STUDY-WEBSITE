import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorFallback.css";


const ErrorFallback = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-card">
        <img
          src="https://stories.freepiklabs.com/storage/13391/355-404-Error_Artboard-1.svg"
          alt="Error"
          className="error-animation"
        />

        <h1 className="error-title">Oops! Something went wrong 😔</h1>
        <p className="error-message">
          We encountered an unexpected issue. Don’t worry — our team is already on it.
        </p>

        {error?.message && (
          <pre className="error-details">{error.message}</pre>
        )}

        <div className="error-buttons">
          <button onClick={() => navigate(-1)} className="error-btn back">
            ⬅ Go Back
          </button>
          <button onClick={() => navigate("/")} className="error-btn home">
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
