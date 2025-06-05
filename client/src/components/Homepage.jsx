import { useEffect } from "react";
import { Container, Col, Button } from "react-bootstrap";

function Homepage(props) {
  return (
    <>
      <Container className="mt-5">
        <Col>
          <h1>Welcome friends</h1>
          <p>
            This is a simple homepage for our application. You can add more
            content here as needed.
          </p>
          <Button>Nuova Partita</Button>
        </Col>
      </Container>
    </>
  );
}
export default Homepage;
