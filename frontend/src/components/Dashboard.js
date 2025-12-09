// src/components/Dashboard.js
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch user's files
  const fetchFiles = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/files/my-files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
      alert("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "30px auto", padding: "0 20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Welcome, {username}!</h2>
        <div>
          <Link to="/upload" style={{ marginRight: "15px" }}>Upload</Link>
          <Link to="/my-files" style={{ marginRight: "15px" }}>My Files</Link>
          <button onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</button>
        </div>
      </header>

      <main style={{ marginTop: "30px" }}>
        <h3>Your Files</h3>
        {loading ? (
          <p>Loading files...</p>
        ) : files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Filename</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Size (KB)</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Privacy</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Download</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file._id}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{file.filename}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{(file.size / 1024).toFixed(2)}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{file.privacy}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    <a
                      href={`http://localhost:8000/${file.path}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
