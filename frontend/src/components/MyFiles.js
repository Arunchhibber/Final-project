// src/components/MyFiles.js
import { useEffect, useState } from "react";
import axios from "axios";

function MyFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/my-files", {
          headers: { "x-auth-token": token },
        });
        setFiles(res.data);
      } catch (err) {
        alert(err.response.data.msg || err.response.data.error);
      }
    };
    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/files/${id}`, {
        headers: { "x-auth-token": token },
      });
      setFiles(files.filter(f => f._id !== id));
      alert("File deleted");
    } catch (err) {
      alert(err.response.data.msg || err.response.data.error);
    }
  };

  return (
    <div>
      <h2>My Files</h2>
      <ul>
        {files.map(f => (
          <li key={f._id}>
            {f.filename} - {f.privacy} - {new Date(f.uploaded_at).toLocaleString()}
            <a href={`http://localhost:5000/${f.path}`} target="_blank" rel="noreferrer"> Download </a>
            <button onClick={() => handleDelete(f._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyFiles;
