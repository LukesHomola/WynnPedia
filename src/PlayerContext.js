import React, { createContext, useState, useEffect } from "react";

// Create a context
export const PlayerContext = createContext();

// Define the provider component
export const PlayerProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState("");

  // Load playerName from localStorage on mount
  useEffect(() => {
    const savedPlayerName = localStorage.getItem("playerName");
    if (savedPlayerName) {
      setPlayerName(savedPlayerName);
    }
  }, []);

  // Save playerName to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("playerName", playerName);
  }, [playerName]);

  return (
    <PlayerContext.Provider value={{ playerName, setPlayerName }}>
      {children}
    </PlayerContext.Provider>
  );
};
