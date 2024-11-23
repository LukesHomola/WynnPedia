import React, { useEffect, useState, useContext } from "react";
import { PlayerContext } from "../PlayerContext.js"; // Access context

const ActivityCheck = () => {
  const { playerName, setPlayerName } = useContext(PlayerContext); // Get playerName from context
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guildName, setGuildName] = useState("KongoBoys");
  const [guildData, setGuildData] = useState(null);
  const [purgeTimeValue, setPurgeTimeValue] = useState(10);
  const [membersData, setMembersData] = useState({});

  /* FETCHING PLAYER DATA */
  /*   useEffect(() => {
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

    if (playerName) {
      fetchPlayerData(); 
    }
  }, [playerName]); */

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
      <br></br>
      <div className="activity_checker_title_container">
        <section className="activity_checker_title_container_left">
          <h1>ACTIVITY CHECKER</h1>
          <h3 className="force-regular">
            Check guild's players activity.
          </h3>{" "}
          <br></br>
          <hr className="width-50"></hr>
          <br></br>
          <p>Simply search for guild name and how many days of inactivity.</p>
        </section>
        <section className="activity_checker_title_container_right">
          <p>Control panel</p>
          <br></br>
          <label className="flex-col">
            Guild name:
            <input
              style={{ maxWidth: "20%" }}
              type="text"
              placeholder="Guild name"
              min="0"
              value={guildName}
              onChange={handleGuildInputChange}
            />
            <br></br>
          </label>
          <label className="flex-col ">
            Purge Time (days):
            <input
              style={{ maxWidth: "20%" }}
              type="number"
              value={purgeTimeValue}
              min="0"
              onChange={(e) => setPurgeTimeValue(parseInt(e.target.value, 10))}
            />
          </label>
        </section>
      </div>

      <br></br>

      {guildData && !loading ? (
        <div className="activity_checker_container_table_container">
          <h2 className="force-medium">
            {" "}
            <strong>{guildData.name}</strong>'s members:
          </h2>
          <table className="activity_checker_container_table">
            <tbody>
              {[
                "owner",
                "chief",
                "strategist",
                "captain",
                "recruiter",
                "recruit",
              ]
                .flatMap((role) => {
                  return Object.entries(guildData.members[role] || {});
                })
                .reduce((rows, [username, member], index) => {
                  const memberData = membersData[username];
                  const lastJoinDate = memberData ? memberData.lastJoin : null;
                  const daysSince = lastJoinDate
                    ? daysSinceLastJoin(lastJoinDate)
                    : null;
                  const isInactive =
                    daysSince !== null && daysSince > purgeTimeValue;

                  // Create a new row every 4 players
                  if (index % 4 === 0) {
                    rows.push([]);
                  }

                  const currentRow = rows[rows.length - 1];

                  currentRow.push(
                    <td
                      key={member.uuid}
                      style={{
                        color: isInactive
                          ? "var(--color-primary-500)"
                          : "inherit",
                      }}
                    >
                      <strong>{username}</strong>
                      <br />
                      Last Join:{" "}
                      {lastJoinDate
                        ? new Date(lastJoinDate).toLocaleString()
                        : "Data not available"}
                      <br />(
                      {daysSince !== null ? daysSince + " days ago" : "N/A"})
                    </td>
                  );

                  return rows;
                }, [])
                .map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="activity_checker_container_cells"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        className="activity_checker_container_cells_data"
                        key={cellIndex}
                        style={{ padding: "10px", border: "1px solid gray" }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        error && <p style={{ color: "red" }}>{error}</p>
      )}
    </div>
  );
};

export default ActivityCheck;
