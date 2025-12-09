import { useEffect, useState } from "react";
import "./PublicFiles.css";  // IMPORTANT — rename file so it doesn't conflict

function PublicFiles() {
  const [files, setFiles] = useState([]);

  const fetchPublicFiles = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/files/public");
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      alert("Failed to load public files");
    }
  };

  const downloadFile = async (id, filename) => {
    try {
      const res = await fetch(`http://localhost:8000/api/files/download/${id}`);
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = filename;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
    }
  };

  useEffect(() => {
    fetchPublicFiles();
  }, []);

  return (
    <div className="public-container">
      <h1 className="public-title">Public Files</h1>

      <div className="public-grid">
        {files.length === 0 ? (
          <p className="no-public-files">No public files found</p>
        ) : (
          files.map((file) => (
            <div className="public-card" key={file._id}>
              <h3 className="public-name">{file.filename}</h3>

              <p className="public-detail">
                <strong>Owner:</strong> {file.uploaded_by?.username || "Unknown"}
              </p>

              <button
                className="public-download-btn"
                onClick={() => downloadFile(file._id, file.filename)}
              >
                Download
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PublicFiles;
