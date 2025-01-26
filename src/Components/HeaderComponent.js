import React, { useContext } from "react";
import { PlayerContext } from "../PlayerContext.js"; // Import PlayerContext
import { Link, useFetcher, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faQuestion, faGear } from "@fortawesome/free-solid-svg-icons";

import "../CSS/HeaderComponent.css";
import avatarBar from "../Assests_components/default_avatar/Profile_head_placeholder.png";
import logo from "../Assests_components/logo.png";

import guild_icon from "../Assests_components/guild_assests/guild.webp";

const Header = () => {
  const {
    playerName,
    setPlayerName,
    playerData,
    guildNameProfile,
    setGuildNameProfile,
    guildDataProfile,
    setGuildDataProfile,
    isSettingsOpen,
    setIsSettingsOpen,
    openSettings,
    closeSettings,
  } = useContext(PlayerContext);

  const handleInputChange = (e) => {
    const newPlayerName = e.target.value;
    setPlayerName(newPlayerName); // Update playerName in context
    localStorage.setItem("playerName", newPlayerName); // Save to local storage
  };
  const handleInputChangeGuild = (e) => {
    const newGuildName = e.target.value;
    setGuildNameProfile(newGuildName); // Update playerName in context
    localStorage.setItem("guildName", newGuildName); // Save to local storage
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  return (
    <header className="nav">
      <div className="profile_topbar_container">
        <div className="logo_topbar_container flex flex-center pR-1-5">
          <img src={logo} className="logo" style={{ maxWidth: "4rem" }}></img>
        </div>
        <section></section>

        <div className="nav_btns_profile_search_section pR-1-5">
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
        <div className="nav_btns_profile_search_section">
          <img src={guild_icon} alt="Avatar" id="topbar_avatar" />
          <input
            className="nav_btns_profile_search_section_input"
            type="text"
            value={guildNameProfile}
            onChange={handleInputChangeGuild}
            placeholder="Guild/TAG"
            aria-label="Search profile"
          />
        </div>
      </div>
      <nav className="nav_right_container">
        <section className="nav_btns_section">
          <NavLink to="/" className="link">
            <h5>Profile</h5>
          </NavLink>{" "}
          <NavLink to="/guild" className="link">
            <h5>Guild</h5>
          </NavLink>
          <NavLink to="/activity-check" className="link">
            <h5>Tools</h5>
          </NavLink>{" "}
          <NavLink to="/leaderboard" className="link">
            <h5>Leaderboard</h5>
          </NavLink>{" "}
          <NavLink to="/achievements" className="link">
            <h5>Achievements</h5>
          </NavLink>{" "}
          <NavLink to="/items" className="link">
            <h5>Items</h5>
          </NavLink>
          <NavLink to="/news" className="link">
            <h5>News</h5>
          </NavLink>{" "}
          <NavLink to="/map" className="link">
            <h5>Map</h5>
          </NavLink>
        </section>{" "}
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
          <button
            onClick={() => {
              handleSettingsClick();
              console.log(isSettingsOpen);
            }}
          >
            {" "}
            <FontAwesomeIcon icon={faGear} />
          </button>
        </section>
      </nav>
    </header>
  );
};

export default Header;
