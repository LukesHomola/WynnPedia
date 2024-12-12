import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/HeaderComponent.js";
import Profile from "./Components/ProfileComponent.js";
import Footer from "./Components/FooterComponent.js";
import ActivityCheck from "./Components/ActivityCheckComponent.js";

import { PlayerProvider } from "./PlayerContext.js";

import "./CSS/App.css";
import "./CSS/Classes.css";
import "./CSS/HeaderComponent.css";
import "./CSS/ProfileComponent.css";
import "./CSS/FooterComponent.css";
import "./CSS/ActivityCheckComponent.css";

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="App">
          <Header />

          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/activity-check" element={<ActivityCheck />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
