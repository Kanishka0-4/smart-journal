import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { themes } from "./themePalettes";
import { applyCSSVariables } from "./ThemeContext";
import "./JournalEntry.css";

export default function JournalEntry() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes[savedTheme]) {
      applyCSSVariables(themes[savedTheme]);
    }
  }, []);

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 1000);
    return () => clearTimeout(timer);
  }, [text]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!text.trim()) {
      setError("Entry cannot be empty");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error saving entry");
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Network error", err);
      setError("Network error");
    }
  };

  const [title, setTitle] = useState("New Journal Entry");

  return (
    <div id="journal-entry-wrapper">
      <div className="journal-container">
        <div className="journal-header">
          <input
            type="text"
            className="journal-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Entry Title"
          />
          <p className="journal-subtitle">Express your thoughts and capture your moments</p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const token = localStorage.getItem("token");
            if (!text.trim()) {
              setError("Entry cannot be empty");
              return;
            }
            try {
              const res = await fetch("http://localhost:5000/api/entries", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text, title }),
              });
              const data = await res.json();
              if (!res.ok) {
                setError(data.message || "Error saving entry");
                return;
              }
              navigate("/dashboard");
            } catch (err) {
              console.error("❌ Network error", err);
              setError("Network error");
            }
          }}
          className="journal-form"
        >
          <label htmlFor="journal-text" className="journal-label">
            What's on your mind today?
          </label>
          <textarea
            id="journal-text"
            className="journal-textarea"
            placeholder="Start writing your thoughts here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="journal-stats">
            <div className="char-count">{text.length} characters</div>
            <div className="word-count">{wordCount} words</div>
            {isTyping && <div className="typing-indicator">Writing...</div>}
          </div>

          {error && (
            <div className="journal-error">{error}</div>
          )}

          <div className="journal-buttons">
            <button
              type="submit"
              disabled={!text.trim()}
              className="save-button"
            >
              📂 Save My Thoughts
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="back-button"
            >
              ↩️ Back to Dashboard
            </button>
          </div>
        </form>

        <div className="journal-quote">
          <blockquote>
            "The life of every man is a diary in which he means to write one story, and writes another."
          </blockquote>
          <cite>— J.M. Barrie</cite>
        </div>
      </div>
    </div>
  );
}
