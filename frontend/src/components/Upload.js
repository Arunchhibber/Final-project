// src/components/Upload.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Upload() {
  const [file, setFile] = useState(null);
  const [privacy, setPrivacy] = useState("private");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("privacy", privacy);

    try {
      await axios.post("http://localhost:8000/api/files/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully");
      navigate("/my-files");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error uploading file");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Upload File</h2>
      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: "10px" }}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="radio"
              name="privacy"
              value="private"
              checked={privacy === "private"}
              onChange={(e) => setPrivacy(e.target.value)}
            />{" "}
            Private
          </label>{" "}
          <label>
            <input
              type="radio"
              name="privacy"
              value="public"
              checked={privacy === "public"}
              onChange={(e) => setPrivacy(e.target.value)}
            />{" "}
            Public
          </label>
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;
