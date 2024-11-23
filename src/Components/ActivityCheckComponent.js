import React, { useEffect, useState, useContext } from "react";
import { PlayerContext } from "../PlayerContext.js"; // Access context

const ActivityCheck = () => {
  const { playerName, setPlayerName } = useContext(PlayerContext); // Get playerName from context
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guildName, setGuildName] = useState("FlameKnights");
  const [guildData, setGuildData] = useState(null);
  const [purgeTimeValue, setPurgeTimeValue] = useState(10);
  const [membersData, setMembersData] = useState({});

  /* FETCHING PLAYER DATA */
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

  /* FETCHING GUILD DATA */
  useEffect(() => {
    const fetchGuildData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.wynncraft.com/v3/guild/${guildName}`
        );

        if (!response.ok) {
          throw new Error(`Guild data not found.`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging the API response

        if (data?.name) {
          setGuildData(data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Error fetching guild data.");
      } finally {
        setLoading(false);
      }
    };

    if (guildName) {
      fetchGuildData(); // Only fetch if there's a valid playerName
    }
  }, [guildName]);

  // Fetching member data for each member
  useEffect(() => {
    const fetchMemberData = async (username) => {
      try {
        const response = await fetch(
          `https://api.wynncraft.com/v3/player/${username}`
        );

        if (!response.ok) {
          throw new Error(`Player data not found for ${username}.`);
        }

        const data = await response.json();
        setMembersData((prev) => ({
          ...prev,
          [username]: data,
        }));
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || `Error fetching player data for ${username}.`);
      }
    };

    if (guildData) {
      const memberUserNames = [
        ...Object.keys(guildData.members.owner || {}),
        ...Object.keys(guildData.members.chief || {}),
        ...Object.keys(guildData.members.strategist || {}),
        ...Object.keys(guildData.members.captain || {}),
        ...Object.keys(guildData.members.recruiter || {}),
        ...Object.keys(guildData.members.recruit || {}),
      ];

      memberUserNames.forEach((username) => {
        fetchMemberData(username); // Fetch data for each member
      });
    }
  }, [guildData]);

  // Helper function to calculate the days since the last join
  const daysSinceLastJoin = (lastJoin) => {
    const now = new Date();
    const lastJoinDate = new Date(lastJoin);
    const diffTime = now - lastJoinDate; // Difference in milliseconds
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
  };

  /* GUILD NAME INPUT EVENT HANDELER */
  const handleGuildInputChange = (e) => {
    const newGuildName = e.target.value;
    setGuildName(newGuildName); // Update playerName in context
    localStorage.setItem("guildName", newGuildName);
  };

  return (
    <div className="activity_checker_container">
      <h1>Guild Activity Check</h1>
      <label>
        Guild name:{" "}
        <input
          type="text"
          min="0"
          value={guildName}
          onChange={handleGuildInputChange}
        />
      </label>
      <label>
        Purge Time (days):{" "}
        <input
          type="number"
          value={purgeTimeValue}
          min="0"
          onChange={(e) => setPurgeTimeValue(parseInt(e.target.value, 10))}
        />
      </label>

      {loading && <p>Loading guild data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {guildData && (
        <div>
          <h2>Members of {guildData.name}</h2>
          <ul>
            {[
              "owner",
              "chief",
              "strategist",
              "captain",
              "recruiter",
              "recruit",
            ].flatMap((role) => {
              return Object.entries(guildData.members[role] || {}).map(
                ([username, member]) => {
                  const memberData = membersData[username];
                  const lastJoinDate = memberData ? memberData.lastJoin : null;
                  const daysSince = lastJoinDate
                    ? daysSinceLastJoin(lastJoinDate)
                    : null;
                  const isInactive =
                    daysSince !== null && daysSince > purgeTimeValue;

                  return (
                    <li
                      key={member.uuid}
                      style={{ color: isInactive ? "red" : "inherit" }}
                    >
                      <strong>{username}</strong> - Last Join:{" "}
                      {lastJoinDate
                        ? new Date(lastJoinDate).toLocaleString()
                        : "Data not available"}{" "}
                      ({daysSince !== null ? daysSince + " days ago" : "N/A"})
                    </li>
                  );
                }
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActivityCheck;
