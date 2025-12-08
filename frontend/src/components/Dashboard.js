// src/components/Dashboard.js
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:6000/api/files/my-files", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files:", err);
        alert("Failed to fetch files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <p>Loading files...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>My Files</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              {file.filename} - {file.size} bytes - {file.privacy}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
