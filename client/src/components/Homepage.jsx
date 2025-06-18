import { useEffect } from "react";
import { Link } from "react-router";
import { Container, Col, Button } from "react-bootstrap";
import { useUser } from "../context/userContext.jsx";

function Homepage() {
  return (
    <>
      <Container className="mt-5">
        <Col>
          <h1>Welcome friends</h1>
          <p>
            This is a simple homepage for our application. You can add more
            content here as needed.
          </p>
          <Button as={Link} to="/new-game">
            Nuova Partita
          </Button>
        </Col>
      </Container>
    </>
  );
}
export default Homepage;
