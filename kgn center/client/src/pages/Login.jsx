import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "../assets/Styles/Login.css";
import Footer from "../components/Footer";

export default function Login() {
  const { signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: form.identifier,
        password: form.password,
      });

      if (result.status === "complete") {
        // Clerk Active Session
        await setActive({ session: result.createdSessionId });

        // ---------------------------------
        // 🔥 BACKEND LOGIN CALL (IMPORTANT)
        // ---------------------------------
        try {
          const backendRes = await fetch("http://localhost:5000/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: form.identifier,
              password: form.password,
            }),
          });

          const data = await backendRes.json();

          if (backendRes.ok) {
            // Save token & user in LocalStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.dispatchEvent(new Event("storage")); // Auto update components
          } else {
            console.log("Backend login failed:", data.msg);
          }
        } catch (err) {
          console.log("Backend Error:", err);
        }

        navigate("/dashboard");
      } else {
        setError("Sign in incomplete. Please try again.");
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || "Signin failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth Login
  const handleOAuth = async (strategy) => {
    try {
      const redirectUrl = `${window.location.origin}/oauth-callback`;
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrlComplete: "/dashboard",
        redirectUrl,
      });
    } catch (err) {
      console.error(err);
      setError("OAuth signup failed. Try again.");
    }
  };

  return (
    <>
      <div className="signin-container">
        <div className="signin-box">
          <div className="logo-placeholder">⬤</div>
          <h2 className="signin-h2">Sign in to your account</h2>

          <div className="oauth-buttons">
            <button
              className="oauth-btn google"
              onClick={() => handleOAuth("oauth_google")}
            >
              Continue with Google
            </button>
            <button
              className="oauth-btn github"
              onClick={() => handleOAuth("oauth_github")}
            >
              Continue with GitHub
            </button>
          </div>

          <div className="divider">or</div>

          <form onSubmit={handleSubmit} className="signin-form">
            <input
              type="text"
              name="identifier"
              placeholder="Email or username"
              value={form.identifier}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="continue-btn" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In →"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>

          <p className="signup-link">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
