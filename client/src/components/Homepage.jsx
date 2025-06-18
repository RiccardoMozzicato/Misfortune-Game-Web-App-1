import { useEffect } from "react";
import { Link } from "react-router";
import { Container, Col, Button, Stack, ListGroup, Row } from "react-bootstrap";
import { useUser } from "../context/userContext.jsx";

function Homepage() {
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
            <Button as={Link} to="/new-game">
              Nuova Partita
            </Button>

            <div className="mt-5">
              <h1>Regole del giuoco</h1>
            </div>
            <ListGroup>
              <ListGroup.Item>
                <Row className="align-items-center">
                  <i class="bi bi-1-circle-fill"></i>
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
