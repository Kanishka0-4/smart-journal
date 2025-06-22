import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./authPage.css";

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      const entriesRes = await fetch("http://localhost:5000/api/entries", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const entriesData = await entriesRes.json();
      setLoading(false);

      if (entriesData.entries && entriesData.entries.length > 0) {
        navigate("/dashboard");
      } else {
        navigate("/getting-started");
      }
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
  const navigate = useNavigate();

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
      window.open("/getting-started", "_blank");
    } catch (err) {
      setLoading(false);
      setError("Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h1 className="form-title">Sign Up</h1>
      <input
        className="form-input"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <input
        className="form-input"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      {error && <div className="form-error">{error}</div>}
      <p className="form-footer">
        Already have an account?{" "}
        <span className="form-link" onClick={onSwitch}>
          Login
        </span>
      </p>
    </form>
  );
};

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();


  return showLogin ? (
    <Login onSwitch={() => setShowLogin(false)} />
  ) : (
    <SignUp onSwitch={() => setShowLogin(true)} />
  );
};

export default AuthPage;
