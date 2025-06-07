import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Card, Container, Row } from "react-bootstrap";
import { useUser } from "../context/userContext.jsx";
import Cards from "./Cards.jsx";
import API from "../API/API.mjs";

function NewGame() {
  const { user, loggedIn } = useUser();
  const [gameCards, setGameCards] = useState([]);
  const [roundCards, setRoundCards] = useState([]);
  const [initialCards, setInitialCards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundState, setRoundState] = useState(0);

  const startGame = async () => {
    let result;
    try {
      result = await API.startGame();
      setGameCards(result);
      setGameStarted(true);
      setRoundState(1);
      setRoundCards(result.roundCards);
      setInitialCards(result.initialCards);
    } catch (err) {
      setError("Errore nel recupero delle carte dal server.");
      return;
    }
  };

  useEffect(() => {
    console.log("Game Cards:", roundCards);
    const card = roundCards.pop();
    <Cards cards={card} />;
  }, [roundState]);

  if (gameStarted) {
    return (
      <>
        <h1>Partita Iniziata!</h1>
        <p>Carte disponibili:</p>
        <Container>
          <Row>
            {initialCards.map((card, index) => (
              <Cards cards={card} key={index} />
            ))}
          </Row>
        </Container>
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
