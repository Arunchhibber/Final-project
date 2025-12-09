import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setUser(data.user))
        .catch(err => console.error(err));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <nav className="navbar">
      <h2 className="logo">FileDrive</h2>

      <ul className="nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/upload">Upload</Link></li>
        <li><Link to="/my-files">My Files</Link></li>
        <li><Link to="/downloads">Public Files</Link></li>
        <li>
          <Link to="/login" onClick={handleLogout}>Logout</Link>
        </li>
      </ul>

      {user && (
        <div className="user-info">
          <span className="username">{user.username}</span>
          <img
            className="user-icon"
            src={`https://ui-avatars.com/api/?name=${user.username}&background=1d4ed8&color=fff`}
            alt="User Avatar"
          />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
