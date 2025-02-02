import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  isValidElement,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faFire,
  faLeaf,
  faDroplet,
  faTornado,
} from "@fortawesome/free-solid-svg-icons";
import { faSlack } from "@fortawesome/free-brands-svg-icons";

const damageIcons = {
  Neutral: faSlack,
  Thunder: faBolt,
  Fire: faFire,
  Earth: faLeaf,
  Water: faDroplet,
  Air: faTornado,
};
const damageColors = {
  Neutral: "#FFAA00",
  Earth: "#00AA00",
  Water: "#55FFFF",
  Thunder: "#FCFC54",
  Fire: "#FF5555",
  Air: "#FFFFFF",
};

import weaponsmithingIcon from "../Assests_components/professions_crafting/crafting/weaponsmithing.png";
import woodworkingIcon from "../Assests_components/professions_crafting/crafting/woodworking.png";
import alchemismIcon from "../Assests_components/professions_crafting/crafting/alchemism.png";
import armoringIcon from "../Assests_components/professions_crafting/crafting/armouring.png";
import cookingIcon from "../Assests_components/professions_crafting/crafting/cooking.png";
import jewelingIcon from "../Assests_components/professions_crafting/crafting/jeweling.png";
import scribingIcon from "../Assests_components/professions_crafting/crafting/scribing.png";
import tailoringIcon from "../Assests_components/professions_crafting/crafting/tailoring.png";

const skillIcons = {
  weaponsmithing: weaponsmithingIcon,
  woodworking: woodworkingIcon,
  alchemism: alchemismIcon,
  armoring: armoringIcon,
  cooking: cookingIcon,
  jeweling: jewelingIcon,
  scribing: scribingIcon,
  tailoring: tailoringIcon,
};

const ItemsComponent = () => {
  const [fetchedItems, setFetchedItems] = useState([]);
  const [searchInput, setSearchInput] = useState("an");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput);

  // Debounce logic: Update debouncedSearchInput after a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 500); // Delay of 500ms

    return () => {
      clearTimeout(handler); // Cleanup timeout on every re-render
    };
  }, [searchInput]);

  const fetchItems = useCallback(async () => {
    try {
      let url;

      if (!debouncedSearchInput || debouncedSearchInput.trim() === "") {
        url = "https://api.wynncraft.com/v3/item/database?result"; // Fetch all items
        console.log("FETCHING ALL ITEMS", url);
      } else {
        url = `https://api.wynncraft.com/v3/item/search/${debouncedSearchInput}?fullResult`; // Search-specific items
      }

      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          "API response error:",
          response.status,
          response.statusText
        );
        return;
      }

      const data = await response.json();
      setFetchedItems(data);
      if (debouncedSearchInput.trim() === "") {
        setFetchedItems(data.results); // Access the results property
      }
      console.log("SEARCHED FOR: ", debouncedSearchInput);
      console.log("FETCHED ITEMS: ", data);
    } catch (error) {
      console.error("Error during item fetch:", error);
    }
  }, [debouncedSearchInput]);

  // Fetch items whenever debouncedSearchInput changes
  useEffect(() => {
    if (!debouncedSearchInput || debouncedSearchInput.trim() === "") {
      fetchItems();
    }
    if (debouncedSearchInput.trim() !== "") {
      fetchItems();
    }
  }, [debouncedSearchInput, fetchItems]);

  /* Formatting for item values */
  const formatItems = (speed) => {
    return speed
      .split("_") // Split the string at "_"
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(" "); // Join it back with a space
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "normal":
        return "var(--color-text)";
      case "set":
        return "var(--color-set)";
      case "unique":
        return "var(--color-unique)";
      case "rare":
        return "var(--color-rare)";
      case "legendary":
        return "var(--color-legendary)";
      case "fabled":
        return "var(--color-fabled)";
      case "mythic":
        return "var(--color-mythic)";
      default:
        return "var(--color-text)"; // Default to normal if rarity is undefined
    }
  };

  return (
    <div className="items_wrapper">
      <br></br>
      <div className="items_container">
        <section className="items_inner_conainer items_item_settings">
          <div className="item_inner_title">
            <h1>Item settings</h1>
            <br></br>
            <div className="item_inner_search">
              <input
                value={searchInput}
                onChange={(event) => {
                  setSearchInput(event.target.value);
                }}
                placeholder="Search for item"
              />
            </div>
          </div>

          <div className="item_inner_filtering">
            <label>Filtering options</label>
            <br></br>
            <div className="item_inner_filtering_inner">
              <section>
                <h6>Type</h6>
              </section>
              <section>
                <h6>Rarity</h6>
              </section>
              <section>
                <h6>Level range</h6>
              </section>
              <section>
                <h6>Identifications</h6>
              </section>
            </div>
          </div>

          <div className="item_inner_options">
            <button>RESET FILTERS</button>
            <button>APPLY FILTERS</button>
          </div>
        </section>

        <section className="items_inner_conainer items_item_database">
          <h3>Results</h3>
          <div className="item_database_results">
            <div className="item_database_results_output">
              {fetchedItems && Object.keys(fetchedItems).length > 0 ? (
                Object.entries(fetchedItems).map(([key, item]) => (
                  <div key={key} className="item_database_results_output_item">
                    {/* ITEM NAME */}
                    <h4
                      key={key}
                      style={{
                        color: getRarityColor(item.rarity),
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {item.internalName || key}
                    </h4>
                    {/* SUB TITLE */}
                    <section
                      style={{
                        color: "var(--color-describe)",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      {item.attackSpeed &&
                        `${formatItems(item.attackSpeed)} Attack Speed`}
                      {item.armourType && `${formatItems(item.armourType)} `}
                      {item.accessoryType &&
                        `${formatItems(item.accessoryType)} `}
                      {item.tomeType && `${formatItems(item.tomeType)} `}
                      {item.type === "charm" && "Charm"}
                      {item.toolType &&
                        `${
                          item.toolType === "rod"
                            ? "Fishing Rod"
                            : formatItems(item.toolType)
                        } `}
                      {item.type === "material" && "Crafting Material"}
                      {item.type === "ingredient" && "Crafting ingredient"}
                    </section>
                    {/*  */}
                    <br></br>
                    {/* DAMAGE */}
                    <section>
                      {item.base && (
                        <div className="item_base">
                          {Object.entries(item.base).map(([key, value]) => {
                            // ✅ Handle Neutral Damage separately
                            if (key === "baseDamage") {
                              return (
                                <div key={key} className="item_base_stat">
                                  <p style={{ color: damageColors["Neutral"] }}>
                                    <FontAwesomeIcon
                                      icon={damageIcons["Neutral"]}
                                      className="icon_dmg"
                                      style={{
                                        marginRight: "5px",
                                        color: "red",
                                      }}
                                    />
                                    Neutral Damage: {value.min} - {value.max}
                                  </p>
                                </div>
                              );
                            }

                            // ✅ Handle base elemental damage attributes (Earth, Fire, etc.)
                            const elementalDamageKeys = [
                              "baseEarthDamage",
                              "baseWaterDamage",
                              "baseThunderDamage",
                              "baseFireDamage",
                              "baseAirDamage",
                            ];

                            if (elementalDamageKeys.includes(key)) {
                              // ✅ Remove "base" prefix (e.g., "baseEarthDamage" → "Earth Damage")
                              const formattedKey = key
                                .replace(/^base/, "")
                                .replace(/([a-z])([A-Z])/g, "$1 $2");

                              // ✅ Extract only the elemental part ("Earth" from "Earth Damage")
                              const element = formattedKey.split(" ")[0];

                              // ✅ Ensure capitalization for correct key lookup
                              const capitalizedElement =
                                element.charAt(0).toUpperCase() +
                                element.slice(1);

                              return (
                                <div key={key} className="item_base_stat">
                                  <p
                                    style={{
                                      color:
                                        damageColors[capitalizedElement] ||
                                        "inherit",
                                    }}
                                  >
                                    {/* ✅ Ensure the icon is found before rendering */}
                                    {damageIcons[capitalizedElement] && (
                                      <FontAwesomeIcon
                                        icon={damageIcons[capitalizedElement]}
                                        style={{ marginRight: "5px" }}
                                      />
                                    )}
                                    {formattedKey}: {value.min} - {value.max}
                                  </p>
                                </div>
                              );
                            }

                            // ✅ For other base attributes (e.g., armor), just display the value without special formatting
                            const formattedKey = key
                              .replace(/^base/, "")
                              .replace(/([a-z])([A-Z])/g, "$1 $2");

                            return (
                              <div key={key} className="item_base_stat">
                                <p>
                                  {formattedKey}:{" "}
                                  {value.min
                                    ? `${value.min} - ${value.max}`
                                    : value}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {item.averageDps && (
                        <p>
                          <span
                            style={{
                              color: "var(--color-describe-dark)",
                              marginLeft: "10px",
                            }}
                          >
                            Average DPS:{" "}
                          </span>
                          <span style={{ color: "var(--color-describe)" }}>
                            {item.averageDps}
                          </span>
                        </p>
                      )}
                    </section>
                    {/*  */}
                    <br></br>
                    {/* requirements */}
                    <section>
                      {item.type !== "ingredient" && item.requirements && (
                        <div className="item_requirements">
                          {Object.entries(item.requirements)
                            .sort(([keyA], [keyB]) => {
                              const order = [
                                "classRequirement", // Ensure "Class Req" appears first
                                "level", // "Combat Lvl. Min" appears after "Class Req"
                                "strength",
                                "dexterity",
                                "intelligence",
                                "defence",
                                "agility",
                              ];
                              return order.indexOf(keyA) - order.indexOf(keyB);
                            })
                            .map(([key, value]) => {
                              // Class name mappings
                              const classNames = {
                                mage: "Mage/Dark Wizard",
                                assassin: "Assassin/Ninja",
                                warrior: "Warrior/Knight",
                                shaman: "Shaman/Skyseer",
                                archer: "Archer/Hunter",
                              };

                              // If the key is classRequirement, get the mapped class name
                              const displayValue =
                                key === "classRequirement" && classNames[value]
                                  ? classNames[value]
                                  : value;

                              return (
                                <div key={key} className="requirement_item">
                                  <strong
                                    style={{
                                      color: "var(--color-describe-dark)",
                                    }}
                                  >
                                    {key === "classRequirement" && "Class Req:"}
                                    {key === "level" && "Lvl. Min:"}
                                    {key === "strength" && "Strength Min:"}
                                    {key === "dexterity" && "Dexterity Min:"}
                                    {key === "intelligence" &&
                                      "Intelligence Min:"}
                                    {key === "defence" && "Defence Min:"}
                                    {key === "agility" && "Agility Min:"}
                                  </strong>{" "}
                                  <span
                                    style={{ color: "var(--color-describe)" }}
                                  >
                                    {displayValue}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      )}
                      {item.type === "ingredient" &&
                        Object.entries(item.requirements).map(
                          ([key, value]) => {
                            if (Array.isArray(value) && key === "skills") {
                              return (
                                <div
                                  key={key}
                                  className="requirement_item_ingredient"
                                >
                                  {/* Display "Crafting Lv. Min:" once for the skills array */}
                                  <div
                                    style={{ color: "var(--color-describe)" }}
                                  >
                                    Crafting Lv. Min: {item.requirements.level}
                                  </div>

                                  {value.map((skill, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        color: "var(--color-describe)",
                                        marginLeft: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                      }}
                                    >
                                      {skillIcons[skill] && (
                                        <img
                                          src={skillIcons[skill]}
                                          alt={skill}
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                          }}
                                        />
                                      )}
                                      {skill}
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                          }
                        )}
                    </section>
                    {/*  */}
                    <br></br>
                    {/* IDENTIFICATIONS RAW STATS*/}
                    <section>
                      <section>
                        {item.identifications &&
                          Object.entries(item.identifications).map(
                            ([key, value]) => {
                              // Function to get the correct display value (for both numbers and objects)
                              const getDisplayValue = (value) => {
                                if (
                                  typeof value === "object" &&
                                  value !== null
                                ) {
                                  if (
                                    value.min !== undefined &&
                                    value.max !== undefined
                                  ) {
                                    return `${value.min} to ${value.max}`;
                                  }
                                  return value.raw !== undefined
                                    ? value.raw
                                    : value;
                                }
                                return value;
                              };

                              const displayValue = getDisplayValue(value); // Get the display value
                              console.log("DISPLAY VALUE: ", displayValue);

                              const isPositive = (() => {
                                if (typeof displayValue === "number") {
                                  return displayValue >= 0; // ✅ Handles single numbers correctly
                                }

                                if (
                                  typeof displayValue === "string" &&
                                  displayValue.includes(" to ")
                                ) {
                                  const [min, max] = displayValue
                                    .split(" to ")
                                    .map(Number);
                                  return min >= 0 && max >= 0; // ✅ Checks both min and max
                                }

                                if (
                                  typeof value === "object" &&
                                  value !== null
                                ) {
                                  if ("min" in value && "max" in value) {
                                    return value.min >= 0 && value.max >= 0; // ✅ Handles `{ min, max }` case
                                  }
                                  if ("raw" in value) {
                                    return value.raw >= 0; // ✅ If there's a raw value, check that
                                  }
                                }

                                return true; // Default (assume positive if unknown)
                              })();

                              // Determine the label based on the key (dynamically)
                              const keyLabels = {
                                baseHealth: "Health",
                                baseEarthDefence: "Earth Defence",
                                baseThunderDefence: "Thunder Defence",
                                dexterity: "Dexterity",
                                intelligence: "Intelligence",
                                rawIntelligence: "Raw Intelligence",
                                spellDamage: "Spell Damage",
                                thunderDamage: "Thunder Damage",
                                waterDamage: "Water Damage",
                                baseWaterDefence: "Water Defence",
                                baseAirDefence: "Air Defence",
                                agility: "Agility",
                                mainAttackDamage: "Main Attack Damage",
                                rawMainAttackDamage: "Raw Main Attack Damage",
                                walkSpeed: "Walk Speed",
                                xpBonus: "XP Bonus",
                                airDamage: "Air Damage",
                                waterDefence: "Water Defence",
                                airDefence: "Air Defence",
                                baseEarthDamage: "Earth Damage",
                                baseFireDamage: "Fire Damage",
                                strength: "Strength",
                                defence: "Defence",
                                manaRegen: "Mana Regen",
                                manaSteal: "Mana Steal",
                                earthDamage: "Earth Damage",
                                fireDamage: "Fire Damage",
                                rawHealth: "Health",
                                exploding: "Exploding",
                                baseDamage: "Base Damage",
                                baseThunderDamage: "Thunder Damage",
                                lifeSteal: "Life Steal",
                                reflection: "Reflection",
                                lootBonus: "Loot Bonus",
                                poison: "Poison",
                                elementalDamage: "Elemental Damage",
                                rawDefence: "Defence",
                                rawAgility: "Agility",
                                healthRegenRaw: "Health Regen",
                                rawAttackSpeed: "Attack Speed",
                                rawStrength: "Strength",
                                healthRegen: "Health Regen",
                                rawSpellDamage: "Spell Damage",
                                thorns: "Thorns",
                                thunderDefence: "Thunder Defence",
                                baseFireDefence: "Fire Defence",
                                rawDexterity: "Dexterity",
                                baseAirDamage: "Air Damage",
                                earthDefence: "Earth Defence",
                                fireDefence: "Fire Defence",
                                "4thSpellCost": "4th Spell Cost",
                                rawFireDamage: "Fire Damage",
                                raw1stSpellCost: "1st Spell Cost",
                                healingEfficiency: "Healing Efficiency",
                                baseWaterDamage: "Water Damage",
                                elementalSpellDamage: "Elemental Spell Damage",
                                "3rdSpellCost": "3rd Spell Cost",
                                "1stSpellCost": "1st Spell Cost",
                                raw4thSpellCost: "4th Spell Cost",
                                stealing: "Stealing",
                                "2ndSpellCost": "2nd Spell Cost",
                                rawFireMainAttackDamage:
                                  "Raw Fire Main Attack Damage",
                                rawAirMainAttackDamage:
                                  "Raw Air Main Attack Damage",
                                elementalMainAttackDamage:
                                  "Elemental Main Attack Damage",
                                knockback: "Knockback",
                                raw2ndSpellCost: "2nd Spell Cost",
                                raw3rdSpellCost: "3rd Spell Cost",
                                thunderMainAttackDamage:
                                  "Thunder Main Attack Damage",
                                rawThunderMainAttackDamage:
                                  "Raw Thunder Main Attack Damage",
                                elementalDefence: "Elemental Defence",
                                jumpHeight: "Jump Height",
                                neutralDamage: "Neutral Damage",
                                slowEnemy: "Slow Enemy",
                                rawEarthMainAttackDamage:
                                  "Raw Earth Main Attack Damage",
                                sprintRegen: "Sprint Regen",
                                rawThunderDamage: "Thunder Damage",
                                rawWaterDamage: "Water Damage",
                                sprint: "Sprint",
                                fireSpellDamage: "Fire Spell Damage",
                                airSpellDamage: "Air Spell Damage",
                                earthMainAttackDamage:
                                  "Earth Main Attack Damage",
                                weakenEnemy: "Weaken Enemy",
                                airMainAttackDamage: "Air Main Attack Damage",
                                waterSpellDamage: "Water Spell Damage",
                                rawThunderSpellDamage:
                                  "Raw Thunder Spell Damage",
                                rawElementalSpellDamage:
                                  "Raw Elemental Spell Damage",
                                rawAirSpellDamage: "Raw Air Spell Damage",
                                thunderSpellDamage: "Thunder Spell Damage",
                                earthSpellDamage: "Earth Spell Damage",
                                rawEarthDamage: "Earth Damage",
                                rawNeutralSpellDamage:
                                  "Raw Neutral Spell Damage",
                                rawDamage: "Damage",
                                rawFireSpellDamage: "Raw Fire Spell Damage",
                                neutralMainAttackDamage:
                                  "Neutral Main Attack Damage",
                                rawWaterSpellDamage: "Raw Water Spell Damage",
                                fireMainAttackDamage: "Fire Main Attack Damage",
                                rawElementalDamage: "Elemental Damage",
                                rawNeutralDamage: "Neutral Damage",
                                rawElementalMainAttackDamage:
                                  "Raw Elemental Main Attack Damage",
                                damage: "Damage",
                                rawAirDamage: "Air Damage",
                                rawEarthSpellDamage: "Earth Spell Damage",
                                rawNeutralMainAttackDamage:
                                  "Neutral Main Attack Damage",
                                leveledXpBonus: "Leveled XP Bonus",
                                damageFromMobs: "Damage from Mobs",
                                leveledLootBonus: "Leveled Loot Bonus",
                                gatherXpBonus: "Gather XP Bonus",
                                rawWaterMainAttackDamage:
                                  "Raw Water Main Attack Damage",
                                gatherSpeed: "Gather Speed",
                                lootQuality: "Loot Quality",
                                neutralSpellDamage: "Neutral Spell Damage",
                                rawMaxMana: "Max Mana",
                                mainAttackRange: "Main Attack Range",
                                criticalDamageBonus: "Critical Damage Bonus",
                              };
                              // Fallback to the key itself if no label is found in the `keyLabels` object
                              const label =
                                keyLabels[key] ||
                                key.replace(/([a-z])([A-Z])/g, "$1 $2");

                              // Check if the key is a spell cost modifier
                              const isSpellCostModifier =
                                key.includes("SpellCost");

                              console.log(isPositive);

                              const formatDisplayValue = (displayValue) => {
                                if (typeof displayValue === "number") {
                                  return displayValue >= 0
                                    ? `+${displayValue}`
                                    : `${displayValue}`;
                                }

                                if (
                                  typeof displayValue === "string" &&
                                  displayValue.includes(" to ")
                                ) {
                                  const [min, max] = displayValue
                                    .split(" to ")
                                    .map(Number);
                                  const formattedMin =
                                    min >= 0 ? `+${min}` : `${min}`;
                                  const formattedMax =
                                    max >= 0 ? `+${max}` : `${max}`;
                                  return `${formattedMin} to ${formattedMax}`;
                                }

                                return displayValue; // Default return if not a number or range
                              };

                              return (
                                <div key={key} className="requirement_item">
                                  {/* Render the value and label dynamically */}
                                  <span>
                                    <span
                                      style={{
                                        color: isSpellCostModifier
                                          ? isPositive
                                            ? "var(--color-fabled)" // Red for positive spell cost
                                            : "var(--color-set)" // Green for negative spell cost
                                          : isPositive
                                          ? "var(--color-set)"
                                          : "var(--color-fabled)", // Apply color based on value
                                      }}
                                    >
                                      {formatDisplayValue(displayValue)}{" "}
                                    </span>{" "}
                                    <span
                                      style={{ color: "var(--color-describe)" }}
                                    >
                                      {label}{" "}
                                      {/* Dynamically display the label */}
                                    </span>
                                  </span>
                                </div>
                              );
                            }
                          )}
                      </section>
                    </section>

                    <br></br>

                    {item.powderSlots && (
                      <p
                        style={{
                          color: "var(--color-describe)",
                        }}
                      >
                        [{item.powderSlots}] Powder slots
                      </p>
                    )}
                    <p
                      style={{
                        color: getRarityColor(item.rarity),
                      }}
                    >
                      {item.rarity && `${formatItems(item.rarity)} Item`}
                    </p>
                    <p>
                      {item.lore && (
                        <p
                          style={{
                            color: "var(--color-describe-dark)",
                          }}
                        >
                          {item.lore}
                        </p>
                      )}
                    </p>
                  </div>
                ))
              ) : (
                <p>No items found or invalid response.</p>
              )}
            </div>
          </div>
          <div className="item_database_pagination">PAGINATION</div>
        </section>
      </div>
    </div>
  );
};

export default ItemsComponent;
