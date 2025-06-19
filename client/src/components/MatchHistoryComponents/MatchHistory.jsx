import React from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import API from "../../API/API"; // Assicurati di avere un file API.js che gestisce le chiamate al server
import { useUser } from "../../context/userContext.jsx";
import { initialCards } from "../../../../server/models.mjs";

function MyVerticallyCenteredModal(props) {
  // Destructure the game object from props.game, if it exists
  console.log("Modal Props:", props);
  let { id, initialCards, outcome, rounds } = props.game || {};

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Game ID: {id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>Carte iniziali:</span>
        {initialCards && Array.isArray(initialCards) ? (
          <ul>
            {initialCards.map((element, idx) => (
              <li key={idx}>{element.name}</li>
            ))}
          </ul>
        ) : (
          <span>Nessuna carta iniziale disponibile.</span>
        )}

        <span>Carte giocate nei round: </span>
        {rounds && Array.isArray(rounds) ? (
          <ul>
            {rounds.map((round, idx) => (
              <li key={idx}>
                Round {idx + 1}:{" "}
                {round.won === 1 ? (
                  <>
                    <i
                      style={{ color: "green", fontSize: "1.5rem" }}
                      className="bi bi-check"
                    ></i>
                    Vinta
                  </>
                ) : (
                  <>
                    <i style={{ color: "red" }} className="bi bi-ban"></i> Persa
                  </>
                )}{" "}
                - {round.name}
              </li>
            ))}
          </ul>
        ) : (
          <span>Nessun round disponibile.</span>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function MatchHistory() {
  const { user } = useUser(); // Ottieni le informazioni dell'utente dal contesto
  console.log(user);

  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalShow, setModalShow] = React.useState(false);
  const [selectedGame, setSelectedGame] = useState(null); // Stato per la partita selezionata

  useEffect(() => {
    let isMounted = true;
    // Qui puoi aggiungere la logica per recuperare la storia delle partite
    const fetchMatchHistory = async () => {
      if (!user || !user.username) {
        setLoading(false);
        return; // Esci dal useEffect se user è undefined
      }

      setLoading(true);
      setError("");
      try {
        const response = await API.getMatchHistory(user.username);
        if (isMounted) {
          setMatchHistory(response);
        }
      } catch (error) {
        setError("Errore nel recupero della cronologia delle partite");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMatchHistory();
    return () => {
      isMounted = false; // Cleanup per evitare aggiornamenti di stato su un componente smontato
    };
  }, [user]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Cronologia Partite</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && matchHistory.length === 0 && (
        <Alert variant="info">Nessuna partita trovata.</Alert>
      )}
      <Row>
        {matchHistory.map((game, idx) => (
          <Col key={`${game.id ?? "game"}-${idx}`} md={4} className="mb-4">
            <Card
              style={{
                backgroundColor: game.outcome === 1 ? "#AAEAAA" : "#FFA6A1",
              }}
            >
              <Card.Body>
                <Card.Title>Partita #{game.id}</Card.Title>
                <Card.Text>
                  Data:{" "}
                  {game.createdAt
                    ? new Date(game.createdAt).toLocaleString()
                    : "-"}
                  <br />
                  Esito:{" "}
                  {game.outcome === 1
                    ? "Vittoria"
                    : game.outcome === 0
                    ? "Sconfitta"
                    : "-"}
                  <br />
                  Carte totali: {game.totalCards || "-"}
                </Card.Text>

                <Button
                  variant="primary"
                  onClick={() => {
                    setModalShow(true);
                    setSelectedGame(game);
                  }}
                >
                  Maggiori dettagli
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        game={selectedGame}
      />
    </Container>
  );
}
//render(<MatchHistory />);

export default MatchHistory;
