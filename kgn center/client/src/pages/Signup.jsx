import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../assets/Styles/Signup.css';

export default function Signup() {
  const { signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otpCode, setOtpCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp.create({
        emailAddress: form.email,
        phoneNumber: form.phone || undefined,
        username: form.username,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Signup failed. Try again.");
    }

    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: otpCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard"); // ✅ Redirect after signup
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Verification failed.");
    }

    setLoading(false);
  };

  const handleOAuth = async (strategy) => {
    try {
      await signUp.authenticateWithRedirect({ strategy,redirectUrlComplete: "/dashboard"});
    } catch (err) {
      setError("OAuth signup failed. Try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="logo-placeholder">⬤</div>
        <h2 className="signup-h2">Create your account</h2>
        <p className="signup-p">Welcome! Please fill in the details to get started.</p>

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

        {error && <p className="error-message">{error}</p>}

        {!pendingVerification ? (
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="name-fields">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number (optional)"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <button type="submit" className="continue-btn" disabled={loading}>
              {loading ? "Processing..." : "Continue →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="signup-form">
            <input
              type="text"
              placeholder="Enter OTP code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" className="continue-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify →"}
            </button>
          </form>
        )}

        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
// This code defines a SignupForm component that allows users to sign up for an account using Clerk.
