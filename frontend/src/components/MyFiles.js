// src/components/MyFiles.js
import { useEffect, useState } from "react";
import axios from "axios";

function MyFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT token from login
        const res = await axios.get("http://localhost:8000/api/files/my-files", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files:", err);
        alert("Failed to fetch files. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <p>Loading files...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>My Files</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file._id} style={{ marginBottom: "10px" }}>
              <strong>{file.filename}</strong> - {file.size} bytes - {file.privacy}{" "}
              <a
                href={`http://localhost:8000/${file.path}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyFiles;
