import React, { useContext } from "react";
import { PlayerContext } from "../PlayerContext.js"; // Import PlayerContext
import { Link, useFetcher } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faQuestion, faGear } from "@fortawesome/free-solid-svg-icons";

import "../CSS/HeaderComponent.css";
import avatarBar from "../Assests_components/Profile_head_placeholder.png";

const Header = () => {
  const { playerName, setPlayerName } = useContext(PlayerContext);
  const handleInputChange = (e) => {
    const newPlayerName = e.target.value;
    setPlayerName(newPlayerName); // Update playerName in context
    localStorage.setItem("playerName", newPlayerName); // Save to local storage
  };

  return (
    <header className="nav">
      <div className="profile_topbar_container">
        <img src={avatarBar} alt="Avatar" id="topbar_avatar" />
        <div className="nav_btns_profile_search_section pL-1-5">
          <label>
            <>Profile</>
          </label>
          <input
            className="nav_btns_profile_search_section_input"
            type="text"
            value={playerName}
            onChange={handleInputChange}
            placeholder="Playername"
            aria-label="Search profile"
          />
        </div>
      </div>

      <nav className="nav_right_container">
        <section className="nav_btns_section">
          <Link to="/">
            <h5>HOME</h5>
          </Link>{" "}
          <Link to="/activity-check">
            <h5>Tools</h5>
          </Link>{" "}
          <h5>Stats</h5>
          <h5>Leaderboard</h5>
          <h5>Settings</h5>
          <h5>Credits</h5>
        </section>
        <section className="nav_socials_section">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join us on Discord"
          >
            <FontAwesomeIcon icon={faDiscord} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join us on Discord"
          >
            <FontAwesomeIcon icon={faQuestion} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join us on Discord"
          >
            <FontAwesomeIcon icon={faGear} />
          </a>
        </section>
      </nav>
    </header>
  );
};

export default Header;
