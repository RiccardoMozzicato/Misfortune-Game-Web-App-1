import React from "react";
import { Link } from "react-router";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import CardList from "./CardList.jsx";
import { useNavigate } from "react-router";

function Recap({ gameFinished, roundLost, gameCards }) {
  const navigate = useNavigate();

  const handleNewGame = () => {
    navigate("/new-game"); // Naviga verso la nuova partita
  };

  return (
    <Container>
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
      <Row>
        <Col>
          <Button onClick={handleNewGame}>Inizia Nuova Partita</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Recap;
