import React from "react";
import { Link } from "react-router";
import { Alert, Button } from "react-bootstrap";

function RoundState({
  roundState,
  roundResult,
  gameFinished,
  setRoundState,
  //setTimeLeft,
  setRoundResult,
}) {
  return (
    <div>
      {roundResult !== null && (
        <>
          {roundResult === true ? (
            <Alert variant="success">Hai vinto il round!</Alert>
          ) : (
            <Alert variant="danger">Hai perso il round!</Alert>
          )}
          {gameFinished != null ? (
            <Button as={Link} to="/new-game/recap">
              Termina partita
            </Button>
          ) : (
            <Button
              onClick={() => {
                setRoundState(roundState + 1);
                //setTimeLeft(30); // Reset del timer a 30 secondi
                setRoundResult(null);
              }}
            >
              Next Round
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default RoundState;
