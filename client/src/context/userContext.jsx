import { createContext, useContext, useState } from "react";
import API from "../API/API.mjs";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

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
    <UserContext.Provider
      value={{ user, setUser, loggedIn, setLoggedIn, handleLogin }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
