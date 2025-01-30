import React, { useState, useEffect, useContext, useCallback } from "react";

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

const ItemsComponent = () => {
  const [fetchedItems, setFetchedItems] = useState([]);
  const [searchInput, setSearchInput] = useState("sword");
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
      case "common":
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
          <div className="item_database_title">
            <h1>Items</h1>
          </div>

          <div className="item_database_results">
            <h3>Results</h3>
            <div className="item_database_results_output">
              {fetchedItems && Object.keys(fetchedItems).length > 0 ? (
                Object.entries(fetchedItems).map(([key, item]) => (
                  <div key={key} className="item_database_results_output_item">
                    {/*  */}
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
                    {/*  */}
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
                    {/*  */}
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
                                      style={{ marginRight: "5px" }}
                                    />
                                    Neutral Damage: {value.min} - {value.max}
                                  </p>
                                </div>
                              );
                            }

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
                          })}
                        </div>
                      )}

                      {item.averageDps && (
                        <h6>
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
                        </h6>
                      )}
                    </section>
                    {/*  */}
                    <br></br>
                    {/* requirements */}
                    <section>
                      {item.requirements && (
                        <div className="item_requirements">
                          {Object.entries(item.requirements).map(
                            ([key, value]) => (
                              <div key={key} className="requirement_item">
                                <strong>{formatItems(key)}:</strong> {value}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </section>
                    {/*  */}
                    <br></br>
                    {/*  */}
                    <p>Weapon Type: {item.weaponType || "N/A"}</p>
                    <p>Attack Speed: {item.attackSpeed || "N/A"}</p>
                    <p>Average DPS: {item.averageDps || "N/A"}</p>

                    <p
                      style={{
                        color: getRarityColor(item.rarity),
                      }}
                    >
                      {item.rarity && `${formatItems(item.rarity)} `}
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
