import React from "react";
import { Container, Col, Card, Button, Row, Stack } from "react-bootstrap";
import ButtonChoice from "./ButtonChoice";

function Cards(props) {
  return (
    <>
      {/* Se roundCard è true, non mostro il bordo della carta */}
      <Card
        className={props.recap === true ? "recapCards" : null}
        style={
          props.roundCard
            ? {
                height: "300px",
                padding: 0,
              }
            : {
                height: "350px",
                padding: 0,
              }
        }
        {...(!props.roundCard ? { border: "primary" } : {})}
      >
        <Col>
          <Card.Img
            //style={{ height: "200px" }}
            className="img-fluid"
            variant="top"
            src={props.cards.url}
          />
          <Card.Body style={{ padding: 0, paddingTop: "1rem" }}>
            <Container>
              <Card.Subtitle className="cardName">
                {props.cards.name}
              </Card.Subtitle>

              {/* Se la carta è una roundCard, non mostro i bottoni per il confronto*/}
              {!props.roundCard ? (
                <Row>
                  <Col>
                    {!props.recap ? (
                      <ButtonChoice
                        title="Stai posizionando la carta a sinistra"
                        onClick={props.prev}
                        className="bi bi-arrow-left fs-3"
                        disable={props.disable}
                      ></ButtonChoice>
                    ) : null}
                  </Col>
                  <Col>
                    <Card.Subtitle className="mt-2">
                      <Stack gap={0}>
                        <div>
                          {props.roundCard ? null : (
                            <p className="red">Misfortune index: </p>
                          )}
                        </div>
                        <div>
                          <h3>{props.cards.misfortune_index}</h3>
                        </div>
                      </Stack>
                    </Card.Subtitle>
                  </Col>
                  <Col>
                    {!props.recap ? (
                      <ButtonChoice
                        title="Stai posizionando la carta a destra"
                        onClick={props.next}
                        className="bi bi-arrow-right fs-3"
                        disable={props.disable}
                      ></ButtonChoice>
                    ) : null}
                  </Col>
                </Row>
              ) : null}
            </Container>
          </Card.Body>
        </Col>
      </Card>
    </>
  );
}
export default Cards;
