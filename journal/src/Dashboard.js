import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./Dashboard.css";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Fetch user info + journal entries
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "");
      } catch {
        console.error("Invalid token");
      }
    }

    fetch("http://localhost:5000/api/entries", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => setEntries([]));
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Delete journal entry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/entries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setEntries(entries.filter((e) => e._id !== id));
      } else {
        alert("Failed to delete entry.");
      }
    } catch {
      alert("Network error deleting entry.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header">
        <h1>👋 Welcome back, {userName}!</h1>
        <div className="dashboard-actions">
          <ThemeToggle />
          <button className="logout-button" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Diamond Layout Feature Buttons */}
      <div className="feature-cards">
        <button onClick={() => navigate("/journalEntry")}>📓 Start Journal</button>
        <button onClick={() => navigate("/DailyQuiz")}>🧠 Daily Quiz</button>
        <button onClick={() => alert("Habit Tracker coming soon!")}>📊 Habit Tracker</button>
        <button onClick={() => alert("Planner coming soon!")}>📅 Daily Planner</button>
      </div>

      {/* Journal Summary */}
      <div className="insight-box">
        📝 Journal Summary: {entries.length} entries
      </div>

      {/* Entries List */}
      {entries.length > 0 && (
        <div className="journal-entries">
          <h2>Your Journal Entries</h2>
          {entries.map((entry) => (
            <div key={entry._id} className="entry-card">
              <h3>{entry.title}</h3>
              <p>{new Date(entry.createdAt).toLocaleString()}</p>
              <div className="entry-actions">
                <button onClick={() => navigate(`/editEntry/${entry._id}`)}>✏️ Edit</button>
                <button onClick={() => handleDelete(entry._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      <div className="insights-section">
        <div className="insight-box">📈 Mood Insights: Coming soon</div>
        <div className="insight-box">🧘 Habit Advice: Coming soon</div>
      </div>
    </div>
  );
}
