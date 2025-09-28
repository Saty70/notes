// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Make sure this is your Tailwind entry point
import { ThemeProvider } from "./context/ThemeContext.jsx"; // 1. Import the provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Wrap the entire App component */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
