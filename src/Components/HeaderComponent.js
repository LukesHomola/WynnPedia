import React, { useContext } from "react";
import { PlayerContext } from "../PlayerContext.js"; // Import PlayerContext
import { Link, useFetcher } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faQuestion, faGear } from "@fortawesome/free-solid-svg-icons";

import "../CSS/HeaderComponent.css";
import avatarBar from "../Assests_components/Profile_head_placeholder.png";
import logo from "../Assests_components/logo.png";

const Header = () => {
  const { playerName, setPlayerName, playerData } = useContext(PlayerContext);

  const handleInputChange = (e) => {
    const newPlayerName = e.target.value;
    setPlayerName(newPlayerName); // Update playerName in context
    localStorage.setItem("playerName", newPlayerName); // Save to local storage
  };

  return (
    <header className="nav">
      <div className="profile_topbar_container">
        <div className="logo_topbar_container flex flex-center pR-1-5">
          <img src={logo} className="logo" style={{ maxWidth: "4rem" }}></img>
        </div>
        <section></section>

        <div className="nav_btns_profile_search_section">
          <img
            src={`https://crafatar.com/renders/head/${playerData?.uuid}`}
            alt="Avatar"
            id="topbar_avatar"
          />
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
          <Link to="/" className="link">
            <h5 className="link_hover">Profile</h5>
          </Link>{" "}
          <Link to="/activity-check" className="link">
            <h5 className="link_hover">Tools</h5>
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
