import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import vip from "../../Assests_components/ranks_tags/vip.svg";
import vip_plus from "../../Assests_components/ranks_tags/vip_plus.svg";
import hero from "../../Assests_components/ranks_tags/hero.svg";
import champ from "../../Assests_components/ranks_tags/champ.svg";
import defaultAvatarHead from "../../Assests_components/default_avatar/Profile_head_placeholder.png";
import defaultAvatarBody from "../../Assests_components/default_avatar/Profile_body_placeholder.png";
const rankImages = {
  VIP: vip,
  VIPPLUS: vip_plus,
  HERO: hero,
  CHAMPION: champ,
};
import { PlayerContext } from "../../PlayerContext.js";

const SidePanel = ({ playerData, playerTabs }) => {
  const { setClickedGuild } = useContext(PlayerContext);
  const navigate = useNavigate();

  const supportRank = playerData?.supportRank
    ? playerData.supportRank.toLowerCase()
    : null;
  const rankImage = supportRank ? rankImages[supportRank.toUpperCase()] : null;

  const imgWidth = supportRank === "champion" ? "8rem" : "8rem";

  const timeAgo = (utcDateString) => {
    if (!utcDateString || isNaN(new Date(utcDateString).getTime())) {
      return "Invalid date";
    }

    const lastJoinDate = new Date(utcDateString);
    const now = new Date();
    const diffInMilliseconds = now - lastJoinDate;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const years = Math.floor(days / 365); // Approximation assuming 365 days per year

    if (years > 0) {
      return `Last seen ${years} year${years > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `Last seen ${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `Last seen ${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `Last seen ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Last seen just now";
    }
  };
  const handleGuildJump = (clickedGuild) => {
    setClickedGuild(clickedGuild);
    navigate(`/guild`);
  };

  return (
    <section className="profile_grid_left">
      <div className="profile_grid_inner_container_top">
        <section className="flex">
          <img
            src={
              playerData?.uuid
                ? `https://crafatar.com/renders/head/${playerData?.uuid}`
                : defaultAvatarHead
            }
            className="grid_container_top_avatar"
          ></img>
        </section>

        <section className="flex-col ">
          <span className="flex gap-05">
            {rankImage ? (
              <img
                src={rankImage}
                alt={supportRank}
                style={{ width: imgWidth }}
              />
            ) : (
              <h2>No Rank</h2> // Fallback message when rank is null
            )}
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
                  {playerData.guild?.rankStars} {playerData.guild?.rank} of the{" "}
                  <a
                    className="guild_jump"
                    onClick={() => {
                      handleGuildJump(playerData.guild?.name);
                    }}
                  >
                    {playerData.guild?.name}
                  </a>
                </h5>
              ) : (
                <h5 className="force-regular">No guild registered.</h5>
              )}
            </h3>
          </section>
        </section>
      </div>

      <div className="profile_grid_inner_container_bottom">
        <img
          src={
            playerData?.uuid
              ? `https://crafatar.com/renders/body/${playerData.uuid}`
              : defaultAvatarBody
          }
          className="grid_container_bottom_avatar "
        ></img>
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
              <strong> {playerData?.globalData?.totalLevel || "0"}</strong>{" "}
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
              <strong>{playerData?.globalData?.killedMobs || "0"}</strong> mobs
              killed.
            </h4>
          </span>
          <span className="flex gap-05">
            <h4 className="force-regular"> Total Chests looted:</h4>
            <h4 className="force-regular">
              <strong>{playerData?.globalData?.chestsFound || "0"}</strong>{" "}
              chests found.
            </h4>
          </span>
          <span className="flex gap-05">
            <h4 className="force-regular"> Dungeons completed:</h4>
            <h4 className="force-regular">
              <strong>{playerData?.globalData?.dungeons.total || "0"}</strong>{" "}
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
  );
};

export default SidePanel;
