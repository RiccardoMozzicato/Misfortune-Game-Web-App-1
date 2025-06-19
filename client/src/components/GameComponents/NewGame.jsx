import React, { use, useEffect } from "react";
import { useState } from "react";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Stack,
} from "react-bootstrap";
import { useUser } from "../../context/userContext.jsx";
import Cards from "./Cards.jsx";
import API from "../../API/API.mjs";
import Timer from "./Timer.jsx";
import CardList from "./CardList.jsx";
import RoundState from "./RoundState.jsx";
import { Outlet } from "react-router";
import { useLocation, Link } from "react-router";
import Recap from "./Recap.jsx";
import NewDemoGame from "./NewGame.jsx";
import { useGame } from "../../context/gameContext.jsx";

function NewGame() {
  const { user, loggedIn } = useUser();
  const location = useLocation();
  const {
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
  } = useGame();

  // Reset dello stato del gioco quando si naviga verso /new-game da qualsiasi altra pagina
  useEffect(() => {
    if (location.pathname === "/new-game") {
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

  return (
    <>
      <Container>
        <Row>
          <Col lg={{ span: 4 }} padding="0">
            {gameFinished === null ? (
              <>
                <Stack>
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
                </Stack>
              </>
            ) : /* Se il numero di carte è 6 e lo stato del round è minore o uguale a 5, significa che la partita è vinta*/
            gameFinished === true ? (
              <h1> Partita Vinta! </h1>
            ) : gameFinished === false ? (
              <h1> Partita Persa! </h1>
            ) : null}

            {gameFinished != null && (
              <Button as={Link} to="/new-game/recap">
                Termina partita
              </Button>
            )}
          </Col>

          <Col lg={{ span: 2, offset: 1 }} padding="0">
            <Container>
              {/* Se esiste mostra la currentCard che poi è quella in gioco per quel round */}
              <Row className="justify-content-center">Carta in palio:</Row>
              <Row>
                {currentCard && (
                  <Cards
                    cards={currentCard}
                    // Passo roundCard == true per indicare che questa è la carta del round corrente
                    roundCard={true}
                  />
                )}
              </Row>
            </Container>
          </Col>
          <Col lg={{ span: 4 }} padding="0">
            <h1>Round {roundState}/5</h1>
          </Col>
        </Row>
      </Container>
      <CardList
        initialCards={initialCards}
        roundResult={roundResult}
        handleCompare={handleCompare}
      />
    </>
  );
}

export default NewGame;
