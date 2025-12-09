import { useEffect, useState } from "react";
import "./PublicFiles.css";

function PublicFiles() {
  const [files, setFiles] = useState([]);

  const fetchPublicFiles = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/files/public");
      const data = await res.json();
      console.log("Public files fetched:", data); // debug owner info
      setFiles(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load public files");
    }
  };

  const downloadFile = async (file) => {
    try {
      const res = await fetch(`http://localhost:8000/api/files/download/${file._id}`);
      if (!res.ok) {
        const err = await res.json();
        return alert(err.error || "Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  useEffect(() => {
    fetchPublicFiles();
  }, []);

  return (
    <div className="public-container">
      <h1 className="public-title">Public Files</h1>

      {files.length === 0 ? (
        <p className="no-public-files">No public files found</p>
      ) : (
        <div className="public-grid">
          {files.map((file) => (
            <div className="public-card" key={file._id}>
              <h3 className="public-name">{file.filename}</h3>

              <p className="public-detail">
                <strong>Owner:</strong>{" "}
                {file.uploaded_by?.username ? file.uploaded_by.username : "Unknown"}
              </p>

              <p className="public-detail">
                <strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>

              <button
                className="public-download-btn"
                onClick={() => downloadFile(file)}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicFiles;
