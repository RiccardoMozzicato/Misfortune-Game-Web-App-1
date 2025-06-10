import React, { useEffect } from "react";
import { useState } from "react";
import dayjs from "dayjs";
import { Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { useUser } from "../context/userContext.jsx";
import Cards from "./Cards.jsx";
import API from "../API/API.mjs";

function NewGame() {
  const { user, loggedIn } = useUser();

  const [gameStarted, setGameStarted] = useState(false); // Stato per verificare se la partita è iniziata

  const [gameCards, setGameCards] = useState([]);
  const [roundCards, setRoundCards] = useState([]);
  const [initialCards, setInitialCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null); // Carta in gioco nel round attuale

  const [roundState, setRoundState] = useState(0); // Round della partita in frontend

  const [gameId, setGameId] = useState(null); // ID della partita corrente nel DB
  const [roundId, setRoundId] = useState(null); // ID del round corrente nel DB

  const [timeLeft, setTimeLeft] = useState(30);
  const [timerState, setTimerState] = useState(false); // Stato del timer, se è in esecuzione o meno
  const [error, setError] = useState("");

  const [roundResult, setRoundResult] = useState(null); // Risultato del round corrente

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

    postRound(card);
  };

  useEffect(() => {
    if (!gameStarted || !timerState) return;

    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, timerState]);

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

    setTimerState(false);
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
    }

    setRoundResult(result.won);
  };

  if (gameStarted) {
    return (
      <>
        <h1>
          {timeLeft > 28 && roundState == 1
            ? "Partita iniziata"
            : "Round: " + roundState}
        </h1>

        <Container>
          <Row>
            {/* Se esiste mostra la currentCard che poi è quella in gioco per quel round */}
            Round Card:
            {currentCard && <Cards cards={currentCard} roundCard={true} />}
          </Row>
        </Container>

        <p>Your cards:</p>
        <Container fluid>
          <Row>
            {initialCards.map((card, index) => (
              <>
                <Col xl="2">
                  <Cards
                    cards={card}
                    disable={roundResult}
                    key={index}
                    prev={() =>
                      handleCompare(
                        initialCards[index - 1]?.misfortune_index,
                        initialCards[index]?.misfortune_index
                      )
                    }
                    next={() =>
                      handleCompare(initialCards[index]?.misfortune_index, 100)
                    }
                  />
                </Col>
              </>
            ))}
          </Row>
        </Container>

        <h1>Time left: {timeLeft} seconds</h1>
        {timeLeft === 0 && <p>Time Expired!</p>}

        {roundResult !== null && (
          <>
            <Alert variant="info">
              Round {roundState} - {roundResult ? "Vinto!" : "Perso!"}
            </Alert>
            <Button
              onClick={() => {
                setRoundState(roundState + 1);
                setTimeLeft(30);
                setRoundResult(null);
              }}
            >
              Next Round
            </Button>
          </>
        )}
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
