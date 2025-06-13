import React, { use, useEffect } from "react";
import { useState } from "react";
import dayjs from "dayjs";
import { Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { useUser } from "../../context/userContext.jsx";
import Cards from "./Cards.jsx";
import API from "../../API/API.mjs";
import Timer from "./Timer.jsx";
import CardList from "./CardList.jsx";
import RoundState from "./RoundState.jsx";
import { Outlet } from "react-router";
import { useLocation } from "react-router";
import Recap from "./Recap.jsx";
import NewDemoGame from "./NewGame.jsx";

function NewGame() {
  const { user, loggedIn } = useUser();
  const location = useLocation();

  const [gameStarted, setGameStarted] = useState(false); // Stato per verificare se la partita è iniziata
  const [gameFinished, setGameFinished] = useState(null); // Stato della partita, se è finita o meno

  const [gameCards, setGameCards] = useState([]);
  const [roundCards, setRoundCards] = useState([]);
  const [initialCards, setInitialCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null); // Carta in gioco nel round attuale

  const [roundState, setRoundState] = useState(0); // Round della partita in frontend
  const [roundLost, setRoundLost] = useState(0); // Counter round persi

  const [gameId, setGameId] = useState(null); // ID della partita corrente nel DB
  const [roundId, setRoundId] = useState(null); // ID del round corrente nel DB

  //const [timeLeft, setTimeLeft] = useState(30);
  const [timerState, setTimerState] = useState(false); // Stato del timer, se è in esecuzione o meno
  const [error, setError] = useState("");

  const [roundResult, setRoundResult] = useState(null); // Risultato del round corrente

  // Reset dello stato del gioco quando si naviga verso /new-game da qualsiasi altra pagina
  useEffect(() => {
    if (location.pathname === "/new-game") {
      setGameStarted(false);
      setGameFinished(null);
      setGameCards([]);
      setRoundCards([]);
      setInitialCards([]);
      setCurrentCard(null);
      setRoundState(0);
      setRoundLost(0);
      setGameId(null);
      setRoundId(null);
      setTimerState(false);
      setError("");
      setRoundResult(null);
    }
  }, [location.pathname]);

  const startGame = async () => {
    let result;
    try {
      result = await API.startGame();
      setGameCards(result);
      setGameStarted(true);
      setGameId(result.gameId); // Imposto l'ID della partita
      setRoundCards(result.roundCards);
      const sortedInitialCards = result.initialCards.sort(
        (a, b) => a.misfortune_index - b.misfortune_index
      );
      setInitialCards(sortedInitialCards);
      setRoundState(1); // Imposto lo stato del round a 1 quando clicchiamo inizia partita
    } catch (err) {
      setError("Errore nel recupero delle carte dal server.");
      return;
    }
  };

  useEffect(() => {
    if (roundState > 0 && roundCards.length > 0) {
      handleNextRound();
    }
  }, [roundState]);

  const handleNextRound = () => {
    const roundCardscopy = [...roundCards];
    const card = roundCardscopy.shift();
    setRoundCards(roundCardscopy);
    setCurrentCard(card);

    // Se user è null, significa che non è loggato, quindi non possiamo procedere
    if (loggedIn) {
      postRound(card);
    } else {
      if (roundState <= 1) {
        postRound(card);
      }
    }

    setTimerState(true); // Ferma il timer all'inizio del round
  };

  const postRound = async (currentCard) => {
    let result;

    try {
      const roundData = {
        gameId: gameId,
        cardId: currentCard.id,
        won: false,
        roundNumber: roundState,
        timeStamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };

      result = await API.postRound(roundData);
      setGameCards(initialCards);
      setRoundId(result.id); // Imposto l'ID del round corrente
      setTimerState(true);
    } catch (err) {
      setError("Errore nel postare il round.");
      return;
    }
  };

  const handleCompare = async (misfortuneLeft = 0, misfortuneRight = 100) => {
    let result;
    try {
      const compareData = {
        misfortuneLeft,
        misfortuneRight,
        cardId: currentCard.id,
        roundId: roundId,
        timeStamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };
      result = await API.compareCards(compareData);
    } catch (err) {
      setError("Errore durante il confronto delle carte.");
      return;
    }

    if (result.won) {
      let cardCurrent = {
        ...currentCard,
        misfortune_index: result.misfortune_index,
      };
      initialCards.push(cardCurrent);
      const sortedInitialCards = initialCards.sort(
        (a, b) => a.misfortune_index - b.misfortune_index
      );
      setInitialCards(sortedInitialCards);
      setGameCards(initialCards);

      if (gameCards.length === 6 && roundState <= 5) {
        setGameFinished(true);
      }
    } else {
      let countRoundLost = roundLost + 1;
      setRoundLost(countRoundLost);

      if (countRoundLost >= 3) {
        setGameFinished(false);
      }
    }

    // Per utenti non loggati quindi DEMO
    if (!loggedIn) {
      if (roundState == 1) {
        if (result.won) {
          setGameFinished(true); // Se non è loggato, la partita finisce subito
        } else {
          setGameFinished(false); // Se non è loggato, la partita finisce subito
        }
      }
    }

    setRoundResult(result.won);
    setTimerState(false);
  };

  useEffect(() => {
    if (gameFinished !== null) {
      let result;
      try {
        const gameData = {
          id: gameId,
          totalCards: gameCards.length,
          outcome: gameFinished,
        };
        result = API.updateGame(gameData);
      } catch (err) {
        setError("Errore durante il caricamento della partita.");
      }
    }
  }, [gameFinished]);

  if (location.pathname === "/new-game/recap") {
    return (
      <Recap
        gameId={gameId}
        gameFinished={gameFinished}
        roundLost={roundLost}
        gameCards={gameCards}
      />
    ); // Renderizza solo Outlet se il percorso è /new-game/recap
  }

  if (gameStarted) {
    return (
      <>
        {/* Se il numero di carte è 6 e lo stato del round è minore o uguale a 5,
        significa che la partita è vinta*/}
        {gameFinished === true && <h1> Partita Vinta! </h1>}
        {gameFinished === false && <h1> Partita Persa! </h1>}

        <Container>
          <Row>
            {/* Se esiste mostra la currentCard che poi è quella in gioco per quel round */}
            Round Card:
            {currentCard && (
              <Cards
                cards={currentCard}
                // Passo roundCard == true per indicare che questa è la carta del round corrente
                roundCard={true}
              />
            )}
          </Row>
        </Container>
        <CardList
          initialCards={initialCards}
          roundResult={roundResult}
          handleCompare={handleCompare}
        />
        <Timer
          initialTime={30}
          timerState={timerState}
          onTimeUp={() => {
            setTimerState(false); // Ferma il timer
            setRoundResult(false);
          }}
        />

        <RoundState
          roundState={roundState}
          roundResult={roundResult}
          gameFinished={gameFinished}
          setRoundState={setRoundState}
          //setTimeLeft={setTimeLeft}
          setRoundResult={setRoundResult}
        />
      </>
    );
  }

  return (
    <>
      <h1>NUOVA PARTITA</h1>
      <Button variant="primary" onClick={startGame}>
        Inizia la partita
      </Button>
    </>
  );
}

export default NewGame;
