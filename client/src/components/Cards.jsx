import React from "react";
import { Container, Col, Card, Button } from "react-bootstrap";

function Cards(props) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={props.cards.url} />
      <Card.Body>
        <Card.Title>{props.cards.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {props.cards.misfortune_index}
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
}
export default Cards;
