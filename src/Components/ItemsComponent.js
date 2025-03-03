import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  isValidElement,
} from "react";
import { CSSTransition } from "react-transition-group";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faFire,
  faLeaf,
  faDroplet,
  faTornado,
  faHeart,
  faStar,
  faCaretUp,
  faCircle,
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

import slowAttackSpeed from "../Assests_components/attack_speed/slow.png";
import mediumAttackSpeed from "../Assests_components/attack_speed/medium.png";
import fastAttackSpeed from "../Assests_components/attack_speed/fast.png";

const skillIcons = {
  weaponsmithing: weaponsmithingIcon,
  woodworking: woodworkingIcon,
  alchemism: alchemismIcon,
  armouring: armoringIcon,
  cooking: cookingIcon,
  jeweling: jewelingIcon,
  scribing: scribingIcon,
  tailoring: tailoringIcon,
};

const ItemsComponent = () => {
  const [fetchedItems, setFetchedItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterVisibility, setFilterVisibility] = useState({
    type: false,
    advanced: false,
    rarity: false,
    level: false,
    identifications: false,
    armour: false,
    accessory: false,
    attackSpeed: false,
    tomes: false,
    tools: false,
    crafting: false,
    gathering: false,
  });
  const [filters, setFilters] = useState({
    query: searchInput || "a",
    type: [],
    tier: [],
    attackSpeed: [],
    armour: [],
    tome: [],
    tool: [],
    levelRange: [],
    professions: [],
    identifications: [],
    majorIds: [],
  });
  const [nextUrl, setNextUrl] = useState(null); // For pagination

  // Whenever searchInput changes, update filters.query
  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      query: searchInput,
    }));
  }, [searchInput]);

  // Debounce logic: Update debouncedSearchInput after a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 500); // Delay of 500ms

    return () => {
      clearTimeout(handler); // Cleanup timeout on every re-render
    };
  }, [searchInput]);

  /* fetching items*/

  const fetchItems = useCallback(
    async (isInitial = false) => {
      try {
        if (loading || (!isInitial && !nextUrl)) return; // Prevent unnecessary calls

        setLoading(true);
        setError(null);

        let requestBody = {};

        // Always include query if available
        if (filters.query) requestBody.query = filters.query;

        // Handle armour type filter
        if (filters.type.length > 0) {
          requestBody.type = filters.type.filter((type) => type !== "armour"); // Send only the selected armourType
        }

        // Handle accessory type filter
        if (filters.type.length > 0) {
          requestBody.type = filters.type.filter(
            (type) => type !== "accessory"
          ); // Send only the selected type
        }

        // Handle ingredients type filter
        if (filters.type.length > 0) {
          requestBody.type = filters.type.filter(
            (type) => type !== "ingredient"
          ); // Send only the selected type
        }

        // Handle tome type filter
        if (filters.type.length > 0) {
          requestBody.type = filters.type.filter((type) => type !== "tome"); // Send only the selected type
        }

        if (filters.type.includes("tool")) {
          if (filters.tool.length > 0) {
            requestBody.type = filters.tool; // Send only the selected armourType
          } else {
            requestBody.type = ["axe", "pickaxe", "rod", "scythe"]; // Default to all armour types if none is selected
          }
        } else if (filters.type.length > 0) {
          requestBody.type = filters.type; // Send normal type filter for non-armour
        }

        if (filters.tier.length) requestBody.tier = filters.tier;
        if (filters.attackSpeed.length)
          requestBody.attackSpeed = filters.attackSpeed;
        if (filters.levelRange.length)
          requestBody.levelRange = filters.levelRange;
        if (filters.professions.length)
          requestBody.professions = filters.professions;
        if (filters.identifications.length)
          requestBody.identifications = filters.identifications;
        if (filters.majorIds.length) requestBody.majorIds = filters.majorIds;

        // ✅ Ensure there is at least one valid field
        if (Object.keys(requestBody).length === 0) {
          requestBody = { query: "a" }; // Default query to prevent empty payload
        }

        // Use nextUrl if available (for pagination), otherwise use default API URL
        const requestUrl = isInitial
          ? "https://api.wynncraft.com/v3/item/search"
          : nextUrl;

        const response = await fetch(requestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody), // Send filters in the body
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error("Failed to fetch items");
        }

        const data = await response.json();
        /*         console.log("Fetched Data:", data);
        console.log("Fetched Items:", fetchedItems);
        console.log("Filters: ", JSON.stringify(filters, null, 2));
        console.log("Final API Request:", JSON.stringify(requestBody, null, 2)); */

        // Append new results instead of replacing them
        setFetchedItems((prevItems) => [
          ...prevItems,
          ...Object.values(data.results),
        ]);

        // Set the next page URL, if available
        setNextUrl(data.controller?.links?.next || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [filters, nextUrl, loading]
  );

  // Scroll event listener for pagination
  const handleScroll = (event) => {
    const container = event.target;
    if (
      container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10 && // Detect bottom
      nextUrl &&
      !loading
    ) {
      fetchItems(false); // Fetch next page
    }
  };

  // Attach scroll event listener
  useEffect(() => {
    const container = document.querySelector(".items_item_database");
    container?.addEventListener("scroll", handleScroll);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Initial fetch when search input changes
  useEffect(() => {
    setFetchedItems([]); // Reset items on new search
    setNextUrl(null); // Reset pagination
    fetchItems(true); // Initial fetch
  }, [debouncedSearchInput, filters]);

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

  const getRarityStyle = (rarity) => {
    switch (rarity) {
      case "normal":
        return { color: "var(--color-text)", filter: "none" };
      case "set":
        return {
          filter: "drop-shadow(0 0 0.75rem var(--color-set))",
        };
      case "unique":
        return {
          filter: "drop-shadow(0 0 0.75rem var(--color-unique))",
        };
      case "rare":
        return {
          filter: "drop-shadow(0 0 0.75rem var(--color-rare))",
        };
      case "legendary":
        return {
          filter: "drop-shadow(0 0 0.75rem var(--color-legendary))",
        };
      case "fabled":
        return {
          filter: "drop-shadow(0 0 0.75rem var(--color-fabled))",
        };
      case "mythic":
        return {
          filter: "drop-shadow(0 0 1rem var(--color-mythic))",
        };
      default:
        return { color: "var(--color-text)", filter: "none" }; // Default style
    }
  };

  const getRarityStyleMaterials = (rarity) => {
    switch (rarity) {
      case 2:
        return {
          filter: "drop-shadow(0 0 0.75rem var(--color-unique))",
        };
      case 3:
        return {
          filter: "drop-shadow(0 0 0.75rem var(--color-fabled))",
        };
      default:
        return { filter: "none" }; // Default style
    }
  };

  /* ITEM USEAGE FUNCS. */
  const getMaterialDescription = (type) => {
    const descriptions = {
      ingot:
        "Use this material to purchase blocks in Housing, or to craft spears, daggers, boots, leggings, helmets & chestplates.",
      gem: "Use this material to purchase blocks in Housing, or to craft rings, bracelets & necklaces.",
      wood: "Use this material to purchase blocks in Housing, or to craft spears, daggers, bows & wands.",
      paper:
        "Use this material to purchase blocks in Housing, or to craft scrolls, helmets & chestplates.",
      string:
        "Use this material to purchase blocks in Housing, or to craft boots, leggings, bows & wands.",
      grain:
        "Use this material to purchase blocks in Housing, or to craft potions & food.",
      oil: "Use this material to purchase blocks in Housing, or to craft scrolls, rings, bracelets, necklaces & potions.",
      meat: "Use this material to purchase blocks in Housing, or to craft food.",
    };

    return (
      descriptions[type] ||
      "This material is used for crafting and housing purchases."
    );
  };
  const materials = [
    "gem",
    "grain",
    "ingot",
    "meat",
    "oil",
    "paper",
    "string",
    "wood",
  ];

  function getMaterialType(item) {
    const lowerName = item.internalName.toLowerCase();
    return (
      materials.find((material) => lowerName.includes(material)) || "unknown"
    );
  }

  /* Handeling visiblity (expanding) of item database */
  // Universal function to toggle filters
  const toggleFilter = (filterKey) => {
    setFilterVisibility((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  /* HANDLE TYPE FILTER SWITCHING */

  const handleTypeFilterSwitch = (newType) => {
    setFilters((prevFilters) => {
      // Ensure prevFilters.type is always an array
      const currentFilters = Array.isArray(prevFilters.type)
        ? prevFilters.type
        : [];

      const isAlreadySelected = currentFilters.includes(newType);
      let updatedTypeFilter = [...currentFilters];

      const armourItems = ["helmet", "chestplate", "leggings", "boots"];
      const accessoryItems = ["bracelet", "ring", "necklace"];
      const tomeItems = [
        "weaponTome",
        "armourTome",
        "guildTome",
        "expertiseTome",
        "mysticismTome",
        "marathonTome",
        "lootrunTome",
      ];
      const toolItems = ["axe", "pickaxe", "rod", "scythe"];

      if (armourItems.includes(newType)) {
        updatedTypeFilter = isAlreadySelected
          ? updatedTypeFilter.filter((type) => type !== newType)
          : [...updatedTypeFilter, newType];

        if (updatedTypeFilter.some((type) => armourItems.includes(type))) {
          updatedTypeFilter = updatedTypeFilter.filter(
            (type) => type !== "armour"
          );
        }
      } else if (accessoryItems.includes(newType)) {
        updatedTypeFilter = isAlreadySelected
          ? updatedTypeFilter.filter((type) => type !== newType)
          : [...updatedTypeFilter, newType];

        if (updatedTypeFilter.some((type) => accessoryItems.includes(type))) {
          updatedTypeFilter = updatedTypeFilter.filter(
            (type) => type !== "accessory"
          );
        }
        /*  */
      } else if (toolItems.includes(newType)) {
        updatedTypeFilter = isAlreadySelected
          ? updatedTypeFilter.filter((type) => type !== newType)
          : [...updatedTypeFilter, newType];

        if (updatedTypeFilter.some((type) => toolItems.includes(type))) {
          updatedTypeFilter = updatedTypeFilter.filter(
            (type) => type !== "tool"
          );
        }
      } else if (tomeItems.includes(newType)) {
        updatedTypeFilter = isAlreadySelected
          ? updatedTypeFilter.filter((type) => type !== newType)
          : [...updatedTypeFilter, newType];

        if (updatedTypeFilter.some((type) => tomeItems.includes(type))) {
          updatedTypeFilter = updatedTypeFilter.filter(
            (type) => type !== "tome"
          );
        }
        /*  */
      } else if (newType === "armour") {
        updatedTypeFilter = isAlreadySelected
          ? updatedTypeFilter.filter((type) => type !== "armour")
          : [
              ...updatedTypeFilter.filter(
                (type) => !armourItems.includes(type)
              ),
              "armour",
            ];
      } else if (newType === "accessory") {
        updatedTypeFilter = isAlreadySelected
          ? updatedTypeFilter.filter((type) => type !== "accessory")
          : [
              ...updatedTypeFilter.filter(
                (type) => !accessoryItems.includes(type)
              ),
              "accessory",
            ];
      } else if (newType === "tome") {
        updatedTypeFilter = isAlreadySelected
          ? updatedTypeFilter.filter((type) => type !== "tome")
          : [
              ...updatedTypeFilter.filter((type) => !tomeItems.includes(type)),
              "tome",
            ];
        /*  */
      } else if (newType === "tool") {
        updatedTypeFilter = isAlreadySelected
          ? updatedTypeFilter.filter((type) => type !== "tool")
          : [
              ...updatedTypeFilter.filter((type) => !toolItems.includes(type)),
              "tool",
            ];
      } else {
        updatedTypeFilter = isAlreadySelected
          ? updatedTypeFilter.filter((type) => type !== newType)
          : [...updatedTypeFilter, newType];
      }

      return {
        ...prevFilters,
        type: updatedTypeFilter,
      };
    });
  };

  const [isMaterialMenuOpen, setIsMaterialMenuOpen] = useState(true);

  const handleProfessionFilterSwitch = (profession) => {
    setFilters((prevFilters) => {
      // Ensure professions is always an array
      const currentProfessionFilters = Array.isArray(prevFilters.professions)
        ? prevFilters.professions
        : [];

      const isAlreadySelected = currentProfessionFilters.includes(profession);
      let updatedProfessionFilter = [...currentProfessionFilters];

      // Toggle the selected profession
      updatedProfessionFilter = isAlreadySelected
        ? updatedProfessionFilter.filter((type) => type !== profession)
        : [...updatedProfessionFilter, profession];

      // Update type filter
      let updatedTypeFilter = [...prevFilters.type];

      // If any profession related to materials is selected, add "material" to the type filter
      const materialProfessions = [
        "mining",
        "fishing",
        "farming",
        "woodcutting",
      ];
      const selectedMaterials = updatedProfessionFilter.filter((profession) =>
        materialProfessions.includes(profession)
      );

      if (
        selectedMaterials.length > 0 &&
        !updatedTypeFilter.includes("material")
      ) {
        updatedTypeFilter.push("material");
      } else {
        // If no material-related professions are selected, remove "material" from the type filter
        updatedTypeFilter = updatedTypeFilter.filter(
          (type) => type !== "material"
        );
      }

      // Automatically close the material section when any profession is selected
      setIsMaterialMenuOpen(false); // Close the material section

      return {
        ...prevFilters,
        professions: updatedProfessionFilter, // Update the professions filter
        type: updatedTypeFilter, // Update the type filter (adding/removing "material" as needed)
      };
    });
  };

  /* Handle filtering for advanced */
  const toggleFilterSelection = (category, value) => {
    setFilters((prevFilters) => {
      const isSelected = prevFilters[category].includes(value);

      return {
        ...prevFilters,
        [category]: isSelected
          ? prevFilters[category].filter((item) => item !== value)
          : [...prevFilters[category], value],
      };
    });

    // Ensure the submenu remains open
    setFilterVisibility((prev) => ({
      ...prev,
      [category]: true, // Keep the submenu open after selection
    }));
  };
  useEffect(() => {
    if (filters.attackSpeed.length > 0) {
      setFilterVisibility((prev) => ({
        ...prev,
        attackSpeed: true, // Ensure submenu remains open
      }));
    }
  }, [filters.attackSpeed]);

  const toggleFilterOption = (section, option) => {
    setFilters((prev) => ({
      ...prev,
      [section]: prev[section].includes(option)
        ? prev[section].filter((item) => item !== option) // Remove if already selected
        : [...prev[section], option], // Add to the selected list
    }));
  };

  /*  */
  return (
    <div className="items_wrapper">
      <br></br>
      <div className="items_container">
        <section className="items_inner_conainer items_item_settings">
          <div className="item_inner_title">
            <h5>Item Settings</h5>
            <br></br>
            <div className="item_inner_search">
              <input
                value={searchInput}
                onChange={(event) => {
                  setSearchInput(event.target.value);
                }}
                placeholder="Search for item name..."
              />
              <h6
                style={{
                  fontSize: "var(--font-size-small)",
                  marginLeft: "0.2rem",
                  marginTop: "0.2rem",
                  color: "gray",
                }}
              >
                Results will be searched after selected input.
              </h6>
            </div>
          </div>

          <div className="item_inner_filtering">
            <h5>Filtering options</h5>
            <br></br>
            <br></br>
            {/* FILTERING OPTIONS */}
            <div className="item_inner_filtering_inner">
              {/* TYPE FILTER */}
              <section className="item_inner_filtering_section_container">
                <div
                  className="flex space-between pB-1"
                  onClick={() => toggleFilter("type")}
                >
                  <h6>Type</h6>
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    className={`filtering_arrow ${
                      filterVisibility.type ? "rotated" : ""
                    }`}
                  />{" "}
                </div>

                <CSSTransition
                  in={filterVisibility.type}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div className="item_inner_filtering_section_grid">
                    <section
                      className={
                        filters.type.includes("weapon")
                          ? "typeFilterIsActive"
                          : ""
                      }
                      onClick={() => {
                        handleTypeFilterSwitch("weapon");
                      }}
                    >
                      <img
                        src="/Assests_components/game_textures/weapon/spear.png"
                        alt="Weapon"
                      />
                      <h5>Weapon</h5>
                    </section>
                    <section
                      className={
                        filters.type.some((type) =>
                          [
                            "armour",
                            "helmet",
                            "chestplate",
                            "leggings",
                            "boots",
                          ].includes(type)
                        )
                          ? "typeFilterIsActive"
                          : ""
                      }
                      onClick={() => {
                        handleTypeFilterSwitch("armour");
                      }}
                    >
                      <img
                        src="/Assests_components/game_textures/armour/diamond/chestplate.webp"
                        alt="Armour"
                      />
                      <h5>Armour</h5>
                    </section>
                    <section
                      className={
                        filters.type.some((type) =>
                          [
                            "accessory",
                            "bracelet",
                            "ring",
                            "necklace",
                          ].includes(type)
                        )
                          ? "typeFilterIsActive"
                          : ""
                      }
                      onClick={() => {
                        handleTypeFilterSwitch("accessory");
                      }}
                    >
                      <img
                        src="/Assests_components/game_textures/accessory/necklace.png"
                        alt="Accessory"
                      />
                      <h5>Accessory</h5>
                    </section>
                    <section
                      className={
                        filters.type.some((type) =>
                          [
                            "tome",
                            "weaponTome",
                            "armourTome",
                            "guildTome",
                            "expertiseTome",
                            "mysticismTome",
                            "marathonTome",
                            "lootrunTome",
                          ].includes(type)
                        )
                          ? "typeFilterIsActive"
                          : ""
                      }
                      onClick={() => {
                        handleTypeFilterSwitch("tome");
                      }}
                    >
                      <img
                        src="/Assests_components/game_textures/tome/tome.png"
                        alt="Tome"
                      />
                      <h5>Tome</h5>
                    </section>
                    <section
                      className={
                        filters.type.includes("charm")
                          ? "typeFilterIsActive"
                          : ""
                      }
                      onClick={() => {
                        handleTypeFilterSwitch("charm");
                      }}
                    >
                      {" "}
                      <img
                        src="/Assests_components/game_textures/charm/charm.png"
                        alt="Charm"
                      />
                      <h5>Charm</h5>
                    </section>
                    <section
                      className={
                        filters.type.some((type) =>
                          ["tool", "pickaxe", "axe", "rod", "scythe"].includes(
                            type
                          )
                        )
                          ? "typeFilterIsActive"
                          : ""
                      }
                      onClick={() => {
                        handleTypeFilterSwitch("tool");
                      }}
                    >
                      {" "}
                      <img
                        src="/Assests_components/game_textures/tool/pickaxe.png"
                        alt="Tool"
                      />
                      <h5>Tool</h5>
                    </section>
                    <section
                      className={
                        filters.type.some((type) =>
                          [
                            "ingredient",
                            "weaponsmithing",
                            "woodworking",
                            "alchemism",
                            "armoring",
                            "cooking",
                            "jeweling",
                            "scribing",
                            "tailoring",
                          ].includes(type)
                        )
                          ? "typeFilterIsActive"
                          : ""
                      }
                      onClick={() => {
                        handleTypeFilterSwitch("ingredient");
                      }}
                    >
                      {" "}
                      <img
                        src="/Assests_components/game_textures/ingredient/ingredient.png"
                        alt="Ingredient"
                      />
                      <h5>Ingredient</h5>
                    </section>
                    <section
                      className={
                        filters.type.includes("material")
                          ? "typeFilterIsActive"
                          : ""
                      }
                      onClick={() => {
                        handleTypeFilterSwitch("material");
                      }}
                    >
                      {" "}
                      <img
                        src="/Assests_components/game_textures/material/gem.png"
                        alt="Material"
                      />
                      <h5>Material</h5>
                    </section>
                  </div>
                </CSSTransition>
              </section>

              {/* ADVANCED FILTERS */}
              <section
                className={`item_inner_filtering_section_container item_inner_filtering_section_container_advanced${
                  filters.type.length === 0 ? " disabled_type" : ""
                }`}
              >
                <div
                  className="flex align-center space-between pB-1"
                  onClick={() => toggleFilter("advanced")}
                  style={{
                    cursor:
                      filters.type.length === 0 ? "not-allowed" : "pointer",
                    opacity: filters.type.length === 0 ? 0.5 : 1,
                  }}
                >
                  <h6>Advanced Options</h6>
                  <p
                    style={{
                      fontSize: "var(--font-size-small)",
                      color: "gray",
                    }}
                  >
                    (Please, select type filtering)
                  </p>
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    className={`filtering_arrow ${
                      filterVisibility.advanced ? "rotated" : ""
                    }`}
                  />
                </div>
                {/* Attack speed */}
                <CSSTransition
                  in={
                    filterVisibility.advanced && filters.type.includes("weapon")
                  }
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div
                    onClick={() => {
                      // Toggle the visibility of armour filters
                      toggleFilter("attackSpeed");
                    }}
                  >
                    <section className="item_inner_filtering_section_grid advanced_filtering_toggleing">
                      <label className="pB-05">Attack Speed</label>{" "}
                      <FontAwesomeIcon
                        icon={faCaretUp}
                        className={`filtering_arrow ${
                          filterVisibility.attackSpeed ? "rotated" : ""
                        }`}
                      />
                    </section>
                    {filterVisibility.attackSpeed && filters.attackSpeed && (
                      // Show submenu if it’s visible or any armour type is selected
                      <div className="item_inner_filtering_section_grid">
                        <section
                          className={
                            filters.attackSpeed.includes("super_slow")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            toggleFilterSelection("attackSpeed", "super_slow")
                          }
                        >
                          <img src={slowAttackSpeed} alt="attack_speed" />{" "}
                          <h5>Super slow</h5>
                        </section>{" "}
                        <section
                          className={
                            filters.attackSpeed.includes("very_slow")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            toggleFilterSelection("attackSpeed", "very_slow")
                          }
                        >
                          <img src={slowAttackSpeed} alt="attack_speed" />{" "}
                          <h5>Very slow</h5>
                        </section>{" "}
                        <section
                          className={
                            filters.attackSpeed.includes("slow")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            toggleFilterSelection("attackSpeed", "slow")
                          }
                        >
                          <img src={slowAttackSpeed} alt="attack_speed" />{" "}
                          <h5>Slow</h5>
                        </section>{" "}
                        <section
                          className={
                            filters.attackSpeed.includes("normal")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            toggleFilterSelection("attackSpeed", "normal")
                          }
                        >
                          <img src={mediumAttackSpeed} alt="attack_speed" />{" "}
                          <h5>Normal</h5>
                        </section>{" "}
                        <section
                          className={
                            filters.attackSpeed.includes("fast")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            toggleFilterSelection("attackSpeed", "fast")
                          }
                        >
                          <img src={fastAttackSpeed} alt="attack_speed" />{" "}
                          <h5>Fast</h5>
                        </section>{" "}
                        <section
                          className={
                            filters.attackSpeed.includes("very_fast")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            toggleFilterSelection("attackSpeed", "very_fast")
                          }
                        >
                          <img src={fastAttackSpeed} alt="attack_speed" />{" "}
                          <h5>Very fast</h5>
                        </section>{" "}
                        <section
                          className={
                            filters.attackSpeed.includes("super_fast")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            toggleFilterSelection("attackSpeed", "super_fast")
                          }
                        >
                          <img src={fastAttackSpeed} alt="attack_speed" />{" "}
                          <h5>Super fast</h5>
                        </section>{" "}
                      </div>
                    )}{" "}
                  </div>
                </CSSTransition>
                {/* Weapon types */}
                <CSSTransition
                  in={
                    filterVisibility.advanced &&
                    (filters.type.includes("weapon") ||
                      filters.type.includes("spear") ||
                      filters.type.includes("dagger") ||
                      filters.type.includes("bow") ||
                      filters.type.includes("wand") ||
                      filters.type.includes("relic"))
                  }
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div
                    onClick={() => {
                      // Toggle the visibility of accessory filters
                      toggleFilter("weapon");
                    }}
                  >
                    <section className="item_inner_filtering_section_grid advanced_filtering_toggleing">
                      <label className="pB-05">Weapon Types</label>{" "}
                      <FontAwesomeIcon
                        icon={faCaretUp}
                        className={`filtering_arrow ${
                          filterVisibility.weapon ? "rotated" : ""
                        }`}
                      />
                    </section>
                    {((filterVisibility.weapon && // Keep the submenu open if it's visible or any subtype is selected
                      filters.type.includes("weapon")) ||
                      filters.type.includes("spear") ||
                      filters.type.includes("dagger") ||
                      filters.type.includes("bow") ||
                      filters.type.includes("wand") |
                        filters.type.includes("relic")) && (
                      <div className="item_inner_filtering_section_grid">
                        <section
                          className={
                            filters.type.includes("spear")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("spear")}
                        >
                          <img
                            src="/Assests_components/game_textures/accessory/necklace.png"
                            alt="necklace"
                          />
                          <h5>Spear</h5>
                        </section>
                      </div>
                    )}
                  </div>
                </CSSTransition>
                {/* Armour types */}
                <CSSTransition
                  in={
                    (filterVisibility.advanced &&
                      filters.type.includes("armour")) ||
                    filters.type.includes("helmet") ||
                    filters.type.includes("chestplate") ||
                    filters.type.includes("leggings") ||
                    filters.type.includes("boots")
                  }
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div
                    onClick={() => {
                      // Toggle the visibility of armour filters
                      toggleFilter("armour");
                    }}
                  >
                    <section className="item_inner_filtering_section_grid advanced_filtering_toggleing">
                      <label className="pB-05">Armour Types</label>{" "}
                      <FontAwesomeIcon
                        icon={faCaretUp}
                        className={`filtering_arrow ${
                          filterVisibility.armour ? "rotated" : ""
                        }`}
                      />
                    </section>
                    {((filterVisibility.armour && // Show submenu if it’s visible or any armour type is selected
                      filters.type.includes("armour")) ||
                      filters.type.includes("helmet") ||
                      filters.type.includes("chestplate") ||
                      filters.type.includes("leggings") ||
                      filters.type.includes("boots")) && (
                      <div className="item_inner_filtering_section_grid">
                        <section
                          className={
                            filters.type.includes("helmet")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("helmet")}
                        >
                          <img
                            src="/Assests_components/game_textures/armour/diamond/helmet.webp"
                            alt="Helmet"
                          />
                          <h5>Helmet</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("chestplate")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("chestplate")}
                        >
                          <img
                            src="/Assests_components/game_textures/armour/diamond/chestplate.webp"
                            alt="Chestplate"
                          />
                          <h5>Chestplate</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("leggings")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("leggings")}
                        >
                          <img
                            src="/Assests_components/game_textures/armour/diamond/leggings.webp"
                            alt="Leggings"
                          />
                          <h5>Leggings</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("boots")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("boots")}
                        >
                          <img
                            src="/Assests_components/game_textures/armour/diamond/boots.webp"
                            alt="Boots"
                          />
                          <h5>Boots</h5>
                        </section>
                      </div>
                    )}
                  </div>
                </CSSTransition>
                {/* Accessory types */}
                <CSSTransition
                  in={
                    // Keep the menu open if "accessory" or any of its subtypes (necklace, ring, bracelet) are active
                    filterVisibility.advanced &&
                    (filters.type.includes("accessory") ||
                      filters.type.includes("bracelet") ||
                      filters.type.includes("ring") ||
                      filters.type.includes("necklace"))
                  }
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div
                    onClick={() => {
                      // Toggle the visibility of accessory filters
                      toggleFilter("accessory");
                    }}
                  >
                    <section className="item_inner_filtering_section_grid advanced_filtering_toggleing">
                      <label className="pB-05">Accessory Types</label>{" "}
                      <FontAwesomeIcon
                        icon={faCaretUp}
                        className={`filtering_arrow ${
                          filterVisibility.accessory ? "rotated" : ""
                        }`}
                      />
                    </section>
                    {((filterVisibility.accessory && // Keep the submenu open if it's visible or any subtype is selected
                      filters.type.includes("accessory")) ||
                      filters.type.includes("bracelet") ||
                      filters.type.includes("ring") ||
                      filters.type.includes("necklace")) && (
                      <div className="item_inner_filtering_section_grid">
                        <section
                          className={
                            filters.type.includes("necklace")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("necklace")}
                        >
                          <img
                            src="/Assests_components/game_textures/accessory/necklace.png"
                            alt="necklace"
                          />
                          <h5>Necklace</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("ring")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("ring")}
                        >
                          <img
                            src="/Assests_components/game_textures/accessory/ring.png"
                            alt="ring"
                          />
                          <h5>Ring</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("bracelet")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("bracelet")}
                        >
                          <img
                            src="/Assests_components/game_textures/accessory/bracelet.png"
                            alt="bracelet"
                          />
                          <h5>Bracelet</h5>
                        </section>
                      </div>
                    )}
                  </div>
                </CSSTransition>
                {/* Tomes types */}
                <CSSTransition
                  in={
                    (filterVisibility.advanced &&
                      filters.type.includes("tome")) ||
                    filters.type.includes("weaponTome") ||
                    filters.type.includes("armourTome") ||
                    filters.type.includes("guildTome") ||
                    filters.type.includes("expertiseTome") ||
                    filters.type.includes("mysticismTome") ||
                    filters.type.includes("marathonTome") ||
                    filters.type.includes("lootrunTome")
                  }
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div
                    onClick={() => {
                      // Toggle the visibility of tome filters
                      toggleFilter("tomes");
                    }}
                  >
                    <section className="item_inner_filtering_section_grid advanced_filtering_toggleing">
                      <label className="pB-05">Tome Types</label>{" "}
                      <FontAwesomeIcon
                        icon={faCaretUp}
                        className={`filtering_arrow ${
                          filterVisibility.tomes ? "rotated" : ""
                        }`}
                      />
                    </section>
                    {(filterVisibility.tomes ||
                      filters.type.some((t) =>
                        [
                          "weaponTome",
                          "armourTome",
                          "guildTome",
                          "expertiseTome",
                          "mysticismTome",
                          "marathonTome",
                          "lootrunTome",
                        ].includes(t)
                      )) && (
                      <div className="item_inner_filtering_section_grid">
                        <section
                          className={
                            filters.type.includes("weaponTome")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("weaponTome")}
                        >
                          <img
                            src="/Assests_components/game_textures/tome/tome.png"
                            alt="tome"
                          />
                          <h5>Weapon Tome</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("armourTome")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("armourTome")}
                        >
                          <img
                            src="/Assests_components/game_textures/tome/tome.png"
                            alt="tome"
                          />
                          <h5>Armour Tome</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("guildTome")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("guildTome")}
                        >
                          <img
                            src="/Assests_components/game_textures/tome/tome.png"
                            alt="tome"
                          />
                          <h5>Guild Tome</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("expertiseTome")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleTypeFilterSwitch("expertiseTome")
                          }
                        >
                          <img
                            src="/Assests_components/game_textures/tome/tome.png"
                            alt="tome"
                          />
                          <h5>Expertise Tome</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("mysticismTome")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleTypeFilterSwitch("mysticismTome")
                          }
                        >
                          <img
                            src="/Assests_components/game_textures/tome/tome.png"
                            alt="tome"
                          />
                          <h5>Mysticism Tome</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("marathonTome")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("marathonTome")}
                        >
                          <img
                            src="/Assests_components/game_textures/tome/tome.png"
                            alt="tome"
                          />
                          <h5>Marathon Tome</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("lootrunTome")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("lootrunTome")}
                        >
                          <img
                            src="/Assests_components/game_textures/tome/tome.png"
                            alt="tome"
                          />
                          <h5>Lootrun Tome</h5>
                        </section>
                      </div>
                    )}
                  </div>
                </CSSTransition>
                {/* Tools types */}
                <CSSTransition
                  in={
                    (filterVisibility.advanced &&
                      filters.type.includes("tool")) ||
                    filters.type.includes("pickaxe") ||
                    filters.type.includes("axe") ||
                    filters.type.includes("scythe") ||
                    filters.type.includes("rod")
                  }
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div
                    onClick={() => {
                      // Toggle the visibility of tool filters
                      toggleFilter("tools");
                    }}
                  >
                    <section className="item_inner_filtering_section_grid advanced_filtering_toggleing">
                      <label className="pB-05">Tool Types</label>{" "}
                      <FontAwesomeIcon
                        icon={faCaretUp}
                        className={`filtering_arrow ${
                          filterVisibility.tools ? "rotated" : ""
                        }`}
                      />
                    </section>
                    {((filterVisibility.tools &&
                      filters.type.includes("tool")) ||
                      filters.type.includes("pickaxe") ||
                      filters.type.includes("axe") ||
                      filters.type.includes("rod") ||
                      filters.type.includes("scythe")) && (
                      <div className="item_inner_filtering_section_grid">
                        <section
                          className={
                            filters.type.includes("axe")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("axe")}
                        >
                          <img
                            src="/Assests_components/game_textures/tool/axe.png"
                            alt="axe"
                          />
                          <h5>Gathering Axe</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("pickaxe")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("pickaxe")}
                        >
                          <img
                            src="/Assests_components/game_textures/tool/pickaxe.png"
                            alt="pickaxe"
                          />
                          <h5>Gathering Pickaxe</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("rod")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("rod")}
                        >
                          <img
                            src="/Assests_components/game_textures/tool/rod.png"
                            alt="rod"
                          />
                          <h5>Fishing Rod</h5>
                        </section>
                        <section
                          className={
                            filters.type.includes("scythe")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleTypeFilterSwitch("scythe")}
                        >
                          <img
                            src="/Assests_components/game_textures/tool/scythe.png"
                            alt="scythe"
                          />
                          <h5>Gathering Scythe</h5>
                        </section>
                      </div>
                    )}
                  </div>
                </CSSTransition>
                {/* Crafting types */}
                <CSSTransition
                  in={
                    (filterVisibility.advanced &&
                      filters.type.includes("ingredient")) ||
                    filters.type.includes("weaponsmithing") ||
                    filters.type.includes("woodworking") ||
                    filters.type.includes("alchemism") ||
                    filters.type.includes("armouring") ||
                    filters.type.includes("cooking") ||
                    filters.type.includes("jeweling") ||
                    filters.type.includes("scribing") ||
                    filters.type.includes("tailoring")
                  }
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div onClick={() => toggleFilter("crafting")}>
                    <section className="item_inner_filtering_section_grid advanced_filtering_toggleing">
                      <label className="pB-05">Crafting Types</label>{" "}
                      <FontAwesomeIcon
                        icon={faCaretUp}
                        className={`filtering_arrow ${
                          filterVisibility.crafting ? "rotated" : ""
                        }`}
                      />
                    </section>
                    {((filterVisibility.crafting &&
                      filters.type.includes("ingredient")) ||
                      filters.professions?.includes("weaponsmithing") ||
                      filters.professions?.includes("woodworking") ||
                      filters.professions?.includes("alchemism") ||
                      filters.professions?.includes("armouring") ||
                      filters.professions?.includes("cooking") ||
                      filters.professions?.includes("jeweling") ||
                      filters.professions?.includes("scribing") ||
                      filters.professions?.includes("tailoring")) && (
                      <div className="item_inner_filtering_section_grid item_inner_filtering_section_grid_bigger">
                        <section
                          className={
                            filters.professions?.includes("alchemism")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleProfessionFilterSwitch("alchemism")
                          }
                        >
                          <img
                            src="/Assests_components/professions/alchemism.webp"
                            alt="alchemism"
                          />
                          <h5>Alchemism</h5>
                        </section>

                        <section
                          className={
                            filters.professions?.includes("armouring")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleProfessionFilterSwitch("armouring")
                          }
                        >
                          <img
                            src="/Assests_components/professions/armouring.webp"
                            alt="armouring"
                          />
                          <h5>Armouring</h5>
                        </section>

                        <section
                          className={
                            filters.professions?.includes("cooking")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleProfessionFilterSwitch("cooking")
                          }
                        >
                          <img
                            src="/Assests_components/professions/cooking.webp"
                            alt="cooking"
                          />
                          <h5>Cooking</h5>
                        </section>

                        <section
                          className={
                            filters.professions?.includes("jeweling")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleProfessionFilterSwitch("jeweling")
                          }
                        >
                          <img
                            src="/Assests_components/professions/jeweling.webp"
                            alt="jeweling"
                          />
                          <h5>Jeweling</h5>
                        </section>

                        <section
                          className={
                            filters.professions?.includes("scribing")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleProfessionFilterSwitch("scribing")
                          }
                        >
                          <img
                            src="/Assests_components/professions/scribing.webp"
                            alt="scribing"
                          />
                          <h5>Scribing</h5>
                        </section>

                        <section
                          className={
                            filters.professions?.includes("tailoring")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleProfessionFilterSwitch("tailoring")
                          }
                        >
                          <img
                            src="/Assests_components/professions/tailoring.webp"
                            alt="tailoring"
                          />
                          <h5>Tailoring</h5>
                        </section>

                        <section
                          className={
                            filters.professions?.includes("weaponsmithing")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleProfessionFilterSwitch("weaponsmithing")
                          }
                        >
                          <img
                            src="/Assests_components/professions/weaponsmithing.webp"
                            alt="weaponsmithing"
                          />
                          <h5>Weaponsmithing</h5>
                        </section>

                        <section
                          className={
                            filters.professions?.includes("woodworking")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleProfessionFilterSwitch("woodworking")
                          }
                        >
                          <img
                            src="/Assests_components/professions/woodworking.webp"
                            alt="woodworking"
                          />
                          <h5>Woodworking</h5>
                        </section>
                      </div>
                    )}{" "}
                  </div>
                </CSSTransition>
                {/* Gathering types */}
                <CSSTransition
                  in={
                    (filterVisibility.advanced &&
                      filters.type.includes("material")) ||
                    filters.professions.includes("mining") ||
                    filters.professions.includes("fishing") ||
                    filters.professions.includes("farming") ||
                    filters.professions.includes("woodcutting")
                  }
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div onClick={() => toggleFilter("gathering")}>
                    <section className="item_inner_filtering_section_grid advanced_filtering_toggleing">
                      <label className="pB-05">Gathering Types</label>{" "}
                      <FontAwesomeIcon
                        icon={faCaretUp}
                        className={`filtering_arrow ${
                          filterVisibility.gathering ? "rotated" : ""
                        }`}
                      />
                    </section>
                    {((filterVisibility.gathering &&
                      filters.type.includes("material")) ||
                      filters.professions?.includes("mining") ||
                      filters.professions?.includes("fishing") ||
                      filters.professions?.includes("farming") ||
                      filters.professions?.includes("woodcutting")) && (
                      <div className="item_inner_filtering_section_grid">
                        <section
                          className={
                            filters.professions?.includes("mining")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() => handleProfessionFilterSwitch("mining")}
                        >
                          <img
                            src="/Assests_components/professions/mining.webp"
                            alt="mining"
                          />
                          <h5>Mining</h5>
                        </section>

                        <section
                          className={
                            filters.professions?.includes("fishing")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleProfessionFilterSwitch("fishing")
                          }
                        >
                          <img
                            src="/Assests_components/professions/fishing.webp"
                            alt="fishing"
                          />
                          <h5>Fishing</h5>
                        </section>

                        <section
                          className={
                            filters.professions?.includes("farming")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleProfessionFilterSwitch("farming")
                          }
                        >
                          <img
                            src="/Assests_components/professions/farming.webp"
                            alt="farming"
                          />
                          <h5>Farming</h5>
                        </section>

                        <section
                          className={
                            filters.professions?.includes("woodcutting")
                              ? "typeFilterIsActive"
                              : ""
                          }
                          onClick={() =>
                            handleProfessionFilterSwitch("woodcutting")
                          }
                        >
                          <img
                            src="/Assests_components/professions/woodcutting.webp"
                            alt="woodcutting"
                          />
                          <h5>Woodcutting</h5>
                        </section>
                      </div>
                    )}{" "}
                  </div>
                </CSSTransition>
              </section>

              {/* RARITY FILTER */}
              <section className="item_inner_filtering_section_container">
                <div
                  className="flex space-between pB-1"
                  onClick={() => toggleFilter("rarity")}
                >
                  <h6>Rarity</h6>
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    className={`filtering_arrow ${
                      filterVisibility.rarity ? "rotated" : ""
                    }`}
                  />{" "}
                </div>

                <CSSTransition
                  in={filterVisibility.rarity}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div className="item_inner_filtering_section_grid">
                    {[
                      { name: "Common", label: "Normal" },
                      { name: "Unique", color: "var(--color-unique)" },
                      { name: "Rare", color: "var(--color-rare)" },
                      { name: "Legendary", color: "var(--color-legendary)" },
                      { name: "Fabled", color: "var(--color-fabled)" },
                      { name: "Set", color: "var(--color-set)" },
                      { name: "Mythic", color: "var(--color-mythic)" },
                    ].map(({ name, label, color }) => (
                      <section
                        key={name}
                        className={
                          filters.tier.includes(name)
                            ? "typeFilterIsActive"
                            : ""
                        }
                        onClick={() => toggleFilterOption("tier", name)}
                      >
                        <FontAwesomeIcon
                          icon={faCircle}
                          style={color ? { color } : {}}
                        />
                        <h5>{label || name}</h5>
                      </section>
                    ))}
                  </div>
                </CSSTransition>
              </section>

              {/* LEVEL FILTER */}
              <section className="item_inner_filtering_section_container">
                <div
                  className="flex space-between"
                  onClick={() => toggleFilter("level")}
                >
                  <h6>Level range</h6>
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    className={`filtering_arrow ${
                      filterVisibility.level ? "rotated" : ""
                    }`}
                  />
                </div>{" "}
                <CSSTransition
                  in={filterVisibility.level}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div className="item_inner_filtering_section_grid"></div>
                </CSSTransition>
              </section>

              {/* IDENTIFICATIONS FILTER */}
              <section className="item_inner_filtering_section_container">
                <div
                  className="flex space-between"
                  onClick={() => toggleFilter("identifications")}
                >
                  <h6>identifications</h6>
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    className={`filtering_arrow ${
                      filterVisibility.identifications ? "rotated" : ""
                    }`}
                  />
                </div>{" "}
                <CSSTransition
                  in={filterVisibility.identifications}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div className="item_inner_filtering_section_grid"></div>
                </CSSTransition>
              </section>

              <br></br>
            </div>
          </div>

          <div className="item_inner_options">
            <button
              onClick={() => {
                /* RESETING FILTERS */
                setFilters((prevFilters) => {
                  return {
                    ...prevFilters,
                    type: [],
                    tier: [],
                    rarity: [],
                    attackSpeed: [],
                    levelRange: [],
                    professions: [],
                    identifications: [],
                    majorIds: [],
                  };
                });
              }}
            >
              RESET FILTERS
            </button>
            <button>APPLY FILTERS</button>
          </div>
        </section>

        <section className="items_inner_conainer items_item_database">
          <h5>Results</h5>
          <div className="item_database_results">
            {fetchedItems && Object.keys(fetchedItems).length > 0 ? (
              Object.entries(fetchedItems).map(([key, item]) => {
                const imagePathArmour = `../Assests_components/game_textures/${item.type}/${item.armourMaterial}/${item.armourType}.webp`;
                const imagePathWeapon = `../Assests_components/game_textures/${item.type}/${item.weaponType}.png`;
                const imagePathAccessory = `../Assests_components/game_textures/${item.type}/${item.accessoryType}.png`;
                const imagePathTome = `../Assests_components/game_textures/${item.type}/tome.png`;
                const imagePathIngredient = `../Assests_components/game_textures/${item.type}/ingredient.png`;
                const imagePathTools = `../Assests_components/game_textures/${item.type}/${item.toolType}.png`;

                /* GETTING IMAGES FOR MATERIALS */
                const materials = [
                  "gem",
                  "grain",
                  "ingot",
                  "meat",
                  "oil",
                  "paper",
                  "string",
                  "wood",
                ];
                function getMaterialImagePath(item) {
                  const itemName = item.internalName.toLowerCase(); // Normalize for comparison
                  const foundMaterial = materials.find((material) =>
                    itemName.includes(material)
                  );
                  if (foundMaterial) {
                    console.log();
                    return `../Assests_components/game_textures/material/${foundMaterial}.png`;
                  }
                }

                return (
                  <div key={key} className="item_database_results_output_item ">
                    {/* IMG, TITLE AND SUB CONTENT */}
                    <section
                      style={{ margin: "0 auto" }}
                      className="item_database_stats_title item_database_fit_height"
                    >
                      <section className="item_database_img">
                        {item.armourType && (
                          <img
                            src={imagePathArmour}
                            alt="Armour"
                            className="item_database_icon"
                            style={getRarityStyle(item.rarity)}
                          />
                        )}{" "}
                        {item.weaponType && (
                          <img
                            src={imagePathWeapon}
                            alt="Weapon"
                            className="item_database_icon"
                            style={getRarityStyle(item.rarity)}
                          />
                        )}{" "}
                        {item.accessoryType && (
                          <img
                            src={imagePathAccessory}
                            alt="Accessory"
                            className="item_database_icon"
                            style={getRarityStyle(item.rarity)}
                          />
                        )}
                        {item.type === "material" && (
                          <img
                            src={getMaterialImagePath(item)}
                            alt="material"
                            className="item_database_icon"
                            style={getRarityStyleMaterials(item.tier)}
                          ></img>
                        )}{" "}
                        {item.type === "tool" && (
                          <img
                            src={imagePathTools}
                            alt="tool"
                            className="item_database_icon"
                            style={getRarityStyle(item.rarity)}
                          ></img>
                        )}
                        {item.type === "ingredient" && (
                          <img
                            src={imagePathIngredient}
                            alt="ingredient"
                            className="item_database_icon"
                            style={getRarityStyle(item.rarity)}
                          ></img>
                        )}
                        {item.type === "tome" && (
                          <img
                            src={imagePathTome}
                            alt="tome"
                            className="item_database_icon"
                            style={getRarityStyle(item.rarity)}
                          ></img>
                        )}
                      </section>
                      <br></br>
                      {/* ITEM NAME */}
                      <section
                        className="flex-center gap-05"
                        style={{ paddingBottom: "0.5rem" }}
                      >
                        {" "}
                        <h4
                          key={key}
                          style={{
                            color: getRarityColor(item.rarity),
                          }}
                        >
                          {/* REMOVING TIERS (NUMBERS) */}
                          {item.type === "material"
                            ? item.internalName
                                .split(" ")
                                .slice(0, -1)
                                .join(" ")
                            : item.internalName || key}{" "}
                        </h4>
                        <div className="flex-center">
                          {" "}
                          {item.tier === 1 && (
                            <div className="flex-center">
                              <h4>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "#fcfc54" }}
                                />{" "}
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "gray" }}
                                />
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "gray" }}
                                />
                              </h4>
                            </div>
                          )}{" "}
                          {item.tier === 2 && (
                            <div className="flex-center">
                              <h4>
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "#fcfc54" }}
                                />
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "#fcfc54" }}
                                />
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "gray" }}
                                />
                              </h4>
                            </div>
                          )}{" "}
                          {item.tier === 3 && (
                            <div className="flex-center">
                              <h4>
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "#fcfc54" }}
                                />
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "#fcfc54" }}
                                />
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "#fcfc54" }}
                                />
                              </h4>
                            </div>
                          )}
                        </div>
                      </section>
                      {/* SUB TITLE */}
                      {(item.attackSpeed ||
                        item.tomeType ||
                        item.type === "charm" ||
                        item.toolType ||
                        item.type === "material" ||
                        item.type === "ingredient") && (
                        <section
                          className="item_database_sub_title"
                          style={{
                            color: "var(--color-describe)",
                            textAlign: "center",
                          }}
                        >
                          {item.attackSpeed &&
                            `${formatItems(item.attackSpeed)} Attack Speed`}
                          {item.tomeType && `${formatItems(item.tomeType)}`}
                          {item.type === "charm" && "Charm"}
                          {item.toolType &&
                            `${
                              item.toolType === "rod"
                                ? "Fishing Rod"
                                : formatItems(item.toolType)
                            }`}
                          {item.type === "material" && "Crafting Material"}
                          {item.type === "ingredient" && "Crafting Ingredient"}
                        </section>
                      )}
                    </section>
                    {/* DAMAGE, REQUIREMENTS, BASE  */}
                    <section className="item_database_stats_damage item_database_fit_height">
                      {/* CHARM SPECIAL */}
                      {item.type === "charm" && (
                        <div className="charm_item">
                          {/* LVL MIN */}
                          {item.requirements.level && (
                            <strong
                              style={{ color: "var(--color-describe-dark)" }}
                            >
                              Lvl. Min:
                              <span style={{ color: "var(--color-describe)" }}>
                                {" "}
                                {item.requirements.level}
                              </span>
                            </strong>
                          )}
                          <br></br>
                          <br></br>
                          {/* BASE STATS */}
                          {item.base && (
                            <div style={{ color: "var(--color-describe)" }}>
                              {item.base.leveledXpBonus && (
                                <p style={{ color: "var(--color-describe)" }}>
                                  <span style={{ color: "var(--color-set)" }}>
                                    {" "}
                                    +{item.base.leveledXpBonus.min}% to +
                                    {item.base.leveledXpBonus.max}%{" "}
                                  </span>
                                  XP from Lvl.{" "}
                                  {item.requirements.levelRange.min}-
                                  {item.requirements.levelRange.max} content
                                </p>
                              )}

                              {item.base.damageFromMobs && (
                                <p style={{ color: "var(--color-describe)" }}>
                                  <span
                                    style={{ color: "var(--color-fabled)" }}
                                  >
                                    +{item.base.damageFromMobs.min}% to +
                                    {item.base.damageFromMobs.max}%{" "}
                                  </span>
                                  Damage taken from mobs
                                </p>
                              )}

                              {item.base.leveledLootBonus && (
                                <p style={{ color: "var(--color-describe)" }}>
                                  <span style={{ color: "var(--color-set)" }}>
                                    {" "}
                                    +{item.base.leveledLootBonus.min}% to +
                                    {item.base.leveledLootBonus.max}%{" "}
                                  </span>
                                  Loot from Lvl.{" "}
                                  {item.requirements.levelRange.min}-
                                  {item.requirements.levelRange.max} content
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/*  */}
                      {item.base && item.type !== "charm" && (
                        <div className="item_base">
                          {Object.entries(item.base).map(([key, value]) => {
                            // Handle Neutral Damage separately
                            if (key === "baseDamage") {
                              return (
                                <div key={key} className="item_base_stat">
                                  <p
                                    style={{
                                      color: damageColors["Neutral"],
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faSlack} /> Neutral
                                    Damage: {value.min} - {value.max}
                                  </p>
                                </div>
                              );
                            }
                            if (key === "baseHealth") {
                              return (
                                <div key={key} className="item_base_stat">
                                  <p style={{ color: "darkRed" }}>
                                    <FontAwesomeIcon icon={faHeart} /> Health:{" "}
                                    {value}
                                  </p>
                                </div>
                              );
                            }
                            // Handle base elemental damage attributes (Earth, Fire, etc.)
                            const elementalDamageKeys = [
                              "baseEarthDamage",
                              "baseWaterDamage",
                              "baseThunderDamage",
                              "baseFireDamage",
                              "baseAirDamage",
                              "baseEarthDefence",
                              "baseWaterDefence",
                              "baseThunderDefence",
                              "baseFireDefence",
                              "baseAirDefence",
                            ];

                            if (elementalDamageKeys.includes(key)) {
                              // Remove "base" prefix (e.g., "baseEarthDamage" → "Earth Damage")
                              const formattedKey = key
                                .replace(/^base/, "")
                                .replace(/([a-z])([A-Z])/g, "$1 $2");

                              // Extract only the elemental part ("Earth" from "Earth Damage")
                              const element = formattedKey.split(" ")[0];

                              // Ensure capitalization for correct key lookup
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
                                    {/* Ensure the icon is found before rendering */}
                                    {damageIcons[capitalizedElement] && (
                                      <span className="item_base_stat_dmg">
                                        <FontAwesomeIcon
                                          icon={damageIcons[capitalizedElement]}
                                          style={{
                                            marginRight: "5px",
                                            color:
                                              damageColors[capitalizedElement],
                                          }}
                                        />
                                      </span>
                                    )}
                                    {typeof value === "object" && value !== null
                                      ? `${formattedKey}: ${value.min} - ${value.max}` // Damage fix
                                      : `${formattedKey}: ${value}`}
                                  </p>
                                </div>
                              );
                            }

                            // For other base attributes (e.g., armor), just display the value without special formatting
                            const formattedKey = key
                              .replace(/^base/, "")
                              .replace(/([a-z])([A-Z])/g, "$1 $2");

                            return (
                              <div key={key} className="item_base_stat">
                                <p>
                                  {formattedKey}:
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
                      <br></br>

                      {/*  */}
                      <section className="item_database_stats_requirements">
                        {item.type !== "ingredient" &&
                          item.requirements &&
                          item.type !== "charm" && (
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
                                  return (
                                    order.indexOf(keyA) - order.indexOf(keyB)
                                  );
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
                                    key === "classRequirement" &&
                                    classNames[value]
                                      ? classNames[value]
                                      : value;

                                  return (
                                    <div key={key} className="requirement_item">
                                      <strong
                                        style={{
                                          color: "var(--color-describe-dark)",
                                        }}
                                      >
                                        {key === "classRequirement" &&
                                          "Class Req:"}
                                        {key === "quest" && "Quest Req:"}
                                        {key === "level" && "Lvl. Min:"}
                                        {key === "strength" && "Strength Min:"}
                                        {key === "dexterity" &&
                                          "Dexterity Min:"}
                                        {key === "intelligence" &&
                                          "Intelligence Min:"}
                                        {key === "defence" && "Defence Min:"}
                                        {key === "agility" && "Agility Min:"}
                                      </strong>{" "}
                                      <span
                                        style={{
                                          color: "var(--color-describe)",
                                        }}
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
                                      Crafting Lv. Min:{" "}
                                      {item.requirements.level}
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
                    </section>{" "}
                    {/* requirements */}
                    {/* IDENTIFICATIONS RAW STATS*/}
                    {item.identifications && (
                      <section className="item_database_stats_identifications item_database_fit_height">
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
                                rawIntelligence: "Intelligence",
                                spellDamage: "Spell Damage",
                                thunderDamage: "Thunder Damage",
                                waterDamage: "Water Damage",
                                baseWaterDefence: "Water Defence",
                                baseAirDefence: "Air Defence",
                                agility: "Agility",
                                mainAttackDamage: "Main Attack Damage",
                                rawMainAttackDamage: "Main Attack Damage",
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
                                      style={{
                                        color: "var(--color-describe)",
                                      }}
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
                    )}
                    {/* ITEM GUIDE FOR MATERIALS */}{" "}
                    {item.type === "material" && (
                      <section className="material_info">
                        <p style={{ color: "var(--color-describe)" }}>
                          {getMaterialDescription(getMaterialType(item))}
                        </p>
                      </section>
                    )}
                    {/* BOTTOM */}
                    <section className="item_database_stats_bottom item_database_fit_height">
                      {" "}
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
                        {item.type === "charm" && (
                          <p style={{ color: "var(--color-fabled)" }}>
                            Fabled Raid Reward
                          </p>
                        )}
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
                    </section>
                  </div>
                );
              })
            ) : (
              <p>No items found</p>
            )}
          </div>
        </section>
      </div>{" "}
    </div>
  );
};

export default ItemsComponent;
