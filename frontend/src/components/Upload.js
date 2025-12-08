// src/components/Upload.js
import { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [privacy, setPrivacy] = useState("public");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("privacy", privacy);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "x-auth-token": token, "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully");
      setFile(null);
    } catch (err) {
      alert(err.response.data.msg || err.response.data.error);
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={e => setFile(e.target.files[0])} required />
        <select value={privacy} onChange={e => setPrivacy(e.target.value)}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;
