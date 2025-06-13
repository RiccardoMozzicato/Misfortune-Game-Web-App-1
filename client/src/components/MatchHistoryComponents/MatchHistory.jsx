import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import API from "../../API/API"; // Assicurati di avere un file API.js che gestisce le chiamate al server
import { useUser } from "../../context/userContext.jsx";

function MatchHistory() {
  const { user } = useUser(); // Ottieni le informazioni dell'utente dal contesto

  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    // Qui puoi aggiungere la logica per recuperare la storia delle partite
    const fetchMatchHistory = async () => {
      if (!user || !user.username) {
        setLoading(false);
        return; // Esci dal useEffect se user è undefined
      }

      setLoading(true);
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
            <Card>
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
                  Carte totali: {game.totalCards ?? "-"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MatchHistory;
