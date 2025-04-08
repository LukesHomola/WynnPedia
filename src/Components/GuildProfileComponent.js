import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "../CSS/FooterComponent.css";
import { PlayerContext } from "../PlayerContext.js";

import guild_members from "../Assests_components/guild_assests/guild_members.webp";
import guild_online from "../Assests_components/guild_assests/guild_online.webp";
import guild_territories from "../Assests_components/guild_assests/guild_territories.webp";
import guild_emblem from "../Assests_components/guild_assests/guild_emblem.webp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import {
  faXmark,
  faPlus,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const GuildPage = () => {
  const {
    guildNameProfile,
    guildDataProfile,
    setGuildNameProfile,
    clickedGuildPlayer,
    setClickedGuildPlayer,
    clickedGuild,
    setClickedGuild,
    isMenuVisible,
    setIsMenuVisible,
  } = useContext(PlayerContext);

  const navigate = useNavigate();

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

  const [searchInput, setSearchInput] = useState(null);

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
    setSearchInput("");
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
      setTabGuildData(data);
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

  /* Handeling player search */
  const handleSearchChange = (event) => {
    setSearchInput(event.target.value.toLowerCase());
  };

  /* Creating new tab for clicked guild from player page */
  useEffect(() => {
    if (clickedGuild !== null) {
      handleAddTab();
      fetchGuildData(clickedGuild, 1);
    }
  }, [clickedGuild]);

  /* Handeling global .guild_page_members_item click for character details*/
  const handleMemberClick = (clickedPlayer) => {
    setClickedGuildPlayer(clickedPlayer);
    navigate(`/`);
  };
  return (
    <div className="stats_tabs_container">
      {" "}
      {!isMenuVisible && (
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
      )}
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
                              {!isMenuVisible && (
                                <input
                                  style={{
                                    border: "1px solid #530909",
                                  }}
                                  className="guild_page_input"
                                  placeholder="Enter guild/tag"
                                  value={tabInputs[index] || ""}
                                  onChange={(e) =>
                                    handleInputChange(index, e.target.value)
                                  }
                                />
                              )}
                            </div>
                          )
                      )}
                    </div>
                  )}
                  <br></br>
                  <div>
                    {activeTabIndex !== 0 && (
                      <div className="guild_page_container">
                        {" "}
                        <section className="guild_page_left">
                          <img
                            src={guild_emblem}
                            className="guild_emblem"
                          ></img>
                        </section>
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
                                <section className="flex-col">
                                  {" "}
                                  <label>Players total</label>{" "}
                                  <section className="flex-center">
                                    {" "}
                                    <h5>
                                      <strong>
                                        {tabGuildData?.members?.total || "0"}
                                      </strong>
                                    </h5>{" "}
                                    <h5>/</h5> <h5>N/A</h5>
                                  </section>
                                </section>
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
                                <section className="flex-col">
                                  <label>Players online</label>{" "}
                                  <section className="flex-center">
                                    {" "}
                                    <h5>
                                      <strong>
                                        {tabGuildData?.online || "0"}
                                      </strong>
                                    </h5>{" "}
                                    <h5>/</h5>{" "}
                                    <h5>
                                      {tabGuildData?.members?.total || "0"}
                                    </h5>
                                  </section>
                                </section>
                              </section>{" "}
                            </section>{" "}
                            <section className="flex-col align-center">
                              <img
                                src={guild_territories}
                                className="guild_page_right_img"
                              ></img>
                              <section className="flex-col">
                                <label>Guild territories</label>{" "}
                                <section className="flex-center">
                                  {" "}
                                  <h5>{tabGuildData?.territories || "0"}</h5>
                                </section>
                              </section>
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
            <section className="guild_page_left">
              <img src={guild_emblem} className="guild_emblem"></img>
            </section>{" "}
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
                    <section className="flex-col">
                      {" "}
                      <label>Players total</label>{" "}
                      <section className="flex-center">
                        {" "}
                        <h5>
                          <strong>{tabGuildData?.members?.total || "0"}</strong>
                        </h5>{" "}
                        <h5>/</h5> <h5>N/A</h5>
                      </section>
                    </section>
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
                    <section className="flex-col">
                      <label>Players online</label>{" "}
                      <section className="flex-center">
                        {" "}
                        <h5>
                          <strong>{tabGuildData?.online || "0"}</strong>
                        </h5>{" "}
                        <h5>/</h5>{" "}
                        <h5>{tabGuildData?.members?.total || "0"}</h5>
                      </section>
                    </section>
                  </section>{" "}
                </section>{" "}
                <section className="flex-col align-center">
                  <img
                    src={guild_territories}
                    className="guild_page_right_img"
                  ></img>
                  <section className="flex-col">
                    <label>Guild territories</label>{" "}
                    <section className="flex-center">
                      {" "}
                      <h5>{tabGuildData?.territories || "0"}</h5>
                    </section>
                  </section>
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
        <div className="guild_page_members_background">
          <div className="guild_page_members_inner_background">
            <div style={{ padding: "1rem" }}>
              {" "}
              <div className="guild_page_members_search_container">
                <section className="guild_page_members_search_inner">
                  {" "}
                  <input
                    type="text"
                    placeholder="Search for members..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    className="guild_page_members_search"
                  />
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="pR-1-5"
                  />
                </section>
                <div className="guild_page_members_search_results">
                  {searchInput != null && searchInput.length > 0 && (
                    <section>
                      {" "}
                      <h4 className="pB-05">Searched Players:</h4>
                      {tabGuildData &&
                        tabGuildData.members &&
                        Object.entries(tabGuildData.members)
                          .filter(
                            ([role, members]) =>
                              searchInput != null && searchInput.length > 0
                          )
                          .map(([role, members]) => {
                            return Object.entries(members)
                              .filter(([memberName, memberData]) => {
                                return memberName
                                  .toLowerCase()
                                  .includes(searchInput);
                              })
                              .map(([memberName, memberData]) => (
                                <div
                                  key={memberData.uuid}
                                  className="guild_page_memebers_search_results_row"
                                  onClick={() => {
                                    handleMemberClick(memberName);
                                  }}
                                >
                                  <section className=" flex align-center">
                                    {" "}
                                    <img
                                      src={`https://crafatar.com/avatars/${memberData.uuid}`}
                                      style={{ maxWidth: "1.5rem" }}
                                      className="pR-05"
                                    />
                                    <section className="flex-col">
                                      <strong style={{ color: "lime" }}>
                                        {memberName}
                                      </strong>{" "}
                                      <section className="guild_page_members_item_joined">
                                        Joined:&nbsp;
                                        {(() => {
                                          const joinedDate = memberData.joined;

                                          if (joinedDate) {
                                            // Create a Date object from the joined date string
                                            const date = new Date(joinedDate);
                                            // Convert to CET format
                                            const cetFormattedDate =
                                              date.toLocaleString("en-GB", {
                                                timeZone: "CET", // Set the time zone to CET
                                                year: "numeric",
                                                month: "long", // Full month name
                                              });

                                            // Calculate time ago
                                            const now = new Date();
                                            const seconds = Math.floor(
                                              (now - date) / 1000
                                            );
                                            const minutes = Math.floor(
                                              seconds / 60
                                            );
                                            const hours = Math.floor(
                                              minutes / 60
                                            );
                                            const days = Math.floor(hours / 24);
                                            const months = Math.floor(
                                              days / 30.44
                                            ); // Average month length
                                            const years = Math.floor(
                                              days / 365
                                            );

                                            let timeAgo = "";
                                            if (years > 0) {
                                              timeAgo = `${years} year${
                                                years > 1 ? "s" : ""
                                              } ago`;
                                            } else if (months > 0) {
                                              timeAgo = `${months} month${
                                                months > 1 ? "s" : ""
                                              } ago`;
                                            } else if (days > 0) {
                                              timeAgo = `${days} day${
                                                days > 1 ? "s" : ""
                                              } ago`;
                                            } else if (hours > 0) {
                                              timeAgo = `${hours} hour${
                                                hours > 1 ? "s" : ""
                                              } ago`;
                                            } else if (minutes > 0) {
                                              timeAgo = `${minutes} minute${
                                                minutes > 1 ? "s" : ""
                                              } ago`;
                                            } else {
                                              timeAgo = `${seconds} second${
                                                seconds > 1 ? "s" : ""
                                              } ago`;
                                            }

                                            return (
                                              <span>
                                                {cetFormattedDate} ({timeAgo})
                                              </span>
                                            );
                                          }
                                          return 0; // Fallback if no date is available
                                        })()}
                                      </section>
                                    </section>
                                  </section>
                                  <section className="guild_page_members_item_contributed">
                                    Contributed:&nbsp;
                                    <strong>{memberData.contributed}</strong>xp
                                  </section>
                                  <section className="flex-center justify-end">
                                    {memberData.online
                                      ? memberData.server
                                      : "Offline"}
                                  </section>{" "}
                                </div>
                              ));
                          })}
                    </section>
                  )}
                </div>
              </div>
            </div>

            <div className="guild_page_members_container">
              <div className="guild_page_members_container_owner">
                <h3 className="force-regular pB-05">Owner</h3>
                <ul className="guild_page_members_item_wrap">
                  <li
                    className="guild_page_members_item"
                    onClick={() => {
                      handleMemberClick(
                        Object.keys(tabGuildData.members.owner)[0]
                      );
                    }}
                  >
                    <section className="flex align-center">
                      <img
                        src={`https://crafatar.com/avatars/${
                          tabGuildData.members.owner[
                            Object.keys(tabGuildData.members.owner)[0]
                          ].uuid
                        }`}
                        style={{ maxWidth: "1.5rem" }}
                        className="pR-05"
                        alt="Owner Avatar"
                      />
                      <section className="flex-col">
                        {" "}
                        <strong>
                          {Object.keys(tabGuildData.members.owner)[0]}
                        </strong>{" "}
                        <section className="guild_page_members_item_joined">
                          Joined:&nbsp;
                          {(() => {
                            const joinedDate =
                              tabGuildData.members.owner[
                                Object.keys(tabGuildData.members.owner)[0]
                              ]?.joined;

                            if (joinedDate) {
                              // Create a Date object from the joined date string
                              const date = new Date(joinedDate);
                              // Convert to CET format
                              const cetFormattedDate = date.toLocaleString(
                                "en-GB",
                                {
                                  timeZone: "CET", // Set the time zone to CET
                                  year: "numeric",
                                  month: "long", // Full month name
                                  day: "numeric",
                                }
                              );

                              // Calculate time ago
                              const now = new Date();
                              const seconds = Math.floor((now - date) / 1000);
                              const minutes = Math.floor(seconds / 60);
                              const hours = Math.floor(minutes / 60);
                              const days = Math.floor(hours / 24);
                              const months = Math.floor(days / 30.44); // Average month length
                              const years = Math.floor(days / 365);

                              let timeAgo = "";
                              if (years > 0) {
                                timeAgo = `${years} year${
                                  years > 1 ? "s" : ""
                                } ago`;
                              } else if (months > 0) {
                                timeAgo = `${months} month${
                                  months > 1 ? "s" : ""
                                } ago`;
                              } else if (days > 0) {
                                timeAgo = `${days} day${
                                  days > 1 ? "s" : ""
                                } ago`;
                              } else if (hours > 0) {
                                timeAgo = `${hours} hour${
                                  hours > 1 ? "s" : ""
                                } ago`;
                              } else if (minutes > 0) {
                                timeAgo = `${minutes} minute${
                                  minutes > 1 ? "s" : ""
                                } ago`;
                              } else {
                                timeAgo = `${seconds} second${
                                  seconds > 1 ? "s" : ""
                                } ago`;
                              }

                              return (
                                <span>
                                  {cetFormattedDate} ({timeAgo})
                                </span>
                              );
                            }
                            return 0; // Fallback if no date is available
                          })()}
                        </section>
                      </section>{" "}
                    </section>{" "}
                    <section className="guild_page_members_item_contributed">
                      Contributed:&nbsp;
                      {"    "}
                      <strong>
                        {tabGuildData.members.owner[
                          Object.keys(tabGuildData.members.owner)[0]
                        ]?.contributed || 0}
                      </strong>
                      xp
                    </section>
                    <section className="flex-center justify-end">
                      {tabGuildData.members.owner[
                        Object.keys(tabGuildData.members.owner)[0]
                      ]?.online
                        ? tabGuildData.members.owner[
                            Object.keys(tabGuildData.members.owner)[0]
                          ]?.server
                        : "Offline"}
                    </section>
                  </li>
                </ul>
              </div>

              {Object.entries(tabGuildData.members).map(([role, members]) => {
                if (
                  role === "total" ||
                  role === "owner" ||
                  role === "recruit"
                ) {
                  return null; // Skip rendering this role
                }

                if (role)
                  return (
                    <div key={role} className="guild_page_members_inner">
                      <h3 className="force-regular pB-05">
                        {role.charAt(0).toUpperCase() + role.slice(1)}s
                      </h3>
                      <section>
                        {Object.entries(members).map(
                          ([memberName, memberData]) => (
                            <li
                              key={memberData.uuid}
                              className="guild_page_members_item"
                              onClick={() => {
                                handleMemberClick(memberName);
                              }}
                            >
                              <section className=" flex align-center">
                                {" "}
                                <img
                                  src={`https://crafatar.com/avatars/${memberData.uuid}`}
                                  style={{ maxWidth: "1.5rem" }}
                                  className="pR-05"
                                />
                                <section className="flex-col">
                                  <strong>{memberName}</strong>{" "}
                                  <section className="guild_page_members_item_joined">
                                    Joined:&nbsp;
                                    {(() => {
                                      const joinedDate = memberData.joined;

                                      if (joinedDate) {
                                        // Create a Date object from the joined date string
                                        const date = new Date(joinedDate);
                                        // Convert to CET format
                                        const cetFormattedDate =
                                          date.toLocaleString("en-GB", {
                                            timeZone: "CET", // Set the time zone to CET
                                            year: "numeric",
                                            month: "long", // Full month name
                                          });

                                        // Calculate time ago
                                        const now = new Date();
                                        const seconds = Math.floor(
                                          (now - date) / 1000
                                        );
                                        const minutes = Math.floor(
                                          seconds / 60
                                        );
                                        const hours = Math.floor(minutes / 60);
                                        const days = Math.floor(hours / 24);
                                        const months = Math.floor(days / 30.44); // Average month length
                                        const years = Math.floor(days / 365);

                                        let timeAgo = "";
                                        if (years > 0) {
                                          timeAgo = `${years} year${
                                            years > 1 ? "s" : ""
                                          } ago`;
                                        } else if (months > 0) {
                                          timeAgo = `${months} month${
                                            months > 1 ? "s" : ""
                                          } ago`;
                                        } else if (days > 0) {
                                          timeAgo = `${days} day${
                                            days > 1 ? "s" : ""
                                          } ago`;
                                        } else if (hours > 0) {
                                          timeAgo = `${hours} hour${
                                            hours > 1 ? "s" : ""
                                          } ago`;
                                        } else if (minutes > 0) {
                                          timeAgo = `${minutes} minute${
                                            minutes > 1 ? "s" : ""
                                          } ago`;
                                        } else {
                                          timeAgo = `${seconds} second${
                                            seconds > 1 ? "s" : ""
                                          } ago`;
                                        }

                                        return (
                                          <span>
                                            {cetFormattedDate} ({timeAgo})
                                          </span>
                                        );
                                      }
                                      return 0; // Fallback if no date is available
                                    })()}
                                  </section>
                                </section>
                              </section>
                              <section className="guild_page_members_item_contributed">
                                Contributed:&nbsp;
                                <strong>{memberData.contributed}</strong>xp
                              </section>
                              <section className="flex-center justify-end">
                                {memberData.online
                                  ? memberData.server
                                  : "Offline"}
                              </section>
                            </li>
                          )
                        )}
                      </section>
                    </div>
                  );
              })}
              <div className="guild_page_members_container_recruits">
                <h4 className="force-regular pB-05">Recruits</h4>
                {tabGuildData?.members?.recruit &&
                Object.keys(tabGuildData.members.recruit).length > 0 ? (
                  Object.entries(tabGuildData.members.recruit).map(
                    ([memberName, memberData]) => (
                      <li
                        key={memberData.uuid}
                        className="guild_page_members_item"
                        onClick={() => {
                          handleMemberClick(memberName);
                        }}
                      >
                        <section className="flex align-center">
                          <img
                            src={`https://crafatar.com/avatars/${memberData.uuid}`}
                            style={{ maxWidth: "1.5rem" }}
                            className="pR-05"
                            alt={`${memberName}'s avatar`}
                          />
                          <section className="flex-col">
                            <strong>{memberName}</strong>
                            <section className="guild_page_members_item_joined">
                              Joined:&nbsp;
                              {(() => {
                                const joinedDate = memberData.joined;

                                if (joinedDate) {
                                  // Create a Date object from the joined date string
                                  const date = new Date(joinedDate);
                                  // Convert to CET format
                                  const cetFormattedDate = date.toLocaleString(
                                    "en-GB",
                                    {
                                      timeZone: "CET", // Set the time zone to CET
                                      year: "numeric",
                                      month: "long", // Full month name
                                      day: "numeric",
                                    }
                                  );

                                  // Calculate time ago
                                  const now = new Date();
                                  const seconds = Math.floor(
                                    (now - date) / 1000
                                  );
                                  const minutes = Math.floor(seconds / 60);
                                  const hours = Math.floor(minutes / 60);
                                  const days = Math.floor(hours / 24);
                                  const months = Math.floor(days / 30.44); // Average month length
                                  const years = Math.floor(days / 365);

                                  let timeAgo = "";
                                  if (years > 0) {
                                    timeAgo = `${years} year${
                                      years > 1 ? "s" : ""
                                    } ago`;
                                  } else if (months > 0) {
                                    timeAgo = `${months} month${
                                      months > 1 ? "s" : ""
                                    } ago`;
                                  } else if (days > 0) {
                                    timeAgo = `${days} day${
                                      days > 1 ? "s" : ""
                                    } ago`;
                                  } else if (hours > 0) {
                                    timeAgo = `${hours} hour${
                                      hours > 1 ? "s" : ""
                                    } ago`;
                                  } else if (minutes > 0) {
                                    timeAgo = `${minutes} minute${
                                      minutes > 1 ? "s" : ""
                                    } ago`;
                                  } else {
                                    timeAgo = `${seconds} second${
                                      seconds > 1 ? "s" : ""
                                    } ago`;
                                  }

                                  return (
                                    <span>
                                      {cetFormattedDate} ({timeAgo})
                                    </span>
                                  );
                                }
                                return 0; // Fallback if no date is available
                              })()}
                            </section>
                          </section>
                        </section>
                        <section className="guild_page_members_item_contributed flex-center">
                          Contributed:&nbsp;{" "}
                          <strong>{memberData.contributed}</strong>xp
                        </section>
                        <section className="flex-center justify-end">
                          {" "}
                          {memberData.online ? memberData.server : "Offline"}
                        </section>
                      </li>
                    )
                  )
                ) : (
                  <li>No recruits available</li>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No guild data available</p>
      )}
      {/*       <div>
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
      </div> */}
    </div>
  );
};

export default GuildPage;
