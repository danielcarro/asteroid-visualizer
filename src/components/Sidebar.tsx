import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="bg-light p-3" style={{ width: "220px", minHeight: "100vh" }}>
      <nav className="nav flex-column">
        <Link className="nav-link" to="/">🏠 Home</Link>
        <Link className="nav-link" to="/dashboard">📊 Dashboard</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
