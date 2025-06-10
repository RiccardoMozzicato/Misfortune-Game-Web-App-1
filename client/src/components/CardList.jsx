import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cards from "./Cards.jsx";

function CardList({ initialCards, roundResult, handleCompare }) {
  return (
    <div>
      <p>Your cards:</p>
      <Container fluid>
        <Row>
          {initialCards.map((card, index) => (
            <Col xl="2" key={index}>
              <Cards
                cards={card}
                disable={roundResult}
                prev={() =>
                  handleCompare(
                    initialCards[index - 1]?.misfortune_index,
                    initialCards[index]?.misfortune_index
                  )
                }
                next={() =>
                  index === initialCards.length - 1
                    ? handleCompare(initialCards[index]?.misfortune_index, 100)
                    : handleCompare(
                        initialCards[index]?.misfortune_index,
                        initialCards[index + 1]?.misfortune_index
                      )
                }
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default CardList;
