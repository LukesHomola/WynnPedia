import React, { useEffect, useState, useContext } from "react";
import { PlayerContext } from "../PlayerContext.js"; // Access context

const ActivityCheck = () => {
  const { playerName, setPlayerName } = useContext(PlayerContext); // Get playerName from context
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.wynncraft.com/v3/player/${playerName}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging the API response

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

    if (playerName) {
      fetchPlayerData(); // Only fetch if there's a valid playerName
    }
  }, [playerName]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.wynncraft.com/v3/player/${playerName}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging the API response

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

    if (playerName) {
      fetchPlayerData(); // Only fetch if there's a valid playerName
    }
  }, [playerName]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {playerData && !error && (
        <div>
          <h2>Player Data for {playerData.username}</h2>
          <p>
            <strong>Username:</strong> {playerData.username}
            <br />
            <strong>Rank:</strong> {playerData.rank}
            <br />
            <strong>Online:</strong> {playerData.online ? "Yes" : "No"}
            <br />
            <strong>Server:</strong> {playerData.server}
            <br />
            <strong>Active Character UUID:</strong> {playerData.activeCharacter}
            <br />
            <strong>Guild Name:</strong> {playerData.guild.name}
            <br />
            <strong>Guild Rank:</strong> {playerData.guild.rank}
            <br />
            <strong>Playtime:</strong> {playerData.playtime} hours
            <br />
            <strong>First Join:</strong>{" "}
            {new Date(playerData.firstJoin).toLocaleString()}
            <br />
            <strong>Last Join:</strong>{" "}
            {new Date(playerData.lastJoin).toLocaleString()}
            <br />
          </p>

          <h3>Global Data</h3>
          <p>
            <strong>Total Wars:</strong> {playerData.globalData.wars}
            <br />
            <strong>Total Level:</strong> {playerData.globalData.totalLevel}
            <br />
            <strong>Killed Mobs:</strong> {playerData.globalData.killedMobs}
            <br />
            <strong>Chests Found:</strong> {playerData.globalData.chestsFound}
            <br />
          </p>

          <h3>Dungeons Completed</h3>
          <ul>
            {Object.entries(playerData.globalData.dungeons.list).map(
              ([dungeon, count]) => (
                <li key={dungeon}>
                  {dungeon}: {count} completed
                </li>
              )
            )}
          </ul>

          <h3>Ranking</h3>
          <p>
            <strong>Fishing Level:</strong> {playerData.ranking.fishingLevel}
            <br />
            <strong>Mining Level:</strong> {playerData.ranking.miningLevel}
            <br />
            <strong>Combat Global Level:</strong>{" "}
            {playerData.ranking.combatGlobalLevel}
            <br />
          </p>

          {/* ALL DATA */}
          <pre>{JSON.stringify(playerData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ActivityCheck;
