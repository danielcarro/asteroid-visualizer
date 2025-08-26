import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

interface LayoutProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Layout({ darkMode, setDarkMode }: LayoutProps) {
  const navbarVariant = darkMode ? "dark" : "light";
  const navbarBg = darkMode ? "dark" : "light";

  return (
    <div className={darkMode ? "bg-dark text-white min-vh-100" : "bg-light text-dark min-vh-100"}>
      <Navbar collapseOnSelect expand="lg" bg={navbarBg} variant={navbarVariant} className="border-bottom">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            NASA Asteroid Simulator
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto align-items-lg-center">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/simulator">Simulator</Nav.Link>
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Button
                variant={darkMode ? "secondary" : "dark"}
                className="ms-lg-3 mt-2 mt-lg-0"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="p-3">
        <Outlet />
      </main>
    </div>
  );
}
