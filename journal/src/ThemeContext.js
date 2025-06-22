import React, { createContext, useContext, useState, useEffect } from "react";
import { themes } from "./themePalettes";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("default");

  const setTheme = (name) => {
    if (themes[name]) {
      setThemeName(name);
      localStorage.setItem("theme", name);
      applyCSSVariables(themes[name]);
    }
  };

  const applyCSSVariables = (palette) => {
    const root = document.documentElement;
    palette.forEach((color, i) => {
      root.style.setProperty(`--color-${i + 1}`, color);
    });
  };

    useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
    }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
