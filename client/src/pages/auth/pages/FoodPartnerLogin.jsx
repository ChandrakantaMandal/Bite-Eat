import React, { useState } from "react";
import "../../../styles/auth-shared.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useEffect } from "react";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const { handleFoodPartnerLogin, loading, authError, clearAuthError } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleFoodPartnerLogin({ email, password });
      navigate("/create-food");
    } catch (err) {
      // error is handled by auth context
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div
        className="auth-card"
        role="region"
        aria-labelledby="partner-login-title"
      >
        <header>
          <h1 id="partner-login-title" className="auth-title">
            Partner login
          </h1>
          <p className="auth-subtitle">
            Access your dashboard and manage orders.
          </p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="business@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {authError ? (
            <p className="small-note" style={{ color: "#dc2626" }}>
              {authError}
            </p>
          ) : null}
          <button className="auth-submit" type="submit">
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="auth-alt-action">
          New partner?{" "}
          <Link to="/food-partner/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
