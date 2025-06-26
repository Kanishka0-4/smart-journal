import React, { createContext, useContext, useState, useEffect } from "react";
import { themes } from "./themePalettes";

const ThemeContext = createContext();

const applyCSSVariables = (palette) => {
  const root = document.documentElement;
  palette.forEach((color, i) => {
    root.style.setProperty(`--color-${i + 1}`, color);
  });
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("default");

  const setTheme = (name) => {
    if (themes[name]) {
      setThemeName(name);
      localStorage.setItem("theme", name);
      applyCSSVariables(themes[name]);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved && themes[saved]) {
      setThemeName(saved);
      applyCSSVariables(themes[saved]);
    } else {
      applyCSSVariables(themes["default"]); // fallback to default
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export { applyCSSVariables };
