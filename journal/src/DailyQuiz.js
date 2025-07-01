import React, { useState, useEffect } from "react";
import { themes } from "./themePalettes";
import { applyCSSVariables } from "./ThemeContext";
import "./dailyQuiz.css";

export default function DailyQuiz() {
  // Apply global theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes[savedTheme]) {
      applyCSSVariables(themes[savedTheme]);
    }
  }, []);
  const [form, setForm] = useState({
    mood: "",
    energy: "",
    sleepQuality: "",
    stressLevel: "",
    exercise: "",
    hydration: "",
    healthIssues: "",
    tookCare: false,
    eatingHabit: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Submission failed.");
    }
  };

  const renderScale = (name, label, options) => (
    <div className="scale-group">
      <label className="scale-label">{label}</label>
      <div className="scale-options">
        {options.map((opt) => (
          <label key={opt.value} className="scale-option">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={form[name] === opt.value}
              onChange={handleChange}
              required
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="quiz-wrapper">
      <h2>🧠 Daily Mood & Health Quiz</h2>
      <form onSubmit={handleSubmit} className="quiz-form">
        
        {renderScale("mood", "How is your mood today?", [
          { value: "1", label: "1. 😞" },
          { value: "2", label: "2. 🙁" },
          { value: "3", label: "3. 😐" },
          { value: "4", label: "4. 🙂" },
          { value: "5", label: "5. 😄" },
        ])}

        {renderScale("energy", "How much energy do you have?", [
          { value: "1", label: "1. Drained" },
          { value: "2", label: "2. Low" },
          { value: "3", label: "3. Okay" },
          { value: "4", label: "4. Good" },
          { value: "5", label: "5. Full" },
        ])}

        {renderScale("stressLevel", "How stressed are you?", [
          { value: "1", label: "1. None" },
          { value: "2", label: "2. Mild" },
          { value: "3", label: "3. Moderate" },
          { value: "4", label: "4. High" },
          { value: "5", label: "5. Overwhelmed" },
        ])}

        {renderScale("sleepQuality", "How was your sleep?", [
          { value: "1", label: "1. Poor" },
          { value: "2", label: "2. Light" },
          { value: "3", label: "3. Average" },
          { value: "4", label: "4. Good" },
          { value: "5", label: "5. Excellent" },
        ])}

        {/* Exercise */}
        <label>
          Physical activity today?
          <select name="exercise" value={form.exercise} onChange={handleChange} required>
            <option value="">-- Select --</option>
            <option value="none">None</option>
            <option value="light">Light (walking)</option>
            <option value="moderate">Moderate (yoga, biking)</option>
            <option value="intense">Intense (gym, cardio)</option>
          </select>
        </label>

        {/* Hydration */}
        <label>
          Water intake today?
          <select name="hydration" value={form.hydration} onChange={handleChange} required>
            <option value="">-- Select --</option>
            <option value="low">Less than 1L</option>
            <option value="moderate">1-2L</option>
            <option value="good">2-3L</option>
            <option value="excellent">More than 3L</option>
          </select>
        </label>

        {/* Health Issues */}
        <label>
          Any health issues?
          <input
            type="text"
            name="healthIssues"
            value={form.healthIssues}
            onChange={handleChange}
            placeholder="Optional"
          />
        </label>

        {/* Self-Care */}
        <label>
          Took care of yourself?
          <input
            type="checkbox"
            name="tookCare"
            checked={form.tookCare}
            onChange={handleChange}
          />
        </label>

        {/* Eating Habits */}
        <label>
          Eating habits today?
          <select name="eatingHabit" value={form.eatingHabit} onChange={handleChange} required>
            <option value="">-- Select --</option>
            <option value="healthy">Healthy</option>
            <option value="stress-eating">Stress Eating</option>
            <option value="unhealthy">Junk Food</option>
            <option value="skipped">Skipped Meals</option>
          </select>
        </label>

        <button type="submit">Submit Quiz</button>
        <button
          type="button"
          onClick={() => window.location.href = "/dashboard"}
        >
          Back to Dashboard
        </button>
      </form>

      {message && <p className="quiz-message">{message}</p>}
    </div>
  );
}
