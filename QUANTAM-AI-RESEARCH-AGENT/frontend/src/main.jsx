// main.jsx — React app entry point
// This is the very first file React loads.
// It mounts the App component into the HTML div with id="root" (in index.html).

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Import our global styles and Tailwind

// Mount the React app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* StrictMode helps catch bugs during development — it doesn't affect production */}
    <App />
  </React.StrictMode>
);
