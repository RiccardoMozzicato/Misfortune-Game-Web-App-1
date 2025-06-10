import React from "react";
import { Container, Col, Card, Button, Row } from "react-bootstrap";

function Cards(props) {
  return (
    <>
      {/* Se roundCard è true, non mostro il bordo della carta */}
      <Card {...(!props.roundCard ? { border: "primary" } : {})}>
        <Card.Img variant="top" src={props.cards.url} />
        <Card.Body>
          <Card.Subtitle>{props.cards.name}</Card.Subtitle>
          <Card.Subtitle className="mt-2">
            {props.cards.misfortune_index}
          </Card.Subtitle>

          {/* Se la carta è una roundCard, non mostro i bottoni per il confronto*/}
          {!props.roundCard ? (
            <Row lg="2" className="mt-2">
              <Col>
                <Button
                  variant="secondary"
                  onClick={props.prev}
                  // Se disable è passato come prop, disabilito il bottone
                  disabled={props.disable != null ? true : false}
                >
                  <i class="bi bi-arrow-left fs-3"></i>
                </Button>
              </Col>
              <Col>
                <Button
                  variant="secondary"
                  onClick={props.next}
                  disabled={props.disable != null ? true : false}
                >
                  <i class="bi bi-arrow-right fs-3"></i>
                </Button>
              </Col>
            </Row>
          ) : null}
        </Card.Body>
      </Card>
    </>
  );
}
export default Cards;
