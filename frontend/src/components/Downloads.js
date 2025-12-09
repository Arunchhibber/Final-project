// src/components/Downloads.js
import { useState, useEffect } from "react";
import axios from "axios";

function Downloads() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/files/public-files")
      .then(res => setFiles(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>Public Downloads</h2>
      {files.length === 0 ? (
        <p>No public files available</p>
      ) : (
        files.map(file => (
          <div key={file._id} style={{ marginBottom: "10px" }}>
            {file.filename}{" "}
            <a href={`http://localhost:8000/${file.path}`} target="_blank" rel="noopener noreferrer">Download</a>
          </div>
        ))
      )}
    </div>
  );
}

export default Downloads;
