import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../PlayerContext.js"; // Import PlayerContext
import { Link, useFetcher, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faQuestion, faGear } from "@fortawesome/free-solid-svg-icons";

import "../CSS/HeaderComponent.css";
import avatarBar from "../Assests_components/default_avatar/Profile_head_placeholder.png";
import logo from "../Assests_components/logo.png";

import guild_icon from "../Assests_components/guild_assests/guild.webp";

import {
  faWindowMinimize,
  faWindowMaximize,
  faTimes,
  faCaretLeft,
  faCaretRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

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
    clickedPlayer,
    setClickedPlayer,
    clickedGuild,
    setClickedGuild,
    isMenuVisible,
    setIsMenuVisible,
  } = useContext(PlayerContext);
  const [playerSearchInput, setPlayerSearchInput] = useState("Player");
  const [guildSearchInput, setGuildSearchInput] = useState("GuildName");
  const [displayName, setDisplayName] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [error, setError] = useState();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [blockSearch, setBlockSearch] = useState(true);
  /*   const [isMenuVisible, setIsMenuVisible] = useState(false);
   */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  const [currentPagePlayers, setCurrentPagePlayers] = useState(1);
  const [currentPageGuilds, setCurrentPageGuilds] = useState(1);
  const [itemsPerPagePlayers, setItemsPerPagePlayers] = useState(10); // Default to 10 items per page
  const [itemsPerPageGuilds, setItemsPerPageGuilds] = useState(10); // Default to 10 items per page

  /*   const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };
 */
  //
  // ADVANCED SEARCH (WIP) - 06.04.2025 */
  //
  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  /* SEARCH INPUT FUCNTIONS // ADVANCED (WIP) - 06.04.2025 */
  const handlePlayerSearchFetch = async () => {
    if (!playerSearchInput.trim()) return;

    const url = `https://api.wynncraft.com/v3/search/${playerSearchInput}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const result = await response.json();

      const players = Object.values(result.players || {});
      console.log("PLAYER SEARCH:", players);

      setSearchResults((prev) => ({
        ...prev,
        players,
      }));
    } catch (error) {
      console.error("Player search error:", error);
      setError("Failed to fetch player results.");
    }
  };

  const handleGuildSearchFetch = async () => {
    if (!guildSearchInput.trim()) return;

    const url = `https://api.wynncraft.com/v3/search/${guildSearchInput}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const result = await response.json();

      const guilds = Object.values(result.guilds || {}).map((g) => ({
        name: g.name,
        prefix: g.prefix,
      }));
      const prefixes = Object.values(result.guildsPrefix || {}).map((g) => ({
        name: g.name,
        prefix: g.prefix,
      }));

      const allGuilds = [
        ...new Map(
          [...guilds, ...prefixes].map((g) => [`${g.name}-${g.prefix}`, g])
        ).values(),
      ];

      console.log("GUILD SEARCH:", allGuilds);

      setSearchResults((prev) => ({
        ...prev,
        guilds: allGuilds,
      }));
    } catch (error) {
      console.error("Guild search error:", error);
      setError("Failed to fetch guild results.");
    }
  };

  const debouncedPlayerSearch = debounce(handlePlayerSearchFetch, 300);
  const debouncedGuildSearch = debounce(handleGuildSearchFetch, 300);

  useEffect(() => {
    if ((playerSearchInput || "").trim()) {
      debouncedPlayerSearch();
    }
  }, [playerSearchInput]);

  useEffect(() => {
    if ((guildSearchInput || "").trim()) {
      debouncedGuildSearch();
    }
  }, [guildSearchInput]);

  const renderSearchResults = () => {
    if (!playerSearchInput.trim() && !guildSearchInput.trim()) {
      return null;
    }

    // Calculate pagination for players
    const indexOfLastPlayer = currentPagePlayers * itemsPerPagePlayers;
    const indexOfFirstPlayer = indexOfLastPlayer - itemsPerPagePlayers;
    const currentPlayers = searchResults.players.slice(
      indexOfFirstPlayer,
      indexOfLastPlayer
    );

    // Calculate pagination for guilds
    const indexOfLastGuild = currentPageGuilds * itemsPerPageGuilds;
    const indexOfFirstGuild = indexOfLastGuild - itemsPerPageGuilds;
    const currentGuilds = searchResults.guilds.slice(
      indexOfFirstGuild,
      indexOfLastGuild
    );

    // Calculate total pages for players and guilds
    const totalPagesPlayers = Math.ceil(
      searchResults.players.length / itemsPerPagePlayers
    );
    const totalPagesGuilds = Math.ceil(
      searchResults.guilds.length / itemsPerPageGuilds
    );

    // Function to handle page change for players
    const handlePageChangePlayers = (pageNumber) => {
      setCurrentPagePlayers(pageNumber);
    };

    // Function to handle page change for guilds
    const handlePageChangeGuilds = (pageNumber) => {
      setCurrentPageGuilds(pageNumber);
    };

    return (
      <div className="leaderboard_selection_search_wraper_results">
        <div className="header_expand_menu_search_results">
          <div className="header_expand_menu_search_players">
            <h4 className="force-medium">Players</h4>
            <br></br>
            <ul>
              {currentPlayers.length > 0 ? (
                currentPlayers.map((player, index) => (
                  <li
                    key={index}
                    className="header_expand_menu_hover"
                    onClick={() => handleMemberClick(player)}
                  >
                    {player}
                  </li>
                ))
              ) : (
                <li>No players found.</li>
              )}
            </ul>
            <br></br>
            <div className="header_expand_menu_pagination">
              <section className="flex">
                {" "}
                <button
                  onClick={() =>
                    handlePageChangePlayers(currentPagePlayers - 1)
                  }
                  disabled={currentPagePlayers === 1}
                >
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </button>{" "}
                <button
                  onClick={() =>
                    handlePageChangePlayers(currentPagePlayers - 1)
                  }
                  disabled={currentPagePlayers === 1}
                >
                  <FontAwesomeIcon icon={faCaretLeft} />
                </button>
              </section>
              <div className="pagination_buttons">
                {Array.from({ length: totalPagesPlayers }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChangePlayers(page)}
                      className={currentPagePlayers === page ? "active" : ""}
                    >
                      {page}
                    </button>
                  )
                )}{" "}
              </div>
              <section className="flex">
                {" "}
                <button
                  onClick={() =>
                    handlePageChangePlayers(currentPagePlayers + 1)
                  }
                  disabled={currentPagePlayers === totalPagesPlayers}
                >
                  <FontAwesomeIcon icon={faCaretRight} />
                </button>{" "}
                <button
                  onClick={() => {
                    handlePageChangePlayers(totalPagesPlayers);
                  }}
                  disabled={currentPagePlayers === totalPagesPlayers}
                >
                  <FontAwesomeIcon icon={faAnglesRight} />{" "}
                </button>
              </section>
            </div>
          </div>
          <div className="header_expand_menu_search_guilds">
            <h4 className="force-medium">Guilds</h4>
            <br></br>
            <ul>
              {currentGuilds.length > 0 ? (
                currentGuilds.map((guild, index) => (
                  <li
                    key={index}
                    className="header_expand_menu_hover"
                    onClick={() => handleGuildClick(guild.name)}
                  >
                    {guild.name} ({guild.prefix})
                  </li>
                ))
              ) : (
                <li>No guilds found.</li>
              )}
            </ul>
            <br></br>
            <div className="header_expand_menu_pagination">
              <section className="flex">
                {" "}
                <button
                  onClick={() => handlePageChangeGuilds(currentPageGuilds - 1)}
                  disabled={currentPageGuilds === 1}
                >
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </button>{" "}
                <button
                  onClick={() => handlePageChangeGuilds(currentPageGuilds - 1)}
                  disabled={currentPageGuilds === 1}
                >
                  <FontAwesomeIcon icon={faCaretLeft} />
                </button>
              </section>
              <div className="pagination_buttons">
                {Array.from({ length: totalPagesGuilds }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChangeGuilds(page)}
                      className={currentPageGuilds === page ? "active" : ""}
                    >
                      {page}
                    </button>
                  )
                )}{" "}
              </div>
              <section className="flex">
                {" "}
                <button
                  onClick={() => handlePageChangeGuilds(currentPageGuilds + 1)}
                  disabled={currentPageGuilds === totalPagesGuilds}
                >
                  <FontAwesomeIcon icon={faCaretRight} />
                </button>{" "}
                <button
                  onClick={() => {
                    handlePageChangeGuilds(totalPagesGuilds);
                  }}
                  disabled={currentPageGuilds === totalPagesGuilds}
                >
                  <FontAwesomeIcon icon={faAnglesRight} />{" "}
                </button>
              </section>
            </div>
          </div>
        </div>{" "}
        {/* Pagination Controls */}
      </div>
    );
  };

  useEffect(() => {
    const storedPlayer = localStorage.getItem("playerName");
    const storedGuild = localStorage.getItem("guildName");

    if (storedPlayer) {
      setPlayerSearchInput(storedPlayer);
      setDisplayName(storedPlayer);
    }

    if (storedGuild) {
      setGuildSearchInput(storedGuild);
    }
  }, []);

  /* Handeling global .guild_page_members_item click for character details*/
  /* Creating new tab for clicked player from guild apge */

  const handleGuildClick = (clickedGuild) => {
    setGuildNameProfile(clickedGuild); // Update playerName in context
    localStorage.setItem("guildName", clickedGuild); // Save to local storage
    setGuildSearchInput(clickedGuild);
    setDisplayName(clickedGuild); // updates input text
    setIsMenuVisible(false);
    navigate(`/guild`);
  };
  const handleMemberClick = (clickedPlayer) => {
    setPlayerName(clickedPlayer);
    localStorage.setItem("playerName", clickedPlayer);
    setPlayerSearchInput(clickedPlayer);
    setDisplayName(clickedPlayer); // updates input text
    setIsMenuVisible(false);
    navigate(`/`);
  };

  return (
    <header>
      {" "}
      <div className="nav">
        <div className="profile_topbar_container no-drag">
          <div className="logo_topbar_container flex flex-center pR-1-5">
            <img
              src={logo}
              className="logo"
              style={{ maxWidth: "4rem" }}
              onClick={() => {
                console.log("Search input: ", searchInput);
                console.log("ClickedPlayer: ", clickedPlayer);
                console.log("PlayerName: ", playerName);
                console.log("Is visible: ", isMenuVisible);
              }}
            ></img>
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
              value={playerSearchInput}
              onChange={(e) => {
                const value = e.target.value;
                setIsMenuVisible(true);
                setPlayerSearchInput(value);
                setPlayerName(value);
                localStorage.setItem("playerName", value);
              }}
              placeholder="Playername"
              aria-label="Search profile"
            />
          </div>
          <div className="nav_btns_profile_search_section">
            <img src={guild_icon} alt="Avatar" id="topbar_avatar" />
            <input
              className="nav_btns_profile_search_section_input"
              type="text"
              value={guildSearchInput}
              onChange={(e) => {
                const value = e.target.value;
                setIsMenuVisible(true);
                setGuildSearchInput(value);
                setGuildNameProfile(value);
                localStorage.setItem("guildName", value);
              }}
              placeholder="Guild/TAG"
              aria-label="Search profile"
            />
          </div>
        </div>
        <div className="nav_right_container no-drag">
          {/* SECTION OF BTNS AND LINKS */}
          <div className="flex-center gap-1">
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
          </div>

          <section className="nav_custom_controls">
            <button
              onClick={() => window.electron.minimize()}
              className="control-button"
            >
              <FontAwesomeIcon icon={faWindowMinimize} />
            </button>
            <button
              onClick={() => window.electron.maximize()}
              className="control-button"
            >
              <FontAwesomeIcon icon={faWindowMaximize} />
            </button>
            <button
              onClick={() => window.electron.close()}
              className="control-button"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </section>
        </div>
      </div>
      <div className="header_expand_menu_container">
        {isMenuVisible && renderSearchResults()}
      </div>
    </header>
  );
};

export default Header;
