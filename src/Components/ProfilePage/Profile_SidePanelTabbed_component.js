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

const SidePanelTabbed = ({ tabPlayerData, playerTabs }) => {
  const { setClickedGuild } = useContext(PlayerContext);
  const navigate = useNavigate();

  const debounceTimeout = useRef(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    console.log("PLAYER DATA TABBED: ", tabPlayerData);
  }, [tabPlayerData]);

  const supportRank = tabPlayerData?.supportRank
    ? tabPlayerData.supportRank.toLowerCase()
    : null;
  const tabbedPlayerRank = playerTabs[activeTabIndex]?.data?.supportRank;
  const rankTabbedImage = tabbedPlayerRank
    ? rankImages[tabbedPlayerRank.toUpperCase()]
    : null;
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
              tabPlayerData?.uuid
                ? `https://crafatar.com/renders/head/${tabPlayerData?.uuid}`
                : defaultAvatarHead
            }
            className="grid_container_top_avatar"
          ></img>
        </section>

        <section className="flex-col ">
          <span className="flex gap-05">
            {rankTabbedImage ? (
              <img
                src={rankTabbedImage}
                alt={supportRank}
                style={{ width: imgWidth }}
              />
            ) : (
              <h2>No Rank</h2> // Fallback message when rank is null
            )}
            <h2>{tabPlayerData?.username || "PLAYER"}</h2>
          </span>
          <section>
            <h3 className="force-regular">
              {tabPlayerData?.online ? (
                <h5 className="force-regular" style={{ color: "lime" }}>
                  Online on {tabPlayerData.server}
                </h5>
              ) : (
                <h5 className="force-regular" style={{ color: "gray" }}>
                  {tabPlayerData?.lastJoin
                    ? timeAgo(tabPlayerData.lastJoin)
                    : "Never joined"}
                </h5>
              )}
            </h3>
            <h3 className="force-regular">
              {tabPlayerData?.guild?.name ? (
                <h5 className="force-regular">
                  {tabPlayerData.guild?.rankStars} {tabPlayerData.guild?.rank}{" "}
                  of the{" "}
                  <a
                    className="guild_jump"
                    onClick={() => {
                      handleGuildJump(tabPlayerData.guild?.name);
                    }}
                  >
                    {" "}
                    {tabPlayerData.guild?.name}
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
            tabPlayerData?.uuid
              ? `https://crafatar.com/renders/body/${tabPlayerData.uuid}`
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
              {tabPlayerData?.firstJoin
                ? new Date(tabPlayerData.firstJoin).toLocaleString()
                : "N/A"}
            </h4>
          </span>
          <span className="flex gap-05">
            <h4 className="force-regular">Total levels:</h4>
            <h4 className="force-regular">
              <strong> {tabPlayerData?.globalData?.totalLevel || "N/A"}</strong>{" "}
              levels
            </h4>
          </span>
          <span className="flex gap-05">
            <h4 className="force-regular">Total playtime:</h4>
            <h4 className="force-regular">
              <strong>
                {tabPlayerData?.playtime ? `${tabPlayerData.playtime}` : "N/A"}
              </strong>{" "}
              hours played.
            </h4>
          </span>
          <span className="flex gap-05">
            <h4 className="force-regular"> Total mobs killed:</h4>
            <h4 className="force-regular">
              <strong>{tabPlayerData?.globalData?.killedMobs || "0"}</strong>{" "}
              mobs killed.
            </h4>
          </span>
          <span className="flex gap-05">
            <h4 className="force-regular"> Total Chests looted:</h4>
            <h4 className="force-regular">
              <strong>{tabPlayerData?.globalData?.chestsFound || "0"}</strong>{" "}
              chests found.
            </h4>
          </span>
          <span className="flex gap-05">
            <h4 className="force-regular"> Dungeons completed:</h4>
            <h4 className="force-regular">
              <strong>
                {tabPlayerData?.globalData?.dungeons.total || "0"}
              </strong>{" "}
              chests found.
            </h4>
          </span>
          <br></br>{" "}
          <span className="flex gap-05">
            <h4 className="force-regular"> PVP kills:</h4>
            <h4 className="force-regular">
              <strong>{tabPlayerData?.globalData?.pvp?.kills || "0"}</strong>{" "}
              kills.
            </h4>
          </span>
          <span className="flex gap-05">
            <h4 className="force-regular"> PVP deaths:</h4>
            <h4 className="force-regular">
              <strong>{tabPlayerData?.globalData?.pvp?.deaths || "0"}</strong>{" "}
              deaths.
            </h4>
          </span>
          <span className="flex gap-05">
            <h4 className="force-regular"> PVP ratio:</h4>
            <h4 className="force-regular">
              <strong>
                {tabPlayerData?.globalData?.pvp?.deaths
                  ? (
                      tabPlayerData.globalData.pvp.kills /
                      tabPlayerData.globalData.pvp.deaths
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

export default SidePanelTabbed;
