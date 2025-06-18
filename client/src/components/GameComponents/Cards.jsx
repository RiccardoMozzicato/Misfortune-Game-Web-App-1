import React from "react";
import { Container, Col, Card, Button, Row } from "react-bootstrap";

function Cards(props) {
  return (
    <>
      {/* Se roundCard è true, non mostro il bordo della carta */}
      <Card
        style={
          props.roundCard
            ? {
                height: "300px",
                padding: 0,
              }
            : {
                height: "450px",
                padding: 0,
              }
        }
        {...(!props.roundCard ? { border: "primary" } : {})}
      >
        <Card.Img
          style={{ height: "200px" }}
          className="img-fluid"
          variant="top"
          src={props.cards.url}
        />
        <Card.Body style={{ paddingTop: "1rem" }}>
          <Card.Subtitle className="cardName">{props.cards.name}</Card.Subtitle>
          <Card.Subtitle className="mt-2">
            {props.roundCard ? null : <p className="red">Misfortune index: </p>}

            {props.cards.misfortune_index}
          </Card.Subtitle>

          {/* Se la carta è una roundCard, non mostro i bottoni per il confronto*/}
          {!props.roundCard ? (
            <Row lg="2" className="mt-2">
              <Col>
                {!props.recap ? (
                  <Button
                    variant="secondary"
                    onClick={props.prev}
                    // Se disable è passato come prop, disabilito il bottone
                    disabled={props.disable != null ? true : false}
                  >
                    <i className="bi bi-arrow-left fs-3"></i>
                  </Button>
                ) : null}
              </Col>
              <Col>
                {!props.recap ? (
                  <Button
                    variant="secondary"
                    onClick={props.next}
                    disabled={props.disable != null ? true : false}
                  >
                    <i className="bi bi-arrow-right fs-3"></i>
                  </Button>
                ) : null}
              </Col>
            </Row>
          ) : null}
        </Card.Body>
      </Card>
    </>
  );
}
export default Cards;
