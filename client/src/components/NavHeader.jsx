import { Navbar } from "react-bootstrap";
import { Link } from "react-router";
import { useUser } from "../context/userContext.jsx";
import { useLocation } from "react-router";

function NavHeader() {
  const location = useLocation(); // Ottieni la posizione corrente per eventuali logiche basate sulla route
  const { loggedIn, setLoggedIn, user, setUser } = useUser();

  return (
    <Navbar fixed="top" expand="lg" bg="dark" data-bs-theme="dark">
      <Navbar.Brand href="/">Game of Fortune</Navbar.Brand>
      <Navbar.Text>
        {loggedIn ? (
          location.pathname === "/match-history" ? null : (
            <Link to="/match-history">Match History</Link>
          )
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </Navbar.Text>
    </Navbar>
  );
}

export default NavHeader;
