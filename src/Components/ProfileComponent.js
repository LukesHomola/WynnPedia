import React, { useEffect, useState, useContext } from "react";

import { PlayerContext } from "../PlayerContext.js"; // Access context

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import "../CSS/ProfileComponent.css";
import profileAvatarHead from "../Assests_components/Profile_head_placeholder.png";
import profileAvatarBody from "../Assests_components/Profile_body_placeholder.png";
import mage from "../Assests_components/classes/mage.webp";
import archer from "../Assests_components/classes/archer.webp";
import shaman from "../Assests_components/classes/shaman.webp";
import assassin from "../Assests_components/classes/assassin.webp";
import warrior from "../Assests_components/classes/warrior.webp";

const characterImages = {
  MAGE: mage, // Assuming you have imported the mage image at the top
  SHAMAN: shaman, // Assuming you have imported the shaman image at the top
  ARCHER: archer, // Assuming you have imported the archer image at the top
  ASSASSIN: assassin, // Assuming you have imported the assassin image at the top
  WARRIOR: warrior, // Assuming you have imported the warrior image at the top
};

const Profile = () => {
  const { playerData, extendedPlayerData, loading, error, playerName } =
    useContext(PlayerContext); // Access playerName from context

  console.log("TEST REQ: ", extendedPlayerData);

  const timeAgo = (utcDateString) => {
    const lastJoinDate = new Date(utcDateString);
    const now = new Date();
    const diffInMilliseconds = now - lastJoinDate;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);

    if (days > 0) {
      return `Last seen ${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `Last seen ${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `Last seen ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Last seen just now";
    }
  };

  return (
    <div className="profile_component">
      <div className="profile_grid_container">
        <section className="profile_grid_left">
          <div className="profile_grid_inner_container_top">
            <section className="flex">
              <img
                src={profileAvatarHead}
                className="grid_container_top_avatar"
              ></img>
            </section>

            <section className="flex-col ">
              <span className="flex gap-05">
                <h2>{(playerData?.supportRank || "RANK").toUpperCase()}</h2>
                <h2>{playerData?.username || "PLAYER"}</h2>
              </span>
              <section>
                <h3 className="force-regular">
                  {playerData?.online ? (
                    <h5 className="force-regular" style={{ color: "lime" }}>
                      Online on {playerData.server}
                    </h5>
                  ) : (
                    <h5 className="force-regular" style={{ color: "gray" }}>
                      {playerData?.lastJoin
                        ? timeAgo(playerData.lastJoin)
                        : "Never joined"}
                    </h5>
                  )}
                </h3>
                <h3 className="force-regular">
                  {playerData?.guild?.name ? (
                    <h5 className="force-regular">
                      {playerData.guild?.rankStars} {playerData.guild?.rank} of
                      the {playerData.guild?.name}
                    </h5>
                  ) : (
                    <h5 className="force-regular">No guild registered.</h5>
                  )}
                </h3>
              </section>
            </section>
          </div>

          <div className="profile_grid_inner_container_bottom">
            <section className="flex-col">
              <img
                src={profileAvatarBody}
                className="grid_container_bottom_avatar"
              ></img>
              <section className="flex-center gap-1">
                <h3>
                  <FontAwesomeIcon
                    icon={faCircleArrowLeft}
                    className="avatar_showcase_control"
                  />
                </h3>
                <h3>
                  <FontAwesomeIcon
                    icon={faUser}
                    className="avatar_showcase_control"
                  />
                </h3>
                <h3>
                  <FontAwesomeIcon
                    icon={faCircleArrowRight}
                    className="avatar_showcase_control"
                  />
                </h3>
              </section>
            </section>
            <section className="flex-col gap-05 grid_bottom_stats">
              <h5>Personal stats</h5>
              <br></br>
              <span className="flex gap-05">
                <h4 className="force-regular">First join:</h4>
                <h4>
                  {playerData?.firstJoin
                    ? new Date(playerData.firstJoin).toLocaleString()
                    : "N/A"}
                </h4>
              </span>
              <span className="flex gap-05">
                <h4 className="force-regular">Total levels:</h4>
                <h4 className="force-regular">
                  <strong>
                    {" "}
                    {playerData?.globalData?.totalLevel || "N/A"}
                  </strong>{" "}
                  levels
                </h4>
              </span>
              <span className="flex gap-05">
                <h4 className="force-regular">Total playtime:</h4>
                <h4 className="force-regular">
                  <strong>
                    {playerData?.playtime ? `${playerData.playtime}` : "N/A"}
                  </strong>{" "}
                  hours played.
                </h4>
              </span>
              <span className="flex gap-05">
                <h4 className="force-regular"> Total mobs killed:</h4>
                <h4 className="force-regular">
                  <strong>{playerData?.globalData?.killedMobs || "N/A"}</strong>{" "}
                  mobs killed.
                </h4>
              </span>
              <span className="flex gap-05">
                <h4 className="force-regular"> Total Chests looted:</h4>
                <h4 className="force-regular">
                  <strong>
                    {playerData?.globalData?.chestsFound || "N/A"}
                  </strong>{" "}
                  chests found.
                </h4>
              </span>
              <br></br>{" "}
              <span className="flex gap-05">
                <h4 className="force-regular"> PVP kills:</h4>
                <h4 className="force-regular">
                  <strong>{playerData?.globalData?.pvp?.kills || "0"}</strong>{" "}
                  kills.
                </h4>
              </span>
              <span className="flex gap-05">
                <h4 className="force-regular"> PVP deaths:</h4>
                <h4 className="force-regular">
                  <strong>{playerData?.globalData?.pvp?.deaths || "0"}</strong>{" "}
                  deaths.
                </h4>
              </span>
              <span className="flex gap-05">
                <h4 className="force-regular"> PVP ratio:</h4>
                <h4 className="force-regular">
                  <strong>
                    {playerData?.globalData?.pvp?.deaths
                      ? (
                          playerData.globalData.pvp.kills /
                          playerData.globalData.pvp.deaths
                        ).toFixed(2)
                      : "0"}
                  </strong>
                </h4>
              </span>
            </section>
          </div>
        </section>

        <section className="profile_grid_right">
          <div className="stats_grid_top">
            <h5>Your characters</h5>
            <br></br>
            {playerData && extendedPlayerData.characters && (
              <div className="characters_container">
                {Object.keys(extendedPlayerData.characters).map(
                  (characterId) => {
                    const character =
                      extendedPlayerData.characters[characterId];
                    return (
                      <div key={characterId} className="characters_item">
                        <img
                          className="character_item_img"
                          src={characterImages[character.type]}
                          alt={character.type}
                        />
                        <section>
                          <h3>{character.type}</h3>
                          <p>Combat Level: {character.level}</p>
                          <p>Total Level: {character.totalLevel}</p>
                          <p>XP: {character.xp}</p>
                        </section>
                      </div>
                    );
                  }
                )}
              </div>
            )}{" "}
          </div>
          <div className="stats_grid_bottom">
            <h5>Your rankings</h5>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
