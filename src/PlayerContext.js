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

  const [guildNameProfile, setGuildNameProfile] = useState(() => {
    return localStorage.getItem("guildName") || "";
  });
  const [guildDataProfile, setGuildDataProfile] = useState({});

  const [clickedGuildPlayer, setClickedGuildPlayer] = useState(null);
  const [clickedGuild, setClickedGuild] = useState(null);
  const [clickedPlayer, setClickedPlayer] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Saved player and guild check to hide tabs temp. while search is open
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

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

  const fetchGuildData = async () => {
    if (!guildNameProfile) return; // Fetch only if guildName exists
    try {
      let response = await fetch(
        `https://api.wynncraft.com/v3/guild/${guildNameProfile}`
      );

      if (!response.ok) {
        // If guild data is not found by name, try to fetch by prefix
        response = await fetch(
          `https://api.wynncraft.com/v3/guild/prefix/${guildNameProfile}`
        );

        if (!response.ok) {
          throw new Error(`Guild data not found.`);
        }
      }

      const data = await response.json();

      if (data?.name) {
        setGuildDataProfile(data);
      }
    } catch (error) {
      console.error("Error fetching guild data:", error); // Handle errors
    }
  };

  useEffect(() => {
    if (guildNameProfile) {
      fetchGuildData();
    }
  }, [guildNameProfile]); // Correctly fetch data when guildName changes

  return (
    <PlayerContext.Provider
      value={{
        playerName,
        setPlayerName,
        playerData,
        extendedPlayerData,
        loading,
        error,
        guildNameProfile,
        setGuildNameProfile,
        guildDataProfile,
        setGuildDataProfile,
        clickedGuildPlayer,
        setClickedGuildPlayer,
        clickedGuild,
        setClickedGuild,
        clickedPlayer,
        setClickedPlayer,
        isSettingsOpen,
        setIsSettingsOpen,
        openSettings,
        closeSettings,
        isMenuVisible,
        setIsMenuVisible,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
