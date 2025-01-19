import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useFetcher,
} from "react-router-dom";
import Header from "./Components/HeaderComponent.js";
import Profile from "./Components/ProfileComponent.js";
import Footer from "./Components/FooterComponent.js";
import GuildPage from "./Components/GuildProfileComponent.js";
import ActivityCheck from "./Components/ActivityCheckComponent.js";
import LeaderboardComponent from "./Components/LeaderboardComponent.js";
import AchievementsComponent from "./Components/AchievementsComponent.js";
import NewsComponent from "./Components/NewsComponent.js";

import { PlayerContext, PlayerProvider } from "./PlayerContext.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import "./CSS/App.css";
import "./CSS/Classes.css";
import "./CSS/HeaderComponent.css";
import "./CSS/ProfileComponent.css";
import "./CSS/FooterComponent.css";
import "./CSS/ActivityCheckComponent.css";
import "./CSS/GuildPageComponent.css";
import "./CSS/SettingsComponent.css";
import "./CSS/LeaderboardComponent.css";
import "./CSS/AchievementsComponent.css";
import "./CSS/NewsComponent.css";

/* function SettingsMenu() {
  const { isSettingsOpen, setIsSettingsOpen, openSettings, closeSettings } =
    useContext(PlayerContext);

  return (
    <div>
      {" "}
      {isSettingsOpen === true && (
        <div className="settings_wrapper">
          <div className="settings_popup_container">
            <div className="settings_content">
              <h5>Options</h5>
              <div className="settings_content_inner">
                <section>General</section>
              </div>
            </div>

            <section className="settings_popup_btns">
              <button
                className="settings_btn settings_close"
                onClick={() => {
                  closeSettings();
                }}
              >
                CANCEL{" "}
              </button>{" "}
              <button
                className="settings_btn settings_apply"
                disabled
                onClick={() => {}}
              >
                APPLY{" "}
              </button>{" "}
              <button
                className="settings_btn settings_reset"
                onClick={() => {}}
              >
                RESTORE DEFAULT
              </button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
} */

function App() {
  const { isSettingsOpen, setIsSettingsOpen, openSettings, closeSettings } =
    useContext(PlayerContext);

  useEffect(() => {
    console.log("Settings changes:", isSettingsOpen);
  }, [isSettingsOpen]);

  console.log("isSettingsOpen:", isSettingsOpen);

  return (
    <PlayerProvider>
      {" "}
      <Router>
        <div className="App">
          {/* Settings Popup */}
          {/*           <SettingsMenu />
           */}{" "}
          <Header />
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/guild" element={<GuildPage />} />
            <Route path="/activity-check" element={<ActivityCheck />} />
            <Route path="/leaderboard" element={<LeaderboardComponent />} />
            <Route
              path="/achievements"
              element={<AchievementsComponent />}
            />{" "}
            <Route path="/news" element={<NewsComponent />} />
          </Routes>
          <Footer />
        </div>
      </Router>{" "}
    </PlayerProvider>
  );
}

export default App;
