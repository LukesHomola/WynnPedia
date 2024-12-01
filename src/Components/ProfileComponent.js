import React, { useEffect, useState, useContext } from "react";
import { CSSTransition } from "react-transition-group";

import { PlayerContext } from "../PlayerContext.js"; // Access context

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faUser,
  faCaretUp,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

import "../CSS/ProfileComponent.css";
import profileAvatarHead from "../Assests_components/Profile_head_placeholder.png";
import profileAvatarBody from "../Assests_components/Profile_body_placeholder.png";
import mage from "../Assests_components/classes/mage.webp";
import archer from "../Assests_components/classes/archer.webp";
import shaman from "../Assests_components/classes/shaman.webp";
import assassin from "../Assests_components/classes/assassin.webp";
import warrior from "../Assests_components/classes/warrior.webp";

// Import the images for each profession
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

// Import the images for each total completion
import wars_completion from "../Assests_components/content_completion/wars.webp";
import global_total_completion from "../Assests_components/content_completion/global_total_completions.webp";
import total_completion from "../Assests_components/content_completion/total_completions.webp";

// Import the images for each total lvl
import total from "../Assests_components/total_levels/total.webp";
import profs from "../Assests_components/total_levels/profs.webp";
import combat from "../Assests_components/total_levels/combat.webp";

// Import the games for each raid
import NoL from "../Assests_components/raids/NoL.webp";
import NotG from "../Assests_components/raids/NotG.webp";
import TCC from "../Assests_components/raids/TCC.webp";
import TNA from "../Assests_components/raids/TNA.webp";

// Importing rank tags

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
];

const totalLevels = [
  "totalSoloLevel",
  "professionsSoloLevel",
  "professionsGlobalLevel",
  "totalGlobalLevel",
  "combatGlobalLevel",
  "combatSoloLevel",
];

const CharacterInfo = ({
  character,
  setIsCharacterInfoVisible,
  rankImage,
  supportRank,
  imgWidth,
  playerData,
  timeAgo,
  isChatacterInfoVisible,
  selectedCharacter,
}) => {
  return (
    <CSSTransition
      in={isChatacterInfoVisible}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div className="hidden">
        {" "}
        {isChatacterInfoVisible && character && (
          <div className="character_detail_container">
            <section className="character_detail_topbar">
              <section className="flex-col gap-05">
                <section className="flex gap-05">
                  {rankImage ? (
                    <img
                      src={rankImage}
                      alt={supportRank}
                      style={{ width: imgWidth }}
                    />
                  ) : (
                    <h2>No Rank</h2> // Fallback message when rank is null
                  )}
                  <h2>{playerData?.username || "PLAYER"}</h2>{" "}
                </section>
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
              <section className="character_detail_topbar_class_info">
                <img
                  className="character_item_img"
                  src={characterImages[character.type]}
                  alt={character.type}
                />
                <section className="flex-col ">
                  {character.reskin ? (
                    <h3>{character.reskin}</h3>
                  ) : (
                    <h2>{character.type}</h2>
                  )}
                  <p>Combat level: {character.level}</p>
                  <p>Total level: {character.letota}</p>
                </section>
              </section>
              <section>
                <button
                  className="character_detail_close_btn"
                  onClick={() => {
                    setIsCharacterInfoVisible(false);
                  }}
                >
                  CLOSE MENU{" "}
                </button>
              </section>
            </section>
            <section className="character_detail_body">
              <div className="character_detail_body_item">
                <h2>Informations</h2>
                <section className="character_detail_body_item_content">
                  <section>
                    <h3 className="force-regular">General</h3>
                    <br></br>
                    <p>Total level: {character.totalLevel}</p>
                    <p>Level: {character.level}</p>
                  </section>
                  <h3>TEST</h3>
                  <h3>TEST</h3>
                </section>
              </div>
            </section>
          </div>
        )}
      </div>
    </CSSTransition>
  );
};

const Profile = () => {
  const { playerData, extendedPlayerData, loading, error, playerName } =
    useContext(PlayerContext); // Access playerName from context

  const [isProfessionsVisible, setIsProfessionsVisible] = useState(false);
  const [isContentCompletionVisible, setIsContentCompletionVisible] =
    useState(false);
  const [isTotalLevelsVisible, setIsTotalLevelsVisible] = useState(false);
  const [isRaidsStatVisible, setIsRaidsStatVisible] = useState(false);

  /*  */
  const [isExpandedProfessions, setIsExpandedProfessions] = useState(false);
  const [isExpandedContentCompletion, setIsExpandedContentCompletion] =
    useState(false);
  const [isExpandedTotalLevels, setIsExpandedTotalLevels] = useState(false);
  const [isExpandedRaidsStats, setIsExpandedRaidsStats] = useState(false);
  /* Character info card  */
  const [isChatacterInfoVisible, setIsCharacterInfoVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const toggleProfessionsVisibility = () => {
    setIsProfessionsVisible(!isProfessionsVisible); // Toggle the visibility state
    setIsExpandedProfessions((prev) => !prev);
  };
  const toggleContentCompletionVisibility = () => {
    setIsContentCompletionVisible(!isContentCompletionVisible); // Toggle the visibility state
    setIsExpandedContentCompletion((prev) => !prev);
  };
  const toggleTotalLevelsVisibility = () => {
    setIsTotalLevelsVisible(!isTotalLevelsVisible); // Toggle the visibility state
    setIsExpandedTotalLevels((prev) => !prev);
  };
  const toggleRaidStatsVisibility = () => {
    setIsRaidsStatVisible(!isRaidsStatVisible); // Toggle the visibility state
    setIsExpandedRaidsStats((prev) => !prev);
  };

  // Characters closer info section

  /* FOR WORKING BACKGROUND */
  const isBothVisible = isProfessionsVisible && isContentCompletionVisible;

  const supportRank = playerData?.supportRank
    ? playerData.supportRank.toLowerCase()
    : null; // Default to null
  const rankImage = supportRank ? rankImages[supportRank.toUpperCase()] : null; // Only call toUpperCase if supportRank is not null

  console.log("Support Rank:", supportRank); // Debugging
  console.log("Rank Image:", rankImage); // Debugging

  // Determine the width based on the rank
  const imgWidth = supportRank === "champion" ? "8rem" : "6rem";

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
    <div className={`profile_component ${isBothVisible ? "expanded" : ""} `}>
      {" "}
      {isChatacterInfoVisible && selectedCharacter && (
        <CharacterInfo
          character={selectedCharacter}
          isChatacterInfoVisible={isChatacterInfoVisible}
          setIsCharacterInfoVisible={setIsCharacterInfoVisible}
          rankImage={rankImage}
          supportRank={supportRank}
          imgWidth={imgWidth}
          playerData={playerData}
          timeAgo={timeAgo}
        />
      )}
      <div
        className={`profile_grid_container ${isBothVisible ? "expanded" : ""} ${
          isChatacterInfoVisible ? "blur" : ""
        }`}
      >
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
                  isExpandedProfessions ? "rotated" : ""
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
                {isProfessionsVisible && playerData && extendedPlayerData && (
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
                  isExpandedContentCompletion ? "rotated" : ""
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
                          #{extendedPlayerData?.ranking?.globalPlayerContent}
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
                {isTotalLevelsVisible && playerData && extendedPlayerData && (
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
              <h5>Content completion</h5>
              <FontAwesomeIcon
                icon={faCaretUp}
                onClick={() => {
                  toggleRaidStatsVisibility();
                }}
                className={`ranking_item_btn ${
                  isExpandedContentCompletion ? "rotated" : ""
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
  );
};

export default Profile;
