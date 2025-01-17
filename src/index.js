// index.js (React)
import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import App from "./App.js";
import "./index.css";
import { PlayerProvider } from "./PlayerContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PlayerProvider>
    <App />
  </PlayerProvider>
);
