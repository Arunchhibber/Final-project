import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Welcome to the File Storage App</h1>

      <p>Select an option below:</p>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
        <Link to="/register">
          <button>Register</button>
        </Link>

        <Link to="/login">
          <button>Login</button>
        </Link>

        <Link to="/upload">
          <button>Upload File</button>
        </Link>

        <Link to="/my-files">
          <button>My Files</button>
        </Link>

        <Link to="/downloads">
          <button>Downloads</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
