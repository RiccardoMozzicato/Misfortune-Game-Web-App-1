import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router";
import "./App.css";
import DefaultLayout from "./components/DefaultLayout";
import { LoginForm } from "./components/AuthComponents";
import Homepage from "./components/Homepage";

import API from "./API/API.mjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUser } from "./context/userContext.jsx";
import NewGame from "./components/NewGame.jsx";

function App() {
  const [games, setGames] = useState([]);
  const { loggedIn, setLoggedIn, user, setUser } = useUser();

  useEffect(() => {
    if (loggedIn == false) return;
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

  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route
          path="/login"
          element={loggedIn ? <Navigate replace to="/" /> : <LoginForm />}
        />
        <Route path="/" element={<Homepage games={games} />} />
        <Route path="/new-game" element={<NewGame />} />
      </Route>
    </Routes>
  );
}

export default App;
