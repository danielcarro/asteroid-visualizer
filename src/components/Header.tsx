import { useState } from "react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-primary text-white">
      <nav className="container-fluid navbar navbar-expand-md navbar-dark">
        <a className="navbar-brand" href="#">
          NASA Asteroid Simulator
        </a>

        {/* Botão hamburger para mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu colapsável */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#simulator">
                Simulator
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#data">
                Data
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="resourcesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Resources
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="resourcesDropdown">
                <li>
                  <a className="dropdown-item" href="#docs">
                    Documentation
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#tutorials">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#api">
                    API
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
