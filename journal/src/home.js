import React from "react";
import { Link } from "react-router-dom";
import HomeFeaturesCarousel from "./carousel";
import "./home.css";

function Home() {
    const isMobile = window.innerWidth < 480;

    return (
        <div className="home-wrapper no-theme">
        <div className="home-wrapper">
            {/* Auth Buttons */}
            <div className="auth-buttons">
                <Link to="/login" className="btn pink">🔐 Log In</Link>
                <Link to="/signup" className="btn pink">📝 Sign Up</Link>
            </div>

            {/* Hero Section */}
            <section className="hero-section">
                <h1 className="hero-title">
                    Your Personal Smart Health Journal
                </h1>
                <p className="hero-subtitle">
                    Track your mood, sleep, diet, and more—get smart health insights powered by AI.
                </p>
                <Link
                    to="/signup"
                    className="cta-button"
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                     Start Journaling Now
                </Link>
            </section>

            {/* Features Carousel Section */}
            <HomeFeaturesCarousel />

            {/* How It Works */}
            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="how-it-steps">
                    {[
                        { icon: "📝", label: "1. Sign Up" },
                        { icon: "📅", label: "2. Log Daily Health" },
                        { icon: "🧠", label: "3. Get Smart Insights (coming soon...) " },
                    ].map((step, i) => (
                        <React.Fragment key={i}>
                            <div className="step">
                                <div className="step-icon">{step.icon}</div>
                                <div className="step-label">{step.label}</div>
                            </div>
                            {i < 2 && <div className="step-arrow">→</div>}
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div>
                    &copy; {new Date().getFullYear()} Smart Health Journal &mdash; All rights reserved.
                </div>
                <div className="footer-love">
                    Made with <span style={{ color: "#f72585ff" }}>❤</span> by You
                </div>
            </footer>
        </div>
        </div>
    );
}

export default Home;
