import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Container, Col, Button, Stack, ListGroup, Row } from "react-bootstrap";
import { useUser } from "../context/userContext.jsx";
import { useGame } from "../context/gameContext.jsx";
import API from "../API/API.mjs";

function Homepage() {
  const navigate = useNavigate();
  const {
    setGameStarted,
    setGameCards,
    setRoundCards,
    setInitialCards,
    setRoundState,
    setGameId,
    setError,
  } = useGame();

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

  return (
    <>
      <Container className="mt-3">
        <Col lg={8} className="mx-auto">
          <Stack>
            <h1>Welcome friends</h1>
            <p>
              La versione single player del gioco da tavolo <br></br>“Stuff
              Happens”.
            </p>
            <Button
              onClick={() => {
                startGame();
                navigate("/new-game");
              }}
            >
              Nuova Partita
            </Button>

            <div className="mt-5">
              <h1>Regole del giuoco</h1>
            </div>
            <ListGroup>
              <ListGroup.Item>
                <Row className="align-items-center">
                  <i className="bi bi-1-circle-fill"></i>
                  <p>
                    Hai 3 carte iniziali, ognuna con una situazione sfortunata e
                    il suo indice da 1 a 100.
                  </p>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                Ad ogni round ti verrà mostrata una nuova situazione (senza
                dirti quanto è sfortunata).
              </ListGroup.Item>
              <ListGroup.Item>
                Il tuo compito è indovinare dove si colloca tra le tue carte, in
                base alla gravità.
              </ListGroup.Item>
              <ListGroup.Item>
                Se indovini entro 30 secondi, ottieni la carta.<br></br>
                Altrimenti la perdi.
              </ListGroup.Item>
              <ListGroup.Item>
                📈 Vinci se collezioni 6 carte. <br></br>💀 Perdi se sbagli 3
                volte. Buona (s)fortuna!
              </ListGroup.Item>
            </ListGroup>
          </Stack>
        </Col>
      </Container>
    </>
  );
}
export default Homepage;
