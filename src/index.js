// index.js (React)
import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import App from "./App.js";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
