import React, { createContext, useState, useEffect } from "react";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  // Initialize playerName from local storage if available
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem("playerName") || ""; // Load from local storage
  });
  const [playerData, setPlayerData] = useState(null);
  const [extendedPlayerData, setExtendedPlayerData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayerData = async (name) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.wynncraft.com/v3/player/${name}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data?.username) {
        setPlayerData(data);
      } else {
        setError("Player data not found.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Error fetching player data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchExtendedPlayerData = async (name) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.wynncraft.com/v3/player/${name}?fullResult`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response 2:", data);

      if (data?.username) {
        setExtendedPlayerData(data);
      } else {
        setError("Player data not found.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Error fetching player data.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch player data whenever playerName changes
  useEffect(() => {
    if (playerName) {
      fetchPlayerData(playerName);
      fetchExtendedPlayerData(playerName);
    }
  }, [playerName]);

  return (
    <PlayerContext.Provider
      value={{
        playerName,
        setPlayerName,
        playerData,
        extendedPlayerData,
        loading,
        error,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
