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

import { PlayerContext } from "../PlayerContext.js";

const achievements = [
  {
    id: 1,
    name: "COMBAT LVL 50",
    description: "Get lvl 50 for the first time.",
    conditions: [
      {
        type: "level",
        value: 50,
      },
    ],
    unlocked: false,
  },
  {
    id: 2,
    name: "COMBAT LVL 100",
    description: "Get lvl 100 for the first time.",
    conditions: [
      {
        type: "level",
        value: 100,
      },
    ],
    unlocked: false,
  },
  {
    id: 3,
    name: "COMBAT LVL 105",
    description: "Get lvl 105 for the first time.",
    conditions: [
      {
        type: "level",
        value: 105,
      },
    ],
    unlocked: false,
  },
  {
    id: 4,
    name: "COMBAT LVL 106",
    description: "Get lvl 106 for the first time.",
    conditions: [
      {
        type: "level",
        value: 106,
      },
    ],
    unlocked: false,
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
  },
  {
    id: 21,
    name: "WynnLord Gatherer",
    description: "Reach 10000 total levels in the professions",
    conditions: [
      {
        type: "professions",
        value: "10000",
      },
    ],
    unlocked: false,
  },
  // Add more achievements here
];

/* ACHIEVEMENT ICONS */
const renderIcon = (type) => {
  switch (type) {
    case "level":
      return faSkull;
    case "quest":
      return faBookOpen;
    case "profession":
      return faHammer;
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
    quests: [],
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

  return (
    <div className="achievments_background">
      <h1>Achievements</h1>
      <p>This is the Achievements component.</p>
      <br></br>
      <div className="achievments_wrapper">
        {achievementsState.map((achievement) => (
          <section
            key={achievement.id}
            className={`achievments_items ${
              achievement.unlocked ? "achievment_unlocked" : "achievment_locked"
            }`}
          >
            <section className="achievments_items_inner">
              <FontAwesomeIcon
                icon={renderIcon(achievement.conditions[0].type)}
              />
              <section>
                <h5>{achievement.name}</h5>
                <p>{achievement.description}</p>
              </section>
            </section>
            {achievement.unlocked ? (
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="achievments_items_icon"
              />
            ) : (
              <FontAwesomeIcon
                icon={faLock}
                className="achievments_items_icon"
              />
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default AchievementsComponent;
