import React, { useState } from "react";

const styles = {
    form: {
        maxWidth: 380,
        margin: "60px auto",
        padding: 36,
        border: "none",
        borderRadius: 18,
        background: "linear-gradient(135deg, #3a0ca3ff 0%, #4895ef 100%)",
        boxShadow: "0 8px 32px 0 rgba(58,12,163,0.18)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
    },
    input: {
        padding: 14,
        fontSize: 18,
        borderRadius: 8,
        border: "2px solid #4cc9f0ff",
        outline: "none",
        boxShadow: "0 2px 8px rgba(76,201,240,0.10)",
        background: "rgba(255,255,255,0.85)",
        color: "#3a0ca3",
        fontWeight: 500,
    },
    button: {
        padding: 14,
        fontSize: 18,
        borderRadius: 8,
        border: "none",
        background: "linear-gradient(90deg, #f72585ff 0%, #7209b7ff 100%)",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 14px 0 rgba(76,201,240,0.18)",
    },
    link: {
        color: "#ffffff",
        cursor: "pointer",
        textDecoration: "underline",
        fontWeight: 600,
    }
};

const Login = ({ onSwitch }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token); // assuming JWT is returned as token
            alert("Login successful!");
        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h1 style={{ color: "white" }}>Login</h1>
            <input
                style={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                style={styles.input}
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button style={styles.button} type="submit">Login</button>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <p style={{ color: "white" }}>
                Don't have an account?{" "}
                <span style={styles.link} onClick={onSwitch}>Sign Up</span>
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Signup failed");
                return;
            }

            alert("Signup successful! Please log in.");
            onSwitch();
        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h1 style={{ color: "white" }}>Sign Up</h1>
            <input
                style={styles.input}
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />
            <input
                style={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                style={styles.input}
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <input
                style={styles.input}
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
            />
            <button style={styles.button} type="submit">Sign Up</button>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <p style={{ color: "white" }}>
                Already have an account?{" "}
                <span style={styles.link} onClick={onSwitch}>Login</span>
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
