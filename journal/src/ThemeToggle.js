import React from "react";
import { useTheme } from "./ThemeContext";
import { themes } from "./themePalettes";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { setTheme, themeName } = useTheme();

  return (
    <div className="theme-toggle">
      {Object.entries(themes).map(([name, palette]) => (
        <button
          key={name}
          className={`theme-dot ${themeName === name ? "active" : ""}`}
          style={{ background: palette[0] }}
          onClick={() => setTheme(name)}
        />
      ))}
    </div>
  );
};

export default ThemeToggle;
