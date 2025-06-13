const SERVER_URL = "http://localhost:3001";
import dayjs from "dayjs";

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies in the request
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errorDetails = await response.text();
    throw errorDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    method: "GET",
    credentials: "include", // Include cookies in the request
  });

  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    throw user;
  }
};

const getMatchHistory = async (username) => {
  const response = await fetch(`${SERVER_URL}/api/games/${username}`, {
    method: "GET",
    credentials: "include",
  });
  if (response.ok) {
    const games = await response.json();
    return games;
  } else {
    throw new Error("Failed to fetch games");
  }
};

const createGame = async (userId) => {
  const response = await fetch(`${SERVER_URL}/api/games/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    //credentials: "include",
    body: JSON.stringify({
      createdAt: dayjs().toISOString(),
      userId,
    }),
  });

  if (response.ok) {
    const game = await response.json();
    return game;
  } else {
    throw new Error("Failed to create game");
  }
};

const getAllCards = async () => {
  const response = await fetch(`${SERVER_URL}/api/cards`, {
    method: "GET",
    credentials: "include",
  });

  if (response.ok) {
    const cards = await response.json();
    return cards;
  } else {
    throw new Error("Failed to fetch initial cards");
  }
};

const startGame = async () => {
  const response = await fetch(`${SERVER_URL}/api/start-game`, {
    method: "GET",
    credentials: "include",
  });

  if (response.ok) {
    const cards = await response.json();
    console.log("Cards received from startGame:", cards);
    return cards;
  } else {
    throw new Error("Failed to fetch game cards");
  }
};

const updateGame = async (gameData) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameData.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(gameData),
  });
};

const postRound = async (roundData) => {
  console.log("Posting round data:", roundData);
  const response = await fetch(`${SERVER_URL}/api/rounds/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(roundData),
  });

  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    const errorDetails = await response.text();
    throw new Error(`Failed to post round: ${errorDetails}`);
  }
};

const compareCards = async (compareData) => {
  const response = await fetch(
    `${SERVER_URL}/api/rounds/${compareData.roundId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(compareData),
    }
  );

  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    const errorDetails = await response.text();
    throw new Error(`Failed to compare cards: ${errorDetails}`);
  }
};

const deleteGame = async (gameId) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (response.ok) {
    return true;
  } else {
    const errorDetails = await response.text();
    throw new Error(`Failed to delete game: ${errorDetails}`);
  }
};

const API = {
  logIn,
  getUserInfo,
  getMatchHistory,
  createGame,
  getAllCards,
  startGame,
  postRound,
  compareCards,
  updateGame,
  deleteGame,
};

export default API;
