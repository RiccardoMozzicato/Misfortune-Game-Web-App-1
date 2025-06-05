import { Alert, Container, Row } from "react-bootstrap";
import { Link, Navigate, Outlet } from "react-router";
import NavHeader from "./NavHeader.jsx";

function DefaultLayout(props) {
  return (
    <>
      <NavHeader loggedIn={props.loggedIn} handleLogout={props.handleLogout} />
      <Container fluid="lg">
        <Outlet />
      </Container>
    </>
  );
}

export default DefaultLayout;
