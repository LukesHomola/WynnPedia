// AchievementsComponent.js
import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faLock,
  faSkull,
  faQuestion,
  faBookOpen,
  faHammer,
} from "@fortawesome/free-solid-svg-icons";

import combat from "../Assests_components/NEW/ICONS/combat.png";
import quests from "../Assests_components/NEW/ICONS/quest.png";
import profs from "../Assests_components/NEW/ICONS/proffesion.png";

import { PlayerContext } from "../PlayerContext.js";

const achievements = [
  {
    id: 1,
    name: "COMBAT LVL 10",
    description: "Get lvl 10 for the first time.",
    conditions: [
      {
        type: "level",
        value: 10,
      },
    ],
    unlocked: false,
    category: "Levels",
  },
  {
    id: 2,
    name: "COMBAT LVL 20",
    description: "Get lvl 20 for the first time.",
    conditions: [
      {
        type: "level",
        value: 20,
      },
    ],
    unlocked: false,
    category: "Levels",
  },
  {
    id: 3,
    name: "COMBAT LVL 50",
    description: "Get lvl 50 for the first time.",
    conditions: [
      {
        type: "level",
        value: 50,
      },
    ],
    unlocked: false,
    category: "Levels",
  },
  {
    id: 4,
    name: "COMBAT LVL 75",
    description: "Get lvl 75 for the first time.",
    conditions: [
      {
        type: "level",
        value: 75,
      },
    ],
    unlocked: false,
    category: "Levels",
  },
  {
    id: 5,
    name: "COMBAT LVL 100",
    description: "Get lvl 100 for the first time.",
    conditions: [
      {
        type: "level",
        value: 100,
      },
    ],
    unlocked: false,
    category: "Levels",
  },
  {
    id: 6,
    name: "COMBAT LVL 105",
    description: "Get lvl 105 for the first time.",
    conditions: [
      {
        type: "level",
        value: 105,
      },
    ],
    unlocked: false,
    category: "Levels",
  },
  {
    id: 7,
    name: "COMBAT LVL 106",
    description: "Get lvl 106 for the first time.",
    conditions: [
      {
        type: "level",
        value: 106,
      },
    ],
    unlocked: false,
    category: "Levels",
  },
  {
    id: 25,
    name: "TOTAL LVL 100",
    description: "Get 100 levels in total for the first time.",
    conditions: [
      {
        type: "level_total",
        value: 100,
      },
    ],
    unlocked: false,
    category: "Total Levels",
  },
  {
    id: 26,
    name: "TOTAL LVL 500",
    description: "Get 500 levels in total for the first time.",
    conditions: [
      {
        type: "level_total",
        value: 500,
      },
    ],
    unlocked: false,
    category: "Total Levels",
  },
  {
    id: 27,
    name: "TOTAL LVL 1000",
    description: "Get 1000 levels in total for the first time.",
    conditions: [
      {
        type: "level_total",
        value: 1000,
      },
    ],
    unlocked: false,
    category: "Total Levels",
  },
  {
    id: 28,
    name: "TOTAL LVL 5000",
    description: "Get 5000 levels in total for the first time.",
    conditions: [
      {
        type: "level_total",
        value: 5000,
      },
    ],
    unlocked: false,
    category: "Total Levels",
  },
  {
    id: 29,
    name: "TOTAL LVL 10000",
    description: "Get 10000 levels in total for the first time.",
    conditions: [
      {
        type: "level_total",
        value: 10000,
      },
    ],
    unlocked: false,
    category: "Total Levels",
  },
  {
    id: 30,
    name: "TOTAL LVL 15000",
    description: "Get 15000 levels in total for the first time.",
    conditions: [
      {
        type: "level_total",
        value: 15000,
      },
    ],
    unlocked: false,
    category: "Total Levels",
  },
  {
    id: 31,
    name: "TOTAL LVL 20000",
    description: "Get 20000 levels in total for the first time.",
    conditions: [
      {
        type: "level_total",
        value: 20000,
      },
    ],
    unlocked: false,
    category: "Total Levels",
  },
  {
    id: 5,
    name: "20 QUESTS COMPLETED",
    description: "Complete number of 20 quests.",
    conditions: [
      {
        type: "quest",
        value: "20",
      },
    ],
    unlocked: false,
    category: "Quests",
  },
  {
    id: 6,
    name: "50 QUESTS COMPLETED",
    description: "Complete number of 50 quests.",
    conditions: [
      {
        type: "quest",
        value: "50",
      },
    ],
    unlocked: false,
    category: "Quests",
  },
  {
    id: 7,
    name: "100 QUESTS COMPLETED",
    description: "Complete number of 100 quests.",
    conditions: [
      {
        type: "quest",
        value: "100",
      },
    ],
    unlocked: false,
    category: "Quests",
  },
  {
    id: 8,
    name: "150 QUESTS COMPLETED",
    description: "Complete number of 150 quests.",
    conditions: [
      {
        type: "quest",
        value: "150",
      },
    ],
    unlocked: false,
    category: "Quests",
  },
  {
    id: 9,
    name: "200 QUESTS COMPLETED",
    description: "Complete number of 200 quests.",
    conditions: [
      {
        type: "quest",
        value: "200",
      },
    ],
    unlocked: false,
    category: "Quests",
  },
  {
    id: 10,
    name: "250 QUESTS COMPLETED",
    description: "Complete number of 250 quests.",
    conditions: [
      {
        type: "quest",
        value: "250",
      },
    ],
    unlocked: false,
    category: "Quests",
  },
  {
    id: 11,
    name: "300 QUESTS COMPLETED",
    description: "Complete number of 300 quests.",
    conditions: [
      {
        type: "quest",
        value: "300",
      },
    ],
    unlocked: false,
    category: "Quests",
  },
  {
    id: 12,
    name: "350 QUESTS COMPLETED",
    description: "Complete number of 350 quests.",
    conditions: [
      {
        type: "quest",
        value: "350",
      },
    ],
    unlocked: false,
    category: "Quests",
  },
  {
    id: 13,
    name: "400 QUESTS COMPLETED",
    description: "Complete number of 400 quests.",
    conditions: [
      {
        type: "quest",
        value: "400",
      },
    ],
    unlocked: false,
    category: "Quests",
  },
  {
    id: 14,
    name: "450 QUESTS COMPLETED",
    description: "Complete number of 450 quests.",
    conditions: [
      {
        type: "quest",
        value: "450",
      },
    ],
    unlocked: false,
    category: "Quests",
  },
  {
    id: 15,
    name: "500 QUESTS COMPLETED",
    description: "Complete number of 500 quests.",
    conditions: [
      {
        type: "quest",
        value: "500",
      },
    ],
    unlocked: false,
    category: "Quests",
  },
  {
    id: 16,
    name: "Novice Gatherer",
    description: "Reach 100 total levels in the professions",
    conditions: [
      {
        type: "professions",
        value: "100",
      },
    ],
    unlocked: false,
    category: "Professions",
  },
  {
    id: 17,
    name: "Apprentice Gatherer",
    description: "Reach 300 total levels in the professions",
    conditions: [
      {
        type: "professions",
        value: "300",
      },
    ],
    unlocked: false,
    category: "Professions",
  },
  {
    id: 18,
    name: "Journeyman Gatherer",
    description: "Reach 500 total levels in the professions",
    conditions: [
      {
        type: "professions",
        value: "500",
      },
    ],
    unlocked: false,
    category: "Professions",
  },
  {
    id: 19,
    name: "Adept Gatherer",
    description: "Reach 1000 total levels in the professions",
    conditions: [
      {
        type: "professions",
        value: "1000",
      },
    ],
    unlocked: false,
    category: "Professions",
  },
  {
    id: 20,
    name: "Master Gatherer",
    description: "Reach 2000 total levels in the professions",
    conditions: [
      {
        type: "professions",
        value: "2000",
      },
    ],
    unlocked: false,
    category: "Professions",
  },
  {
    id: 21,
    name: "Elder Gatherer",
    description: "Reach 5000 total levels in the professions",
    conditions: [
      {
        type: "professions",
        value: "5000",
      },
    ],
    unlocked: false,
    category: "Professions",
  },
  {
    id: 22,
    name: "WynnLord Gatherer",
    description: "Reach 10000 total levels in the professions",
    conditions: [
      {
        type: "professions",
        value: "10000",
      },
    ],
    unlocked: false,
    category: "Professions",
  },
  {
    id: 23,
    name: "WynnElder Gatherer",
    description: "Reach 15000 total levels in the professions",
    conditions: [
      {
        type: "professions",
        value: "15000",
      },
    ],
    unlocked: false,
    category: "Professions",
  },
  {
    id: 24,
    name: "WynnEmperor Gatherer",
    description: "Reach 20000 total levels in the professions",
    conditions: [
      {
        type: "professions",
        value: "20000",
      },
    ],
    unlocked: false,
    category: "Professions",
  },
];

/* ACHIEVEMENT ICONS */
const renderIcon = (type) => {
  switch (type) {
    case "level":
      return combat;
    case "level_total":
      return combat;
    case "quest":
      return quests;
    case "professions":
      return profs;
    default:
      return faQuestion;
  }
};

const AchievementsComponent = () => {
  const { playerName } = useContext(PlayerContext);
  const [fetchedPlayerData, setFetchedPlayerData] = useState([]);
  const [totalQuests, setTotalQuests] = useState(0);

  const [playerData, setPlayerData] = useState({
    level: 0,
    level_total: 0,
    quests: 0,
    professions: 0,
  });
  const [achievementsState, setAchievementsState] = useState(achievements);

  const fetchPlayerData = async () => {
    if (!playerName) return;
    try {
      const response = await fetch(
        `https://api.wynncraft.com/v3/player/${playerName}?fullResult`
      );
      const data = await response.json();
      setFetchedPlayerData(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch player data:", error);
    }
  };
  useEffect(() => {
    fetchPlayerData();
  }, [playerName]);

  const fetchTotalQuests = async () => {
    try {
      const response = await fetch(`https://api.wynncraft.com/v3/map/quests`);
      const data = await response.json();
      setTotalQuests(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch player data:", error);
    }
  };
  useEffect(() => {
    if (!totalQuests) {
      fetchTotalQuests();
    }
  }, [totalQuests]);

  /* ACHIEVEMENT DATA UPDATE */
  useEffect(() => {
    if (fetchedPlayerData && fetchedPlayerData.globalData) {
      const updateAchievements = () => {
        const updatedAchievements = achievementsState.map((achievement) => {
          const conditionsMet = achievement.conditions.every((condition) => {
            switch (condition.type) {
              case "level":
                return playerData.level >= condition.value;

              case "level_total":
                return (
                  fetchedPlayerData.globalData.totalLevel >= condition.value
                );
              case "quest":
                return (
                  fetchedPlayerData.globalData.completedQuests >=
                  condition.value
                );
              case "professions":
                return playerData.professions >= condition.value;
              default:
                return false;
            }
          });
          if (conditionsMet && !achievement.unlocked) {
            return { ...achievement, unlocked: true };
          }
          return achievement;
        });
        setAchievementsState(updatedAchievements);
      };
      updateAchievements();
    }
  }, [fetchedPlayerData, playerData]);

  /* FINDING HIGHEST LVL IN PROFILE CLASSES */
  const characters = fetchedPlayerData.characters;
  let highestLevel = 0;
  let highestLevelCharacter = null;
  useEffect(() => {
    if (characters) {
      let highestLevel = 0;
      let highestLevelCharacter = null;
      let totalProfValue = 0;

      Object.keys(characters).forEach((characterId) => {
        const character = characters[characterId];
        if (character.level > highestLevel) {
          highestLevel = character.level;
          highestLevelCharacter = character.level;
        }
        if (character.professions) {
          Object.keys(character.professions).forEach((profession) => {
            totalProfValue += character.professions[profession].level;
          });
        }
      });
      setPlayerData({
        ...playerData,
        level: highestLevelCharacter,
        professions: totalProfValue,
      });
    }
  }, [characters]);

  /* GROUPING ACHIEVEMENTS */
  const groupedAchievements = achievementsState.reduce((acc, achievement) => {
    const category = achievement.category; // assuming achievement has a category property
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {});

  const calculateProgress = (playerData, condition) => {
    if (condition.value === 0 || condition.value === undefined) {
      return 0;
    }
    switch (condition.type) {
      case "level":
        return (playerData.level / condition.value) * 100;
      case "level_total":
        return (playerData.level_total / condition.value) * 100;
      case "quest":
        return (playerData.quests / condition.value) * 100;
      case "professions":
        return (playerData.professions / condition.value) * 100;
      default:
        return 0;
    }
  };

  return (
    <div className="achievments_background">
      <br></br>{" "}
      <div className="achievments_wrapper">
        {Object.keys(groupedAchievements).map((category) => (
          <section key={category} className="achievments_items_container">
            <h5 id={category}>{category}</h5>
            {groupedAchievements[category].map((achievement) => (
              <section
                key={achievement.id}
                className={`achievments_items ${
                  achievement.unlocked
                    ? "achievment_unlocked"
                    : "achievment_locked"
                }`}
              >
                <section className="achievments_items_inner">
                  <img
                    src={renderIcon(achievement.conditions[0].type)}
                    className="achievments_items_type_icon"
                  ></img>

                  <section>
                    <h5>{achievement.name}</h5>
                    <p>{achievement.description}</p>
                    <p>
                      {achievement.conditions[0].type === "quest" &&
                      fetchedPlayerData &&
                      fetchedPlayerData.globalData &&
                      fetchedPlayerData.globalData.completedQuests !== undefined
                        ? fetchedPlayerData.globalData.completedQuests
                        : achievement.conditions[0].type === "level_total" &&
                          fetchedPlayerData &&
                          fetchedPlayerData.globalData &&
                          fetchedPlayerData.globalData.totalLevel !== undefined
                        ? fetchedPlayerData.globalData.totalLevel
                        : playerData[achievement.conditions[0].type]}
                    </p>
                    <p>
                      {calculateProgress(playerData, achievement.conditions[0])}
                      %
                    </p>
                    <progress
                      style={{ width: "100%" }}
                      value={
                        achievement.conditions[0].type === "quest" &&
                        fetchedPlayerData &&
                        fetchedPlayerData.globalData &&
                        fetchedPlayerData.globalData.completedQuests !==
                          undefined
                          ? fetchedPlayerData.globalData.completedQuests
                          : achievement.conditions[0].type === "level_total" &&
                            fetchedPlayerData &&
                            fetchedPlayerData.globalData &&
                            fetchedPlayerData.globalData.totalLevel !==
                              undefined
                          ? fetchedPlayerData.globalData.totalLevel
                          : playerData[achievement.conditions[0].type]
                      }
                      max={achievement.conditions[0].value}
                    />
                  </section>
                </section>
                {achievement.unlocked ? (
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="achievments_items_icon achievments_items_icon_unlocked"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faLock}
                    className="achievments_items_icon"
                  />
                )}
              </section>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};

export default AchievementsComponent;
