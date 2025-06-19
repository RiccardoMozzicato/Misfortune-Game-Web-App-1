import { Navbar } from "react-bootstrap";
import { Link } from "react-router";
import { useUser } from "../context/userContext.jsx";
import { useLocation } from "react-router";
import "../App.css";

function NavHeader() {
  const location = useLocation(); // Ottieni la posizione corrente per eventuali logiche basate sulla route
  const { loggedIn, setLoggedIn, user, setUser } = useUser();
  const isNewGame = location.pathname === "/new-game";

  return (
    <Navbar
      fixed="top"
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      className={`justify-content-center ${
        isNewGame ? " disabled-navbar" : ""
      }`}
    >
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
