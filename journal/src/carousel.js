import React from "react";
import "./carousel.css";

const features = [
  {
    icon: "😊",
    title: "Mood & Wellness Tracking",
    desc: "Log your mood, sleep, activity, and diet daily.",
  },
  {
    icon: "🧠",
    title: "AI-Powered Insights",
    desc: "Get smart summaries from your journal entries.",
  },
  {
    icon: "📊",
    title: "Visual Dashboards",
    desc: "Spot trends with graphs and charts.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "Your data is encrypted and protected with JWT-based login.",
  },
];

export default function HomeFeaturesCarousel() {
  return (
    <section className="carousel-wrapper">
      <h2 className="carousel-title">Core Features</h2>
      <div className="carousel-track">
        {features.map((f, i) => (
          <div className="carousel-card" key={i}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
