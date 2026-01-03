import { useEffect, useState, useContext, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../PlayerContext.js";
import CharacterInfo from "../Components/ProfilePage/Profile_CharacterInfo_component.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import {
  faCaretUp,
  faXmark,
  faSkull,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import "../CSS/ProfileComponent.css";
import defaultAvatarHead from "../Assests_components/default_avatar/Profile_head_placeholder.png";
import defaultAvatarBody from "../Assests_components/default_avatar/Profile_body_placeholder.png";
import mage from "../Assests_components/classes/mage.webp";
import archer from "../Assests_components/classes/archer.webp";
import shaman from "../Assests_components/classes/shaman.webp";
import assassin from "../Assests_components/classes/assassin.webp";
import warrior from "../Assests_components/classes/warrior.webp";

import scribing from "../Assests_components/professions/Scribing.webp";
import cooking from "../Assests_components/professions/Cooking.webp";
import woodcutting from "../Assests_components/professions/Woodcutting.webp";
import farming from "../Assests_components/professions/Farming.webp";
import mining from "../Assests_components/professions/Mining.webp";
import alchemism from "../Assests_components/professions/Alchemism.webp";
import jeweling from "../Assests_components/professions/Jeweling.webp";
import weaponsmithing from "../Assests_components/professions/Weaponsmithing.webp";
import armouring from "../Assests_components/professions/Armouring.webp";
import tailoring from "../Assests_components/professions/Tailoring.webp";
import fishing from "../Assests_components/professions/Fishing.webp";
import woodworking from "../Assests_components/professions/Woodworking.webp";

import wars_completion from "../Assests_components/content_completion/wars.webp";
import global_total_completion from "../Assests_components/content_completion/global_total_completions.webp";
import total_completion from "../Assests_components/content_completion/total_completions.webp";

import total from "../Assests_components/total_levels/total.webp";
import profs from "../Assests_components/total_levels/profs.webp";
import combat from "../Assests_components/total_levels/combat.webp";

import NoL from "../Assests_components/raids/NoL.webp";
import NotG from "../Assests_components/raids/NotG.webp";
import TCC from "../Assests_components/raids/TCC.webp";
import TNA from "../Assests_components/raids/TNA.webp";

import vip from "../Assests_components/ranks_tags/vip.svg";
import vip_plus from "../Assests_components/ranks_tags/vip_plus.svg";
import hero from "../Assests_components/ranks_tags/hero.svg";
import champ from "../Assests_components/ranks_tags/champ.svg";
const characterImages = {
  MAGE: mage,
  SHAMAN: shaman,
  ARCHER: archer,
  ASSASSIN: assassin,
  WARRIOR: warrior,
};
const professionImages = {
  Scribing: scribing,
  Cooking: cooking,
  Woodcutting: woodcutting,
  Farming: farming,
  Mining: mining,
  Alchemism: alchemism,
  Jeweling: jeweling,
  Weaponsmithing: weaponsmithing,
  Armouring: armouring,
  Tailoring: tailoring,
  Fishing: fishing,
  Woodworking: woodworking,
};

const totalLevelsImages = {
  totalSoloLevel: total,
  professionsSoloLevel: total,
  professionsGlobalLevel: profs,
  totalGlobalLevel: profs,
  combatGlobalLevel: combat,
  combatSoloLevel: combat,
};

const rankImages = {
  VIP: vip,
  VIPPLUS: vip_plus,
  HERO: hero,
  CHAMPION: champ,
};

const professions = [
  "scribing",
  "cooking",
  "woodcutting",
  "farming",
  "mining",
  "alchemism",
  "jeweling",
  "weaponsmithing",
  "armouring",
  "tailoring",
  "fishing",
  "woodworking",
];

const totalLevels = [
  "totalSoloLevel",
  "professionsSoloLevel",
  "professionsGlobalLevel",
  "totalGlobalLevel",
  "combatGlobalLevel",
  "combatSoloLevel",
];

const Profile = ({ characters, currentCharacter }) => {
  const {
    playerData,
    extendedPlayerData,
    loading,
    error,
    playerName,
    clickedGuildPlayer,
    setClickedGuildPlayer,
    clickedGuild,
    setClickedGuild,
    clickedPlayer,
    setClickedPlayer,
    isMenuVisible,
    setIsMenuVisible,
  } = useContext(PlayerContext); // Access playerName from context
  const debounceTimeout = useRef(null);

  const navigate = useNavigate();

  const [isProfessionsVisible, setIsProfessionsVisible] = useState(false);
  const [isContentCompletionVisible, setIsContentCompletionVisible] =
    useState(false);
  const [isTotalLevelsVisible, setIsTotalLevelsVisible] = useState(false);
  const [isRaidsStatVisible, setIsRaidsStatVisible] = useState(false);

  /*  */
  const [isProfessions, setIsProfessions] = useState(false);
  const [isContentCompletion, setIsContentCompletion] = useState(false);

  /* Character info card  */
  const [isCharacterInfoVisible, setIsCharacterInfoVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  /*  */
  const [playerTabs, setPlayerTabs] = useState([
    {
      username: playerData?.username || "",
      data: extendedPlayerData,
    },
  ]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabInputs, setTabInputs] = useState([""]);
  const [tabPlayerData, setTabPlayerData] = useState();

  useEffect(() => {
    if (extendedPlayerData) {
      // Set the first tab to the extendedPlayerData
      setPlayerTabs([
        { username: extendedPlayerData.username, characters: [] },
        ...playerTabs.slice(1),
      ]);
    }
  }, [extendedPlayerData]); // Run this effect when extendedPlayerData changes

  const handleTabClick = (index, playerName) => {
    setActiveTabIndex(index);
    fetchPlayerData(playerName);
  };

  // Fetch data for a specific tab
  const fetchPlayerData = async (username, index) => {
    if (!username) return;
    try {
      const response = await fetch(
        `https://api.wynncraft.com/v3/player/${username}?fullResult`
      );
      const data = await response.json();
      setTabPlayerData(data),
        setPlayerTabs((prevTabs) =>
          prevTabs.map((tab, i) =>
            i === index ? { ...tab, username, data } : tab
          )
        );
    } catch (error) {
      console.error("Failed to fetch player data:", error);
    }
  };

  // Handle input change for a specific tab
  const handleInputChange = (index, value) => {
    setTabInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      console.log("LOG: ", playerTabs);
      updatedInputs[index] = value;
      return updatedInputs;
    });

    // Trigger API query with debounce
    if (value.length >= 3) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        fetchPlayerData(value, index);
      }, 300);
    }
  };

  // Add a new tab
  const handleAddTab = () => {
    setPlayerTabs((prevTabs) => [
      ...prevTabs,
      { username: `Player ${prevTabs.length + 1}`, data: null },
    ]);
    setTabInputs((prevInputs) => [...prevInputs, ""]);
    setActiveTabIndex(playerTabs.length); // Switch to the new tab
  };

  // Close a tab
  const handleCloseTab = (index) => {
    if (playerTabs.length === 1) return;
    const updatedTabs = playerTabs.filter((_, i) => i !== index);
    const updatedInputs = tabInputs.filter((_, i) => i !== index);
    setPlayerTabs(updatedTabs);
    setTabInputs(updatedInputs);
    setActiveTabIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  /*  */

  const toggleProfessionsVisibility = () => {
    setIsProfessionsVisible(!isProfessionsVisible); // Toggle the visibility state
    setIsProfessions((prev) => !prev);
  };
  const toggleContentCompletionVisibility = () => {
    setIsContentCompletionVisible(!isContentCompletionVisible); // Toggle the visibility state
    setIsContentCompletion((prev) => !prev);
  };
  const toggleTotalLevelsVisibility = () => {
    setIsTotalLevelsVisible(!isTotalLevelsVisible); // Toggle the visibility state
    setIsTotalLevels((prev) => !prev);
  };
  const toggleRaidStatsVisibility = () => {
    setIsRaidsStatVisible(!isRaidsStatVisible); // Toggle the visibility state
    setIsRaidsStats((prev) => !prev);
  };

  // Characters closer info section

  /* FOR WORKING BACKGROUND */
  const isBothVisible = isProfessionsVisible && isContentCompletionVisible;

  const supportRank = playerData?.supportRank
    ? playerData.supportRank.toLowerCase()
    : null; // Default to null
  const rankImage = supportRank ? rankImages[supportRank.toUpperCase()] : null; // Only call toUpperCase if supportRank is not null

  const tabbedPlayerRank = playerTabs[activeTabIndex]?.data?.supportRank;
  const rankTabbedImage = tabbedPlayerRank
    ? rankImages[tabbedPlayerRank.toUpperCase()]
    : null;

  // Determine the width based on the rank
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

  // Close character info on player data update
  useEffect(() => {
    if (playerData || extendedPlayerData) {
      setIsCharacterInfoVisible(false);
      setIsProfessionsVisible(false);
      setIsContentCompletionVisible(false);
      setIsTotalLevelsVisible(false);
      setIsRaidsStatVisible(false);
    }
  }, [playerData, extendedPlayerData]);

  /*  */

  /* Creating new tab for clicked player from guild apge */
  useEffect(() => {
    if (clickedGuildPlayer !== null) {
      handleAddTab();
      fetchPlayerData(clickedGuildPlayer, 1);
    }
  }, [clickedGuildPlayer]);
  useEffect(() => {
    if (clickedPlayer !== null) {
      handleAddTab();
      fetchPlayerData(clickedPlayer, 1);
    }
  }, [clickedPlayer]);

  /*  */

  const handleGuildJump = (clickedGuild) => {
    setClickedGuild(clickedGuild);
    navigate(`/guild`);
  };

  return (
    <div className="stats_tabs_container">
      {!isMenuVisible && (
        <div className="stats_tabs_container_controls">
          <section className="stats_tabs_main_profile_tabs">
            {playerTabs.slice(0, 10).map((player, index) => (
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
                <button onClick={() => handleTabClick(index, player.username)}>
                  <h5>{player?.username}</h5>
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

          {playerTabs.length < 10 && (
            <button
              className="stats_tabs_add"
              onClick={() =>
                handleAddTab({
                  username: `Player ${playerTabs.length + 1}`,
                  characters: [],
                })
              }
            >
              <FontAwesomeIcon icon={faPlus} />{" "}
            </button>
          )}
        </div>
      )}

      {/* TABBED PLAYER RENDERS */}
      <div className="stats_tabs_main_tab_container p-05">
        {playerTabs.length > 0 ? (
          <div>
            {playerTabs[activeTabIndex] ? (
              <>
                {/* TABBED PLAYER SEARCH */}
                {activeTabIndex !== 0 && (
                  <div className="stats_tabs_main_input_background">
                    {playerTabs.map(
                      (tab, index) =>
                        index === activeTabIndex && (
                          <div key={index}>
                            {!isMenuVisible && (
                              <input
                                style={{
                                  border: "1px solid #530909",
                                }}
                                placeholder="Enter username"
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
                    <div
                      className={`profile_component ${
                        isBothVisible ? "" : ""
                      } `}
                    >
                      {isCharacterInfoVisible && selectedCharacter && (
                        <CharacterInfo
                          character={selectedCharacter}
                          isCharacterInfoVisible={isCharacterInfoVisible}
                          setIsCharacterInfoVisible={setIsCharacterInfoVisible}
                          rankImage={rankTabbedImage}
                          supportRank={supportRank}
                          imgWidth={imgWidth}
                          tabPlayerData={tabPlayerData}
                          timeAgo={timeAgo}
                          isProfessionsVisible={isProfessionsVisible}
                          playerTabs={playerTabs}
                          activeTabIndex={activeTabIndex}
                        />
                      )}
                      <div
                        className={`profile_grid_container ${
                          isBothVisible ? "" : ""
                        } ${isCharacterInfoVisible ? "blur" : ""}`}
                      >
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
                                    <h5
                                      className="force-regular"
                                      style={{ color: "lime" }}
                                    >
                                      Online on {tabPlayerData.server}
                                    </h5>
                                  ) : (
                                    <h5
                                      className="force-regular"
                                      style={{ color: "gray" }}
                                    >
                                      {tabPlayerData?.lastJoin
                                        ? timeAgo(tabPlayerData.lastJoin)
                                        : "Never joined"}
                                    </h5>
                                  )}
                                </h3>
                                <h3 className="force-regular">
                                  {tabPlayerData?.guild?.name ? (
                                    <h5 className="force-regular">
                                      {tabPlayerData.guild?.rankStars}{" "}
                                      {tabPlayerData.guild?.rank} of the{" "}
                                      <a
                                        className="guild_jump"
                                        onClick={() => {
                                          handleGuildJump(
                                            tabPlayerData.guild?.name
                                          );
                                        }}
                                      >
                                        {" "}
                                        {tabPlayerData.guild?.name}
                                      </a>
                                    </h5>
                                  ) : (
                                    <h5 className="force-regular">
                                      No guild registered.
                                    </h5>
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
                                    ? new Date(
                                        tabPlayerData.firstJoin
                                      ).toLocaleString()
                                    : "N/A"}
                                </h4>
                              </span>
                              <span className="flex gap-05">
                                <h4 className="force-regular">Total levels:</h4>
                                <h4 className="force-regular">
                                  <strong>
                                    {" "}
                                    {tabPlayerData?.globalData?.totalLevel ||
                                      "N/A"}
                                  </strong>{" "}
                                  levels
                                </h4>
                              </span>
                              <span className="flex gap-05">
                                <h4 className="force-regular">
                                  Total playtime:
                                </h4>
                                <h4 className="force-regular">
                                  <strong>
                                    {tabPlayerData?.playtime
                                      ? `${tabPlayerData.playtime}`
                                      : "N/A"}
                                  </strong>{" "}
                                  hours played.
                                </h4>
                              </span>
                              <span className="flex gap-05">
                                <h4 className="force-regular">
                                  {" "}
                                  Total mobs killed:
                                </h4>
                                <h4 className="force-regular">
                                  <strong>
                                    {tabPlayerData?.globalData?.killedMobs ||
                                      "0"}
                                  </strong>{" "}
                                  mobs killed.
                                </h4>
                              </span>
                              <span className="flex gap-05">
                                <h4 className="force-regular">
                                  {" "}
                                  Total Chests looted:
                                </h4>
                                <h4 className="force-regular">
                                  <strong>
                                    {tabPlayerData?.globalData?.chestsFound ||
                                      "0"}
                                  </strong>{" "}
                                  chests found.
                                </h4>
                              </span>
                              <span className="flex gap-05">
                                <h4 className="force-regular">
                                  {" "}
                                  Dungeons completed:
                                </h4>
                                <h4 className="force-regular">
                                  <strong>
                                    {tabPlayerData?.globalData?.dungeons
                                      .total || "0"}
                                  </strong>{" "}
                                  chests found.
                                </h4>
                              </span>
                              <br></br>{" "}
                              <span className="flex gap-05">
                                <h4 className="force-regular"> PVP kills:</h4>
                                <h4 className="force-regular">
                                  <strong>
                                    {tabPlayerData?.globalData?.pvp?.kills ||
                                      "0"}
                                  </strong>{" "}
                                  kills.
                                </h4>
                              </span>
                              <span className="flex gap-05">
                                <h4 className="force-regular"> PVP deaths:</h4>
                                <h4 className="force-regular">
                                  <strong>
                                    {tabPlayerData?.globalData?.pvp?.deaths ||
                                      "0"}
                                  </strong>{" "}
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

                        <section className="profile_grid_right">
                          <div className="stats_grid_top">
                            <h5>Characters</h5>
                            <br></br>
                            {tabPlayerData && tabPlayerData.characters && (
                              <div className="characters_container">
                                {Object.keys(tabPlayerData.characters).map(
                                  (characterId) => {
                                    const character =
                                      tabPlayerData.characters[characterId];
                                    return (
                                      <div
                                        key={characterId}
                                        className="characters_item"
                                        onClick={() => {
                                          setSelectedCharacter(character); // Update selected character
                                          setIsCharacterInfoVisible(true); // Optionally show character info
                                        }}
                                      >
                                        <img
                                          className="character_item_img"
                                          src={characterImages[character.type]}
                                          alt={character.type}
                                        />
                                        <section>
                                          {character.reskin ? (
                                            <h3>{character.reskin}</h3>
                                          ) : (
                                            <h2>{character.type}</h2>
                                          )}{" "}
                                          <p>Combat level: {character.level}</p>
                                          <p>
                                            Total level: {character.totalLevel}
                                          </p>
                                          <p>
                                            Time played: {character.playtime}{" "}
                                            hours
                                          </p>
                                          <progress
                                            value={character.xpPercent}
                                            max={100}
                                          />
                                        </section>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}{" "}
                          </div>
                          <div className="stats_grid_bottom">
                            <h5>Rankings</h5>
                            <br></br>
                            {/* Profs. ranking section */}
                            <section
                              className="flex-center space-between p-02-05 color-bg-09 stats_ranking_hover"
                              onClick={toggleProfessionsVisibility}
                            >
                              <h5>Professions</h5>
                              <FontAwesomeIcon
                                icon={faCaretUp}
                                onClick={() => {
                                  toggleProfessionsVisibility();
                                }}
                                className={`ranking_item_btn ${
                                  isProfessions ? "rotated" : ""
                                }`}
                              />
                            </section>
                            <br></br>
                            <CSSTransition
                              in={isProfessionsVisible}
                              timeout={300}
                              classNames="fade"
                              unmountOnExit
                            >
                              <div style={{ overflow: "hidden" }}>
                                {" "}
                                {isProfessionsVisible &&
                                  tabPlayerData &&
                                  tabPlayerData && (
                                    <div className="rankings_container">
                                      {Object.entries(tabPlayerData.ranking)
                                        .filter(([rankingId]) =>
                                          professions.some((profession) =>
                                            rankingId.startsWith(
                                              profession.toLowerCase()
                                            )
                                          )
                                        )
                                        .map(([rankingId, rankingValue]) => {
                                          const formattedRankingId = rankingId
                                            .replace(/Level$/, "")
                                            .replace(/([A-Z])/g, " $1")
                                            .trim()
                                            .replace(/^./, (str) =>
                                              str.toUpperCase()
                                            );

                                          const profession =
                                            formattedRankingId
                                              .charAt(0)
                                              .toUpperCase() +
                                            formattedRankingId
                                              .slice(1)
                                              .toLowerCase();

                                          return (
                                            <div
                                              key={rankingId}
                                              className="ranking_item"
                                            >
                                              <img
                                                className="ranking_item_img"
                                                src={
                                                  professionImages[
                                                    profession
                                                  ] ||
                                                  "https://via.placeholder.com/150"
                                                } // Fallback to a placeholder image
                                                alt={profession}
                                              />
                                              <h5>
                                                {formattedRankingId}:{" "}
                                                <strong>#{rankingValue}</strong>
                                              </h5>
                                            </div>
                                          );
                                        })}{" "}
                                    </div>
                                  )}{" "}
                                <br></br>
                              </div>
                            </CSSTransition>

                            {/* Content completion ranking section */}
                            <section
                              className="flex-center space-between p-02-05 color-bg-09 stats_ranking_hover"
                              onClick={toggleContentCompletionVisibility}
                            >
                              <h5>Content completion</h5>
                              <FontAwesomeIcon
                                icon={faCaretUp}
                                onClick={() => {
                                  toggleContentCompletionVisibility();
                                }}
                                className={`ranking_item_btn ${
                                  isContentCompletion ? "rotated" : ""
                                }`}
                              />
                            </section>
                            <br></br>
                            <CSSTransition
                              in={isContentCompletionVisible}
                              timeout={300}
                              classNames="fade"
                              unmountOnExit
                            >
                              <div style={{ overflow: "hidden" }}>
                                {" "}
                                {isContentCompletionVisible &&
                                  tabPlayerData &&
                                  tabPlayerData && (
                                    <div className="rankings_container_small">
                                      <div className="ranking_item">
                                        <img
                                          className="ranking_item_img"
                                          src={wars_completion}
                                        />
                                        Wars completed:
                                        <strong>
                                          {" "}
                                          #
                                          {
                                            tabPlayerData?.ranking
                                              ?.warsCompletion
                                          }
                                        </strong>
                                      </div>
                                      <div className="ranking_item">
                                        <img
                                          className="ranking_item_img"
                                          src={global_total_completion}
                                        />
                                        Global total completion:
                                        <strong>
                                          {" "}
                                          #
                                          {
                                            tabPlayerData?.ranking
                                              ?.globalPlayerContent
                                          }
                                        </strong>
                                      </div>{" "}
                                      <div className="ranking_item">
                                        <img
                                          className="ranking_item_img"
                                          src={total_completion}
                                        />
                                        Total completion:
                                        <strong>
                                          {" "}
                                          #
                                          {
                                            tabPlayerData?.ranking
                                              ?.playerContent
                                          }
                                        </strong>
                                      </div>
                                    </div>
                                  )}{" "}
                                <br></br>
                              </div>
                            </CSSTransition>
                            {/* Total levels section */}
                            <section
                              className="flex-center space-between p-02-05 color-bg-09 stats_ranking_hover"
                              onClick={toggleTotalLevelsVisibility}
                            >
                              <h5>Total levels</h5>
                              <FontAwesomeIcon
                                icon={faCaretUp}
                                onClick={() => {
                                  toggleTotalLevelsVisibility();
                                }}
                                className={`ranking_item_btn ${
                                  isTotalLevelsVisible ? "rotated" : ""
                                }`}
                              />
                            </section>
                            <br></br>
                            <CSSTransition
                              in={isTotalLevelsVisible}
                              timeout={300}
                              classNames="fade"
                              unmountOnExit
                            >
                              <div style={{ overflow: "hidden" }}>
                                {isTotalLevelsVisible &&
                                  tabPlayerData &&
                                  tabPlayerData && (
                                    <div className="rankings_container">
                                      {Object.entries(tabPlayerData.ranking)
                                        .filter(([key]) =>
                                          totalLevels.includes(key)
                                        )
                                        .map(([key, value]) => (
                                          <div
                                            key={key}
                                            className="ranking_item"
                                          >
                                            <img
                                              className="ranking_item_img"
                                              src={
                                                totalLevelsImages[key] ||
                                                "https://via.placeholder.com/150"
                                              }
                                              alt={key}
                                            />
                                            <h5>
                                              {key.charAt(0).toUpperCase() +
                                                key
                                                  .slice(1)
                                                  .replace(/([A-Z])/g, " $1")
                                                  .trim()}
                                              : <strong>#{value}</strong>
                                            </h5>
                                          </div>
                                        ))}
                                    </div>
                                  )}{" "}
                                <br></br>
                              </div>
                            </CSSTransition>
                            {/* Content raids ranking section */}
                            <section
                              className="flex-center space-between p-02-05 color-bg-09 stats_ranking_hover"
                              onClick={toggleRaidStatsVisibility}
                            >
                              <h5>Raids completion</h5>
                              <FontAwesomeIcon
                                icon={faCaretUp}
                                onClick={() => {
                                  toggleRaidStatsVisibility();
                                }}
                                className={`ranking_item_btn ${
                                  isContentCompletion ? "rotated" : ""
                                }`}
                              />
                            </section>
                            <br></br>
                            <CSSTransition
                              in={isRaidsStatVisible}
                              timeout={300}
                              classNames="fade"
                              unmountOnExit
                            >
                              <div style={{ overflow: "hidden" }}>
                                {" "}
                                {isRaidsStatVisible &&
                                  tabPlayerData &&
                                  tabPlayerData && (
                                    <div className="rankings_container_small">
                                      <div className="ranking_item">
                                        <img
                                          className="ranking_item_img"
                                          src={NoL}
                                        />
                                        NoL Raids completed:
                                        <strong>
                                          {" "}
                                          #
                                          {
                                            tabPlayerData?.ranking
                                              ?.orphionCompletion
                                          }
                                        </strong>
                                      </div>
                                      <div className="ranking_item">
                                        <img
                                          className="ranking_item_img"
                                          src={NotG}
                                        />
                                        NotG Raids completed:
                                        <strong>
                                          {" "}
                                          #
                                          {
                                            tabPlayerData?.ranking
                                              ?.grootslangCompletion
                                          }
                                        </strong>
                                      </div>{" "}
                                      <div className="ranking_item">
                                        <img
                                          className="ranking_item_img"
                                          src={TCC}
                                        />
                                        TCC Raids completed:
                                        <strong>
                                          {" "}
                                          #
                                          {
                                            tabPlayerData?.ranking
                                              ?.colossusCompletion
                                          }
                                        </strong>
                                      </div>
                                      <div className="ranking_item">
                                        <img
                                          className="ranking_item_img"
                                          src={TNA}
                                        />
                                        TNA Raid Raids completed:
                                        <strong>
                                          {" "}
                                          #
                                          {
                                            tabPlayerData?.ranking
                                              ?.namelessCompletion
                                          }
                                        </strong>
                                      </div>
                                    </div>
                                  )}{" "}
                                <br></br>
                              </div>
                            </CSSTransition>
                          </div>
                        </section>
                      </div>
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
        )}
      </div>

      {/* RENDER STATS FOR LOCALY STORED PLAYER */}
      {activeTabIndex == 0 && (
        <div className={`profile_component ${isBothVisible ? "" : ""} `}>
          {isCharacterInfoVisible && selectedCharacter && (
            <CharacterInfo
              character={selectedCharacter}
              isCharacterInfoVisible={isCharacterInfoVisible}
              setIsCharacterInfoVisible={setIsCharacterInfoVisible}
              rankImage={rankImage}
              supportRank={supportRank}
              imgWidth={imgWidth}
              playerData={playerData}
              timeAgo={timeAgo}
              isProfessionsVisible={isProfessionsVisible}
              extendedPlayerData={extendedPlayerData}
            />
          )}
          <div
            className={`profile_grid_container ${isBothVisible ? "" : ""} ${
              isCharacterInfoVisible ? "blur" : ""
            }`}
          >
            <section className="profile_grid_left">
              <div className="profile_grid_inner_container_top">
                <section className="flex">
                  <img
                    src={`https://crafatar.com/renders/head/${playerData?.uuid}`}
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
                          {playerData.guild?.rankStars} {playerData.guild?.rank}{" "}
                          of the{" "}
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
                  src={`https://crafatar.com/renders/body/${playerData?.uuid}`}
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
                      <strong>
                        {" "}
                        {playerData?.globalData?.totalLevel || "0"}
                      </strong>{" "}
                      levels
                    </h4>
                  </span>
                  <span className="flex gap-05">
                    <h4 className="force-regular">Total playtime:</h4>
                    <h4 className="force-regular">
                      <strong>
                        {playerData?.playtime
                          ? `${playerData.playtime}`
                          : "N/A"}
                      </strong>{" "}
                      hours played.
                    </h4>
                  </span>
                  <span className="flex gap-05">
                    <h4 className="force-regular"> Total mobs killed:</h4>
                    <h4 className="force-regular">
                      <strong>
                        {playerData?.globalData?.killedMobs || "0"}
                      </strong>{" "}
                      mobs killed.
                    </h4>
                  </span>
                  <span className="flex gap-05">
                    <h4 className="force-regular"> Total Chests looted:</h4>
                    <h4 className="force-regular">
                      <strong>
                        {playerData?.globalData?.chestsFound || "0"}
                      </strong>{" "}
                      chests found.
                    </h4>
                  </span>
                  <span className="flex gap-05">
                    <h4 className="force-regular"> Dungeons completed:</h4>
                    <h4 className="force-regular">
                      <strong>
                        {playerData?.globalData?.dungeons.total || "0"}
                      </strong>{" "}
                      chests found.
                    </h4>
                  </span>
                  <br></br>{" "}
                  <span className="flex gap-05">
                    <h4 className="force-regular"> PVP kills:</h4>
                    <h4 className="force-regular">
                      <strong>
                        {playerData?.globalData?.pvp?.kills || "0"}
                      </strong>{" "}
                      kills.
                    </h4>
                  </span>
                  <span className="flex gap-05">
                    <h4 className="force-regular"> PVP deaths:</h4>
                    <h4 className="force-regular">
                      <strong>
                        {playerData?.globalData?.pvp?.deaths || "0"}
                      </strong>{" "}
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
                <h5>Characters</h5>
                <br></br>
                {playerData && extendedPlayerData.characters && (
                  <div className="characters_container">
                    {Object.keys(extendedPlayerData.characters).map(
                      (characterId) => {
                        const character =
                          extendedPlayerData.characters[characterId];
                        return (
                          <div
                            key={characterId}
                            className="characters_item"
                            onClick={() => {
                              setSelectedCharacter(character); // Update selected character
                              setIsCharacterInfoVisible(true); // Optionally show character info
                            }}
                          >
                            <img
                              className="character_item_img"
                              src={characterImages[character.type]}
                              alt={character.type}
                            />
                            <section>
                              {character.reskin ? (
                                <h3>{character.reskin}</h3>
                              ) : (
                                <h2>{character.type}</h2>
                              )}{" "}
                              <p>Combat level: {character.level}</p>
                              <p>Total level: {character.totalLevel}</p>
                              <p>Time played: {character.playtime} hours</p>
                              <progress value={character.xpPercent} max={100} />
                            </section>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}{" "}
              </div>
              <div className="stats_grid_bottom">
                <h5>Rankings</h5>
                <br></br>
                {/* Profs. ranking section */}
                <section
                  className="flex-center space-between p-02-05 color-bg-09 stats_ranking_hover"
                  onClick={toggleProfessionsVisibility}
                >
                  <h5>Professions</h5>
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    onClick={() => {
                      toggleProfessionsVisibility();
                    }}
                    className={`ranking_item_btn ${
                      isProfessions ? "rotated" : ""
                    }`}
                  />
                </section>
                <br></br>
                <CSSTransition
                  in={isProfessionsVisible}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div style={{ overflow: "hidden" }}>
                    {" "}
                    {isProfessionsVisible &&
                      playerData &&
                      extendedPlayerData && (
                        <div className="rankings_container">
                          {Object.entries(extendedPlayerData.ranking)
                            .filter(([rankingId]) =>
                              professions.some((profession) =>
                                rankingId.startsWith(profession.toLowerCase())
                              )
                            )
                            .map(([rankingId, rankingValue]) => {
                              const formattedRankingId = rankingId
                                .replace(/Level$/, "")
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .replace(/^./, (str) => str.toUpperCase());

                              const profession =
                                formattedRankingId.charAt(0).toUpperCase() +
                                formattedRankingId.slice(1).toLowerCase();

                              return (
                                <div key={rankingId} className="ranking_item">
                                  <img
                                    className="ranking_item_img"
                                    src={
                                      professionImages[profession] ||
                                      "https://via.placeholder.com/150"
                                    } // Fallback to a placeholder image
                                    alt={profession}
                                  />
                                  <h5>
                                    {formattedRankingId}:{" "}
                                    <strong>#{rankingValue}</strong>
                                  </h5>
                                </div>
                              );
                            })}{" "}
                        </div>
                      )}{" "}
                    <br></br>
                  </div>
                </CSSTransition>

                {/* Content completion ranking section */}
                <section
                  className="flex-center space-between p-02-05 color-bg-09 stats_ranking_hover"
                  onClick={toggleContentCompletionVisibility}
                >
                  <h5>Content completion</h5>
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    onClick={() => {
                      toggleContentCompletionVisibility();
                    }}
                    className={`ranking_item_btn ${
                      isContentCompletion ? "rotated" : ""
                    }`}
                  />
                </section>
                <br></br>
                <CSSTransition
                  in={isContentCompletionVisible}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div style={{ overflow: "hidden" }}>
                    {" "}
                    {isContentCompletionVisible &&
                      playerData &&
                      extendedPlayerData && (
                        <div className="rankings_container_small">
                          <div className="ranking_item">
                            <img
                              className="ranking_item_img"
                              src={wars_completion}
                            />
                            Wars completed:
                            <strong>
                              {" "}
                              #{extendedPlayerData?.ranking?.warsCompletion}
                            </strong>
                          </div>
                          <div className="ranking_item">
                            <img
                              className="ranking_item_img"
                              src={global_total_completion}
                            />
                            Global total completion:
                            <strong>
                              {" "}
                              #
                              {extendedPlayerData?.ranking?.globalPlayerContent}
                            </strong>
                          </div>{" "}
                          <div className="ranking_item">
                            <img
                              className="ranking_item_img"
                              src={total_completion}
                            />
                            Total completion:
                            <strong>
                              {" "}
                              #{extendedPlayerData?.ranking?.playerContent}
                            </strong>
                          </div>
                        </div>
                      )}{" "}
                    <br></br>
                  </div>
                </CSSTransition>
                {/* Total levels section */}
                <section
                  className="flex-center space-between p-02-05 color-bg-09 stats_ranking_hover"
                  onClick={toggleTotalLevelsVisibility}
                >
                  <h5>Total levels</h5>
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    onClick={() => {
                      toggleTotalLevelsVisibility();
                    }}
                    className={`ranking_item_btn ${
                      isTotalLevelsVisible ? "rotated" : ""
                    }`}
                  />
                </section>
                <br></br>
                <CSSTransition
                  in={isTotalLevelsVisible}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div style={{ overflow: "hidden" }}>
                    {isTotalLevelsVisible &&
                      playerData &&
                      extendedPlayerData && (
                        <div className="rankings_container">
                          {Object.entries(extendedPlayerData.ranking)
                            .filter(([key]) => totalLevels.includes(key))
                            .map(([key, value]) => (
                              <div key={key} className="ranking_item">
                                <img
                                  className="ranking_item_img"
                                  src={
                                    totalLevelsImages[key] ||
                                    "https://via.placeholder.com/150"
                                  }
                                  alt={key}
                                />
                                <h5>
                                  {key.charAt(0).toUpperCase() +
                                    key
                                      .slice(1)
                                      .replace(/([A-Z])/g, " $1")
                                      .trim()}
                                  : <strong>#{value}</strong>
                                </h5>
                              </div>
                            ))}
                        </div>
                      )}{" "}
                    <br></br>
                  </div>
                </CSSTransition>
                {/* Content raids ranking section */}
                <section
                  className="flex-center space-between p-02-05 color-bg-09 stats_ranking_hover"
                  onClick={toggleRaidStatsVisibility}
                >
                  <h5>Raids completion</h5>
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    onClick={() => {
                      toggleRaidStatsVisibility();
                    }}
                    className={`ranking_item_btn ${
                      isContentCompletion ? "rotated" : ""
                    }`}
                  />
                </section>
                <br></br>
                <CSSTransition
                  in={isRaidsStatVisible}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div style={{ overflow: "hidden" }}>
                    {" "}
                    {isRaidsStatVisible && playerData && extendedPlayerData && (
                      <div className="rankings_container_small">
                        <div className="ranking_item">
                          <img className="ranking_item_img" src={NoL} />
                          NoL Raids completed:
                          <strong>
                            {" "}
                            #{extendedPlayerData?.ranking?.orphionCompletion}
                          </strong>
                        </div>
                        <div className="ranking_item">
                          <img className="ranking_item_img" src={NotG} />
                          NotG Raids completed:
                          <strong>
                            {" "}
                            #{extendedPlayerData?.ranking?.grootslangCompletion}
                          </strong>
                        </div>{" "}
                        <div className="ranking_item">
                          <img className="ranking_item_img" src={TCC} />
                          TCC Raids completed:
                          <strong>
                            {" "}
                            #{extendedPlayerData?.ranking?.colossusCompletion}
                          </strong>
                        </div>
                        <div className="ranking_item">
                          <img className="ranking_item_img" src={TNA} />
                          TNA Raid Raids completed:
                          <strong>
                            {" "}
                            #{extendedPlayerData?.ranking?.namelessCompletion}
                          </strong>
                        </div>
                      </div>
                    )}{" "}
                    <br></br>
                  </div>
                </CSSTransition>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
