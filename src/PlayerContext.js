import React, { createContext, useState, useEffect, useRef } from "react";

const memCache = new Map();

const now = () => Date.now();
const norm = (s) => (s || "").trim().toLowerCase();

const getCached = (key) => {
  // 1) memory
  const m = memCache.get(key);
  if (m && m.expiresAt > now()) return m.value;

  // 2) localStorage
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.expiresAt > now()) {
      memCache.set(key, parsed);
      return parsed.value;
    }
  } catch {}
  return null;
};

const setCached = (key, value, ttlMs) => {
  const entry = { value, expiresAt: now() + ttlMs };
  memCache.set(key, entry);
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {}
};

const fetchJsonWithTTL = async (key, url, ttlMs) => {
  const cached = getCached(key);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const data = await res.json();
  setCached(key, data, ttlMs);
  return data;
};

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem("playerName") || ""; // Load from local storage
  });
  const [playerData, setPlayerData] = useState(null);
  const [extendedPlayerData, setExtendedPlayerData] = useState(null);

  const [loadingCount, setLoadingCount] = useState(0);
  const loading = loadingCount > 0;
  const [error, setError] = useState(null);
  const [guildNameProfile, setGuildNameProfile] = useState(() => {
    return localStorage.getItem("guildName") || "";
  });
  const [guildDataProfile, setGuildDataProfile] = useState({});
  const [clickedGuildPlayer, setClickedGuildPlayer] = useState(null);
  const [clickedGuild, setClickedGuild] = useState(null);
  const [clickedPlayer, setClickedPlayer] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const PLAYER_TTL = 60 * 1000;
  const PLAYER_FULL_TTL = 5 * 60 * 1000;
  const GUILD_TTL = 5 * 60 * 1000;

  const playerReqIdRef = useRef(0);
  const playerFullReqIdRef = useRef(0);
  const guildReqIdRef = useRef(0);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const beginLoading = () => setLoadingCount((c) => c + 1);
  const endLoading = () => setLoadingCount((c) => Math.max(0, c - 1));

  const fetchPlayerData = async (name) => {
    try {
      beginLoading();
      setError(null);
      const reqId = ++playerReqIdRef.current;

      const key = `cache:player:${name}`;
      const url = `https://api.wynncraft.com/v3/player/${name}`;

      const data = await fetchJsonWithTTL(key, url, PLAYER_TTL);
      if (reqId !== playerReqIdRef.current) return;
      if (data?.username) setPlayerData(data);
      else setError("Player data not found.");
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Error fetching player data.");
    } finally {
      endLoading();
    }
  };

  const fetchExtendedPlayerData = async (name) => {
    try {
      beginLoading();
      setError(null);
      const reqId = ++playerFullReqIdRef.current;

      const key = `cache:playerFull:${name}`;
      const url = `https://api.wynncraft.com/v3/player/${name}?fullResult`;

      const data = await fetchJsonWithTTL(key, url, PLAYER_FULL_TTL);
      if (reqId !== playerReqIdRef.current) return;
      if (data?.username) setExtendedPlayerData(data);
      else setError("Player data not found.");
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Error fetching player data.");
    } finally {
      endLoading();
    }
  };

  useEffect(() => {
    if (playerName) {
      fetchPlayerData(playerName);
      fetchExtendedPlayerData(playerName);
    }
  }, [playerName]);

  const fetchGuildData = async () => {
    const input = (guildNameProfile || "").trim();
    if (!input) return;

    const keyInput = norm(input);
    const reqId = ++guildReqIdRef.current;

    try {
      beginLoading();

      const byNameKey = `cache:guild:name:${keyInput}`;
      const byNameUrl = `https://api.wynncraft.com/v3/guild/${input}`;

      try {
        const data = await fetchJsonWithTTL(byNameKey, byNameUrl, GUILD_TTL);
        if (reqId !== guildReqIdRef.current) return;
        if (data?.name) return setGuildDataProfile(data);
      } catch {
        const byPrefixKey = `cache:guild:prefix:${keyInput}`;
        const byPrefixUrl = `https://api.wynncraft.com/v3/guild/prefix/${input}`;

        const data = await fetchJsonWithTTL(
          byPrefixKey,
          byPrefixUrl,
          GUILD_TTL
        );
        if (reqId !== guildReqIdRef.current) return;
        if (data?.name) return setGuildDataProfile(data);

        throw new Error("Guild data not found.");
      }
    } catch (err) {
      if (reqId !== guildReqIdRef.current) return;
      console.error("Error fetching guild data:", err);
    } finally {
      endLoading();
    }
  };

  useEffect(() => {
    if (guildNameProfile) {
      fetchGuildData();
    }
  }, [guildNameProfile]);

  return (
    <PlayerContext.Provider
      value={{
        playerName,
        setPlayerName,
        playerData,
        extendedPlayerData,
        loading,
        error,
        guildNameProfile,
        setGuildNameProfile,
        guildDataProfile,
        setGuildDataProfile,
        clickedGuildPlayer,
        setClickedGuildPlayer,
        clickedGuild,
        setClickedGuild,
        clickedPlayer,
        setClickedPlayer,
        isSettingsOpen,
        setIsSettingsOpen,
        openSettings,
        closeSettings,
        isMenuVisible,
        setIsMenuVisible,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
