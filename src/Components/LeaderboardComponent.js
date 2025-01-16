import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "../CSS/LeaderboardComponent.css";
import { PlayerContext } from "../PlayerContext.js";

import guildImg from "../Assests_components/Leaderboard/Section_icons/guild.webp";
import playerImg from "../Assests_components/Leaderboard/Section_icons/player.webp";
import gamemodeImg from "../Assests_components/Leaderboard/Section_icons/gamemode.webp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import {
  faCaretLeft,
  faCaretRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

// Import the images for each profession
import scribing from "../Assests_components/professions/Scribing.webp";
import cooking from "../Assests_components/professions/Cooking.webp";
import woodcutting from "../Assests_components/professions/Woodcutting.webp";
import farming from "../Assests_components/professions/Farming.webp";
import mining from "../Assests_components/professions/Mining.webp";
import alchemism from "../Assests_components/professions/Alchemism.webp";
import jeweling from "../Assests_components/professions/Jeweling.webp";
import weaponsmithing from "../Assests_components/professions/Weaponsmithing.webp";
import armouring from "../Assests_components/professions/Armouring.webp";
import tailoring from "../Assests_components/professions/Tailoring.webp";
import fishing from "../Assests_components/professions/Fishing.webp";
import woodworking from "../Assests_components/professions/Woodworking.webp";

// Import the images for each total completion
import wars_completion from "../Assests_components/content_completion/wars.webp";
import global_total_completion from "../Assests_components/content_completion/global_total_completions.webp";
import total_completion from "../Assests_components/content_completion/total_completions.webp";

// Import the images for each total lvl
import total from "../Assests_components/total_levels/total.webp";
import profs from "../Assests_components/total_levels/profs.webp";
import combat from "../Assests_components/total_levels/combat.webp";

// Import the games for each raid
import NoL from "../Assests_components/raids/NoL.webp";
import NotG from "../Assests_components/raids/NotG.webp";
import TCC from "../Assests_components/raids/TCC.webp";
import TNA from "../Assests_components/raids/TNA.webp";

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

/* MetaData table for options */
const playerTableConfigs = {
  default: [
    { key: "name", label: "NAME" },
    { key: "score", label: "SCORE" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  woodcuttingLevel: [
    { key: "name", label: "NAME" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  scribing: [
    { key: "metadata.totalLevel", label: "Total Level" },
    { key: "metadata.completions", label: "Completions" },
    { key: "metadata.gambits", label: "Gambits" },
  ],
  /*  */
  /* Total Content */
  playerContent: [
    { key: "name", label: "NAME" },
    { key: "score", label: "CONTENT" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "characterType", label: "CHARACTER" },
  ],
  /* Global Total Content */
  globalPlayerContent: [
    { key: "name", label: "NAME" },
    { key: "score", label: "CONTENT" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  /* Ward compl. */
  warsCompletion: [
    { key: "name", label: "NAME" },
    { key: "score", label: "COMPLETITION" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  grootslangSrPlayers: [
    { key: "name", label: "NAME" },
    { key: "score", label: "SCORE" },
    { key: "metadata.completions", label: "COMPLETIONS" },
    { key: "metadata.gambits", label: "GAMBITS" },
  ],
  orphionSrPlayers: [
    { key: "name", label: "NAME" },
    { key: "score", label: "SCORE" },
    { key: "metadata.completions", label: "COMPLETIONS" },
    { key: "metadata.gambits", label: "GAMBITS" },
  ],
  colossusSrPlayers: [
    { key: "name", label: "NAME" },
    { key: "score", label: "SCORE" },
    { key: "metadata.completions", label: "COMPLETIONS" },
    { key: "metadata.gambits", label: "GAMBITS" },
  ],
  namelessSrPlayers: [
    { key: "name", label: "NAME" },
    { key: "score", label: "SCORE" },
    { key: "metadata.completions", label: "COMPLETIONS" },
    { key: "metadata.gambits", label: "GAMBITS" },
  ],
  grootslangCompletion: [
    { key: "name", label: "NAME" },
    { key: "score", label: "COMPLETIONS" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  orphionCompletion: [
    { key: "name", label: "NAME" },
    { key: "score", label: "COMPLETIONS" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  colossusCompletion: [
    { key: "name", label: "NAME" },
    { key: "score", label: "COMPLETIONS" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  namelessCompletion: [
    { key: "name", label: "NAME" },
    { key: "score", label: "COMPLETIONS" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  /*  */
  professionsGlobalLevel: [
    { key: "name", label: "NAME" },
    { key: "score", label: "COMPLETIONS" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],

  professionsSoloLevel: [
    { key: "name", label: "NAME" },
    { key: "score", label: "LEVEL" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.XP", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  combatGlobalLevel: [
    { key: "name", label: "NAME" },
    { key: "score", label: "LEVEL" },
    { key: "metadata.XP", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "metadata.character", label: "CHARACTR" },
  ],
  combatSoloLevel: [
    { key: "name", label: "NAME" },
    { key: "score", label: "LEVEL" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.XP", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  totalGlobalLevel: [
    { key: "name", label: "NAME" },
    { key: "score", label: "LEVEL" },
    { key: "metadata.XP", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  totalSoloLevel: [
    { key: "name", label: "NAME" },
    { key: "score", label: "TOTAL LEVEL" },
    { key: "metadata.XP", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
  ],
  /*  */
  guildLevel: [
    { key: "name", label: "NAME" },
    { key: "level", label: "LEVEL" },
    { key: "territories", label: "TERRITORIES" },
    { key: "wars", label: "WARS" },
    { key: "members", label: "MEMBERS" },
  ],
  guildTerritories: [
    { key: "name", label: "NAME" },
    { key: "territories", label: "TERRITORIES" },
    { key: "level", label: "LEVEL" },
    { key: "wars", label: "WARS" },
    { key: "members", label: "MEMBERS" },
  ],
  guildWars: [
    { key: "name", label: "NAME" },
    { key: "wars", label: "WARS" },
    { key: "territories", label: "TERRITORIES" },
    { key: "level", label: "LEVEL" },
    { key: "members", label: "MEMBERS" },
  ],
  grootslangSrGuilds: [
    { key: "name", label: "NAME" },
    { key: "score", label: "SCORE" },
    { key: "metadata.completions", label: "COMPLETIONS" },
    { key: "metadata.gambits", label: "GAMBITS" },
  ],
  orphionSrGuilds: [
    { key: "name", label: "NAME" },
    { key: "score", label: "SCORE" },
    { key: "metadata.completions", label: "COMPLETIONS" },
    { key: "metadata.gambits", label: "GAMBITS" },
  ],
  colossusSrGuilds: [
    { key: "name", label: "NAME" },
    { key: "score", label: "SCORE" },
    { key: "metadata.completions", label: "COMPLETIONS" },
    { key: "metadata.gambits", label: "GAMBITS" },
  ],
  namelessSrGuilds: [
    { key: "name", label: "NAME" },
    { key: "score", label: "SCORE" },
    { key: "metadata.completions", label: "COMPLETIONS" },
    { key: "metadata.gambits", label: "GAMBITS" },
  ],
  /*  */
  ironmanContent: [
    { key: "name", label: "NAME" },
    { key: "score", label: "CONTENT" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "characterType", label: "CHARACTER" },
  ],
  ultimateIronmanContent: [
    { key: "name", label: "NAME" },
    { key: "score", label: "CONTENT" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "characterType", label: "CHARACTER" },
  ],
  hardcoreContent: [
    { key: "name", label: "NAME" },
    { key: "score", label: "CONTENT" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "characterData.type", label: "CHARACTER" },
  ],
  craftsmanContent: [
    { key: "name", label: "NAME" },
    { key: "score", label: "CONTENT" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "characterType", label: "CHARACTER" },
  ],
  huntedContent: [
    { key: "name", label: "NAME" },
    { key: "score", label: "CONTENT" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "characterType", label: "CHARACTER" },
  ],
  huicContent: [
    { key: "name", label: "NAME" },
    { key: "score", label: "CONTENT" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "characterData.type", label: "CHARACTER" },
  ],
  huichContent: [
    { key: "name", label: "NAME" },
    { key: "score", label: "CONTENT" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "characterData.type", label: "CHARACTER" },
  ],
  hichContent: [
    { key: "name", label: "NAME" },
    { key: "score", label: "CONTENT" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "characterData.type", label: "CHARACTER" },
  ],
  hicContent: [
    { key: "name", label: "NAME" },
    { key: "score", label: "CONTENT" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "characterData.type", label: "CHARACTER" },
  ],
  hardcoreLegacyLevel: [
    { key: "name", label: "NAME" },
    { key: "score", label: "LEVEL" },
    { key: "metadata.totalLevel", label: "TOTAL LEVEL" },
    { key: "metadata.xp", label: "XP" },
    { key: "metadata.playtime", label: "PLAYTIME" },
    { key: "characterData.type", label: "CHARACTER" },
  ],
};

// Helper function to safely access nested data
const getNestedValue = (obj, path) => {
  return path
    .split(".")
    .reduce((acc, key) => (acc && acc[key] ? acc[key] : null), obj);
};

const LeaderboardComponent = () => {
  const { clickedPlayer, setClickedPlayer, clickedGuild, setClickedGuild } =
    useContext(PlayerContext); // Access playerName from context
  const [leaderboardType, setLeaderboardType] = useState([]);
  const [selectedTypePlayerGuild, setselectedTypePlayerGuild] = useState("");
  const [selectedTypePlayer, setselectedTypePlayer] = useState("playerContent");
  const [selectedTypePlayerGameMode, setselectedTypePlayerGameMode] =
    useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [selectedLeaderboard, setSelectedLeaderboard] =
    useState("leaderboardPlayers");

  const [clickedItem, setClickedItem] =
    useState("playerContent"); /* CLICKED ITEM FOR OPTION FILTER */

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState({
    players: [],
    guilds: [],
  });

  const [currentPagePlayers, setCurrentPagePlayers] = useState(1);
  const [currentPageGuilds, setCurrentPageGuilds] = useState(1);
  const [itemsPerPagePlayers, setItemsPerPagePlayers] = useState(10); // Default to 10 items per page
  const [itemsPerPageGuilds, setItemsPerPageGuilds] = useState(10); // Default to 10 items per page

  // Calculate pagination
  const indexOfLastPlayer = currentPage * itemsPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - itemsPerPage;
  const currentPlayers = searchResults.players.slice(
    indexOfFirstPlayer,
    indexOfLastPlayer
  );
  const totalPages = Math.ceil(searchResults.players.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fetch leaderboard data based on selected type
  const fetchLeaderboardData = async (type) => {
    const url = `https://api.wynncraft.com/v3/leaderboards/${type}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const result = await response.json();
      const dataArray = Object.values(result); // Convert the object to an array
      setData(dataArray); // Update state with the array
    } catch (err) {
      setError(err.message);
      setData([]); // Reset to an empty array on error
    }
  };

  // Fetch data when the selected type changes
  useEffect(() => {
    fetchLeaderboardData(selectedTypePlayer);
    console.log("API Response:", data);
  }, [selectedTypePlayer]);

  const renderSearchResults = () => {
    if (!searchInput || !searchResults) {
      return null; // Don't render if there's no input or no results
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
        <div className="leaderboard_selection_search_results">
          <div className="leaderboard_selection_search_players">
            <h4 className="force-medium">Players</h4>
            <br></br>
            <ul>
              {currentPlayers.length > 0 ? (
                currentPlayers.map((player, index) => (
                  <li
                    key={index}
                    className="leaderboard_selection_hover"
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
            <div className="leaderboard_search_pagination">
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
          <div className="leaderboard_selection_search_guilds">
            <h4 className="force-medium">Guilds</h4>
            <br></br>
            <ul>
              {currentGuilds.length > 0 ? (
                currentGuilds.map((guild, index) => (
                  <li
                    key={index}
                    className="leaderboard_selection_hover"
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
            <div className="leaderboard_search_pagination">
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

  // Render the dynamic leaderboard table
  const renderTableGuild = () => {
    const tableConfig =
      playerTableConfigs[selectedTypePlayer] || playerTableConfigs.default;

    if (!Array.isArray(data) || data.length === 0) {
      return <p>No data available.</p>;
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(data)
      ? data.slice(indexOfFirstItem, indexOfLastItem)
      : [];
    const totalPages = Array.isArray(data)
      ? Math.ceil(data.length / itemsPerPage)
      : 1;

    return (
      <div>
        <table className="leaderboard_table">
          <thead className="leaderboard_table_header">
            <tr className="leaderboard_table_header_row">
              <th>#</th>
              {tableConfig.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="leaderboard_table_body">
            {Array.isArray(currentItems) ? (
              currentItems.map((row, index) => (
                <tr
                  key={index}
                  className="leaderboard_table_body_row"
                  onClick={() => {
                    handleGuildClick(row.name);
                    console.log("Clicked on:", row.name);
                  }}
                >
                  <td> #{index + 1} </td>
                  {tableConfig.map((col) => (
                    <td
                      key={col.key}
                      className={col.key === "name" ? "name-column" : ""}
                    >
                      {/* NEEDED FOR GUILD BANNER IMG */}
                      {/*   {col.key === "name" && col.key !== "prefix" && (
                        <img
                          src={`https://crafatar.com/avatars/${row.uuid}`}
                          style={{ maxWidth: "1.5rem" }}
                          alt="Owner Avatar"
                        />
                      )} */}
                      {getNestedValue(row, col.key) || "N/A"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableConfig.length + 1}>No data available.</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="leaderboard_table_pagination">
          <button
            onClick={() => {
              handlePageChange(1);
            }}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faCaretLeft} />
          </button>
          <div className="leaderboard_table_pagination_buttons">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            ))}{" "}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </button>{" "}
          <button
            onClick={() => {
              handlePageChange(totalPages);
            }}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faAnglesRight} />{" "}
          </button>
        </div>
      </div>
    );
  };
  const renderTablePlayer = () => {
    const tableConfig =
      playerTableConfigs[selectedTypePlayer] || playerTableConfigs.default;

    if (!Array.isArray(data) || data.length === 0) {
      return <p>No data available.</p>;
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(data)
      ? data.slice(indexOfFirstItem, indexOfLastItem)
      : [];
    const totalPages = Array.isArray(data)
      ? Math.ceil(data.length / itemsPerPage)
      : 1;

    return (
      <div>
        <table className="leaderboard_table">
          <thead className="leaderboard_table_header">
            <tr className="leaderboard_table_header_row">
              <th>#</th>
              {tableConfig.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="leaderboard_table_body">
            {Array.isArray(currentItems) ? (
              currentItems.map((row, index) => (
                <tr
                  key={index}
                  className="leaderboard_table_body_row"
                  onClick={() => {
                    handleMemberClick(row.name);
                    console.log("Clicked on:", row.name);
                  }}
                >
                  <td>#{indexOfFirstItem + index + 1}</td>

                  {tableConfig.map((col) => (
                    <td
                      key={col.key}
                      className={col.key === "name" ? "name-column" : ""}
                    >
                      {col.key === "name" && col.key !== "prefix" && (
                        <img
                          src={`https://crafatar.com/avatars/${row.uuid}`}
                          style={{ maxWidth: "1.5rem" }}
                          alt="Owner Avatar"
                        />
                      )}
                      {getNestedValue(row, col.key) || "N/A"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableConfig.length + 1}>No data available.</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="leaderboard_table_pagination">
          <button
            onClick={() => {
              handlePageChange(1);
            }}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faCaretLeft} />
          </button>
          <div className="leaderboard_table_pagination_buttons">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            ))}{" "}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </button>{" "}
          <button
            onClick={() => {
              handlePageChange(totalPages);
            }}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faAnglesRight} />{" "}
          </button>
        </div>
      </div>
    );
  };
  const renderTableGamemode = () => {
    const tableConfig =
      playerTableConfigs[selectedTypePlayer] || playerTableConfigs.default;

    if (!Array.isArray(data) || data.length === 0) {
      return <p>No data available.</p>;
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(data)
      ? data.slice(indexOfFirstItem, indexOfLastItem)
      : [];
    const totalPages = Array.isArray(data)
      ? Math.ceil(data.length / itemsPerPage)
      : 1;

    return (
      <div>
        <table className="leaderboard_table">
          <thead className="leaderboard_table_header">
            <tr className="leaderboard_table_header_row">
              <th>#</th>
              {tableConfig.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="leaderboard_table_body">
            {Array.isArray(currentItems) ? (
              currentItems.map((row, index) => (
                <tr
                  key={index}
                  className="leaderboard_table_body_row"
                  onClick={() => {
                    handleMemberClick(row.name);
                    console.log("Clicked on:", row.name);
                  }}
                >
                  <td> #{index + 1} </td>
                  {tableConfig.map((col) => (
                    <td
                      key={col.key}
                      className={col.key === "name" ? "name-column" : ""}
                    >
                      {col.key === "name" && col.key !== "prefix" && (
                        <img
                          src={`https://crafatar.com/avatars/${row.uuid}`}
                          style={{ maxWidth: "1.5rem" }}
                          alt="Owner Avatar"
                        />
                      )}
                      {getNestedValue(row, col.key) || "N/A"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableConfig.length + 1}>No data available.</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="leaderboard_table_pagination">
          <button
            onClick={() => {
              handlePageChange(1);
            }}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faCaretLeft} />
          </button>
          <div className="leaderboard_table_pagination_buttons">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            ))}{" "}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </button>{" "}
          <button
            onClick={() => {
              handlePageChange(totalPages);
            }}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faAnglesRight} />{" "}
          </button>
        </div>
      </div>
    );
  };

  // Fetch function for leaderboard types
  const fetchLeaderboardTypes = async () => {
    const url = "https://api.wynncraft.com/v3/leaderboards/types";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const result = await response.json();
      if (Array.isArray(result)) {
        setLeaderboardType(result);
      } else {
        setError("Unexpected response format");
        setLeaderboardType([]); // Reset to an empty array if the format is unexpected
      }
    } catch (error) {
      setError(error.message);
      setLeaderboardType([]); // Reset to an empty array on error
    }
  };

  // Debounced version of the fetch function
  const debouncedFetchLeaderboardTypes = debounce(fetchLeaderboardTypes, 300);

  // Use effect to call debounced fetch function on component mount
  useEffect(() => {
    debouncedFetchLeaderboardTypes();
  }, []); // Only run once on mount

  // Fetch function for guild leaderboard
  const fetchLeaderboard = async () => {
    if (!selectedTypePlayer) return; // Prevent fetch if selectedTypePlayer is not set
    const url = `https://api.wynncraft.com/v3/leaderboards/${selectedTypePlayer}`; // Use selectedTypePlayer directly
    try {
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        setData(result);
        const dataArray = Object.values(result);
        setData(dataArray);
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Use effect to call fetch function when selectedTypePlayer changes
  useEffect(() => {
    fetchLeaderboard();
  }, [selectedTypePlayer]); // Dependency array to refetch if selectedTypePlayer changes

  // Use effect to call fetch function on component mount
  useEffect(() => {
    fetchLeaderboardTypes();
  }, []); // Only run once on mount

  // Function to handle table switching
  const showTable = (tableId) => {
    setSelectedLeaderboard(tableId);
  };

  // Function to handle item click
  const handleItemClick = (item) => {
    setClickedItem(item);
    setselectedTypePlayer(item);
    console.log("Selected type:", item); // Debugging
  };

  /* Handeling global .guild_page_members_item click for character details*/
  /* Creating new tab for clicked player from guild apge */
  const handleGuildClick = (clickedGuild) => {
    setClickedGuild(clickedGuild);
    navigate(`/guild`);
  };
  const handleMemberClick = (clickedPlayer) => {
    setClickedPlayer(clickedPlayer);
    navigate(`/`);
  };

  /* SEARCH INPUT FUCNTIONS */
  const handleSearchFetch = async () => {
    if (!searchInput || typeof searchInput !== "string") {
      setError("Invalid search input. Please enter a valid query.");
      return;
    }

    setSearchResults({ players: [], guilds: [] }); // Reset results
    const url = `https://api.wynncraft.com/v3/search/${searchInput}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const result = await response.json();
      console.log("SEARCH QUERY: ", result);

      // Extract player nicknames (default to empty array if players is undefined)
      const players = Object.values(result.players || {});

      // Extract guild names and prefixes (default to empty array if guilds is undefined)
      const guilds = Object.values(result.guilds || {}).map((guild) => ({
        name: guild.name,
        prefix: guild.prefix,
      }));

      // Extract guild prefixes (default to empty array if guildsPrefix is undefined)
      const guildPrefixes = Object.values(result.guildsPrefix || {}).map(
        (guild) => ({
          name: guild.name,
          prefix: guild.prefix,
        })
      );

      // Combine guilds and guildPrefixes (remove duplicates)
      const allGuilds = [...new Set([...guilds, ...guildPrefixes])];

      // Log the combined data for debugging
      console.log("COMBINED DATA: ", { players, guilds: allGuilds });

      // Set the grouped data to state
      setSearchResults({
        players,
        guilds: allGuilds,
      });
    } catch (error) {
      console.error("Search fetch error:", error);
      setError("Failed to fetch search results. Please try again.");
    }
  };
  const debouncedSearchFetch = debounce(handleSearchFetch, 300);

  useEffect(() => {
    if (searchInput) {
      debouncedSearchFetch();
    }
  }, [searchInput]);
  return (
    <div className="leaderboard_wrapper">
      <div className="leaderboard_inner">
        <br></br>
        <div className="leaderboard_selection_wrapper">
          <section
            className={`leaderboard_selection_item ${
              selectedLeaderboard === "leaderboardGuilds"
                ? "selected_leaderboard"
                : ""
            }`}
            onClick={() => {
              showTable("leaderboardGuilds");
              handleItemClick("guildLevel");
            }}
          >
            <img
              className="leaderboard_selection_item_img"
              src={guildImg}
              alt="Guild"
            />
            <h4>GUILD</h4>
          </section>
          <section
            className={`leaderboard_selection_item ${
              selectedLeaderboard === "leaderboardPlayers"
                ? "selected_leaderboard"
                : ""
            }`}
            onClick={() => {
              showTable("leaderboardPlayers");
              handleItemClick("playerContent");
            }}
          >
            <img
              className="leaderboard_selection_item_img"
              src={playerImg}
              alt="Player"
            />
            <h4>PLAYER</h4>
          </section>
          <section
            className={`leaderboard_selection_item ${
              selectedLeaderboard === "leaderboardGamemodes"
                ? "selected_leaderboard"
                : ""
            }`}
            onClick={() => {
              showTable("leaderboardGamemodes");
              handleItemClick("ironmanContent");
            }}
          >
            <img
              className="leaderboard_selection_item_img"
              src={gamemodeImg}
              alt="Gamemode"
            />
            <h4>GAMEMODE</h4>
          </section>
        </div>

        <br></br>
        <div className="leaderboard_selection_search_wrapper">
          {" "}
          <div className="leaderboard_selection_search">
            {" "}
            <br></br>
            <h5>Quick search</h5>
            <br></br>
            <input
              placeholder="Enter playername or guild... "
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                console.log("SEARCH INPUT: (ENTRIES)", searchInput);
              }}
            ></input>
            <br></br> <br></br>
          </div>
          {renderSearchResults()}
        </div>
        <br></br>
        <div className="leaderboard_table_wrapper">
          {" "}
          {selectedLeaderboard === "leaderboardGuilds" && (
            <div className="leaderboard_selection_body">
              <div className="leaderboard_selection_options_wrapper">
                <div className="leaderboard_selection_options_inner_wrapper">
                  <h5>Global</h5>
                  <div className="leaderboard_selection_options_section">
                    <section
                      className={`option_item ${
                        clickedItem === "guildLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("guildLevel")}
                    >
                      By Level
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "guildTerritories" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("guildTerritories")}
                    >
                      By Territories
                    </section>{" "}
                    <section
                      className={`option_item ${
                        clickedItem === "guildWars" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("guildWars")}
                    >
                      By Wars
                    </section>{" "}
                  </div>
                </div>
                <div className="leaderboard_selection_options_inner_wrapper">
                  <h5>Raids</h5>
                  <div className="leaderboard_selection_options_section">
                    <section
                      className={`option_item ${
                        clickedItem === "grootslangSrGuilds"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("grootslangSrGuilds")}
                    >
                      <img src={NotG}></img>
                      NotG Raid
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "orphionSrGuilds" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("orphionSrGuilds")}
                    >
                      <img src={NoL}></img>
                      NoL Raid
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "colossusSrGuilds" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("colossusSrGuilds")}
                    >
                      <img src={TCC}></img>
                      TCC Raid
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "namelessSrGuilds" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("namelessSrGuilds")}
                    >
                      <img src={TNA}></img>
                      TNA Raid
                    </section>
                  </div>
                </div>{" "}
              </div>
              <br></br>
              {renderTableGuild()}{" "}
            </div>
          )}
          {selectedLeaderboard === "leaderboardPlayers" && (
            <div className="leaderboard_selection_body">
              <div className="leaderboard_selection_options_wrapper">
                <div className="leaderboard_selection_options_inner_wrapper">
                  <h5>Professions Levels</h5>
                  <div className="leaderboard_selection_options_section">
                    <section
                      className={`option_item ${
                        clickedItem === "woodcuttingLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("woodcuttingLevel")}
                    >
                      <img src={woodcutting}></img>
                      Woodcutting
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "miningLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("miningLevel")}
                    >
                      <img src={mining}></img>
                      Mining
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "fishingLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("fishingLevel")}
                    >
                      <img src={fishing}></img>
                      Fishing
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "farmingLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("farmingLevel")}
                    >
                      <img src={farming}></img>
                      Farming
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "alchemismLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("alchemismLevel")}
                    >
                      <img src={alchemism}></img>
                      Alchemism
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "armouringLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("armouringLevel")}
                    >
                      <img src={armouring}></img>
                      Armouring
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "cookingLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("cookingLevel")}
                    >
                      <img src={cooking}></img>
                      Cooking
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "jewelingLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("jewelingLevel")}
                    >
                      <img src={jeweling}></img>
                      Jeweling
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "scribingLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("scribingLevel")}
                    >
                      <img src={scribing}></img>
                      Scribing
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "tailoringLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("tailoringLevel")}
                    >
                      <img src={tailoring}></img>
                      Tailoring
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "weaponsmithingLevel"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("weaponsmithingLevel")}
                    >
                      <img src={weaponsmithing}></img>
                      Weaponsmithing
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "woodworkingLevel" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("woodworkingLevel")}
                    >
                      <img src={woodworking}></img>
                      Woodworking
                    </section>
                  </div>
                </div>
                <div className="leaderboard_selection_options_inner_wrapper">
                  <h5>Content Completions</h5>
                  <div className="leaderboard_selection_options_section">
                    <section
                      className={`option_item ${
                        clickedItem === "playerContent" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("playerContent")}
                    >
                      <img src={total_completion}></img>
                      Total Content
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "globalPlayerContent"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("globalPlayerContent")}
                    >
                      <img src={global_total_completion}></img>
                      Global Total Content
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "warsCompletion" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("warsCompletion")}
                    >
                      <img src={wars_completion}></img>
                      Wars (Completions)
                    </section>
                  </div>
                </div>
                <div className="leaderboard_selection_options_inner_wrapper">
                  <h5>Raids</h5>
                  <div className="leaderboard_selection_options_section">
                    <section
                      className={`option_item ${
                        clickedItem === "grootslangSrPlayers"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("grootslangSrPlayers")}
                    >
                      <img src={NotG}></img>
                      NotG Raid
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "orphionSrPlayers" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("orphionSrPlayers")}
                    >
                      <img src={NoL}></img>
                      NoL Raid
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "colossusSrPlayers"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("colossusSrPlayers")}
                    >
                      <img src={TCC}></img>
                      TCC Raid
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "namelessSrPlayers"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("namelessSrPlayers")}
                    >
                      <img src={TNA}></img>
                      TNA Raid
                    </section>
                  </div>
                </div>
                <div className="leaderboard_selection_options_inner_wrapper">
                  <h5>Raids (COMPLETIONS)</h5>
                  <div className="leaderboard_selection_options_section">
                    <section
                      className={`option_item ${
                        clickedItem === "grootslangCompletion"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("grootslangCompletion")}
                    >
                      <img src={NotG}></img>
                      NotG Raid (COMPLETIONS)
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "orphionCompletion"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("orphionCompletion")}
                    >
                      <img src={NoL}></img>
                      NoL Raid (COMPLETIONS)
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "colossusCompletion"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("colossusCompletion")}
                    >
                      <img src={TCC}></img>
                      TCC Raid (COMPLETIONS)
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "namelessCompletion"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("namelessCompletion")}
                    >
                      <img src={TNA}></img>
                      TNA Raid (COMPLETIONS)
                    </section>
                  </div>
                </div>{" "}
              </div>
              <div className="leaderboard_selection_options_inner_wrapper_total">
                <h5>Total Levels</h5>
                <br></br>
                <div className="leaderboard_selection_options_section_total">
                  <div className="leaderboard_selection_options_section_total_item">
                    <h5>Professions</h5>
                    <section className="flex gap-05">
                      <button
                        className={`option_item ${
                          clickedItem === "professionsGlobalLevel"
                            ? "clicked_item_btn"
                            : ""
                        }`}
                        onClick={() =>
                          handleItemClick("professionsGlobalLevel")
                        }
                      >
                        All classes
                      </button>
                      <button
                        className={`option_item ${
                          clickedItem === "professionsSoloLevel"
                            ? "clicked_item_btn"
                            : ""
                        }`}
                        onClick={() => handleItemClick("professionsSoloLevel")}
                      >
                        Solo class
                      </button>
                    </section>
                  </div>
                  <div className="leaderboard_selection_options_section_total_item">
                    <h5>Combat</h5>
                    <section className="flex gap-05">
                      <button
                        className={`option_item ${
                          clickedItem === "combatGlobalLevel"
                            ? "clicked_item_btn"
                            : ""
                        }`}
                        onClick={() => handleItemClick("combatGlobalLevel")}
                      >
                        All classes
                      </button>
                      <button
                        className={`option_item ${
                          clickedItem === "combatSoloLevel"
                            ? "clicked_item_btn"
                            : ""
                        }`}
                        onClick={() => handleItemClick("combatSoloLevel")}
                      >
                        Solo class
                      </button>
                    </section>
                  </div>{" "}
                  <div className="leaderboard_selection_options_section_total_item leaderboard_selection_options_section_total_bottom">
                    <h5>Total</h5>
                    <section className="flex gap-05">
                      <button
                        className={`option_item ${
                          clickedItem === "totalGlobalLevel"
                            ? "clicked_item_btn"
                            : ""
                        }`}
                        onClick={() => handleItemClick("totalGlobalLevel")}
                      >
                        All classes
                      </button>
                      <button
                        className={`option_item ${
                          clickedItem === "totalSoloLevel"
                            ? "clicked_item_btn"
                            : ""
                        }`}
                        onClick={() => handleItemClick("totalSoloLevel")}
                      >
                        Solo class
                      </button>
                    </section>
                  </div>
                </div>
              </div>
              <br></br>
              {renderTablePlayer()}
            </div>
          )}
          {selectedLeaderboard === "leaderboardGamemodes" && (
            <div className="leaderboard_selection_body">
              <div className="leaderboard_selection_options_wrapper">
                {" "}
                <div className="leaderboard_selection_options_inner_wrapper">
                  <h5>Global</h5>
                  <div className="leaderboard_selection_options_section">
                    <section
                      className={`option_item ${
                        clickedItem === "ironmanContent" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("ironmanContent")}
                    >
                      Ironman{" "}
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "ultimateIronmanContent"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("ultimateIronmanContent")}
                    >
                      Ultimate Ironman{" "}
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "hardcoreContent" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("hardcoreContent")}
                    >
                      Hardcore
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "craftsmanContent" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("craftsmanContent")}
                    >
                      Craftsman{" "}
                    </section>{" "}
                    <section
                      className={`option_item ${
                        clickedItem === "huntedContent" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("huntedContent")}
                    >
                      Hunter{" "}
                    </section>
                  </div>
                </div>{" "}
                <div className="leaderboard_selection_options_inner_wrapper">
                  <h5>Special</h5>
                  <div className="leaderboard_selection_options_section">
                    <section
                      className={`option_item ${
                        clickedItem === "huicContent" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("huicContent")}
                    >
                      HUIC{" "}
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "huichContent" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("huichContent")}
                    >
                      HUICH{" "}
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "hichContent" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("hichContent")}
                    >
                      HICH
                    </section>
                    <section
                      className={`option_item ${
                        clickedItem === "hicContent" ? "clicked_item" : ""
                      }`}
                      onClick={() => handleItemClick("hicContent")}
                    >
                      HIC{" "}
                    </section>{" "}
                  </div>
                </div>{" "}
                <div className="leaderboard_selection_options_inner_wrapper">
                  <h5>Legacy</h5>
                  <div className="leaderboard_selection_options_section">
                    <section
                      className={`option_item ${
                        clickedItem === "hardcoreLegacyLevel"
                          ? "clicked_item"
                          : ""
                      }`}
                      onClick={() => handleItemClick("hardcoreLegacyLevel")}
                    >
                      Hardcore{" "}
                    </section>
                  </div>
                </div>
              </div>
              <br></br>
              {renderTableGamemode()}{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardComponent;
