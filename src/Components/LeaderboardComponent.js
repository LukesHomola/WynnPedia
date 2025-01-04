import React, { useContext, useEffect, useState, useRef } from "react";

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
};

// Helper function to safely access nested data
const getNestedValue = (obj, path) => {
  return path
    .split(".")
    .reduce((acc, key) => (acc && acc[key] ? acc[key] : null), obj);
};

const LeaderboardComponent = () => {
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

  // Render the dynamic leaderboard table
  const renderTable = () => {
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
                <tr key={index} className="leaderboard_table_body_row">
                  <td>#{indexOfFirstItem + index + 1}</td>

                  {tableConfig.map((col) => (
                    <td
                      key={col.key}
                      className={col.key === "name" ? "name-column" : ""}
                    >
                      {col.key === "name" && (
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
            onClick={() => showTable("leaderboardGuilds")}
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
            onClick={() => showTable("leaderboardPlayers")}
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
            onClick={() => showTable("leaderboardGamemodes")}
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
            <h5>Quick search</h5>
            <input placeholder="Enter playername or guild..."></input>
          </div>
        </div>
        <br></br>
        <div className="leaderboard_table_wrapper">
          {" "}
          {selectedLeaderboard === "leaderboardGuilds" && (
            <div className="leaderboard_selection_body">
              <div className="leader_board_selection_options_wrapper"></div>
              <h2>Table 1</h2>
              <table>
                <thead>
                  <tr>
                    <th>Header 1</th>
                    <th>Header 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Data 1</td>
                    <td>Data 2</td>
                  </tr>
                </tbody>
              </table>
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
                </div>
              </div>

              <br></br>
              {renderTable()}
            </div>
          )}
          {selectedLeaderboard === "leaderboardGamemodes" && (
            <div className="leaderboard_selection_body">
              <h2>Table 3</h2>
              <table>
                <thead>
                  <tr>
                    <th>Header 1</th>
                    <th>Header 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Data 1</td>
                    <td>Data 2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardComponent;
