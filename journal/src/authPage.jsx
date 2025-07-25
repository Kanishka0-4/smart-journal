import React, { useState } from "react";
import "./authPage.css";

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

    
      window.open("/Dashboard", "_blank");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h1 className="form-title">Login</h1>
      <input
        className="form-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="form-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div className="form-error">{error}</div>}
      <p className="form-footer">
        Don't have an account?{" "}
        <span className="form-link" onClick={onSwitch}>
          Sign Up
        </span>
      </p>
    </form>
  );
};

const SignUp = ({ onSwitch }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setLoading(false);
      // Open home page in a new tab after signup
      window.open("/GettingStarted", "_blank");
    } catch (err) {
      setLoading(false);
      setError("Network error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form"
      autoComplete="off"
      noValidate
    >
      <h1 className="form-title">Sign Up</h1>
      <input
        className="form-input"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        maxLength={50}
        pattern="^[a-zA-Z\s]+$"
        title="Name should only contain letters and spaces"
      />
      <input
        className="form-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        title="Please enter a valid email address"
      />
      <input
        className="form-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        maxLength={100}
        title="Password must be at least 6 characters"
      />
      <input
        className="form-input"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={6}
        maxLength={100}
        title="Passwords must match"
      />
      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      {error && <div className="form-error">{error}</div>}
      <p className="form-footer">
        Already have an account?{" "}
        <span className="form-link" onClick={onSwitch}>Login</span>
      </p>
    </form>
  );
};

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);


  return showLogin ? (
    <Login onSwitch={() => setShowLogin(false)} />
  ) : (
    <SignUp onSwitch={() => setShowLogin(true)} />
  );
};

export default AuthPage;
