import React, { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import jwtDecode from "jwt-decode";
import "./Dashboard.css";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [habitsTracked, setHabitsTracked] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "");
      } catch (err) {
        console.error("Failed to decode token");
      }
    }

    fetch("https://smart-journal-backend.onrender.com/api/entries", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => setEntries([]));

    setQuizCompleted(false);
    setHabitsTracked(false);
  }, []);

  const hasActivity = entries.length > 0 || quizCompleted || habitsTracked;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to home
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1>👋 Welcome back, {userName}!</h1>
        <div className="dashboard-actions">
          <ThemeToggle />
          <button className="logout-button" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {!hasActivity ? (
        <div className="feature-cards">
          <button onClick={() => (window.location.href = "/entry/new")}>📓 Start Journal</button>
          <button onClick={() => alert("Quiz coming soon!")}>🧠 Daily Quiz</button>
          <button onClick={() => alert("Habit Tracker coming soon!")}>📊 Habit Tracker</button>
          <button onClick={() => alert("Planner coming soon!")}>📅 Daily Planner</button>
        </div>
      ) : (
        <div className="insights-section">
          <div className="insight-box">📈 Mood Insights: Coming soon</div>
          <div className="insight-box">🧘 Habit Advice: Coming soon</div>
          <div className="insight-box">📝 Journal Summary: {entries.length} entries</div>
        </div>
      )}
    </div>
  );
}
