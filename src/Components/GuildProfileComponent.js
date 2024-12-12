import React, { useContext, useEffect, useState } from "react";

import "../CSS/FooterComponent.css";
import { PlayerContext } from "../PlayerContext.js";

import guild_members from "../Assests_components/guild_assests/guild_members.webp";
import guild_online from "../Assests_components/guild_assests/guild_online.webp";
import guild_territories from "../Assests_components/guild_assests/guild_territories.webp";

const GuildPage = () => {
  const { guildNameProfile, guildDataProfile, setGuildNameProfile } =
    useContext(PlayerContext);

  console.log("Current Guild Name:", guildNameProfile);

  /* Input handle for guild name search */
  const handleInputChange = (e) => {
    const newGuildName = e.target.value;
    setGuildNameProfile(newGuildName);
    localStorage.setItem("guildNameProfile", newGuildName);
  };

  const createdDate = guildDataProfile.created
    ? new Date(guildDataProfile.created)
    : null;

  const cetDate = createdDate
    ? new Date(
        createdDate.toLocaleString("en-GB", { timeZone: "Europe/Berlin" })
      )
    : null;

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };

  return (
    <div className="guild_page_background">
      <div>
        <input
          placeholder="Enter guild name/tag"
          value={guildNameProfile}
          onChange={handleInputChange}
        ></input>
      </div>
      <div className="guild_page_container">
        <section className="guild_page_left"></section>
        <section className="guild_page_right">
          <section>
            <section className="flex align-center gap-05">
              <h1>[{guildDataProfile?.prefix}]</h1>
              <h1>{guildDataProfile?.name}</h1>
            </section>
            <section>
              {" "}
              <h5>
                Created:{" "}
                {cetDate
                  ? cetDate.toLocaleString("en-GB", options)
                  : "Creation date not available"}
              </h5>
            </section>
          </section>
          <section className="flex align-center justify-evenly gap-05">
            <section className="flex-col align-center">
              <img src={guild_members} className="guild_page_right_img"></img>
              <section
                className="flex gap-05
              "
              >
                {" "}
                <h5>
                  <strong>{guildDataProfile?.members?.total}</strong>
                </h5>{" "}
                <h5>/</h5> <h5>N/A</h5>
              </section>
            </section>{" "}
            <section className="flex-col align-center">
              <img src={guild_online} className="guild_page_right_img"></img>
              <section
                className="flex gap-05
              "
              >
                <h5>
                  <strong>{guildDataProfile?.online}</strong>
                </h5>{" "}
                <h5>/</h5> <h5>{guildDataProfile?.members?.total}</h5>
              </section>{" "}
            </section>{" "}
            <section className="flex-col align-center">
              <img
                src={guild_territories}
                className="guild_page_right_img"
              ></img>
              <h5>{guildDataProfile?.territories}</h5>
            </section>
          </section>
          <section>
            <section className="flex">
              <h5 className="pR-03">
                {" "}
                Guild level: <strong>{guildDataProfile.level}</strong>
              </h5>
              <h5>({guildDataProfile.xpPercent}%)</h5>
            </section>
            <section>
              <progress
                value={guildDataProfile.xpPercent}
                max={100}
                style={{ width: "100%" }}
              />
            </section>
          </section>
        </section>
      </div>
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
