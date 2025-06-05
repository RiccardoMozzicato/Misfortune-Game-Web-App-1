import { Navbar } from "react-bootstrap";
import { Link } from "react-router";

function NavHeader(props) {
  return (
    <Navbar fixed="top" expand="lg">
      <Navbar.Brand href="/">Game of Fortune</Navbar.Brand>
      <Navbar.Text>
        {props.loggedIn ? null : <Link to="/login">Login</Link>}
      </Navbar.Text>
    </Navbar>
  );
}

export default NavHeader;
