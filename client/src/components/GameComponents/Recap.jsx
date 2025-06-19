import React from "react";
import { Link } from "react-router";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import CardList from "./CardList.jsx";
import { useNavigate } from "react-router";
import { useUser } from "../../context/userContext.jsx";
import API from "../../API/API.mjs";

function Recap({ gameFinished, roundLost, gameCards, gameId }) {
  const { user, loggedIn } = useUser();
  const navigate = useNavigate();

  const handleNewGame = () => {
    try {
      API.deleteGame(gameId); // Elimina la partita corrente dal DB
    } catch (error) {
      alert("Errore durante l'eliminazione della partita. Riprova più tardi.");
    }
    navigate("/new-game"); // Naviga verso la nuova partita
  };

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
                      <h3 className="pastelgreen">Partita Vinta!</h3>
                    ) : (
                      <h3 className="pastelred">Partita Persa!</h3>
                    )}
                  </Card.Text>
                  <Card.Text>
                    <h4>Carte Totali: {gameCards.length}</h4>
                  </Card.Text>
                  <Card.Text>
                    <h4>Round Persi: {roundLost}</h4>
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
          <Button onClick={handleNewGame}>Inizia Nuova Partita</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Recap;
