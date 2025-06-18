import { Alert, Container, Row } from "react-bootstrap";
import { Link, Navigate, Outlet } from "react-router";
import NavHeader from "./NavHeader.jsx";

function DefaultLayout() {
  return (
    <>
      <NavHeader />
      <Container fluid="lg" style={{ marginTop: "5rem" }}>
        <Outlet />
      </Container>
    </>
  );
}

export default DefaultLayout;
