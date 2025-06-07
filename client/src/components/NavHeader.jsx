import { Navbar } from "react-bootstrap";
import { Link } from "react-router";
import { useUser } from "../context/userContext.jsx";

function NavHeader() {
  const { loggedIn, setLoggedIn, user, setUser } = useUser();
  return (
    <Navbar fixed="top" expand="lg">
      <Navbar.Brand href="/">Game of Fortune</Navbar.Brand>
      <Navbar.Text>
        {loggedIn ? null : <Link to="/login">Login</Link>}
      </Navbar.Text>
    </Navbar>
  );
}

export default NavHeader;
