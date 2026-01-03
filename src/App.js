import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/HeaderComponent.js";
import Profile from "./Components/ProfileComponent.js";
import Footer from "./Components/FooterComponent.js";
import GuildPage from "./Components/GuildProfileComponent.js";
import ActivityCheck from "./Components/ActivityCheckComponent.js";
import LeaderboardComponent from "./Components/LeaderboardComponent.js";
import AchievementsComponent from "./Components/AchievementsComponent.js";
import NewsComponent from "./Components/NewsComponent.js";
import ItemsComponent from "./Components/ItemsComponent.js";

import { PlayerContext, PlayerProvider } from "./PlayerContext.js";

import {} from "@fortawesome/free-brands-svg-icons";

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
import "./CSS/ItemsComponent.css";

function App() {
  const { isSettingsOpen } = useContext(PlayerContext);

  useEffect(() => {}, [isSettingsOpen]);

  return (
    <PlayerProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/guild" element={<GuildPage />} />
            <Route path="/activity-check" element={<ActivityCheck />} />
            <Route path="/leaderboard" element={<LeaderboardComponent />} />
            <Route path="/achievements" element={<AchievementsComponent />} />
            <Route path="/items" element={<ItemsComponent />} />
            <Route path="/news" element={<NewsComponent />} />
          </Routes>
          <Footer />
        </div>
      </Router>{" "}
    </PlayerProvider>
  );
}

export default App;
