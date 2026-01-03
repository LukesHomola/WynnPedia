import { useEffect, useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import strength from "../../Assests_components/Skills/strength.svg";
import dexterity from "../../Assests_components/Skills/dexterity.svg";
import intelligence from "../../Assests_components/Skills/intelligence.svg";
import defense from "../../Assests_components/Skills/defense.svg";
import agility from "../../Assests_components/Skills/agility.svg";
import decrepitSewers from "../../Assests_components/dungs/Decrepit_Sewers.webp";
import infestedPit from "../../Assests_components/dungs/Infested_Pit.webp";
import underworldCrypt from "../../Assests_components/dungs/Underworld_Crypt.webp";
import timelostSanctum from "../../Assests_components/dungs/TImelost_Sanctum.webp";
import lostSanctuary from "../../Assests_components/dungs/Lost_Sanctuary.webp";
import sandSweptTomb from "../../Assests_components/dungs/Sand_Swept_Tomb.webp";
import iceBarrows from "../../Assests_components/dungs/Ice_Barrows.webp";
import undergrowthRuins from "../../Assests_components/dungs/Undergrowth_Ruins.webp";
import galleonsGraveyard from "../../Assests_components/dungs/Galleons_Graveyard.webp";
import fallenFactory from "../../Assests_components/dungs/Fallen_Factory.webp";
import eldritchOutlook from "../../Assests_components/dungs/Eldritch_Outlook.webp";
import total from "../../Assests_components/total_levels/total.webp";
import profs from "../../Assests_components/total_levels/profs.webp";
import combat from "../../Assests_components/total_levels/combat.webp";
import NoL from "../../Assests_components/raids/NoL.webp";
import NotG from "../../Assests_components/raids/NotG.webp";
import TCC from "../../Assests_components/raids/TCC.webp";
import TNA from "../../Assests_components/raids/TNA.webp";
import mage from "../../Assests_components/classes/mage.webp";
import archer from "../../Assests_components/classes/archer.webp";
import shaman from "../../Assests_components/classes/shaman.webp";
import assassin from "../../Assests_components/classes/assassin.webp";
import warrior from "../../Assests_components/classes/warrior.webp";
import scribing from "../../Assests_components/professions/Scribing.webp";
import cooking from "../../Assests_components/professions/Cooking.webp";
import woodcutting from "../../Assests_components/professions/Woodcutting.webp";
import farming from "../../Assests_components/professions/Farming.webp";
import mining from "../../Assests_components/professions/Mining.webp";
import alchemism from "../../Assests_components/professions/Alchemism.webp";
import jeweling from "../../Assests_components/professions/Jeweling.webp";
import weaponsmithing from "../../Assests_components/professions/Weaponsmithing.webp";
import armouring from "../../Assests_components/professions/Armouring.webp";
import tailoring from "../../Assests_components/professions/Tailoring.webp";
import fishing from "../../Assests_components/professions/Fishing.webp";
import woodworking from "../../Assests_components/professions/Woodworking.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import {
  faCaretUp,
  faXmark,
  faSkull,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

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
const characterImages = {
  MAGE: mage,
  SHAMAN: shaman,
  ARCHER: archer,
  ASSASSIN: assassin,
  WARRIOR: warrior,
};
const raidImages = {
  "Nest of the Grootslangs": NotG,
  "The Canyon Colossus": TCC,
  "Orphion's Nexus of Light": NoL,
  "The Nameless Anomaly": TNA,
};

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
  const [isTotalLevels, setIsTotalLevels] = useState(false);
  const [isRaidsStats, setIsRaidsStats] = useState(false);
  const [isTotalLevelsVisible, setIsTotalLevelsVisible] = useState(false);
  const [isRaidsStatVisible, setIsRaidsStatVisible] = useState(false);

  const handleClickOutside = (event) => {
    if (
      characterInfoRef.current &&
      !characterInfoRef.current.contains(event.target)
    ) {
      setIsCharacterInfoVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  isTotalLevels;
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);

  const characters =
    activeTabIndex === 0 || !playerTabs // Use extendedPlayerData for non-tabbed player
      ? extendedPlayerData?.characters
        ? Object.values(extendedPlayerData.characters)
        : []
      : playerTabs[activeTabIndex]?.data?.characters
      ? Object.values(playerTabs[activeTabIndex].data.characters)
      : [];

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      setSelectedCharacterIndex(
        (prevIndex) => (prevIndex + 1) % characters.length
      );
    } else if (event.key === "ArrowLeft") {
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCharacterInfoVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const toggleProfessionsVisibility = () => {
    setIsProfessionsVisible(!isProfessionsVisible);
    setIsProfessions((prev) => !prev);
  };
  const toggleContentCompletionVisibility = () => {
    setIsContentCompletionVisible(!isContentCompletionVisible);
  };
  const toggleTotalLevelsVisibility = () => {
    setIsTotalLevelsVisible(!isTotalLevelsVisible);
    setIsTotalLevels((prev) => !prev);
  };
  const toggleRaidStatsVisibility = () => {
    setIsRaidsStatVisible(!isRaidsStatVisible);
    setIsRaidsStats((prev) => !prev);
  };
  return (
    <CSSTransition
      in={isCharacterInfoVisible}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div className="hidden" ref={characterInfoRef}>
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
                <h2></h2>
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
              CLOSE MENU
            </button>
          </section>
        </section>
        {isCharacterInfoVisible && (
          <div className="character_detail_container">
            <br></br>
            <section className="character_detail_body">
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
                        professionKey.slice(1).toLowerCase();
                      const level = professionData.level;

                      return (
                        <div
                          key={professionKey}
                          className="character_detail_ranking_item"
                        >
                          <img
                            className="character_ranking_item_img"
                            src={
                              professionImages[formattedProfession] ||
                              "https://via.placeholder.com/150"
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
                                "https://via.placeholder.com/150"
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
                                "https://via.placeholder.com/150"
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
export default CharacterInfo;
