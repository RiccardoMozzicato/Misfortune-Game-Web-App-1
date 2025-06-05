const SERVER_URL = "http://localhost:3001";

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

const getGames = async (username) => {
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

const API = { logIn, getUserInfo, getGames };

export default API;
