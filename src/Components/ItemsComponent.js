import React, { useState, useEffect, useContext, useCallback } from "react";

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
      const response = await fetch(
        `https://api.wynncraft.com/v3/item/search/${debouncedSearchInput}?fullResult`
      );
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
      console.log("SEARCHED FOR: ", debouncedSearchInput);
      console.log("FETCHED ITEMS: ", fetchedItems);
    } catch (error) {
      console.error("Error during item fetch:", error);
    }
  }, [debouncedSearchInput]);

  // Fetch items whenever debouncedSearchInput changes
  useEffect(() => {
    if (debouncedSearchInput.trim() !== "") {
      fetchItems();
    }
  }, [debouncedSearchInput, fetchItems]);

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
                    <h2>{item.internalName || key}</h2>
                    <p>Type: {item.type}</p>
                    <p>Weapon Type: {item.weaponType || "N/A"}</p>
                    <p>Attack Speed: {item.attackSpeed || "N/A"}</p>
                    <p>Average DPS: {item.averageDps || "N/A"}</p>
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
