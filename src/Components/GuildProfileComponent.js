import React, { useContext, useEffect, useState, useRef } from "react";

import "../CSS/FooterComponent.css";
import { PlayerContext } from "../PlayerContext.js";

import guild_members from "../Assests_components/guild_assests/guild_members.webp";
import guild_online from "../Assests_components/guild_assests/guild_online.webp";
import guild_territories from "../Assests_components/guild_assests/guild_territories.webp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";

const GuildPage = () => {
  const { guildNameProfile, guildDataProfile, setGuildNameProfile } =
    useContext(PlayerContext);

  const [guildTabs, setGuildTabs] = useState([
    {
      name: guildDataProfile?.name || "",
      data: guildDataProfile,
    },
  ]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabInputs, setTabInputs] = useState([""]);
  const [tabGuildData, setTabGuildData] = useState();

  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (guildDataProfile && guildDataProfile.name) {
      fetchGuildData(guildDataProfile.name);

      setGuildTabs((prevTabs) => [
        { name: guildDataProfile.name, data: guildDataProfile },
        ...prevTabs.slice(1), // Retain other tabs if they exist
      ]);
    }
  }, [guildDataProfile]);

  const handleTabClick = (index, guildName) => {
    setActiveTabIndex(index);
    fetchGuildData(guildName);
    console.log("INDEX TEST: ", guildName);
  };

  // Fetch data for a specific tab
  const fetchGuildData = async (name, index) => {
    if (!name) return;
    try {
      let response = await fetch(`https://api.wynncraft.com/v3/guild/${name}`);
      if (!response.ok) {
        // If guild data is not found by name, try to fetch by prefix
        response = await fetch(
          `https://api.wynncraft.com/v3/guild/prefix/${name}`
        );

        if (!response.ok) {
          throw new Error(`Guild data not found.`);
        }
      }

      const data = await response.json();
      setTabGuildData(data), console.log(data);
      setGuildTabs((prevTabs) =>
        prevTabs.map((tab, i) => (i === index ? { ...tab, name, data } : tab))
      );
    } catch (error) {
      console.error("Failed to fetch player data:", error);
    }
  };

  // Handle input change for a specific tab
  const handleInputChange = (index, value) => {
    setTabInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[index] = value;
      return updatedInputs;
    });

    // Trigger API query with debounce
    if (value.length >= 3) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        fetchGuildData(value, index);
      }, 300);
    }
  };

  // Add a new tab
  const handleAddTab = () => {
    setGuildTabs((prevTabs) => [
      ...prevTabs,
      { name: `Guild ${prevTabs.length + 1}`, data: null },
    ]);
    setTabInputs((prevInputs) => [...prevInputs, ""]);
    setActiveTabIndex(guildTabs.length); // Switch to the new tab
  };

  // Close a tab
  const handleCloseTab = (index) => {
    if (guildTabs.length === 1) return;
    const updatedTabs = guildTabs.filter((_, i) => i !== index);
    const updatedInputs = tabInputs.filter((_, i) => i !== index);
    setGuildTabs(updatedTabs);
    setTabInputs(updatedInputs);
    setActiveTabIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const convertToCET = (isoDate) => {
    // Check if isoDate is a valid date string
    if (!isoDate || isNaN(Date.parse(isoDate))) {
      return "Invalid date"; // or return a default value
    }

    // Create a Date object from the ISO string
    const date = new Date(isoDate);

    // Extract date components
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Format the date as "DD.MM.YYYY HH:mm:ss"
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  };
  const cetFormattedDate = convertToCET(tabGuildData?.created);

  const timeAgo = (isoDate) => {
    if (!isoDate || isNaN(Date.parse(isoDate))) {
      return "Invalid date"; // or return a default value
    }

    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44); // Average month length
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  };
  const createdTimeAgo = timeAgo(tabGuildData?.created); // Calculate how long ago it was

  return (
    <div className="stats_tabs_container">
      {" "}
      <div className="stats_tabs_container_controls">
        <section className="stats_tabs_main_profile_tabs">
          {guildTabs.slice(0, 10).map((guild, index) => (
            <div
              key={`tab-${index}`}
              className={`stats_tabs_main_profile_tab ${
                activeTabIndex === index ? "activeTab" : ""
              }`}
              onMouseUp={(event) => {
                // Check if the middle mouse button was clicked
                if (event.button === 1) {
                  handleCloseTab(index);
                }
              }}
            >
              <button onClick={() => handleTabClick(index, guild.name)}>
                <h5>{guild?.name}</h5>
              </button>
              {index > 0 && (
                <button
                  onClick={() => {
                    handleCloseTab(index);
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>
          ))}
        </section>

        {guildTabs.length < 10 && (
          <button
            className="stats_tabs_add"
            onClick={() =>
              handleAddTab({
                name: `Guild ${guildTabs.length + 1}`,
                characters: [],
              })
            }
          >
            <FontAwesomeIcon icon={faPlus} />{" "}
          </button>
        )}
      </div>
      {/*  */}
      <div className="stats_tabs_main_tab_container p-05 ">
        <div className="guild_page_background">
          {guildTabs.length > 0 ? (
            <div>
              {guildTabs[activeTabIndex] ? (
                <>
                  {/* TABBED GUILD SEARCH */}
                  {activeTabIndex !== 0 && (
                    <div className="guild_page_input_background">
                      {guildTabs.map(
                        (tab, index) =>
                          index === activeTabIndex && (
                            <div key={index}>
                              <input
                                className="guild_page_input"
                                placeholder="Enter guild/tag"
                                value={tabInputs[index] || ""}
                                onChange={(e) =>
                                  handleInputChange(index, e.target.value)
                                }
                              />
                            </div>
                          )
                      )}
                    </div>
                  )}
                  <br></br>
                  <div>
                    {activeTabIndex !== 0 && (
                      <div className="guild_page_container">
                        <section className="guild_page_left"></section>
                        <section className="guild_page_right">
                          <section>
                            <section className="flex align-center gap-05">
                              <h1>[{tabGuildData?.prefix || "N/A"}]</h1>
                              <h1>{tabGuildData?.name || "No data found"}</h1>
                            </section>
                            <section>
                              {" "}
                              <h5>
                                Created: <strong>{cetFormattedDate}</strong> (
                                {createdTimeAgo})
                              </h5>
                            </section>
                          </section>
                          <section className="guild_page_right_inner_stats flex align-center justify-evenly gap-05">
                            <section className="flex-col align-center">
                              <img
                                src={guild_members}
                                className="guild_page_right_img"
                              ></img>
                              <section
                                className="flex gap-05
              "
                              >
                                {" "}
                                <h5>
                                  <strong>
                                    {tabGuildData?.members?.total || "0"}
                                  </strong>
                                </h5>{" "}
                                <h5>/</h5> <h5>N/A</h5>{" "}
                              </section>
                            </section>{" "}
                            <section className="flex-col align-center">
                              <img
                                src={guild_online}
                                className="guild_page_right_img"
                              ></img>
                              <section
                                className="flex gap-05
              "
                              >
                                <h5>
                                  <strong>{tabGuildData?.online || "0"}</strong>
                                </h5>{" "}
                                <h5>/</h5>{" "}
                                <h5>{tabGuildData?.members?.total || "0"}</h5>
                              </section>{" "}
                            </section>{" "}
                            <section className="flex-col align-center">
                              <img
                                src={guild_territories}
                                className="guild_page_right_img"
                              ></img>
                              <h5>{tabGuildData?.territories || "0"}</h5>
                            </section>
                          </section>
                          <section>
                            <section className="flex">
                              <h5 className="pR-03">
                                {" "}
                                Guild level:{" "}
                                <strong>{tabGuildData?.level || "0"}</strong>
                              </h5>
                              <h5>({tabGuildData?.xpPercent || "0"}%)</h5>
                            </section>
                            <section>
                              <progress
                                value={tabGuildData?.xpPercent}
                                max={100}
                                style={{ width: "100%" }}
                              />
                            </section>
                          </section>
                        </section>
                      </div>
                    )}
                    {/*  */}
                  </div>
                </>
              ) : (
                <></>
              )}{" "}
            </div>
          ) : (
            <></>
          )}{" "}
        </div>
      </div>
      {/*  */}
      {/* RENDER STATS FOR LOCALY STORED GUILD */}
      {activeTabIndex === 0 && (
        <div className="guild_page_background">
          {" "}
          <div className="guild_page_container">
            <section className="guild_page_left"></section>
            <section className="guild_page_right">
              <section>
                <section className="flex align-center gap-05">
                  <h1>[{tabGuildData?.prefix || "N/A"}]</h1>
                  <h1>{tabGuildData?.name || "No data found"}</h1>
                </section>
                <section>
                  <h5>
                    Created: <strong>{cetFormattedDate}</strong> (
                    {createdTimeAgo})
                  </h5>
                </section>
              </section>
              <section className="guild_page_right_inner_stats flex align-center justify-evenly gap-05">
                <section className="flex-col align-center">
                  <img
                    src={guild_members}
                    className="guild_page_right_img"
                  ></img>
                  <section
                    className="flex gap-05
    "
                  >
                    {" "}
                    <h5>
                      <strong>{tabGuildData?.members?.total || "0"}</strong>
                    </h5>{" "}
                    <h5>/</h5> <h5>N/A</h5>
                  </section>
                </section>{" "}
                <section className="flex-col align-center">
                  <img
                    src={guild_online}
                    className="guild_page_right_img"
                  ></img>
                  <section
                    className="flex gap-05
    "
                  >
                    <h5>
                      <strong>{tabGuildData?.online || "0"}</strong>
                    </h5>{" "}
                    <h5>/</h5> <h5>{tabGuildData?.members?.total || "0"}</h5>
                  </section>{" "}
                </section>{" "}
                <section className="flex-col align-center">
                  <img
                    src={guild_territories}
                    className="guild_page_right_img"
                  ></img>
                  <h5>{tabGuildData?.territories || "0"}</h5>
                </section>
              </section>
              <section>
                <section className="flex">
                  <h5 className="pR-03">
                    {" "}
                    Guild level: <strong>{tabGuildData?.level || "0"}</strong>
                  </h5>
                  <h5>({tabGuildData?.xpPercent || "0"}%)</h5>
                </section>
                <section>
                  <progress
                    value={tabGuildData?.xpPercent}
                    max={100}
                    style={{ width: "100%" }}
                  />
                </section>
              </section>
            </section>
          </div>
        </div>
      )}
      {tabGuildData ? (
        <div className="guild_page_members_container">
          {Object.entries(tabGuildData.members).map(([role, members]) => {
            // Check if the role is "total" and skip it
            if (role === "total") {
              return null; // Skip rendering this role
            }
            return (
              <div key={role} className="guild_page_members_inner">
                <h4 className="force-regular">
                  {role.charAt(0).toUpperCase() + role.slice(1)}'s:
                </h4>{" "}
                {/* Capitalize the role name */}
                <section>
                  {Object.entries(members).map(([memberName, memberData]) => (
                    <li key={memberData.uuid}>
                      <img
                        src={`https://crafatar.com/avatars/${memberData.uuid}`}
                        style={{ maxWidth: "1.5rem" }}
                        className="pR-05"
                      ></img>
                      <strong>{memberName}</strong> - Contribution:{" "}
                      <strong>{memberData.contributed}</strong>xp -{" "}
                      {memberData.online ? "Yes" : "Offline"}
                    </li>
                  ))}
                </section>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No guild data available</p> // Fallback if tabGuildData is not defined
      )}
      <div>
        <h1>Guild Data</h1>
        <p>Guild Name: {guildNameProfile}</p>
        <button
          onClick={() => {
            setGuildNameProfile("FLK"), console.log(guildDataProfile);
          }}
        >
          Change Guild Name
        </button>
        <pre>{JSON.stringify(guildDataProfile, null, 2)}</pre>{" "}
        {/* Display fetched data */}
      </div>
    </div>
  );
};

export default GuildPage;
