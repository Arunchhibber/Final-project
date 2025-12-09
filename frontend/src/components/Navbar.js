import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">FileDrive</h2>

      <ul className="nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/upload">Upload</Link></li>
        <li><Link to="/my-files">My Files</Link></li>
        <li><Link to="/downloads">Public Files</Link></li>
        <li><Link to="/login" onClick={() => localStorage.clear()}>Logout</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
