import { createContext, useContext, useState } from "react";
import API from "../API/API.mjs";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (credentials) => {
    try {
      const result = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(result);
      return user;
    } catch (err) {
      throw new Error(
        "Login failed. Please check your credentials and try again."
      );
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
