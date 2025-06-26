// GettingStarted.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./GettingStarted.css";

export default function GettingStarted() {
  const navigate = useNavigate();

  return (
    <div className="getting-started-wrapper">
      <h1>🎉 Welcome to Smart Health Journal!</h1>
      <p>
        We're excited to help you track your health and get meaningful insights. Here's what you can do:
      </p>

      <div className="onboarding-steps">
        <div>📝 Log your daily mood, sleep, activity & diet</div>
        <div>🧠 Get AI-powered health insights</div>
        <div>📊 Visualize trends & track improvements</div>
      </div>

      <div className="onboarding-buttons">
        <button onClick={() => navigate("/journalEntry")}>Start Journaling</button>
        <button onClick={() => navigate("/dashboard")} className="skip-btn">Skip to Dashboard</button>
      </div>
    </div>
  );
}
