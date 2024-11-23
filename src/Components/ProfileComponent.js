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

const Profile = () => {
  const { playerData, loading, error, playerName } = useContext(PlayerContext); // Access playerName from context

  console.log("TEST: ", playerData);

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

            <section className="flex-col gap-05">
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
                      Offline
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
                  <FontAwesomeIcon icon={faCircleArrowLeft} />
                </h3>
                <h3>
                  <FontAwesomeIcon icon={faUser} />
                </h3>
                <h3>
                  <FontAwesomeIcon icon={faCircleArrowRight} />
                </h3>
              </section>
              <br></br>
              <br></br>
              <br></br>
            </section>
            <section className="flex-col gap-05 grid_bottom_stats">
              <h3>Personal stats</h3>
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
                <h4>{playerData?.globalData?.totalLevel || "N/A"}</h4>
              </span>
              <span className="flex gap-05">
                <h4 className="force-regular">Total playtime:</h4>
                <h4>
                  {playerData?.playtime
                    ? `${playerData.playtime} hours`
                    : "N/A"}
                </h4>
              </span>
              <span className="flex gap-05">
                <h4 className="force-regular">Total mobs killed:</h4>
                <h4>{playerData?.globalData?.killedMobs || "N/A"}</h4>
              </span>
            </section>
          </div>
        </section>

        <section className="profile_grid_right">
          <div className="stats_grid_top">
            <h3>Your rankings</h3>
          </div>
          <div className="stats_grid_bottom">
            <h3>Your characters</h3>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
