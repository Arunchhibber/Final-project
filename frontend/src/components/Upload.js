// src/components/Upload.js
import { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [privacy, setPrivacy] = useState("private");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file to upload.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("privacy", privacy);

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // JWT from login
      const res = await axios.post("http://localhost:8000/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert(res.data.msg);
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("File upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: "10px" }}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Privacy:{" "}
            <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default Upload;
