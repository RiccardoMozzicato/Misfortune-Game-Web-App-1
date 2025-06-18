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
              <Card>
                <Card.Body>
                  <Card.Title>Esito Finale</Card.Title>
                  <Card.Text>
                    {gameFinished === true && "Partita Vinta!"}
                    {gameFinished === false && "Partita Persa!"}
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

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Dettagli Partita</Card.Title>
              <Card.Text>Carte Totali: {gameCards.length}</Card.Text>
              <Card.Text>Round Persi: {roundLost}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
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
