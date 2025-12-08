// src/components/Downloads.js
import { useEffect, useState } from "react";
import axios from "axios";

function Downloads() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/public-files");
        setFiles(res.data);
      } catch (err) {
        alert(err.response.data.msg || err.response.data.error);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Public Downloads</h2>
      <ul>
        {files.map(f => (
          <li key={f._id}>
            {f.filename} - {new Date(f.uploaded_at).toLocaleString()}
            <a href={`http://localhost:5000/${f.path}`} target="_blank" rel="noreferrer"> Download </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Downloads;
