import React, { useEffect, useState, useContext, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../PlayerContext.js"; // Access context

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faUser,
  faCaretUp,
  faXmark,
  faSkull,
  faL,
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
import fishing from "../Assests_components/professions/Fishing.webp";
import woodworking from "../Assests_components/professions/Woodworking.webp";

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

// Importing skill books

import strength from "../Assests_components/Skills/strength.svg";
import dexterity from "../Assests_components/Skills/dexterity.svg";
import intelligence from "../Assests_components/Skills/intelligence.svg";
import defense from "../Assests_components/Skills/defense.svg";
import agility from "../Assests_components/Skills/agility.svg";

// Importing regular dungeon images
import decrepitSewers from "../Assests_components/dungs/Decrepit_Sewers.webp";
import infestedPit from "../Assests_components/dungs/Infested_Pit.webp";
import underworldCrypt from "../Assests_components/dungs/Underworld_Crypt.webp";
import timelostSanctum from "../Assests_components/dungs/TImelost_Sanctum.webp";
import lostSanctuary from "../Assests_components/dungs/Lost_Sanctuary.webp";
import sandSweptTomb from "../Assests_components/dungs/Sand_Swept_Tomb.webp";
import iceBarrows from "../Assests_components/dungs/Ice_Barrows.webp";
import undergrowthRuins from "../Assests_components/dungs/Undergrowth_Ruins.webp";
import galleonsGraveyard from "../Assests_components/dungs/Galleons_Graveyard.webp";
import fallenFactory from "../Assests_components/dungs/Fallen_Factory.webp";
import eldritchOutlook from "../Assests_components/dungs/Eldritch_Outlook.webp";

// Creating an object to map raid names to their images
const raidImages = {
  "Nest of the Grootslangs": NotG,
  "The Canyon Colossus": TCC,
  "Orphion's Nexus of Light": NoL,
  "The Nameless Anomaly": TNA,
};

// Creating an object to map dungeon names to their images
const dungeonImages = {
  "Decrepit Sewers": decrepitSewers,
  "Infested Pit": infestedPit,
  "Underworld Crypt": underworldCrypt,
  "Timelost Sanctum": timelostSanctum,
  "Lost Sanctuary": lostSanctuary,
  "Sand-Swept Tomb": sandSweptTomb,
  "Ice Barrows": iceBarrows,
  "Undergrowth Ruins": undergrowthRuins,
  "Galleon's Graveyard": galleonsGraveyard,
  "Fallen Factory": fallenFactory,
  "Eldritch Outlook": eldritchOutlook,
};

// Now you can use dungeonImages to access the images by dungeon name

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

const CharacterInfo = ({
  character,
  setIsCharacterInfoVisible,
  rankImage,
  supportRank,
  imgWidth,
  playerData,
  timeAgo,
  isCharacterInfoVisible,
  selectedCharacter,
  isProfessionsVisible,
  extendedPlayerData,
  playerTabs,
  activeTabIndex,
}) => {
  /* Handeling closure if user will click outside of the box */
  const characterInfoRef = useRef(null);

  const handleClickOutside = (event) => {
    // Check if the click is outside the character info
    if (
      characterInfoRef.current &&
      !characterInfoRef.current.contains(event.target)
    ) {
      setIsCharacterInfoVisible(false);
    }
  };
  useEffect(() => {
    // Add event listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);

  // Determine the source of `characters`
  const characters =
    activeTabIndex === 0 || !playerTabs // Use extendedPlayerData for non-tabbed player
      ? extendedPlayerData?.characters
        ? Object.values(extendedPlayerData.characters)
        : []
      : playerTabs[activeTabIndex]?.data?.characters
      ? Object.values(playerTabs[activeTabIndex].data.characters)
      : [];

  // Function to handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      // Move to the next character
      setSelectedCharacterIndex(
        (prevIndex) => (prevIndex + 1) % characters.length
      );
    } else if (event.key === "ArrowLeft") {
      // Move to the previous character
      setSelectedCharacterIndex(
        (prevIndex) => (prevIndex - 1 + characters.length) % characters.length
      );
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const currentCharacter = characters[selectedCharacterIndex];

  // Handeler to close character details if ESC is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCharacterInfoVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <CSSTransition
      in={isCharacterInfoVisible}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div className="hidden" ref={characterInfoRef}>
        {" "}
        <section
          className={`character_detail_topbar ${
            isCharacterInfoVisible ? "fixed-topbar" : ""
          }`}
        >
          <section className="flex-col gap-05">
            <section className="flex gap-05">
              {rankImage ? (
                <img
                  src={rankImage}
                  alt={supportRank}
                  style={{ width: imgWidth }}
                />
              ) : (
                <h2></h2> // Fallback message when rank is null
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
                  {playerData.guild?.rankStars} {playerData.guild?.rank} of the{" "}
                  {playerData.guild?.name}
                </h5>
              ) : (
                <h5 className="force-regular">No guild registered.</h5>
              )}
            </h3>
          </section>
          <section className="character_detail_topbar_class_info">
            <img
              className="character_item_img"
              src={characterImages[currentCharacter.type]}
              alt={currentCharacter.type}
            />
            <section className="flex-col ">
              {currentCharacter.reskin ? (
                <h3>{currentCharacter.reskin}</h3>
              ) : (
                <h2>{currentCharacter.type}</h2>
              )}
              <p>Combat level: {currentCharacter.level}</p>
              <p>Total level: {currentCharacter.totalLevel}</p>
              <progress value={currentCharacter.xpPercent} max={100} />
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
        {isCharacterInfoVisible && (
          <div className="character_detail_container">
            {" "}
            <br></br>
            <section className="character_detail_body">
              {/*  */}
              <div className="character_detail_body_item">
                <h2 className="force-regular">Informations</h2>
                <section className="character_detail_body_item_content">
                  <section className="character_detail_body_item_content_inner">
                    <span className="flex-start gap-05 pB-05">
                      <img src={total} style={{ maxHeight: "3rem" }}></img>{" "}
                      <h4 className="force-regular">General</h4>
                      <h5 className="force-regular" style={{ color: "gray" }}>
                        section
                      </h5>
                    </span>{" "}
                    <hr
                      style={{ margin: "0 auto", border: "1px solid gray" }}
                    ></hr>
                    <br></br>
                    <h5>
                      Total level:{" "}
                      <strong>{currentCharacter.totalLevel}</strong> levels
                    </h5>
                    <h5>
                      Level: <strong>{currentCharacter.level}</strong> levels
                    </h5>
                    <h5>
                      Time player: <strong>{currentCharacter.playtime}</strong>{" "}
                      hours
                    </h5>
                    <h5>
                      Logins: <strong>{currentCharacter.logins}</strong>
                    </h5>
                    <h5>
                      Deaths: <strong>{currentCharacter.deaths}</strong>
                    </h5>
                  </section>
                  <section className="character_detail_body_item_content_inner">
                    <span className="flex-start gap-05 pB-05">
                      {" "}
                      <img src={profs} style={{ maxHeight: "3rem" }}></img>{" "}
                      <h4 className="force-regular">Achievments</h4>
                      <h5 className="force-regular" style={{ color: "gray" }}>
                        section
                      </h5>
                    </span>{" "}
                    <hr
                      style={{ margin: "0 auto", border: "1px solid gray" }}
                    ></hr>
                    <br></br>
                    <h5>
                      Discoveries:{" "}
                      <strong>{currentCharacter.discoveries}</strong>
                    </h5>
                    <h5>
                      Mobs killed:{" "}
                      <strong>{currentCharacter.mobsKilled} </strong>
                      mobs
                    </h5>
                    <h5>
                      Chests opened:{" "}
                      <strong>{currentCharacter.chestsFound} </strong>
                      chests
                    </h5>
                    <h5>
                      Dungeons completed:{" "}
                      <strong>{currentCharacter.dungeons.total} </strong>
                      dungeons
                    </h5>
                    <h5>
                      Raids completed:{" "}
                      <strong>{currentCharacter.raids.total} </strong>
                      raids
                    </h5>
                    <h5>
                      Deaths: <strong>{currentCharacter.deaths} </strong>deaths
                    </h5>
                  </section>{" "}
                  <section className="character_detail_body_item_content_inner ">
                    <span className="flex-start gap-05 pB-05">
                      {" "}
                      <img
                        src={combat}
                        style={{ maxHeight: "3rem" }}
                      ></img>{" "}
                      <h3 className="force-regular">PVP</h3>
                      <h4 className="force-regular" style={{ color: "gray" }}>
                        section
                      </h4>
                    </span>{" "}
                    <hr
                      style={{ margin: "0 auto", border: "1px solid gray" }}
                    ></hr>
                    <br></br>
                    <h5>
                      PVP kills: <strong>{currentCharacter.pvp.kills}</strong>
                    </h5>
                    <h5>
                      PVP deaths: <strong>{currentCharacter.pvp.deaths}</strong>
                    </h5>
                  </section>{" "}
                </section>
              </div>{" "}
              <br></br>
              {/*  */}
              <div className="character_detail_body_item_skills">
                <div className="character_detail_body_item_skills_inner">
                  <section className="flex-col flex-center">
                    <h5>Strength</h5>
                    <label>
                      {currentCharacter.skillPoints.strength || 0} points
                    </label>
                    <br></br>
                    <img src={strength} style={{ maxWidth: "5rem" }}></img>
                  </section>
                  <section className="flex-col flex-center">
                    <h5>Dexterity</h5>
                    <label>
                      {currentCharacter.skillPoints.dexterity || 0} points
                    </label>
                    <br></br>
                    <img src={dexterity} style={{ maxWidth: "5rem" }}></img>
                  </section>{" "}
                  <section className="flex-col flex-center">
                    <h5>intelligence</h5>
                    <label>
                      {currentCharacter.skillPoints.strength || 0} points
                    </label>
                    <br></br>
                    <img src={intelligence} style={{ maxWidth: "5rem" }}></img>
                  </section>
                  <section className="flex-col flex-center">
                    <h5>Defense</h5>
                    <label>
                      {currentCharacter.skillPoints.defense || 0} points
                    </label>
                    <br></br>
                    <img src={defense} style={{ maxWidth: "5rem" }}></img>
                  </section>
                  <section className="flex-col flex-center">
                    <h5>Agility</h5>
                    <label>
                      {currentCharacter.skillPoints.agility || 0} points
                    </label>
                    <br></br>
                    <img src={agility} style={{ maxWidth: "5rem" }}></img>
                  </section>
                </div>
              </div>
              {/*  */}
              <div className="character_detail_body_item_professions">
                <h2 className="force-regular pL-1">Professions</h2>{" "}
                <div className="character_detail_body_item_professions_inner">
                  {Object.entries(currentCharacter.professions).map(
                    ([professionKey, professionData]) => {
                      const formattedProfession =
                        professionKey.charAt(0).toUpperCase() +
                        professionKey.slice(1).toLowerCase(); // Format the profession name
                      const level = professionData.level; // Get the level from the profession data

                      return (
                        <div
                          key={professionKey}
                          className="character_detail_ranking_item"
                        >
                          <img
                            className="character_ranking_item_img"
                            src={
                              professionImages[formattedProfession] ||
                              "https://via.placeholder.com/150" // Fallback to a placeholder image
                            }
                            alt={formattedProfession}
                          />
                          <section className="flex-col">
                            <h5>{formattedProfession}</h5>
                            <h6>
                              {" "}
                              Level<strong> {level}</strong>{" "}
                            </h6>{" "}
                            <progress value={level} max={100} />
                          </section>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              <br></br>
              {/*  */}
              <div className="character_detail_body_item_professions">
                <h2 className="force-regular pL-1">Dungeons</h2>
                <div className="character_detail_body_item_professions_inner">
                  {Object.entries(currentCharacter.dungeons.list).filter(
                    ([dungeonKey]) => !dungeonKey.startsWith("Corrupted")
                  ).length === 0 ? (
                    <div className="error-message">
                      <p>No dungeon data available</p>
                    </div>
                  ) : (
                    Object.entries(currentCharacter.dungeons.list)
                      .filter(
                        ([dungeonKey]) => !dungeonKey.startsWith("Corrupted")
                      )
                      .map(([dungeonKey, completions]) => {
                        const formattedDungeon =
                          dungeonKey.charAt(0).toUpperCase() +
                          dungeonKey.slice(1).toLowerCase();

                        // Filter out related corrupted dungeon entries
                        const relatedCorruptedDungeons = Object.entries(
                          character.dungeons.list
                        ).filter(
                          ([corruptedKey]) =>
                            corruptedKey.startsWith("Corrupted") &&
                            corruptedKey.includes(dungeonKey)
                        );

                        return (
                          <div
                            key={dungeonKey}
                            className="character_detail_ranking_item"
                          >
                            <img
                              className="character_ranking_item_img"
                              src={
                                dungeonImages[dungeonKey] ||
                                "https://via.placeholder.com/150" // Fallback to a placeholder image
                              }
                              alt={formattedDungeon}
                            />
                            <section className="flex-col">
                              <h5>{formattedDungeon}</h5>
                              <br />
                              <h6>
                                Regular Completions:{" "}
                                <strong>{completions}</strong>
                              </h6>

                              {/* Render corrupted dungeon completions */}
                              {relatedCorruptedDungeons.map(
                                ([corruptedKey, corruptedCompletions]) => {
                                  const formattedCorruptedDungeon =
                                    corruptedKey.charAt(0).toUpperCase() +
                                    corruptedKey.slice(1).toLowerCase();

                                  return (
                                    <div
                                      key={corruptedKey}
                                      className="corrupted_dungeon_info"
                                    >
                                      <h6>
                                        <FontAwesomeIcon icon={faSkull} />{" "}
                                        Completions:{" "}
                                        <strong>{corruptedCompletions}</strong>
                                      </h6>
                                    </div>
                                  );
                                }
                              )}
                            </section>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
              <br></br>
              {/*  */}
              <div className="character_detail_body_item_professions">
                <h2 className="force-regular pL-1">Raids</h2>
                <div className="character_detail_body_item_professions_inner">
                  {Object.entries(currentCharacter.raids.list).length === 0 ? (
                    <div className="error-message">
                      <p>No dungeon data available</p>
                    </div>
                  ) : (
                    Object.entries(currentCharacter.raids.list).map(
                      ([raidKey, completions]) => {
                        const formattedRaid =
                          raidKey.charAt(0).toUpperCase() +
                          raidKey.slice(1).toLowerCase();
                        return (
                          <div
                            key={raidKey}
                            className="character_detail_ranking_item"
                          >
                            <img
                              className="character_ranking_item_img"
                              src={
                                raidImages[raidKey] ||
                                "https://via.placeholder.com/150" // Fallback to a placeholder image
                              }
                              alt={formattedRaid}
                            />
                            <section className="flex-col">
                              <h5>{formattedRaid}</h5>
                              <br />
                              <h6>
                                Regular Completions:{" "}
                                <strong>{completions}</strong>
                              </h6>
                            </section>
                          </div>
                        );
                      }
                    )
                  )}
                </div>
              </div>
              <br></br>
              {/*  */}
              <div className="character_detail_body_item_quests">
                <h2 className="force-regular pL-1">Quests completed</h2>
                <div className="character_detail_body_item_professions_inner">
                  {currentCharacter.quests &&
                  currentCharacter.quests.length > 0 ? (
                    currentCharacter.quests.map((quest, index) => (
                      <div key={index} className="quest-item">
                        <h5>{quest}</h5>
                      </div>
                    ))
                  ) : (
                    <div className="error-message">
                      <p>No quests available</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}{" "}
      </div>
    </CSSTransition>
  );
};

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
  const [isTotalLevels, setIsTotalLevels] = useState(false);
  const [isRaidsStats, setIsRaidsStats] = useState(false);
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
