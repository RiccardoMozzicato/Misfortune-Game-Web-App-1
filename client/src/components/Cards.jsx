import React from "react";
import { Container, Col, Card, Button, Row } from "react-bootstrap";

function Cards(props) {
  return (
    <Card {...(!props.roundCard ? { border: "primary" } : {})}>
      <Card.Img variant="top" src={props.cards.url} />
      <Card.Body>
        <Card.Subtitle>{props.cards.name}</Card.Subtitle>
        <Card.Subtitle className="mt-2">
          {props.cards.misfortune_index}
        </Card.Subtitle>
        {!props.roundCard ? (
          <Row lg="2" className="mt-2">
            <Col>
              <Button
                variant="secondary"
                onClick={props.prev}
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
  );
}
export default Cards;
