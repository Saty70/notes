// src/context/ThemeContext.jsx

import { createContext, useState, useEffect, useContext } from "react";

// 1. Create the context
const ThemeContext = createContext();

// 2. Create the provider component
export const ThemeProvider = ({ children }) => {
  // State to hold the current theme. We initialize it from localStorage or default to 'light'.
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  // This effect runs whenever the theme state changes
  useEffect(() => {
    const root = window.document.documentElement; // This is the <html> tag

    // Remove the old theme class and add the new one
    const oldTheme = theme === "light" ? "dark" : "light";
    root.classList.remove(oldTheme);
    root.classList.add(theme);

    // Save the user's choice to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Provide the theme and the toggle function to the rest of the app
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Create a custom hook for easy access to the context
export const useTheme = () => useContext(ThemeContext);
