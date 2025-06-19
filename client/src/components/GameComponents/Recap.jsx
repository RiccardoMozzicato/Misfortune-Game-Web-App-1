import React, { useEffect } from "react";
import { Link } from "react-router";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import CardList from "./CardList.jsx";
import { useNavigate } from "react-router";
import { useUser } from "../../context/userContext.jsx";
import { useGame } from "../../context/gameContext.jsx";
import API from "../../API/API.mjs";

function Recap() {
  const { user, loggedIn } = useUser();
  const navigate = useNavigate();
  const { gameFinished, roundLost, gameCards, gameId } = useGame();

  const handleNewGame = () => {
    try {
      API.deleteGame(gameId); // Elimina la partita corrente dal DB
    } catch (error) {
      alert("Errore durante l'eliminazione della partita. Riprova più tardi.");
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      handleNewGame();
    }
  }, []);

  return (
    <Container>
      {console.log("Logged in Recap:", loggedIn, user)}
      {loggedIn ? (
        <>
          <Row>
            <Col>
              <h1>Riepilogo Partita</h1>
              <Card style={{ padding: 0 }}>
                <Card.Body>
                  <Card.Text>
                    {gameFinished === true ? (
                      <div style={{ fontSize: "3rem" }} className="pastelgreen">
                        Partita Vinta!
                      </div>
                    ) : (
                      <div style={{ fontSize: "3rem" }} className="pastelred">
                        Partita Persa!
                      </div>
                    )}
                  </Card.Text>
                  <Card.Text>
                    <div>Carte Totali: {gameCards.length}</div>
                  </Card.Text>
                  <Card.Text>
                    <div>Round Persi: {roundLost}</div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <h3>Hai finito la demo</h3>
          <p>Effettua il login e gioca con il tuo account!</p>
        </>
      )}

      <>
        <CardList initialCards={gameCards} recap={true} />
      </>
      <Row className="mt-3">
        <Col>
          <Button onClick={() => navigate("/")}>Inizia Nuova Partita</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Recap;
