import React, { useContext, useEffect, useState, useRef } from "react";

import "../CSS/LeaderboardComponent.css";
import { PlayerContext } from "../PlayerContext.js";

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

const LeaderboardComponent = () => {
  const [leaderboardType, setLeaderboardType] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [selectedLeaderboard, setSelectedLeaderboard] =
    useState("leaderboardPlayers");

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
    if (!selectedType) return; // Prevent fetch if selectedType is not set
    const url = `https://api.wynncraft.com/v3/leaderboards/${selectedType}`; // Use selectedType directly
    try {
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Use effect to call fetch function when selectedType changes
  useEffect(() => {
    fetchLeaderboard();
  }, [selectedType]); // Dependency array to refetch if selectedType changes

  // Use effect to call fetch function on component mount
  useEffect(() => {
    fetchLeaderboardTypes();
  }, []); // Only run once on mount

  // Function to handle table switching
  const showTable = (tableId) => {
    setSelectedLeaderboard(tableId);
  };

  return (
    <div className="leaderboard_wrapper">
      <br></br>
      <div className="leaderboard_selection_wrapper">
        <section
          className="leaderboard_selection_item"
          onClick={() => showTable("leaderboardGuilds")}
        ></section>
        <section
          className="leaderboard_selection_item"
          onClick={() => showTable("leaderboardPlayers")}
        ></section>
        <section
          className="leaderboard_selection_item"
          onClick={() => showTable("leaderboardGamemodes")}
        ></section>
      </div>
      <br></br>
      <div className="leaderboard_selection_search">
        {" "}
        <h5>Quick search</h5>
        <input placeholder="Enter playername or guild..."></input>
      </div>
      <br></br>
      {selectedLeaderboard === "leaderboardGuilds" && (
        <div className="table-section">
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
        <div className="table-section">
          <h2>Table 2</h2>
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
      )}{" "}
      {selectedLeaderboard === "leaderboardGamemodes" && (
        <div className="table-section">
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
      <br></br>
      <label>Enter guild type to search for</label>
      <select
        onChange={(e) => {
          const value = e.target.value;
          if (value === "Expand...") {
            setSelectedType(""); // Reset selectedType when "Expand..." is selected
          } else {
            fetchLeaderboard();
            setSelectedType(value); // Set selectedType to the chosen value
          }

          console.log("Selected type:", value);
        }}
      >
        <option>Expand...</option>
        {Array.isArray(leaderboardType) &&
          leaderboardType.map((type) => <option key={type}>{type}</option>)}
        {error && <p>Error: {error}</p>}
      </select>
      <div>
        {" "}
        <pre>{JSON.stringify(data, null, 2)}</pre>{" "}
      </div>
    </div>
  );
};

export default LeaderboardComponent;
