import React, { createContext, useContext, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
  // Stato del gioco centralizzato
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(null);
  const [gameCards, setGameCards] = useState([]);
  const [roundCards, setRoundCards] = useState([]);
  const [initialCards, setInitialCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [roundState, setRoundState] = useState(0);
  const [roundLost, setRoundLost] = useState(0);
  const [gameId, setGameId] = useState(null);
  const [roundId, setRoundId] = useState(null);
  const [timerState, setTimerState] = useState(false);
  const [error, setError] = useState("");
  const [roundResult, setRoundResult] = useState(null);

  return (
    <GameContext.Provider
      value={{
        gameStarted,
        setGameStarted,
        gameFinished,
        setGameFinished,
        gameCards,
        setGameCards,
        roundCards,
        setRoundCards,
        initialCards,
        setInitialCards,
        currentCard,
        setCurrentCard,
        roundState,
        setRoundState,
        roundLost,
        setRoundLost,
        gameId,
        setGameId,
        roundId,
        setRoundId,
        timerState,
        setTimerState,
        error,
        setError,
        roundResult,
        setRoundResult,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
