import { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão para abrir sidebar no mobile */}
      <button
        className="btn btn-primary d-md-none m-2"
        onClick={() => setIsOpen(true)}
      >
        ☰ Menu
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          onClick={() => setIsOpen(false)}
          style={{ zIndex: 1040 }}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-light p-3 position-fixed top-0 start-0 h-100 ${
          isOpen ? "translate-middle-x" : "translate-start"} d-md-block`}
        style={{
          width: "220px",
          minHeight: "100vh",
          zIndex: 1050,
          transition: "transform 0.3s ease"
        }}
      >
        <nav className="nav flex-column">
          <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>🏠 Home</Link>
          <Link className="nav-link" to="/dashboard" onClick={() => setIsOpen(false)}>📊 Dashboard</Link>
          <Link className="nav-link" to="/simulator" onClick={() => setIsOpen(false)}>🪐 Simulator</Link>
          <Link className="nav-link" to="/data" onClick={() => setIsOpen(false)}>📂 Data</Link>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
