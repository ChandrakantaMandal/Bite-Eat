import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/auth-shared.css";
import { useAuth } from "../hook/useAuth";

const UserRegister = () => {
  const navigate = useNavigate();
  const { handleUserRegister, loading, authError, clearAuthError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleUserRegister({
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        password,
      });
      navigate("/");
    } catch (err) {
      // error is handled by auth context
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div
        className="auth-card"
        role="region"
        aria-labelledby="user-register-title"
      >
        <header>
          <h1 id="user-register-title" className="auth-title">
            Create your account
          </h1>
          <p className="auth-subtitle">
            Join to explore and enjoy delicious meals.
          </p>
        </header>
        <nav className="auth-alt-action" style={{ marginTop: "-4px" }}>
          <strong style={{ fontWeight: 600 }}>Switch:</strong>{" "}
          <Link to="/user/register">User</Link> •{" "}
          <Link to="/food-partner/register">Food partner</Link>
        </nav>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="two-col">
            <div className="field-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                placeholder="Jane"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
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
              placeholder="••••••••"
              autoComplete="new-password"
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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="auth-alt-action">
          Already have an account? <Link to="/user/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
