import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router";
import "./App.css";
import DefaultLayout from "./components/DefaultLayout";
import { LoginForm } from "./components/AuthComponents";
import Homepage from "./components/Homepage";

import API from "./API/API.mjs";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [games, setGames] = useState([]);
  useEffect(() => {
    if (!loggedIn) return;
    const allGames = async () => {
      const games = await API.getGames(user.username);
      setGames(games);
      console.log(games);
    };
    allGames();
  }, [user.username]);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);
      setUser(user);
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.username}!`, type: "success" });
      setUser(user);
    } catch (err) {
      setMessage({ msg: err, type: "danger" });
    }
  };

  return (
    <Routes>
      <Route element={<DefaultLayout loggedIn={loggedIn} />}>
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate replace to="/" />
            ) : (
              <LoginForm handleLogin={handleLogin} />
            )
          }
        />
        <Route path="/" element={<Homepage games={games} />} />
      </Route>
    </Routes>
  );
}

export default App;
