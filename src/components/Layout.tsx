import { useState } from "react";
import { Outlet, Link } from "react-router-dom";

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-primary text-white p-2">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="h5 m-0">NASA Asteroid Simulator</h1>

          {/* Mobile dropdown menu */}
          <div className="d-md-none">
            <button
              className="btn btn-outline-light"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰ Menu
            </button>

            {menuOpen && (
              <div className="position-absolute bg-white text-dark p-3 shadow rounded mt-2" style={{ right: 10, zIndex: 1050 }}>
                <nav className="nav flex-column">
                  <Link className="nav-link" to="/" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
                  <Link className="nav-link" to="/simulator" onClick={() => setMenuOpen(false)}>🪐 Simulator</Link>                  
                  <Link className="nav-link" to="/about" onClick={() => setMenuOpen(false)}>ℹ️ About</Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="d-flex flex-grow-1">
        {/* Sidebar desktop */}
        <aside className="bg-light p-3 d-none d-md-block" style={{ width: 220 }}>
          <nav className="nav flex-column">
            <Link className="nav-link" to="/">🏠 Home</Link>
            <Link className="nav-link" to="/simulator">🪐 Simulator</Link>            
            <Link className="nav-link" to="/about">ℹ️ About</Link>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-grow-1 p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
