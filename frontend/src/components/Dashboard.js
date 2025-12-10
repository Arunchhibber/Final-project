import { useEffect, useState, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import "./Dashboard.css";

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Fetch user's files
  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/files/my-files", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch files");

      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch files");
    }
  };

  // Delete file
  const deleteFile = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/files/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setFiles(files.filter((file) => file._id !== id));
        alert("File deleted");
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Download file
  const downloadFile = async (id, filename) => {
    try {
      const res = await fetch(`http://localhost:8000/api/files/download/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.error || "Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  // Close dropdown if clicked outside
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dashboard-container">
      {/* User Info Header with Dropdown */}
      <header className="dashboard-header">
        <div className="user-info" ref={dropdownRef}>
          <div
            className="user-dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle className="user-icon" />
            <span className="username">{username || "Guest"}</span>
          </div>

          {dropdownOpen && (
            <div className="user-dropdown-menu">
              <button className="dropdown-item" onClick={() => alert("Profile clicked")}>
                Profile
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Files Section */}
      <div className="section-box">
        <h2>My Files</h2>

        {files.length === 0 ? (
          <p>No files uploaded yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Filename</th>
                <th>Privacy</th>
                <th>Download</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {files.map((file) => (
                <tr key={file._id}>
                  <td>{file.filename}</td>
                  <td>{file.privacy}</td>

                  <td>
                    <button onClick={() => downloadFile(file._id, file.filename)}>
                      Download
                    </button>
                  </td>

                  <td>
                    <button className="delete-btn" onClick={() => deleteFile(file._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
